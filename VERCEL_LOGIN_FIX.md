# 🔧 Fix Vercel Login Page Error

## Quick Fixes to Try

### Fix 1: Update vercel.json (Most Common Fix)

Replace your `frontend/vercel.json` with this:

```json
{
  "routes": [
    {
      "src": "/[^.]+",
      "dest": "/",
      "status": 200
    }
  ]
}
```

### Fix 2: Check Build Settings in Vercel

Go to Vercel Dashboard → Your Project → Settings → General:

**Root Directory:** `frontend` ✅
**Framework Preset:** Vite ✅
**Build Command:** `npm run build` ✅
**Output Directory:** `dist` ✅
**Install Command:** `npm install` ✅

### Fix 3: Check Environment Variables

Go to Settings → Environment Variables:

Make sure you have:
```
VITE_API_URL
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_STRIPE_PUBLIC_KEY
```

All variables MUST start with `VITE_` for Vite apps!

### Fix 4: Redeploy

After making changes:
1. Go to Deployments tab
2. Click "..." on latest deployment
3. Click "Redeploy"
4. Wait for completion

---

## Common Issues & Solutions

### Issue 1: 404 on /login route

**Cause:** React Router not handling routes properly

**Solution:** Update `frontend/vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Issue 2: Blank page / White screen

**Cause:** Environment variables not set

**Solution:**
1. Check browser console (F12)
2. Look for errors about undefined variables
3. Add missing VITE_ variables in Vercel

### Issue 3: "Cannot GET /login"

**Cause:** SPA routing not configured

**Solution:** Use the vercel.json from Fix 1 above

### Issue 4: Build succeeds but page doesn't load

**Cause:** Base path issue

**Solution:** Add to `vite.config.js`:
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 5173,
    open: true
  }
});
```

---

## Step-by-Step Debugging

### Step 1: Check Vercel Build Logs

1. Go to Vercel Dashboard
2. Click on your deployment
3. Click "Building" or "View Function Logs"
4. Look for errors

Common errors:
- `Module not found` → Missing dependency
- `Build failed` → Syntax error in code
- `Out of memory` → Build too large

### Step 2: Check Browser Console

1. Open your Vercel URL
2. Press F12 (Developer Tools)
3. Go to Console tab
4. Look for errors

Common errors:
- `Failed to fetch` → API URL wrong
- `undefined is not an object` → Missing env variable
- `404` → Routing issue

### Step 3: Check Network Tab

1. F12 → Network tab
2. Refresh page
3. Look for failed requests (red)

Common issues:
- API calls to localhost → Update VITE_API_URL
- 404 on assets → Build output directory wrong

---

## Complete Fix (Do All These)

### 1. Update frontend/vercel.json

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 2. Update frontend/vite.config.js

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  server: {
    port: 5173,
    open: true
  }
});
```

### 3. Verify package.json scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### 4. Push changes to GitHub

```bash
git add .
git commit -m "Fix Vercel routing"
git push
```

Vercel will auto-deploy!

---

## Test Locally First

Before deploying, test the build locally:

```bash
cd frontend
npm run build
npm run preview
```

Visit http://localhost:4173/login

If it works locally, it should work on Vercel!

---

## Still Not Working?

### Check These:

1. **Root Directory**
   - Must be `frontend` not root
   - Check in Vercel Settings → General

2. **Build Output**
   - Should create `dist` folder
   - Check in Vercel build logs

3. **Environment Variables**
   - All must start with `VITE_`
   - Check in Vercel Settings → Environment Variables

4. **API URL**
   - Should be your backend URL + `/api`
   - Example: `https://your-backend.railway.app/api`

5. **Supabase URL**
   - Should be your Supabase project URL
   - Example: `https://abc123.supabase.co`

---

## Quick Test

After deploying, test these URLs:

- `https://your-app.vercel.app` → Should load home
- `https://your-app.vercel.app/login` → Should load login
- `https://your-app.vercel.app/fixtures` → Should load fixtures

If any 404, the routing fix didn't work.

---

## Nuclear Option (If Nothing Works)

### Delete and Redeploy:

1. Delete the Vercel project
2. Create new project
3. Import repository again
4. Set Root Directory to `frontend`
5. Add environment variables
6. Deploy

Sometimes a fresh start fixes weird issues!

---

## Get Help

If still stuck, check:
1. Vercel build logs (full output)
2. Browser console errors
3. Network tab for failed requests

Share these details for better help!
