import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}

export const authenticateUser = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!supabase) {
      return res.status(503).json({ error: 'Authentication service not configured' });
    }

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

export const requirePremium = async (req, res, next) => {
  try {
    if (!supabase) {
      return res.status(503).json({ error: 'Service not configured' });
    }

    // Get user profile to check premium status
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('is_premium')
      .eq('id', req.user.id)
      .single();

    if (error || !profile) {
      return res.status(403).json({ error: 'Unable to verify premium status' });
    }

    if (!profile.is_premium) {
      return res.status(403).json({ 
        error: 'Premium subscription required',
        message: 'This feature is only available for premium users. Upgrade to access AI predictions!'
      });
    }

    next();
  } catch (error) {
    console.error('Premium check error:', error);
    res.status(403).json({ error: 'Premium verification failed' });
  }
};
