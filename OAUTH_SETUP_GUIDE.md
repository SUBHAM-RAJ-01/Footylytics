# OAuth Setup Guide - Google, X (Twitter), GitHub

## Overview

Your login page now supports OAuth authentication with Google, X (Twitter), and GitHub! Users can sign in with one click using their existing accounts.

## ✅ What's Implemented

### Frontend Changes

1. **Login Page** - Added 3 OAuth buttons:

   - 🔴 Continue with Google
   - ⚫ Continue with X (Twitter)
   - 🐙 Continue with GitHub

2. **AuthContext** - Added `signInWithOAuth()` method
3. **Beautiful UI** - Styled buttons with brand colors and icons
4. **Loading States** - Spinner animations during OAuth flow

## 🔧 Supabase Configuration Required

To enable OAuth providers, you need to configure them in your Supabase dashboard.

### Step 1: Access Supabase Dashboard

1. Go to https://supabase.com
2. Select your project
3. Navigate to **Authentication** → **Providers**

---

## 🔴 Google OAuth Setup

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Configure OAuth consent screen if prompted:
   - User Type: External
   - App name: Footylytics
   - User support email: your email
   - Developer contact: your email
6. Application type: **Web application**
7. Name: Footylytics
8. Authorized redirect URIs:

   ```
   https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback
   ```

   Example: `https://abcdefghijk.supabase.co/auth/v1/callback`

9. Click **Create**
10. Copy your **Client ID** and **Client Secret**

### 2. Configure in Supabase

1. In Supabase Dashboard → **Authentication** → **Providers**
2. Find **Google** and click to expand
3. Enable Google provider
4. Paste your **Client ID**
5. Paste your **Client Secret**
6. Click **Save**

### 3. Test Google Login

- Go to your login page
- Click "Continue with Google"
- Should redirect to Google login
- After authentication, redirects back to your app

---

## ⚫ X (Twitter) OAuth Setup

### 1. Create Twitter App

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Sign in with your Twitter account
3. Create a new project (if needed)
4. Create a new app
5. App name: Footylytics
6. Navigate to app settings → **User authentication settings**
7. Click **Set up**
8. App permissions: **Read**
9. Type of App: **Web App**
10. App info:
    - Callback URI: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
    - Website URL: Your app URL
11. Save and copy:
    - **API Key** (Client ID)
    - **API Secret Key** (Client Secret)

### 2. Configure in Supabase

1. In Supabase Dashboard → **Authentication** → **Providers**
2. Find **Twitter** and click to expand
3. Enable Twitter provider
4. Paste your **API Key** as Client ID
5. Paste your **API Secret Key** as Client Secret
6. Click **Save**

### 3. Test X Login

- Go to your login page
- Click "Continue with X"
- Should redirect to Twitter/X login
- After authentication, redirects back to your app

---

## 🐙 GitHub OAuth Setup

### 1. Create GitHub OAuth App

