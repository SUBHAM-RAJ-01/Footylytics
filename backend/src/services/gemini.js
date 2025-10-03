import { GoogleGenAI } from '@google/genai';
import { logger } from '../utils/logger.js';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export async function generatePrediction(matchData) {
  try {
    console.log('🤖 Initializing Gemini AI...');
    console.log('API Key present:', !!process.env.GEMINI_API_KEY);

    const prompt = `You are a professional football analyst. Analyze this upcoming match and provide a detailed prediction.

Match Details:
- Home Team: ${matchData.homeTeam}
- Away Team: ${matchData.awayTeam}
- Competition: ${matchData.competition}
- Venue: ${matchData.venue || 'Unknown'}
- Date: ${matchData.matchDate || 'TBD'}

Provide your prediction in JSON format (respond ONLY with valid JSON, no markdown or code blocks):
{
  "homeWinProbability": 45,
  "drawProbability": 30,
  "awayWinProbability": 25,
  "predictedScore": "2-1",
  "confidence": "medium",
  "keyFactors": ["Home advantage", "Better recent form", "Key player availability", "Head-to-head record"],
  "reasoning": "Based on home advantage and recent form, the home team has a slight edge in this matchup."
}

Important: 
- Probabilities must add up to 100
- Be realistic and consider home advantage
- Provide specific, insightful key factors`;

    console.log('📤 Sending request to Gemini...');
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: prompt
    });

    console.log('📥 Raw response:', response);
    
    if (!response || !response.text) {
      throw new Error('No text in response from Gemini');
    }
    
    const text = response.text;
    console.log('📥 Received text:', text.substring(0, 200));
    
    // Remove markdown code blocks if present
    let cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Try to find JSON in the response
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const prediction = JSON.parse(jsonMatch[0]);
      console.log('✅ Prediction parsed successfully');
      return prediction;
    }
    
    throw new Error('Invalid response format from AI');
  } catch (error) {
    logger.error('Gemini API error:', error);
    console.error('❌ Gemini error details:');
    console.error('Message:', error.message);
    console.error('Full error:', error);
    throw error;
  }
}
