# 🔴 Stripe Live Mode Setup Guide

## Step 1: Activate Your Stripe Account

### 1. Go to Stripe Dashboard
- Visit: https://dashboard.stripe.com
- Sign in to your account

### 2. Complete Account Activation
You'll need to provide:

**Business Information:**
- Business name: `Footylytics` (or your name)
- Business type: `Individual` or `Company`
- Industry: `Software/SaaS`
- Website: Your Vercel URL

**Personal Information:**
- Full name
- Date of birth
- Address
- Phone number

**Bank Account (for payouts):**
- Bank name
- Account number
- IFSC code (for India)
- Account holder name

**Tax Information:**
- PAN card (for India)
- GST number (if applicable)

### 3. Verify Your Identity
- Upload ID proof (Aadhaar/PAN/Passport)
- Wait for verification (usually 1-2 days)

---

## Step 2: Get Your Live API Keys

### 1. Toggle to Live Mode
- In Stripe Dashboard, look for the toggle switch
- Switch from **"Test mode"** to **"Live mode"**
- The toggle is usually in the top right corner

### 2. Get Your Live Keys
- Go to: **Developers** → **API keys**
- You'll see two keys:

**Publishable key (Public):**
```
pk_live_51...
```
Copy this for frontend

**Secret key (Private):**
```
sk_live_51...
```
Click "Reveal test key" → Copy this for backend

⚠️ **IMPORTANT:** Never share your secret key publicly!

---

## Step 3: Create Live Products

### 1. Go to Products
- Click **Products** in left sidebar
- Click **+ Add product**

### 2. Create Monthly Premium Plan

**Product Information:**
- Name: `Premium Monthly`
- Description: `Access to AI predictions, advanced analytics, and ad-free experience`

**Pricing:**
- Price: `₹29` (or `$0.99` for international)
- Billing period: `Monthly`
- Currency: `INR` (or `USD`)

Click **Save product**

### 3. Copy Price ID
- After saving, you'll see a Price ID like: `price_1...`
- Copy this ID
- Update in your frontend code

---

## Step 4: Set Up Live Webhook

### 1. Go to Webhooks
- Click **Developers** → **Webhooks**
- Click **+ Add endpoint**

### 2. Configure Webhook

**Endpoint URL:**
```
https://your-backend-url.vercel.app/api/payments/webhook
```
(Use your actual backend URL)

**Events to listen to:**
Select these events:
- ✅ `checkout.session.completed`
- ✅ `customer.subscription.updated`
- ✅ `customer.subscription.deleted`
- ✅ `invoice.payment_succeeded`
- ✅ `invoice.payment_failed`

Click **Add endpoint**

### 3. Get Webhook Secret
- After creating, click on the webhook
- Click **Reveal** under "Signing secret"
- Copy the secret: `whsec_...`
- Save this for backend environment variables

---

## Step 5: Update Your Code

### Update Frontend Pricing Page

Open `frontend/src/pages/Pricing.jsx` and update the price ID:

```javascript
// Find this line:
const priceId = 'price_1...'; // Your test price ID

// Replace with your LIVE price ID:
const priceId = 'price_1QaBcDeFgHiJkLmN'; // Your live price ID
```

### Update Environment Variables

**Frontend (Vercel):**
```env
VITE_STRIPE_PUBLIC_KEY=pk_live_51...
```

