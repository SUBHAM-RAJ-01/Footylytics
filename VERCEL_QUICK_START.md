# ⚡ Vercel Quick Start - 10 Minutes

## 🎯 Deploy Frontend (5 min)

### 1. Go to Vercel
→ https://vercel.com
→ Sign in with GitHub

### 2. Import Project
→ Add New → Project
→ Select `Footylytics` repo
→ Click Import

### 3. Configure
```
Framework: Vite
Root Directory: frontend ⚠️
Build Command: npm run build
Output Directory: dist
```

### 4. Add Environment Variables
```
VITE_API_URL = https://your-backend-url/api
VITE_SUPABASE_URL = https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGc...
VITE_STRIPE_PUBLIC_KEY = pk_test_... (or pk_live_...)
```

### 5. Deploy
→ Click "Deploy"
→ Wait 2-3 minutes
→ Done! 🎉

**Your URL:** `https://your-app.vercel.app`

---

## 🔧 Deploy Backend (5 min)

### Option A: Use Railway (Recommended)
→ See `DEPLOYMENT_GUIDE.md`

### Option B: Use Vercel
→ Same steps as frontend
→ Root Directory: `backend`
→ Add all backend environment variables

---

## ✅ After Deployment

### Update These:

1. **Supabase**
   - Site URL → Your Vercel URL
   - Redirect URLs → Your Vercel URL + `/**`

2. **Stripe**
   - Webhook URL → Your backend URL + `/api/payments/webhook`

3. **Environment Variables**
   - Frontend: Update `VITE_API_URL` with backend URL
   - Backend: Update `FRONTEND_URL` with frontend URL

---

## 🧪 Test It

- [ ] Visit your Vercel URL
- [ ] Sign up works
- [ ] Fixtures load
- [ ] Dark mode works
- [ ] Premium purchase works

---

## 🐛 Issues?

**Build Failed?**
→ Check Root Directory is set to `frontend`

**API Not Working?**
→ Check `VITE_API_URL` ends with `/api`

**404 on Refresh?**
→ `vercel.json` file is already added ✅

---

## 🎉 Done!

Your app is live at: `https://your-app.vercel.app`

**Next Steps:**
- Share with friends
- Monitor Vercel dashboard
- Check for errors
- Enjoy! ⚽
