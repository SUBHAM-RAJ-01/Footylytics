import express from 'express';
import sportsdb from '../services/sportsdb.js';
import { logger } from '../utils/logger.js';

const router = express.Router();

router.get('/live', async (req, res) => {
  try {
    logger.info('Fetching live scores...');
    const data = await sportsdb.getLiveScores();
    logger.info('Live scores fetched successfully');
    res.json(data);
  } catch (error) {
    logger.error('Live scores error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch live scores',
      message: error.message,
      matches: []
    });
  }
});

router.get('/fixtures/:leagueId', async (req, res) => {
  try {
    logger.info(`Fetching fixtures for league ${req.params.leagueId}...`);
    const data = await sportsdb.getUpcomingFixtures(req.params.leagueId);
    res.json(data);
  } catch (error) {
    logger.error('Fixtures error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch fixtures',
      message: error.message,
      matches: []
    });
  }
});

// Test endpoint to verify API-Football connection
router.get('/test', async (req, res) => {
  try {
    const axios = (await import('axios')).default;
    const apiKey = process.env.RAPIDAPI_KEY;
    const apiHost = process.env.RAPIDAPI_HOST || 'api-football-v1.p.rapidapi.com';
    
    if (!apiKey) {
      return res.status(400).json({
        success: false,
        error: 'RapidAPI key not configured',
        message: 'Set RAPIDAPI_KEY in .env file'
      });
    }

    const testUrl = `https://${apiHost}/v3/timezone`;
    logger.info(`Testing API-Football: ${testUrl}`);
    
    const response = await axios.get(testUrl, {
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': apiHost
      }
    });
    
    res.json({ 
      success: true,
      message: 'API-Football connection successful!',
      apiKeyLength: apiKey.length,
      timezonesCount: response.data.response?.length || 0,
      sampleTimezones: response.data.response?.slice(0, 5)
    });
  } catch (error) {
    logger.error('API test error:', error.response?.data || error.message);
    res.status(500).json({ 
      success: false,
      error: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
  }
});

export default router;
