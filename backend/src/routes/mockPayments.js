import express from 'express';
import { authenticateUser } from '../middleware/auth.js';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { sendPremiumWelcomeEmail } from '../services/email.js';

dotenv.config();

const router = express.Router();

let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}

// Mock payment session creation
router.post('/create-checkout-session', authenticateUser, async (req, res) => {
  try {
    const { priceId } = req.body;
    
    // Determine plan type from priceId
    const planType = priceId.includes('yearly') ? 'yearly' : 'monthly';
    const amount = planType === 'yearly' ? 299 : 29;
    
    // Create a mock session ID
    const mockSessionId = `mock_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('🎭 Mock Payment Session Created:');
    console.log('   User:', req.user.email);
    console.log('   Plan:', planType);
    console.log('   Amount: ₹', amount);
    console.log('   Session ID:', mockSessionId);
    
    // Return mock session
    res.json({ 
      sessionId: mockSessionId,
      isMock: true,
      amount,
      planType
    });
  } catch (error) {
    console.error('Mock payment error:', error);
    res.status(500).json({ error: 'Failed to create mock checkout session' });
  }
});

// Mock payment success handler
router.post('/mock-success', authenticateUser, async (req, res) => {
  if (!supabase) {
    return res.status(503).json({ error: 'Service not configured' });
  }
  
  try {
    const { sessionId } = req.body;
    
    console.log('✅ Mock Payment Successful:');
    console.log('   User:', req.user.email);
    console.log('   Session:', sessionId);
    
    // Update user to premium
    const { error } = await supabase
      .from('profiles')
      .update({ 
        is_premium: true,
        subscription_start: new Date().toISOString(),
        subscription_type: 'mock_premium'
      })
      .eq('id', req.user.id);

    if (error) {
      console.error('Error updating profile:', error);
      return res.status(500).json({ error: 'Failed to update profile' });
    }

    // Send premium welcome email
    const userName = req.user.email?.split('@')[0] || 'there';
    await sendPremiumWelcomeEmail(req.user.email, userName);
    
    console.log('🎉 User upgraded to Premium (Mock)');
    
    res.json({ 
      success: true, 
      message: 'Premium activated!',
      isMock: true
    });
  } catch (error) {
    console.error('Mock success error:', error);
    res.status(500).json({ error: 'Failed to process mock payment' });
  }
});

// Mock webhook (for testing webhook flow)
router.post('/mock-webhook', async (req, res) => {
  if (!supabase) {
    return res.status(503).json({ error: 'Service not configured' });
  }
  
  try {
    const { userId, email } = req.body;
    
    console.log('🔔 Mock Webhook Received:');
    console.log('   User ID:', userId);
    console.log('   Email:', email);
    
    // Update user to premium
    await supabase
      .from('profiles')
      .update({ 
        is_premium: true,
        subscription_start: new Date().toISOString()
      })
      .eq('id', userId);
    
    // Send welcome email
    const userName = email?.split('@')[0] || 'there';
    await sendPremiumWelcomeEmail(email, userName);
    
    res.json({ received: true });
  } catch (error) {
    console.error('Mock webhook error:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
});

export default router;
