import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  matchId: { type: String, required: true },
  homeTeam: String,
  awayTeam: String,
  prediction: {
    homeWinProbability: Number,
    drawProbability: Number,
    awayWinProbability: Number,
    predictedScore: String,
    confidence: String,
    keyFactors: [String],
    reasoning: String
  },
  actualResult: {
    homeScore: Number,
    awayScore: Number,
    outcome: String
  },
  isCorrect: Boolean,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Prediction', predictionSchema);