**Backend (Vercel/Railway):**
```env
STRIPE_SECRET_KEY=sk_live_51...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## Step 6: Test Live Mode

### 1. Use Real Card for Testing
⚠️ **Warning:** This will charge real money!

**Test with small amount:**
- Use your own card
- Make a ₹29 purchase
- Verify it works
- You can refund yourself later

### 2. Verify Payment Flow
- [ ] User clicks "Upgrade to Premium"
- [ ] Redirects to Stripe checkout
- [ ] Payment succeeds
- [ ] Redirects back to success page
- [ ] Premium features unlock
- [ ] Webhook receives event
- [ ] Database updates

### 3. Check Stripe Dashboard
- Go to **Payments** in Stripe Dashboard
- You should see your test payment
- Status should be "Succeeded"

### 4. Refund Test Payment (Optional)
- Click on the payment
- Click **Refund**
- Enter amount: ₹29
- Click **Refund**

---

## Step 7: Go Live! 🚀

### 1. Deploy with Live Keys
- Update environment variables in Vercel/Railway
- Redeploy your app
- Test one more time

### 2. Monitor Payments
- Check Stripe Dashboard regularly
- Set up email notifications
- Monitor webhook events

### 3. Handle Disputes
- Respond to customer inquiries
- Process refunds if needed
- Keep good records

---

## 📋 Quick Checklist

- [ ] Stripe account activated
- [ ] Identity verified
- [ ] Bank account added
- [ ] Switched to Live mode
- [ ] Copied live API keys
- [ ] Created live product (₹29/month)
- [ ] Copied live price ID
- [ ] Set up live webhook
- [ ] Copied webhook secret
- [ ] Updated price ID in code
- [ ] Updated environment variables
- [ ] Deployed to production
- [ ] Tested with real payment
- [ ] Verified webhook works
- [ ] Ready to accept payments!

---

## 🔒 Security Best Practices

### Never Commit These:
- ❌ Secret keys (sk_live_...)
- ❌ Webhook secrets (whsec_...)
- ❌ Any .env files

### Always:
- ✅ Use environment variables
- ✅ Keep keys in Vercel/Railway dashboard
- ✅ Verify webhook signatures
- ✅ Use HTTPS everywhere
- ✅ Log all transactions

---

## 💰 Understanding Fees

### Your Pricing:
- Customer pays: **₹29**
- Stripe fee: **₹3.84** (2.9% + ₹3)
- You receive: **₹25.16**

### Payout Schedule:
- **India:** 7 days after first payment, then daily
- **International:** 2-7 days depending on country

### Where Money Goes:
- Stripe holds funds for 7 days (first time)
- Then automatically transfers to your bank
- You can see pending balance in Dashboard

---

## 🐛 Common Issues

### Issue 1: "Account not activated"
**Solution:** Complete all verification steps in Stripe Dashboard

### Issue 2: "Invalid API key"
**Solution:** 
- Make sure you're using LIVE keys (pk_live_... and sk_live_...)
- Check for extra spaces when copying

### Issue 3: "Webhook not receiving events"
**Solution:**
- Verify webhook URL is correct
- Check webhook secret is updated
- Look at webhook logs in Stripe Dashboard

### Issue 4: "Payment succeeds but premium not unlocked"
**Solution:**
- Check backend logs
- Verify webhook endpoint is working
- Check database connection

---

## 📊 Monitoring Your Business

### Stripe Dashboard Shows:
- Total revenue
- Number of customers
- Successful payments
- Failed payments
- Refunds
- Subscription status

### Set Up Alerts:
- Go to **Settings** → **Notifications**
- Enable email alerts for:
  - Successful payments
  - Failed payments
  - Disputes
  - Refunds

---

## 🎉 You're Ready for Business!

Once you complete these steps:
- ✅ Your app accepts real payments
- ✅ Customers can subscribe to premium
- ✅ Money goes to your bank account
- ✅ You're officially in business!

**Congratulations!** 🎊

---

## 📞 Need Help?

- Stripe Docs: https://stripe.com/docs
- Stripe Support: https://support.stripe.com
- Stripe India: https://stripe.com/in

---

## 💡 Pro Tips

1. **Start Small:** Test with your own card first
2. **Monitor Daily:** Check Stripe Dashboard regularly
3. **Respond Fast:** Reply to customer issues quickly
4. **Keep Records:** Save all transaction details
5. **Stay Compliant:** Follow tax regulations in your country

Good luck with your business! 🚀⚽
