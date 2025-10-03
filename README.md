# ⚽ Footylytics

A modern, feature-rich football analytics platform built with React, Node.js, and Supabase. Get live scores, fixtures, standings, AI-powered predictions, and more!

![Footylytics](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### 🎯 Core Features
- **Live Scores** - Real-time match updates and scores
- **Fixtures** - Upcoming matches with countdown timers
- **Standings** - League tables with detailed statistics
- **My Team** - Follow your favorite teams
- **Match Notifications** - Get notified before matches start

### 🤖 Premium Features
- **AI Predictions** - Google Gemini-powered match predictions
- **Advanced Analytics** - Detailed team and player statistics
- **Head-to-Head Analysis** - Historical matchup data
- **Ad-Free Experience** - Clean, distraction-free interface

### 🎨 UI/UX
- **Dark Mode** - Beautiful dark theme support
- **Responsive Design** - Works perfectly on all devices
- **Mobile Menu** - Smooth hamburger menu for mobile
- **Animations** - Framer Motion powered transitions
- **Football Graphics** - Animated football-themed elements

### 🔐 Authentication
- **Email/Password** - Secure authentication with Supabase
- **Google OAuth** - One-click sign in with Google
- **Email Verification** - Confirmation links via Resend
- **Password Reset** - Easy password recovery

### 💳 Payments
- **Stripe Integration** - Secure payment processing
- **Premium Subscriptions** - ₹29/month premium plans
- **Test Mode** - Full testing support

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **date-fns** - Date manipulation

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **Supabase** - Backend as a Service
- **MongoDB** - Database (optional)
- **Resend** - Email service
- **Stripe** - Payment processing

### APIs
- **Football-Data.org** - Match data and statistics
- **Google Gemini** - AI predictions
- **Supabase Auth** - Authentication
- **Stripe API** - Payments

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Football-Data.org API key
- Stripe account (for payments)
- Resend account (for emails)
- Google Gemini API key (for predictions)

### 1. Clone Repository
```bash
git clone https://github.com/SUBHAM-RAJ-01/Footylytics.git
cd Footylytics
```

### 2. Install Dependencies

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd backend
npm install
```

### 3. Environment Variables

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

**Backend (.env):**
```env
PORT=5000
FRONTEND_URL=http://localhost:5173

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key

# Football Data API
FOOTBALL_API_KEY=your_football_data_api_key

# Google Gemini
GEMINI_API_KEY=your_gemini_api_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Resend (Email)
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=Footylytics <noreply@yourdomain.com>

# MongoDB (Optional)
MONGODB_URI=mongodb://localhost:27017/footylytics

# Cache Settings
CACHE_TTL_LIVE_MATCH=60
CACHE_TTL_FIXTURES=1800
CACHE_TTL_STANDINGS=3600
CACHE_TTL_TEAM_INFO=86400

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Database Setup

Run the SQL scripts in your Supabase SQL Editor:
```bash
# 1. Basic setup
SUPABASE_SETUP.sql

# 2. Add missing columns
ADD_MISSING_COLUMNS.sql

# 3. Match notifications
MATCH_NOTIFICATIONS_TABLE.sql
```

### 5. Run Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Visit: http://localhost:5173

## 🔧 Configuration

### Get API Keys

1. **Football-Data.org**
   - Sign up at https://www.football-data.org/client/register
   - Free tier: 10 requests/minute
   - Copy your API key

2. **Supabase**
   - Create project at https://supabase.com
   - Get URL and keys from Settings → API
   - Run SQL scripts for database setup

3. **Stripe**
   - Sign up at https://stripe.com
   - Get test keys from Developers → API keys
   - Set up webhook endpoint

4. **Google Gemini**
   - Get API key from https://makersuite.google.com/app/apikey
   - Free tier available

5. **Resend**
   - Sign up at https://resend.com
   - Get API key from dashboard
   - Verify your domain (optional)

### Google OAuth Setup (Optional)

1. Go to Google Cloud Console
2. Create OAuth credentials
3. Add redirect URI: `https://YOUR-PROJECT.supabase.co/auth/v1/callback`
4. Add credentials to Supabase → Authentication → Providers

## 📱 Features Guide

### Match Notifications
1. Go to Fixtures page
2. Click bell icon on any match
3. Get notified before match starts
4. View all notifications in navbar

### Premium Subscription
1. Click "Upgrade" button
2. Choose plan (₹29/month)
3. Complete Stripe payment
4. Access AI predictions instantly

### AI Predictions
1. Subscribe to Premium
2. Go to Predictions page
3. Select a match
4. View AI-powered analysis

### My Team
1. Go to My Team page
2. Search for your team
3. Click "Follow"
4. See team stats and fixtures

## 🏗️ Project Structure

```
Footylytics/
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   ├── utils/          # Utility functions
│   │   └── main.jsx        # Entry point
│   └── package.json
│
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── models/         # Database models
│   │   ├── middleware/     # Express middleware
│   │   └── server.js       # Entry point
│   └── package.json
│
├── .gitignore
└── README.md
```

## 🧪 Testing

### Test Stripe Payments
Use test card numbers:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Any future expiry date and CVC

### Test Email
Emails are logged to console in development mode without Resend API key.

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Render)
```bash
cd backend
# Set environment variables
# Deploy with Node.js
```

### Environment Variables
Update all URLs to production values:
- `VITE_API_URL` → Your backend URL
- `FRONTEND_URL` → Your frontend URL
- Update Stripe webhook URL
- Update OAuth redirect URLs

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Subham Raj**
- GitHub: [@SUBHAM-RAJ-01](https://github.com/SUBHAM-RAJ-01)

## 🙏 Acknowledgments

- Football-Data.org for match data
- Supabase for backend infrastructure
- Google Gemini for AI predictions
- Stripe for payment processing
- All open-source libraries used

## 📞 Support

For issues or questions:
1. Check existing issues on GitHub
2. Create a new issue with details
3. Include error messages and screenshots

---

Made with ❤️ for football fans worldwide ⚽
