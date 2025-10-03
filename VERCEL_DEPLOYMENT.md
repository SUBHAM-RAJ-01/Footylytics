# 🚀 Deploy to Vercel - Step by Step

## Part 1: Deploy Frontend to Vercel

### Step 1: Prepare Your Project

1. **Push to GitHub** (if not already done)
```bash
git add .
git commit -m "Ready for deployment"
git push
```

2. **Make sure your frontend builds locally**
```bash
cd frontend
npm run build
```
If this works, you're ready!

---

### Step 2: Sign Up for Vercel

1. Go to https://vercel.com
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your repositories

---

### Step 3: Import Your Project

1. Click "Add New..." → "Project"
2. Find your repository: `Footylytics`
3. Click "Import"

---

### Step 4: Configure Project Settings

**Framework Preset:** Vite
**Root Directory:** `frontend` ⚠️ Important!

**Build Settings:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

Click "Continue"

---

### Step 5: Add Environment Variables

Click "Environment Variables" and add these:

```
VITE_API_URL
https://your-backend-url.up.railway.app/api

VITE_SUPABASE_URL
https://your-project.supabase.co

VITE_SUPABASE_ANON_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

VITE_STRIPE_PUBLIC_KEY
pk_live_51...
```

**Note:** For now, use your test Stripe key. We'll update to live keys later.

---

### Step 6: Deploy!

1. Click "Deploy"
2. Wait 2-3 minutes
3. You'll see "Congratulations!" when done
4. Click "Visit" to see your live site!

Your app is now live at: `https://your-app.vercel.app`

---

## Part 2: Deploy Backend to Vercel (Alternative)

You can also deploy backend to Vercel instead of Railway!

### Step 1: Create New Project

1. In Vercel dashboard, click "Add New..." → "Project"
2. Import your repository again
3. This time, set Root Directory to: `backend`

### Step 2: Configure Backend

**Framework Preset:** Other
**Root Directory:** `backend`

**Build Settings:**
- Build Command: `npm install`
- Output Directory: (leave empty)
- Install Command: `npm install`

### Step 3: Add Environment Variables

Add all backend environment variables:

```
PORT
5000

NODE_ENV
production

FRONTEND_URL
https://your-frontend.vercel.app

SUPABASE_URL
https://your-project.supabase.co

SUPABASE_SERVICE_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

FOOTBALL_API_KEY
your_key

GEMINI_API_KEY
your_key

STRIPE_SECRET_KEY
sk_test_... (or sk_live_... for production)

STRIPE_WEBHOOK_SECRET
whsec_...

RESEND_API_KEY
re_...

EMAIL_FROM
Footylytics <noreply@yourdomain.com>
```

### Step 4: Add vercel.json

Create `backend/vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.js"
    }
  ]
}
```

### Step 5: Deploy Backend

Click "Deploy" and wait for completion.

Your backend will be at: `https://your-backend.vercel.app`

---

## Part 3: Update Environment Variables

### Update Frontend

1. Go to your frontend project in Vercel
2. Settings → Environment Variables
3. Update `VITE_API_URL` to your backend URL:
```
https://your-backend.vercel.app/api
```
4. Click "Save"
5. Go to Deployments → Click "..." → "Redeploy"

### Update Backend

1. Go to your backend project in Vercel
2. Settings → Environment Variables
3. Update `FRONTEND_URL` to your frontend URL:
```
https://your-frontend.vercel.app
```
4. Click "Save"
5. Redeploy

---

## Part 4: Configure External Services

### 1. Update Supabase

Go to Supabase Dashboard → Authentication → URL Configuration:

**Site URL:**
```
https://your-frontend.vercel.app
```

**Redirect URLs:**
```
https://your-frontend.vercel.app/**
```

### 2. Update Stripe Webhook

Go to Stripe Dashboard → Developers → Webhooks:

**Endpoint URL:**
```
https://your-backend.vercel.app/api/payments/webhook
```

**Events:**
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

Copy the webhook secret and update in Vercel backend environment variables.

### 3. Update Google OAuth (if using)

Go to Google Cloud Console → Credentials:

**Authorized redirect URIs:**
```
https://your-project.supabase.co/auth/v1/callback
```

**Authorized JavaScript origins:**
```
https://your-frontend.vercel.app
```

---

## 🎯 Vercel Dashboard Overview

### Frontend Project
- **URL:** `https://your-frontend.vercel.app`
- **Build:** Vite
- **Root:** `frontend`

### Backend Project (if using Vercel)
- **URL:** `https://your-backend.vercel.app`
- **Build:** Node.js
- **Root:** `backend`

---

## 🔧 Useful Vercel Commands

### Install Vercel CLI
```bash
npm install -g vercel
```

### Deploy from CLI
```bash
cd frontend
vercel
```

### Deploy to Production
```bash
vercel --prod
```

### View Logs
```bash
vercel logs
```

---

## 🐛 Common Issues

### Issue 1: "Build failed"
**Solution:**
- Check build logs in Vercel
- Make sure `npm run build` works locally
- Verify Root Directory is set correctly

### Issue 2: "Environment variables not working"
**Solution:**
- Make sure variables start with `VITE_` for frontend
- Redeploy after adding variables
- Check variable names are exact

### Issue 3: "API not responding"
**Solution:**
- Check VITE_API_URL includes `/api` at the end
- Verify backend is deployed and running
- Check CORS settings in backend

### Issue 4: "404 on refresh"
**Solution:**
Add `vercel.json` in frontend root:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

---

## 📊 Vercel Free Tier Limits

- ✅ 100GB Bandwidth per month
- ✅ Unlimited projects
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Serverless Functions (12 seconds timeout)

Perfect for your app! 🎉

---

## 🚀 Auto-Deployments

Vercel automatically deploys when you push to GitHub:

- **Push to main branch** → Production deployment
- **Push to other branches** → Preview deployment
- **Pull requests** → Preview deployment

---

## 🎨 Custom Domain (Optional)

### Add Your Domain

1. Go to Project Settings → Domains
2. Add your domain: `footylytics.com`
3. Follow DNS configuration instructions
4. Wait for DNS propagation (5-30 minutes)

### Update Environment Variables

After adding domain, update:
- Supabase redirect URLs
- Stripe webhook URL
- Google OAuth URLs
- Backend FRONTEND_URL

---

## ✅ Deployment Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed (Vercel or Railway)
- [ ] Environment variables added
- [ ] Frontend VITE_API_URL updated
- [ ] Backend FRONTEND_URL updated
- [ ] Supabase URLs configured
- [ ] Stripe webhook configured
- [ ] Google OAuth configured (if using)
- [ ] Test all features
- [ ] Monitor for errors

---

## 🎉 You're Live!

Your app is now deployed and accessible worldwide!

**Frontend:** https://your-frontend.vercel.app
**Backend:** https://your-backend.vercel.app (or Railway)

Share it with the world! ⚽🎯

---

## 📞 Need Help?

- Vercel Docs: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- Check deployment logs in Vercel dashboard
- Check browser console for frontend errors
- Check Vercel function logs for backend errors
