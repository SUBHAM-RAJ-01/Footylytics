# 🚀 Footylytics Deployment Guide

## Recommended Hosting Platforms

### Frontend: Vercel (Recommended)
- ✅ Free tier available
- ✅ Automatic deployments from GitHub
- ✅ Built-in CDN
- ✅ Perfect for React/Vite apps

### Backend: Railway or Render (Recommended)
- ✅ Free tier available
- ✅ Easy Node.js deployment
- ✅ Environment variables support
- ✅ Automatic HTTPS

---

## 📋 Pre-Deployment Checklist

- [ ] GitHub repository is up to date
- [ ] All API keys are ready
- [ ] Supabase database is set up
- [ ] Stripe account is configured
- [ ] Domain name (optional)

---

## 🎯 Step-by-Step Deployment

### Part 1: Deploy Backend (Railway)

#### 1. Sign Up for Railway
- Go to https://railway.app
- Sign in with GitHub
- Click "New Project"

#### 2. Deploy from GitHub
- Select "Deploy from GitHub repo"
- Choose your repository
- Select the `backend` folder

#### 3. Set Environment Variables
Click on your service → Variables → Add all these:

```env
# Server
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.vercel.app

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_supabase_service_role_key

# Football Data API
FOOTBALL_API_KEY=your_football_data_api_key

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Stripe
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Resend (Email)
RESEND_API_KEY=re_your_resend_api_key
EMAIL_FROM=Footylytics <noreply@yourdomain.com>

# MongoDB (Optional)
MONGODB_URI=mongodb+srv://your_connection_string

# Cache Settings
CACHE_TTL_LIVE_MATCH=60
CACHE_TTL_FIXTURES=1800
CACHE_TTL_STANDINGS=3600
CACHE_TTL_TEAM_INFO=86400

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

#### 4. Get Your Backend URL
- After deployment, Railway will give you a URL like:
- `https://your-app.up.railway.app`
- **Save this URL** - you'll need it for frontend!

---

### Part 2: Deploy Frontend (Vercel)

#### 1. Sign Up for Vercel
- Go to https://vercel.com
- Sign in with GitHub
- Click "Add New Project"

#### 2. Import Repository
- Select your GitHub repository
- Vercel will auto-detect it's a Vite app
- Set Root Directory to `frontend`

#### 3. Configure Build Settings
```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

#### 4. Set Environment Variables
Add these in Vercel → Settings → Environment Variables:

```env
VITE_API_URL=https://your-backend.up.railway.app/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLIC_KEY=pk_live_your_live_public_key
```

#### 5. Deploy
- Click "Deploy"
- Wait 2-3 minutes
- Your app will be live at: `https://your-app.vercel.app`

---

## 🔧 Post-Deployment Configuration

### 1. Update Supabase Redirect URLs

Go to Supabase Dashboard → Authentication → URL Configuration:

**Site URL:**
```
https://your-app.vercel.app
```

**Redirect URLs (add all):**
```
https://your-app.vercel.app
https://your-app.vercel.app/
https://your-app.vercel.app/**
```

### 2. Update Stripe Webhook

Go to Stripe Dashboard → Developers → Webhooks:

**Endpoint URL:**
```
https://your-backend.up.railway.app/api/payments/webhook
```

**Events to listen to:**
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

**Copy the Webhook Secret** and update in Railway environment variables.

### 3. Update Google OAuth (if using)

Go to Google Cloud Console → Credentials:

**Authorized redirect URIs:**
```
https://your-project.supabase.co/auth/v1/callback
```

**Authorized JavaScript origins:**
```
https://your-app.vercel.app
```

### 4. Update CORS in Backend

The backend already has CORS configured, but verify in `backend/src/server.js`:

```javascript
app.use(cors({ 
  origin: process.env.FRONTEND_URL,  // Should be your Vercel URL
  credentials: true 
}));
```

---

## 📝 Environment Variables Summary

