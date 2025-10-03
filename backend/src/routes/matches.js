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
    
    // Return mock data if API fails
    const { mockMatches } = await import('../services/mockData.js');
    logger.warn('Returning mock data due to API error');
    res.json(mockMatches);
  }
});

router.get('/fixtures/:leagueId', async (req, res) => {
  try {
    const data = await sportsdb.getUpcomingFixtures(req.params.leagueId);
    res.json(data);
  } catch (error) {
    logger.error('Fixtures error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch fixtures',
      message: error.message 
    });
  }
});

// Test endpoint to verify API connection
router.get('/test', async (req, res) => {
  try {
    const axios = (await import('axios')).default;
    const apiKey = process.env.FOOTBALL_API_KEY;
    
    if (!apiKey || apiKey === 'your_football_data_api_key') {
      return res.status(400).json({
        success: false,
        error: 'API key not configured',
        message: 'Get free key from: https://www.football-data.org/client/register'
      });
    }

    const testUrl = 'https://api.football-data.org/v4/competitions';
    logger.info(`Testing API: ${testUrl}`);
    
    const response = await axios.get(testUrl, {
      headers: {
        'X-Auth-Token': apiKey
      }
    });
    
    res.json({ 
      success: true,
      message: 'API connection successful!',
      apiKeyLength: apiKey.length,
      competitionsCount: response.data.competitions?.length || 0,
      sample: response.data.competitions?.slice(0, 3).map(c => ({
        id: c.id,
        name: c.name,
        area: c.area.name
      }))
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
