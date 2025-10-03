import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import { logger } from './utils/logger.js';
import matchRoutes from './routes/matches.js';
import leagueRoutes from './routes/leagues.js';
import teamRoutes from './routes/teams.js';
import predictionRoutes from './routes/predictions.js';
import userRoutes from './routes/users.js';
import paymentRoutes from './routes/payments.js';
import authRoutes from './routes/auth.js';
import notificationRoutes from './routes/notifications.js';
import pushRoutes from './routes/push.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'https://localhost:5173',
  'https://footylytics.netlify.app'
].filter(Boolean);

app.use(cors({ 
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // For development, allow any localhost
    if (origin && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true 
}));

// Stripe webhook needs raw body - must be BEFORE express.json()
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// JSON parsing for all other routes
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests, please try again later.'
});
app.use('/api/', limiter);

// MongoDB connection (optional - will use memory cache if not available)
if (process.env.MONGODB_URI && process.env.MONGODB_URI !== 'mongodb://localhost:27017/footylytics') {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => logger.info('MongoDB connected'))
    .catch(err => {
      logger.warn('MongoDB connection failed, using memory cache:', err.message);
    });
} else {
  logger.info('MongoDB not configured, using memory cache');
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/leagues', leagueRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/push', pushRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    pushNotifications: !!(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY)
  });
});

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
