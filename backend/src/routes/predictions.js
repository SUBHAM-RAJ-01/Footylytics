import express from 'express';
import { authenticateUser, requirePremium } from '../middleware/auth.js';
import { generatePrediction } from '../services/gemini.js';
import Prediction from '../models/Prediction.js';
import sportsdb from '../services/sportsdb.js';

const router = express.Router();

router.post('/predict', authenticateUser, requirePremium, async (req, res) => {
  try {
    console.log('📥 Received request body:', JSON.stringify(req.body, null, 2));
    const { match } = req.body;
    
    if (!match) {
      console.log('❌ No match data in request');
      return res.status(400).json({ error: 'Match data is required' });
    }

    console.log('🎯 Generating AI prediction for:', match.homeTeam?.name, 'vs', match.awayTeam?.name);

    // Prepare match data for AI
    const matchData = {
      homeTeam: match.homeTeam?.name || 'Home Team',
      awayTeam: match.awayTeam?.name || 'Away Team',
      homeTeamForm: [],
      awayTeamForm: [],
      h2h: [],
      homePosition: 'N/A',
      awayPosition: 'N/A',
      competition: match.competition?.name || 'Unknown',
      matchDate: match.utcDate
    };

    console.log('🤖 Calling Gemini AI...');
    const aiPrediction = await generatePrediction(matchData);
    console.log('✅ AI prediction received:', aiPrediction);

    // Format response
    const prediction = {
      prediction: aiPrediction.homeWinProbability > aiPrediction.awayWinProbability 
        ? (aiPrediction.homeWinProbability > aiPrediction.drawProbability ? 'Home Win' : 'Draw')
        : (aiPrediction.awayWinProbability > aiPrediction.drawProbability ? 'Away Win' : 'Draw'),
      confidence: Math.max(
        aiPrediction.homeWinProbability,
        aiPrediction.drawProbability,
        aiPrediction.awayWinProbability
      ),
      analysis: aiPrediction.reasoning || 'AI analysis based on team form and statistics.',
      keyFactors: aiPrediction.keyFactors || [],
      predictedScore: aiPrediction.predictedScore,
      probabilities: {
        homeWin: aiPrediction.homeWinProbability,
        draw: aiPrediction.drawProbability,
        awayWin: aiPrediction.awayWinProbability
      }
    };

    res.json(prediction);
  } catch (error) {
    console.error('❌ Prediction error:', error);
    res.status(500).json({ 
      error: 'Failed to generate prediction',
      message: error.message 
    });
  }
});

router.get('/history', authenticateUser, async (req, res) => {
  try {
    const predictions = await Prediction.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(predictions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch prediction history' });
  }
});

export default router;