1. Go to [GitHub Settings](https://github.com/settings/developers)
2. Click **OAuth Apps** → **New OAuth App**
3. Application name: Footylytics
4. Homepage URL: Your app URL (e.g., `http://localhost:5173` for dev)
5. Authorization callback URL:
   ```
   https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback
   ```
6. Click **Register application**
7. Copy your **Client ID**
8. Click **Generate a new client secret**
9. Copy your **Client Secret**

### 2. Configure in Supabase

1. In Supabase Dashboard → **Authentication** → **Providers**
2. Find **GitHub** and click to expand
3. Enable GitHub provider
4. Paste your **Client ID**
5. Paste your **Client Secret**
6. Click **Save**

### 3. Test GitHub Login

- Go to your login page
- Click "Continue with GitHub"
- Should redirect to GitHub login
- After authentication, redirects back to your app

---

## 🔍 Finding Your Supabase Callback URL

Your callback URL format:

```
https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback
```

To find your project reference:

1. Go to Supabase Dashboard
2. Look at your project URL
3. Example: If your URL is `https://abcdefghijk.supabase.co`
4. Your callback is: `https://abcdefghijk.supabase.co/auth/v1/callback`

Or find it in:

- Supabase Dashboard → **Settings** → **API**
- Look for "URL" field

---

## 🎨 UI Features

### OAuth Buttons

- **Google**: Red Google icon with white background
- **X (Twitter)**: Black X logo with white background
- **GitHub**: Black GitHub octocat with white background

### States

- **Normal**: Border with hover effect
- **Hover**: Slight scale up + background color change
- **Loading**: Spinner animation
- **Disabled**: Grayed out when another OAuth is in progress

### User Experience

- Click button → Redirects to provider
- User authenticates → Redirects back to app
- Automatic profile creation in database
- Seamless sign-in experience

---

## 🧪 Testing

### Development Testing

1. Start your app: `npm run dev`
2. Go to login page
3. Click each OAuth button
4. Verify redirect to provider
5. Complete authentication
6. Verify redirect back to app
7. Check user is logged in

### Production Testing

1. Deploy your app
2. Update OAuth redirect URLs to production URL
3. Test each provider
4. Verify user data is saved correctly

---

## 🔒 Security Best Practices

### 1. Environment Variables

Never commit OAuth secrets to git:

```env
# These are in Supabase, not in your .env
# But keep your Supabase keys secure:
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 2. Redirect URLs

- Use HTTPS in production
- Whitelist only your domains
- Don't use wildcards

### 3. Scopes

- Request minimum permissions needed
- Google: email, profile (default)
- Twitter: read (default)
- GitHub: read:user (default)

---

## 📊 User Data

### What You Get from OAuth

**Google:**

- Email
- Name
- Profile picture
- Email verified status

**X (Twitter):**

- Username
- Display name
- Profile picture
- Twitter ID

**GitHub:**

- Username
- Email (if public)
- Name
- Profile picture
- GitHub ID

### Database Storage

All OAuth users are stored in:

- `auth.users` table (Supabase managed)
- `profiles` table (your custom table)

Profile is auto-created on first login with:

```sql
{
  id: user_id,
  is_premium: false,
  created_at: timestamp
}
```

---

## 🐛 Troubleshooting

### "Invalid redirect URI"

- Check callback URL matches exactly in provider settings
- Include `/auth/v1/callback` path
- Use HTTPS in production

### "OAuth provider not configured"

- Verify provider is enabled in Supabase
- Check Client ID and Secret are correct
- Ensure no extra spaces in credentials

### "User already exists"

- User signed up with email first
- OAuth email matches existing account
- Supabase will link accounts automatically

### Redirect loop

- Check redirect URL in provider settings
- Verify Supabase URL is correct
- Clear browser cookies and try again

### No user data after login

- Check Supabase logs for errors
- Verify profile table exists
- Check RLS policies allow inserts

---

## 🚀 Next Steps

### Optional Enhancements

1. **More Providers**: Add Facebook, Discord, Apple
2. **Account Linking**: Allow users to link multiple providers
3. **Profile Enrichment**: Save OAuth profile data
4. **Avatar Images**: Use OAuth profile pictures
5. **Social Features**: Show "Signed in with Google" badge

### Code Examples

**Add Facebook OAuth:**

```javascript
// In Login.jsx
<button onClick={() => handleOAuthSignIn("facebook")}>
  <FaFacebook /> Continue with Facebook
</button>
```

**Get OAuth Profile Picture:**

```javascript
// In AuthContext.jsx
const user = session?.user;
const avatarUrl = user?.user_metadata?.avatar_url;
```

---

## 📝 Summary

You now have:

- ✅ Google OAuth login
- ✅ X (Twitter) OAuth login
- ✅ GitHub OAuth login
- ✅ Beautiful UI with brand icons
- ✅ Loading states and error handling
- ✅ Automatic profile creation
- ✅ Secure authentication flow

Just configure the providers in Supabase and you're ready to go!

---

## 📞 Support

### Useful Links

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Google OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Twitter OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-twitter)
- [GitHub OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-github)

### Common Issues

- Check Supabase logs: Dashboard → Logs → Auth
- Check browser console for errors
- Verify all URLs use HTTPS in production
- Test in incognito mode to avoid cache issues
