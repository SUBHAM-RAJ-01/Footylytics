import express from 'express';
import { authenticateUser } from '../middleware/auth.js';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

let supabase = null;
if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}

router.get('/profile', authenticateUser, async (req, res) => {
  if (!supabase) {
    return res.status(503).json({ error: 'Service not configured' });
  }
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.put('/favorite-team', authenticateUser, async (req, res) => {
  if (!supabase) {
    return res.status(503).json({ error: 'Service not configured' });
  }
  
  try {
    const { teamId, teamName } = req.body;
    
    const { data, error } = await supabase
      .from('profiles')
      .update({ favorite_team_id: teamId, favorite_team_name: teamName })
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update favorite team' });
  }
});

export default router;
