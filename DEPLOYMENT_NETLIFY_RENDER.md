# 🚀 Deployment Guide: Netlify + Render

## 📱 Frontend Deployment (Netlify)

### **Step 1: Prepare for Deployment**
```bash
cd frontend
npm run build
# This creates a 'dist' folder with your built app
```

### **Step 2: Deploy to Netlify**

#### **Option A: Drag & Drop (Quick)**
1. Go to [netlify.com](https://netlify.com)
2. Drag the `dist` folder to the deploy area
3. Your app will be live instantly!

#### **Option B: Git Integration (Recommended)**
1. Push your code to GitHub/GitLab
2. Connect repository to Netlify
3. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: `18`

### **Step 3: Configure Environment Variables**
In Netlify dashboard > Site settings > Environment variables:
```env
VITE_API_URL=https://your-backend-url.onrender.com
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### **Step 4: Custom Domain (Optional)**
1. Go to Domain settings
2. Add your custom domain
3. Configure DNS records
4. Enable HTTPS (automatic)

---

## 🖥️ Backend Deployment (Render)

### **Step 1: Prepare Backend**
```bash
cd backend
# Ensure package.json has start script
npm install
```

### **Step 2: Deploy to Render**
1. Go to [render.com](https://render.com)
2. Connect your GitHub repository
3. Create new Web Service
4. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Node Version**: `18`

### **Step 3: Environment Variables**
In Render dashboard > Environment:
```env
PORT=10000
MONGODB_URI=your_mongodb_connection_string
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
FOOTBALL_API_KEY=your_football_api_key
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=production
```

### **Step 4: Update Frontend API URL**
Update your Netlify environment variables with the Render backend URL:
```env
VITE_API_URL=https://your-app-name.onrender.com
```

---

## 🔧 Fix MIME Type Issues

### **Files Already Configured:**
✅ `netlify.toml` - Netlify configuration with proper MIME types
✅ `_redirects` - SPA routing that doesn't break static assets
✅ `.htaccess` - Apache server configuration (backup)
✅ `vite.config.js` - Optimized build settings

### **If Issues Persist:**

#### **Clear Build Cache:**
```bash
cd frontend
rm -rf dist node_modules
npm install
npm run build
```

#### **Check Netlify Build Logs:**
1. Go to Netlify dashboard
2. Check "Deploys" tab
3. Look for build errors
4. Verify all files are being copied correctly

#### **Test Locally:**
```bash
cd frontend
npm run build
npm run preview
# Test if built version works locally
```

---

## 🧪 Testing Your Deployment

### **Frontend Tests:**
- [ ] App loads without errors
- [ ] All routes work (refresh test)
- [ ] Static assets load (images, icons)
- [ ] PWA features work
- [ ] Service worker registers
- [ ] Manifest.json loads

### **Backend Tests:**
- [ ] API endpoints respond
- [ ] Database connections work
- [ ] Authentication works
- [ ] Stripe webhooks work
- [ ] CORS is configured for frontend domain

### **Integration Tests:**
- [ ] Frontend can call backend APIs
- [ ] Authentication flow works
- [ ] Payment processing works
- [ ] Notifications work

---

## 🚨 Common Issues & Solutions

### **MIME Type Error Still Occurs:**
1. **Check _redirects file** - Make sure static assets aren't being redirected
2. **Clear Netlify cache** - Trigger a new deploy
3. **Check build output** - Verify JS files are in dist/assets/
4. **Test with curl**:
   ```bash
   curl -I https://your-app.netlify.app/assets/index-abc123.js
   # Should return Content-Type: application/javascript
   ```

### **404 Errors on Refresh:**
- Check `_redirects` file is in `public` folder
- Verify SPA fallback rule: `/* /index.html 200`

### **Environment Variables Not Working:**
- Prefix with `VITE_` for frontend
- Redeploy after adding variables
- Check build logs for variable loading

### **Backend Connection Issues:**
- Verify CORS settings in backend
- Check Render service is running
- Test API endpoints directly

---

## 📊 Monitoring & Analytics

### **Netlify Analytics:**
- Enable in site settings
- Monitor page views and performance
- Check for 404s and errors

### **Render Monitoring:**
- Check service health
- Monitor response times
- Set up alerts for downtime

### **Application Monitoring:**
```javascript
// Add to your app for error tracking
window.addEventListener('error', (e) => {
  console.error('App Error:', e.error);
  // Send to your analytics service
});
```

---

## 🎉 Success Checklist

- [ ] Frontend deployed to Netlify with HTTPS
- [ ] Backend deployed to Render
- [ ] Environment variables configured
- [ ] Custom domain configured (optional)
- [ ] PWA features working
- [ ] All API integrations working
- [ ] Error monitoring set up

**Your Footylytics app is now live! 🚀**

### **Next Steps:**
1. Test PWA installation on mobile
2. Generate APK using PWABuilder with your live URL
3. Submit to app stores if desired
4. Monitor performance and user feedback

---

## 🆘 Need Help?

If you encounter issues:
1. Check Netlify/Render build logs
2. Test locally first
3. Verify all environment variables
4. Check browser console for errors
5. Use the notification tester in Developer page