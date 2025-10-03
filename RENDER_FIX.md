# 🔧 Fix Render Deployment Error

## The Problem:
Render is trying to run `npm run dev` which uses `nodemon` (dev dependency).
For production, it should use `npm start` which uses `node`.

## ✅ Quick Fix:

### In Render Dashboard:

1. **Go to your service**
2. **Click "Settings"** (left sidebar)
3. **Find "Start Command"**
4. **Change from:**
   ```
   npm run dev
   ```
   **To:**
   ```
   npm start
   ```
5. **Click "Save Changes"**
6. **Manual Deploy** → Click "Deploy latest commit"

---

## Complete Render Configuration:

### Build & Deploy Settings:

```
Name: footylytics-backend
Root Directory: backend
Runtime: Node
Branch: main

Build Command: npm install
Start Command: npm start  ← IMPORTANT!

Auto-Deploy: Yes
```

### Environment Variables:

Add all these in Render → Environment tab:

```
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_key

FOOTBALL_API_KEY=your_key
GEMINI_API_KEY=your_key

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

---

## After Deployment:

### 1. Get Your Backend URL
Render will give you a URL like:
```
https://footylytics-backend.onrender.com
```

### 2. Test Backend
Visit:
```
https://your-backend.onrender.com/api/health
```

Should return:
```json
{"status":"ok","timestamp":"..."}
```

### 3. Update Frontend
Go to Vercel → Your frontend → Settings → Environment Variables

Update `VITE_API_URL`:
```
https://your-backend.onrender.com/api
```

Click "Save" → Redeploy

---

## 🎯 Alternative: Use Railway Instead

Render free tier can be slow. Railway is faster:

### Railway Setup:
1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Select `backend` folder
4. Add environment variables
5. Done! Much faster than Render

Railway gives you:
- ✅ Faster deployments
- ✅ Better performance
- ✅ Easier configuration
- ✅ $5/month free credit

---

## 🐛 Common Render Issues

### Issue 1: "nodemon not found"
**Fix:** Change Start Command to `npm start`

### Issue 2: "Build failed"
**Fix:** Make sure Root Directory is `backend`

### Issue 3: "Port already in use"
**Fix:** Render sets PORT automatically, your code already handles this

### Issue 4: "Service unavailable"
**Fix:** Check environment variables are all set

---

## ⚡ Quick Comparison

| Feature | Railway | Render |
|---------|---------|--------|
| Speed | ⚡ Fast | 🐌 Slower |
| Free Tier | $5 credit | Free forever |
| Setup | Easy | Easy |
| Performance | Better | Good |
| Cold Starts | Minimal | Can be slow |

**Recommendation:** Use Railway for better performance!

---

## 🎉 After Backend is Live:

Your app will work completely:
- ✅ Fixtures load
- ✅ Standings load
- ✅ Live scores load
- ✅ Predictions work
- ✅ Payments work
- ✅ Everything works!

---

## 🚀 Deploy Now!

Choose one:
- **Railway** (recommended) - https://railway.app
- **Render** (free forever) - https://render.com

Both work great - Railway is just faster! 🎯
