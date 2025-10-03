# Stripe Payment Troubleshooting Guide

## ✅ What I Just Fixed

1. **Created missing authentication middleware** (`backend/src/middleware/auth.js`)
2. **Fixed session token handling** in AuthContext
3. **Updated Pricing page** to use correct token
4. **Added better error logging** to see what's happening

## 🔄 Next Steps

### 1. Restart Both Servers

**Terminal 1 (Backend):**

```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**

```bash
cd frontend
npm run dev
```

### 2. Test the Payment Flow

1. Go to: http://localhost:5173/login
2. Sign in with your account
3. Go to: http://localhost:5173/pricing
4. Click "Upgrade Now"
5. Watch the **backend console** for logs

### 3. Check Backend Console

You should see:

```
💳 Creating checkout session:
   User: your@email.com
   Price ID: price_xxxxxxxxxxxxx
✅ Checkout session created: cs_test_xxxxxxxxxxxxx
```

If you see errors, they'll show up here!

## 🐛 Common Issues & Solutions

### Issue 1: "Failed to initiate payment"

**Check Backend Console for:**

#### Error: "No authorization token provided"

**Solution:** Make sure you're logged in

```bash
# Go to /login and sign in again
```

#### Error: "Invalid or expired token"

**Solution:** Sign out and sign in again

```bash
# Click sign out, then sign in
```

#### Error: "No such price"

**Solution:** Check your Price IDs

```bash
# In Stripe Dashboard:
# 1. Go to Products
# 2. Click on your product
# 3. Copy the correct Price ID (starts with price_)
# 4. Update .env files
# 5. Restart servers
```

#### Error: "Stripe not configured"

**Solution:** Check your Stripe secret key

```bash
# In backend/.env:
STRIPE_SECRET_KEY=sk_test_51xxxxxxxxxxxxx

# Make sure it starts with sk_test_
# Restart backend
```

### Issue 2: Monthly and Yearly Same Price ID

**Your current .env has:**

```env
STRIPE_PRICE_ID_MONTHLY=price_1SDwHmFy9kI1RIxkIsRfoJ8I
STRIPE_PRICE_ID_YEARLY=price_1SDwHmFy9kI1RIxkIsRfoJ8I
```

**They're the same! You need to:**

1. Go to Stripe Dashboard → Products
2. Create a NEW product for yearly:
   - Name: Footylytics Premium Yearly
   - Price: ₹299
   - Billing: Yearly
3. Copy the NEW Price ID
4. Update both .env files:

```env
# Backend .env
STRIPE_PRICE_ID_YEARLY=price_NEW_YEARLY_ID_HERE

# Frontend .env
VITE_STRIPE_PRICE_ID_YEARLY=price_NEW_YEARLY_ID_HERE
```

5. Restart both servers

### Issue 3: "Payment service not configured"

**Check:**

```bash
# Backend .env should have:
STRIPE_SECRET_KEY=sk_test_51xxxxxxxxxxxxx

# Frontend .env should have:
VITE_STRIPE_PUBLIC_KEY=pk_test_51xxxxxxxxxxxxx
```

**Make sure:**

- Keys start with `sk_test_` and `pk_test_`
- No extra spaces
- No quotes around values

### Issue 4: Stripe Checkout Doesn't Open

**Check Browser Console (F12):**

Look for errors like:

- "Invalid publishable key"
- "Network error"
- "CORS error"

**Solutions:**

```bash
# 1. Check frontend .env has correct public key
VITE_STRIPE_PUBLIC_KEY=pk_test_51xxxxxxxxxxxxx

# 2. Restart frontend
cd frontend
npm run dev

# 3. Hard refresh browser (Ctrl+Shift+R)
```

## 📋 Verification Checklist

Run through this checklist:

### Backend (.env):

- [ ] `STRIPE_SECRET_KEY` starts with `sk_test_`
- [ ] `STRIPE_PRICE_ID_MONTHLY` starts with `price_`
- [ ] `STRIPE_PRICE_ID_YEARLY` starts with `price_` (different from monthly!)
- [ ] `FRONTEND_URL=http://localhost:5173`

### Frontend (.env):

