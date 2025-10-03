import express from 'express';
import Stripe from 'stripe';
import { authenticateUser } from '../middleware/auth.js';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { sendPremiumWelcomeEmail } from '../services/email.js';

dotenv.config();

const router = express.Router();

let stripe = null;
let supabase = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}

router.post('/create-checkout-session', authenticateUser, async (req, res) => {
  if (!stripe) {
    console.error('❌ Stripe not configured');
    return res.status(503).json({ error: 'Payment service not configured' });
  }
  
  try {
    const { priceId } = req.body;

    console.log('💳 Creating checkout session:');
    console.log('   User:', req.user.email);
    console.log('   Price ID:', priceId);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing`,
      client_reference_id: req.user.id,
      customer_email: req.user.email
    });

    console.log('✅ Checkout session created:', session.id);
    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('❌ Payment error:', error.message);
    res.status(500).json({ error: 'Failed to create checkout session', details: error.message });
  }
});

// Activate premium after successful payment
router.post('/activate-premium', authenticateUser, async (req, res) => {
  if (!supabase) {
    return res.status(503).json({ error: 'Service not configured' });
  }

  try {
    const { sessionId } = req.body;

    console.log('🎉 Activating premium for user:', req.user.email);

    // Update user to premium
    const { error } = await supabase
      .from('profiles')
      .update({ 
        is_premium: true,
        subscription_start: new Date().toISOString(),
        stripe_session_id: sessionId
      })
      .eq('id', req.user.id);

    if (error) {
      console.error('❌ Failed to activate premium:', error);
      return res.status(500).json({ error: 'Failed to activate premium' });
    }

    console.log('✅ Premium activated successfully');

    // Send welcome email
    const userName = req.user.email?.split('@')[0] || 'there';
    await sendPremiumWelcomeEmail(req.user.email, userName);
    console.log('📧 Welcome email sent');

    res.json({ success: true, message: 'Premium activated!' });
  } catch (error) {
    console.error('❌ Activation error:', error);
    res.status(500).json({ error: 'Failed to activate premium' });
  }
});

router.post('/webhook', async (req, res) => {
  if (!stripe || !supabase) {
    console.error('❌ Webhook: Service not configured');
    return res.status(503).json({ error: 'Service not configured' });
  }
  
  const sig = req.headers['stripe-signature'];

  try {
    console.log('🔔 Webhook received');
    
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log('✅ Webhook verified:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      console.log('💳 Processing checkout.session.completed');
      console.log('   Customer:', session.customer_email);
      console.log('   User ID:', session.client_reference_id);
      
      // Update user profile to premium
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_premium: true,
          subscription_start: new Date().toISOString(),
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription
        })
        .eq('id', session.client_reference_id);

      if (error) {
        console.error('❌ Failed to update profile:', error);
      } else {
        console.log('✅ Profile updated to premium');
        
        // Send premium welcome email
        const userName = session.customer_email?.split('@')[0] || 'there';
        await sendPremiumWelcomeEmail(session.customer_email, userName);
        console.log('📧 Welcome email sent');
      }
    }

    // Handle subscription cancellation
    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      
      console.log('🔴 Processing subscription cancellation');
      
      await supabase
        .from('profiles')
        .update({ 
          is_premium: false,
          subscription_end: new Date().toISOString()
        })
        .eq('stripe_subscription_id', subscription.id);
      
      console.log(`✅ Subscription cancelled: ${subscription.id}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('❌ Webhook error:', error.message);
    res.status(400).json({ error: 'Webhook error', details: error.message });
  }
});

export default router;
