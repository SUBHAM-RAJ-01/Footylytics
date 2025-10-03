import express from 'express';
import sportsdb from '../services/sportsdb.js';

const router = express.Router();

router.get('/:teamId', async (req, res) => {
  try {
    const data = await sportsdb.getTeamInfo(req.params.teamId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team info' });
  }
});

router.get('/:teamId/matches', async (req, res) => {
  try {
    const data = await sportsdb.getTeamLastMatches(req.params.teamId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team matches' });
  }
});

router.get('/search/:query', async (req, res) => {
  try {
    const data = await sportsdb.searchTeams(req.params.query);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search teams' });
  }
});

export default router;