### Frontend (.env in Vercel)
```env
VITE_API_URL=https://your-backend.up.railway.app/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_STRIPE_PUBLIC_KEY=pk_live_...
```

### Backend (.env in Railway)
```env
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGc...

FOOTBALL_API_KEY=your_key
GEMINI_API_KEY=your_key
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
EMAIL_FROM=Footylytics <noreply@yourdomain.com>
```

---

## 🔒 Security Checklist

- [ ] Use LIVE Stripe keys (not test keys)
- [ ] Never commit .env files to GitHub
- [ ] Use strong Supabase service role key
- [ ] Enable Stripe webhook signature verification
- [ ] Set up proper CORS origins
- [ ] Use HTTPS everywhere
- [ ] Enable rate limiting
- [ ] Set up monitoring/logging

---

## 🧪 Testing Production

### 1. Test Frontend
```
✓ Visit https://your-app.vercel.app
✓ Sign up with email
✓ Check email verification
✓ Browse fixtures, standings
✓ Test dark mode
```

### 2. Test Backend
```
✓ Check API health: https://your-backend.up.railway.app/api/health
✓ Test live scores endpoint
✓ Verify CORS is working
```

### 3. Test Payments
```
✓ Try purchasing premium
✓ Use real card (small amount)
✓ Verify webhook receives event
✓ Check premium features unlock
```

### 4. Test Notifications
```
✓ Subscribe to match notifications
✓ Check email delivery
✓ Verify countdown in Settings
```

---

## 🐛 Common Issues & Fixes

### Issue 1: "API not responding"
**Fix:** Check VITE_API_URL in Vercel includes `/api` at the end

### Issue 2: "CORS error"
**Fix:** Update FRONTEND_URL in Railway to match your Vercel URL exactly

### Issue 3: "Stripe webhook failing"
**Fix:** 
1. Check webhook URL is correct
2. Verify webhook secret in Railway
3. Check Stripe dashboard for errors

### Issue 4: "OAuth not working"
**Fix:** Update redirect URLs in Google Cloud Console and Supabase

### Issue 5: "Database connection failed"
**Fix:** Check Supabase URL and keys are correct in both frontend and backend

---

## 📊 Monitoring

### Railway Dashboard
- Check logs for errors
- Monitor memory/CPU usage
- Set up alerts

### Vercel Dashboard
- Check deployment logs
- Monitor function execution
- View analytics

### Supabase Dashboard
- Monitor database usage
- Check auth logs
- View API requests

---

## 🔄 Updating Your App

### Update Frontend
1. Push changes to GitHub
2. Vercel auto-deploys
3. Check deployment status

### Update Backend
1. Push changes to GitHub
2. Railway auto-deploys
3. Check logs for errors

### Update Environment Variables
1. Update in Vercel/Railway dashboard
2. Redeploy if needed
3. Test changes

---

## 💰 Cost Estimate

### Free Tier (Good for starting)
- Vercel: Free (100GB bandwidth)
- Railway: $5/month credit (enough for small app)
- Supabase: Free (500MB database, 50K users)
- Stripe: Free (2.9% + ₹3 per transaction)

### Paid Tier (For growth)
- Vercel Pro: $20/month
- Railway: ~$10-20/month
- Supabase Pro: $25/month
- Total: ~$55-65/month

---

## 🎉 Launch Checklist

- [ ] Backend deployed on Railway
- [ ] Frontend deployed on Vercel
- [ ] All environment variables set
- [ ] Supabase URLs updated
- [ ] Stripe webhook configured
- [ ] Google OAuth configured (if using)
- [ ] Test all features
- [ ] Monitor for errors
- [ ] Share with users!

---

## 📞 Support

If you encounter issues:
1. Check Railway/Vercel logs
2. Check browser console
3. Verify all environment variables
4. Test API endpoints directly
5. Check Supabase logs

---

## 🚀 You're Ready!

Your app is now live and accessible worldwide!

**Frontend:** https://your-app.vercel.app
**Backend:** https://your-backend.up.railway.app

Share it with the world! ⚽🎯
