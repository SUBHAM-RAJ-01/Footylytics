import express from 'express';
import sportsdb from '../services/sportsdb.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

router.get('/:leagueId/standings', async (req, res) => {
  try {
    logger.info(`Fetching standings for league ${req.params.leagueId}...`);
    const data = await sportsdb.getLeagueStandings(req.params.leagueId);
    res.json(data);
  } catch (error) {
    logger.error('Standings error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch standings',
      message: error.message,
      standings: []
    });
  }
});

export default router;
