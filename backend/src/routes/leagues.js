import express from 'express';
import sportsdb from '../services/sportsdb.js';

const router = express.Router();

router.get('/:leagueId/standings', async (req, res) => {
  try {
    const data = await sportsdb.getLeagueStandings(req.params.leagueId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch standings' });
  }
});

export default router;
