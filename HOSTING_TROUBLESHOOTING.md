# 🚨 Hosting Troubleshooting Guide

## 🔍 **Step 1: Identify Your Error Type**

### **Frontend Errors (Netlify)**
- Build failures
- 404 errors on refresh
- Blank white screen
- JavaScript module errors
- Environment variable issues

### **Backend Errors (Render)**
- Service won't start
- Database connection issues
- API endpoints returning 500 errors
- CORS errors

### **Integration Errors**
- Frontend can't connect to backend
- Authentication not working
- Payment processing fails

## 🛠️ **Frontend Fixes (Netlify)**

### **Build Failures:**
```bash
# 1. Check build settings in Netlify dashboard:
Build command: npm run build
Publish directory: dist
Node version: 18

# 2. Check if all dependencies are in package.json
npm install

# 3. Test build locally first:
cd frontend
npm run build
```

### **Environment Variables:**
Add these in Netlify dashboard > Site settings > Environment variables:
```env
VITE_API_URL=https://your-backend.onrender.com
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_or_pk_live_key
```

### **404 Errors on Page Refresh:**
✅ Already fixed with `_redirects` and `netlify.toml`

### **JavaScript Module Errors:**
✅ Already fixed with proper MIME types in `netlify.toml`

## 🛠️ **Backend Fixes (Render)**

### **Service Won't Start:**
```bash
# 1. Check build command in Render dashboard:
Build Command: npm install
Start Command: npm start

# 2. Check package.json has start script:
"scripts": {
  "start": "node src/server.js"
}
```

### **Environment Variables:**
Add these in Render dashboard > Environment:
```env
PORT=10000
MONGODB_URI=your_mongodb_connection_string
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
STRIPE_SECRET_KEY=sk_test_or_sk_live_key
STRIPE_WEBHOOK_SECRET=whsec_from_stripe_dashboard
FOOTBALL_API_KEY=your_football_data_api_key
GEMINI_API_KEY=your_google_gemini_api_key
FRONTEND_URL=https://your-app.netlify.app
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100
```

### **Database Connection Issues:**
```javascript
// If MongoDB connection fails, the app will use memory cache
// Check logs in Render dashboard for connection errors
```

## 🔗 **Integration Fixes**

### **CORS Errors:**
✅ Already fixed in backend with flexible CORS configuration

Update the allowed origins in `backend/src/server.js`:
```javascript
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://your-actual-netlify-domain.netlify.app'
];
```

### **API Connection Issues:**
1. **Check frontend environment:**
   ```env
   # Must be HTTPS for production
   VITE_API_URL=https://your-backend.onrender.com
   ```

2. **Test API endpoint:**
   ```bash
   curl https://your-backend.onrender.com/api/health
   # Should return: {"status":"ok","timestamp":"..."}
   ```

### **Authentication Issues:**
1. **Check Supabase configuration:**
   - Project URL is correct
   - Anon key is correct
   - RLS policies are set up

2. **Check redirect URLs in Supabase:**
   - Add your Netlify domain to allowed redirect URLs
   - Format: `https://your-app.netlify.app/*`

## 🚀 **Deployment Checklist**

### **Before Deploying:**
- [ ] Test build locally: `npm run build`
- [ ] Test frontend locally: `npm run preview`
- [ ] Test backend locally: `npm start`
- [ ] All environment variables documented
- [ ] API keys are valid and not expired

### **After Deploying:**
- [ ] Frontend builds successfully
- [ ] Backend service starts
- [ ] Health check endpoint works
- [ ] Authentication flow works
- [ ] API calls work from frontend to backend
- [ ] Database connections work
- [ ] Payment processing works (if applicable)

## 🔍 **Debugging Steps**

### **1. Check Netlify Build Logs:**
```bash
# In Netlify dashboard:
Site overview > Production deploys > [Latest deploy] > Deploy log
```

### **2. Check Render Service Logs:**
```bash
# In Render dashboard:
Services > [Your service] > Logs
```

### **3. Test API Endpoints:**
```bash
# Test health endpoint
curl https://your-backend.onrender.com/api/health

# Test with browser dev tools
fetch('https://your-backend.onrender.com/api/health')
  .then(r => r.json())
  .then(console.log)
```

### **4. Check Browser Console:**
```javascript
// Open browser dev tools (F12)
// Check Console tab for errors
// Check Network tab for failed requests
```

## 🆘 **Common Error Messages & Solutions**

### **"Failed to load module script"**
✅ Fixed with proper `_redirects` and MIME types

### **"CORS policy: No 'Access-Control-Allow-Origin' header"**
✅ Fixed with flexible CORS configuration

### **"Network Error" or "Failed to fetch"**
- Check if backend URL is correct and accessible
- Verify backend service is running
- Check if API endpoint exists

### **"404 Not Found" on page refresh**
✅ Fixed with SPA routing configuration

### **Build fails with "Module not found"**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### **Environment variables not working**
- Check variable names (must start with VITE_ for frontend)
- Restart services after adding variables
- Check for typos in variable names

## 📞 **Getting Help**

If you're still having issues:

1. **Share the specific error message**
2. **Share the deployment logs**
3. **Share your domain URLs**
4. **Describe what you were trying to do when the error occurred**

### **Useful Commands for Debugging:**
```bash
# Test frontend build
cd frontend && npm run build

# Test backend locally
cd backend && npm start

# Check if ports are available
netstat -tulpn | grep :5000
netstat -tulpn | grep :5173
```