- [ ] `VITE_STRIPE_PUBLIC_KEY` starts with `pk_test_`
- [ ] `VITE_STRIPE_PRICE_ID_MONTHLY` matches backend
- [ ] `VITE_STRIPE_PRICE_ID_YEARLY` matches backend
- [ ] `VITE_API_URL=http://localhost:5000/api`

### Servers:

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] No errors in either console

### User:

- [ ] Logged in to the app
- [ ] Can see profile in sidebar
- [ ] Email verified in Supabase

## 🧪 Test Commands

### Test 1: Check if Stripe is configured

```bash
# In backend console, you should see on startup:
# ✅ Stripe configured
```

### Test 2: Check if user is authenticated

```bash
# Open browser console (F12)
# Type:
localStorage.getItem('supabase.auth.token')

# Should show a token
```

### Test 3: Manual API test

```bash
# Get your access token from browser console
# Then test the API:

curl -X POST http://localhost:5000/api/payments/create-checkout-session \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"priceId":"price_YOUR_PRICE_ID"}'
```

## 📊 Expected Flow

### Successful Payment Flow:

1. **User clicks "Upgrade Now"**

   - Frontend sends request to backend
   - Includes: priceId + auth token

2. **Backend receives request**

   - Console shows: "💳 Creating checkout session"
   - Verifies user token
   - Creates Stripe session
   - Console shows: "✅ Checkout session created"

3. **Frontend receives session ID**

   - Redirects to Stripe Checkout
   - User sees payment form

4. **User enters card details**

   - Card: 4242 4242 4242 4242
   - Expiry: 12/25
   - CVV: 123

5. **Payment succeeds**
   - Redirects to success page
   - (Webhook updates user to premium)

## 🔍 Debug Mode

Add this to see more details:

**Backend (server.js):**

```javascript
// Add after imports
console.log("🔧 Environment Check:");
console.log(
  "   Stripe Key:",
  process.env.STRIPE_SECRET_KEY ? "✅ Set" : "❌ Missing"
);
console.log(
  "   Supabase URL:",
  process.env.SUPABASE_URL ? "✅ Set" : "❌ Missing"
);
console.log("   Frontend URL:", process.env.FRONTEND_URL);
```

**Frontend (Pricing.jsx):**

```javascript
// Add in handleUpgrade before try block
console.log("🔍 Debug Info:");
console.log("   User:", user?.email);
console.log("   Session:", session ? "✅ Has session" : "❌ No session");
console.log("   Price ID:", priceId);
console.log(
  "   Token:",
  session?.access_token ? "✅ Has token" : "❌ No token"
);
```

## 💡 Quick Fixes

### Fix 1: Clear everything and restart

```bash
# 1. Stop both servers (Ctrl+C)
# 2. Clear browser cache
# 3. Sign out of app
# 4. Restart backend
cd backend && npm run dev
# 5. Restart frontend
cd frontend && npm run dev
# 6. Sign in again
# 7. Try payment
```

### Fix 2: Verify Stripe Dashboard

```bash
# 1. Go to: https://dashboard.stripe.com/test
# 2. Check you're in TEST MODE (toggle top right)
# 3. Go to Developers → API keys
# 4. Verify keys match your .env files
# 5. Go to Products
# 6. Verify you have 2 products (monthly & yearly)
# 7. Verify Price IDs match your .env files
```

### Fix 3: Test with curl

```bash
# This bypasses the frontend to test backend directly
# Replace YOUR_TOKEN and YOUR_PRICE_ID

curl -X POST http://localhost:5000/api/payments/create-checkout-session \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"priceId":"YOUR_PRICE_ID"}' \
  -v
```

## 📞 Still Having Issues?

Check these in order:

1. **Backend console** - Any errors?
2. **Frontend console** (F12) - Any errors?
3. **Network tab** (F12) - Check the API request
4. **Stripe Dashboard** - Logs tab shows any API calls?
5. **Environment variables** - All correct?

## ✅ Success Indicators

You'll know it's working when:

1. Backend console shows:

```
💳 Creating checkout session:
   User: your@email.com
   Price ID: price_xxxxxxxxxxxxx
✅ Checkout session created: cs_test_xxxxxxxxxxxxx
```

2. Browser redirects to Stripe Checkout page

3. You see the payment form with your plan details

4. Test card works and redirects to success page

---

**After following this guide, your payment should work! 🎉**
