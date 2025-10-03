# 🚀 Deploy Backend RIGHT NOW - 5 Minutes

## Option 1: Railway (Easiest - Recommended)

### Step 1: Sign Up
- Go to https://railway.app
- Click "Login with GitHub"
- Authorize Railway

### Step 2: Create New Project
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose your `Footylytics` repository
- Railway will ask which folder - Select `backend`

### Step 3: Add Environment Variables
Click on your service → Variables tab → Raw Editor

Paste this (update with your values):

```
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_key
FOOTBALL_API_KEY=your_football_api_key
GEMINI_API_KEY=your_gemini_key
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_secret
RESEND_API_KEY=re_your_key
EMAIL_FROM=Footylytics <noreply@resend.dev>
CACHE_TTL_LIVE_MATCH=60
CACHE_TTL_FIXTURES=1800
CACHE_TTL_STANDINGS=3600
CACHE_TTL_TEAM_INFO=86400
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

### Step 4: Deploy
- Railway auto-deploys
- Wait 2-3 minutes
- You'll get a URL like: `https://your-app.up.railway.app`

### Step 5: Update Frontend
- Go to Vercel → Your frontend project
- Settings → Environment Variables
- Update `VITE_API_URL` to: `https://your-app.up.railway.app/api`
- Redeploy frontend

---

## Option 2: Render (Also Free)

### Step 1: Sign Up
- Go to https://render.com
- Sign in with GitHub

### Step 2: Create Web Service
- Click "New +"
- Select "Web Service"
- Connect your GitHub repository
- Select `backend` folder

### Step 3: Configure
```
Name: footylytics-backend
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: node src/server.js
```

### Step 4: Add Environment Variables
Same as Railway (see above)

### Step 5: Deploy
- Click "Create Web Service"
- Wait 5 minutes
- Get your URL

---

## Option 3: Vercel (For Backend Too)

### Step 1: Create New Project in Vercel
- Go to Vercel Dashboard
- Add New → Project
- Import your repository AGAIN

### Step 2: Configure for Backend
```
Root Directory: backend  ← IMPORTANT!
Framework: Other
Build Command: (leave empty)
Output Directory: (leave empty)
Install Command: npm install
```

### Step 3: Add Environment Variables
Same as above

### Step 4: Deploy
- Click Deploy
- Get your backend URL

---

## 🔍 Quick Check - Is Backend Working?

After deploying, test these URLs:

### Health Check:
```
https://your-backend-url/api/health
```
Should return:
```json
{"status":"ok","timestamp":"2025-10-03T..."}
```

### Test Fixtures:
```
https://your-backend-url/api/matches/fixtures/2021
```
Should return match data

If these work, your backend is live! ✅

---

## 🔗 Connect Frontend to Backend

### Update Frontend Environment Variable:

1. Go to Vercel → Your frontend project
2. Settings → Environment Variables
3. Find `VITE_API_URL`
4. Update to: `https://your-backend-url/api`
5. Click "Save"
6. Go to Deployments → Redeploy

---

## ✅ Verification Checklist

After deploying backend:

- [ ] Backend URL is accessible
- [ ] `/api/health` returns OK
- [ ] Frontend VITE_API_URL updated
- [ ] Frontend redeployed
- [ ] Test fixtures page loads
- [ ] Test live scores loads
- [ ] Test standings loads

---

## 🎯 My Recommendation:

**Use Railway** - It's the easiest:
1. One-click GitHub import
2. Auto-detects Node.js
3. Gives you a URL instantly
4. Free $5/month credit
5. Perfect for Express apps

---

## 🐛 Common Backend Issues

### Issue 1: "Cannot connect to backend"
**Check:** VITE_API_URL in frontend includes `/api` at the end

### Issue 2: "CORS error"
**Check:** FRONTEND_URL in backend matches your Vercel URL exactly

### Issue 3: "API returns 500"
**Check:** All environment variables are set in backend

### Issue 4: "Webhook not working"
**Check:** Stripe webhook URL points to your backend

---

## 🚀 Quick Deploy Command

If you have Railway CLI:
```bash
cd backend
railway login
railway init
railway up
```

---

Your backend needs to be deployed for fixtures, standings, and all data to load!

Choose Railway and follow the steps above - you'll be live in 5 minutes! 🎉
