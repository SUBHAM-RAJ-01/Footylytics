import express from 'express';
import { createClient } from '@supabase/supabase-js';
import { sendMatchNotificationEmail } from '../services/email.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}

// Toggle match notification
router.post('/toggle', async (req, res) => {
  try {
    const { userId, matchId, matchData } = req.body;

    if (!userId || !matchId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!supabase) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    // Check if notification already exists
    const { data: existing } = await supabase
      .from('match_notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('match_id', matchId)
      .single();

    if (existing) {
      // Remove notification
      await supabase
        .from('match_notifications')
        .delete()
        .eq('user_id', userId)
        .eq('match_id', matchId);

      return res.json({ success: true, subscribed: false });
    } else {
      // Add notification
      await supabase
        .from('match_notifications')
        .insert({
          user_id: userId,
          match_id: matchId,
          match_data: matchData,
          created_at: new Date().toISOString()
        });

      return res.json({ success: true, subscribed: true });
    }
  } catch (error) {
    console.error('Notification toggle error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user's notifications
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!supabase) {
      return res.json({ notifications: [] });
    }

    const { data, error } = await supabase
      .from('match_notifications')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

    res.json({ notifications: data || [] });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
