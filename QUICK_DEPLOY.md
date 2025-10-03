# ⚡ Quick Deployment Guide

## 🚀 Deploy in 15 Minutes

### Step 1: Deploy Backend (5 min)

1. **Go to Railway.app**
   - Sign in with GitHub
   - New Project → Deploy from GitHub
   - Select your repo → Choose `backend` folder

2. **Add Environment Variables**
   - Copy from `backend/.env.production.example`
   - Update with your actual values
   - **Important:** Use LIVE Stripe keys!

3. **Get Backend URL**
   - Copy the URL: `https://your-app.up.railway.app`
   - Save it for frontend setup

### Step 2: Deploy Frontend (5 min)

1. **Go to Vercel.com**
   - Sign in with GitHub
   - New Project → Import your repo
   - Root Directory: `frontend`

2. **Add Environment Variables**
   - Copy from `frontend/.env.production.example`
   - `VITE_API_URL` = Your Railway URL + `/api`
   - **Important:** Use LIVE Stripe public key!

3. **Deploy**
   - Click Deploy
   - Wait 2-3 minutes
   - Get your URL: `https://your-app.vercel.app`

### Step 3: Update Services (5 min)

1. **Update Railway**
   - Add `FRONTEND_URL` = Your Vercel URL

2. **Update Supabase**
   - Site URL = Your Vercel URL
   - Redirect URLs = Your Vercel URL + `/**`

3. **Update Stripe**
   - Webhook URL = Your Railway URL + `/api/payments/webhook`
   - Copy webhook secret → Add to Railway

## ✅ Done!

Your app is live at: `https://your-app.vercel.app`

## 🧪 Test It

- [ ] Visit your Vercel URL
- [ ] Sign up with email
- [ ] Browse fixtures
- [ ] Try premium purchase (small amount)
- [ ] Check all features work

## 🐛 Issues?

Check `DEPLOYMENT_GUIDE.md` for detailed troubleshooting.

---

**Need Help?**
- Railway logs: Check for backend errors
- Vercel logs: Check for frontend errors
- Browser console: Check for API errors
