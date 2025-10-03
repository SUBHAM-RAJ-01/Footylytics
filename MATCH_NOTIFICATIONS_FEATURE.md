# Match Notifications & Extended Fixtures Feature

## Overview

This feature adds match notification bells to fixture cards and extends the fixtures page to show recent results from the last 5 days along with upcoming matches.

## Features Implemented

### 1. Match Notification System

- **Bell Icon on Each Match Card**: Users can click a bell icon to subscribe/unsubscribe to match notifications
- **Visual Feedback**: Bell icon changes color when notification is active
- **Email Notifications**: Users receive email alerts before matches start
- **User-Specific**: Each user manages their own notification preferences

### 2. Extended Fixtures View

- **Recent Results**: Shows match results from the last 5 days
- **Upcoming Fixtures**: Shows matches scheduled for the next 14 days
- **Organized Sections**: Clear separation between recent results and upcoming fixtures
- **Match Counts**: Displays the number of matches in each section

### 3. Email Service Updates

- **Confirmation Links**: Changed from OTP to email confirmation links (Supabase handles this)
- **Match Notification Emails**: Beautiful HTML emails with match details, team crests, and kick-off times
- **Resend Integration**: Uses Resend service for reliable email delivery

## Setup Instructions

### 1. Database Setup

Run the SQL script in your Supabase SQL Editor:

```bash
# Open Supabase Dashboard > SQL Editor
# Copy and paste the contents of MATCH_NOTIFICATIONS_TABLE.sql
# Click "Run"
```

### 2. Environment Variables

Ensure these are set in your `.env` file:

```env
# Email Service (Resend)
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=Footylytics <noreply@yourdomain.com>

# Frontend URL for email links
FRONTEND_URL=http://localhost:5173

# Supabase (for notifications storage)
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

### 3. Get Resend API Key

1. Go to https://resend.com
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add it to your `.env` file

### 4. Restart Backend Server

```bash
cd backend
npm run dev
```

## How It Works

### Notification Flow

1. **User Subscribes**: User clicks bell icon on a match card
2. **Data Stored**: Match details and user preference saved to Supabase
3. **Email Sent**: Before match starts, system sends notification email
4. **Visual Indicator**: Bell icon shows active state for subscribed matches

### Fixtures Data Flow

1. **API Fetch**: Backend fetches matches from 5 days ago to 14 days ahead
2. **Client Filtering**: Frontend separates matches into recent results and upcoming fixtures
3. **Sorting**: Recent results sorted newest first, upcoming fixtures sorted by date
4. **Display**: Both sections shown with clear headings and match counts

## API Endpoints

### Notifications

```javascript
// Toggle notification for a match
POST /api/notifications/toggle
Body: {
  userId: "user-uuid",
  matchId: "match-id",
  matchData: {
    homeTeam: "Team A",
    awayTeam: "Team B",
    homeTeamCrest: "url",
    awayTeamCrest: "url",
    competition: "Premier League",
    matchTime: "3:00 PM IST",
    matchDate: "15 Oct 2025"
  }
}

// Get user's notifications
GET /api/notifications/user/:userId
```

## Components Updated

### MatchCard.jsx

- Added notification bell button
- Integrated with AuthContext to check user login
- Shows loading state while toggling notification
- Visual feedback for active/inactive states

### Fixtures.jsx

- Extended date range for fetching matches
- Separated recent results and upcoming fixtures
- Added section headers with match counts
- Improved empty state messages

### email.js

- Changed `sendWelcomeEmail` to use confirmation links
- Added `sendMatchNotificationEmail` for match alerts
- Beautiful HTML email templates with team crests

## Database Schema

### match_notifications Table

```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key to auth.users)
- match_id: TEXT (Match identifier)
- match_data: JSONB (Match details)
- created_at: TIMESTAMP
- notified: BOOLEAN (Email sent flag)
- notified_at: TIMESTAMP
```

## Testing

### Test Notification Toggle

1. Sign in to the app
2. Go to Fixtures page
3. Click bell icon on any upcoming match
4. Bell should turn blue (active state)
5. Click again to unsubscribe
6. Bell should turn gray (inactive state)

### Test Recent Results

1. Go to Fixtures page
2. Select a league that had matches in the last 5 days
3. "Recent Results" section should appear above "Upcoming Fixtures"
4. Results should show final scores with "FT" badge

### Test Email (Development Mode)

If RESEND_API_KEY is not set, emails are logged to console:

```bash
# Check backend console for email preview
=== EMAIL (Development Mode - Not Sent) ===
To: user@example.com
Subject: Match Starting Soon: ...
```

## Future Enhancements

- [ ] Scheduled job to send notifications 1 hour before matches
- [ ] Push notifications for mobile devices
- [ ] Notification preferences (timing, frequency)
- [ ] Bulk notification management
- [ ] Match reminder customization

## Troubleshooting

### Bell Icon Not Showing

- Ensure user is signed in
- Check browser console for errors
- Verify Supabase connection

### Notifications Not Saving

- Check Supabase table exists (run SQL script)
- Verify SUPABASE_URL and SUPABASE_SERVICE_KEY in .env
- Check backend logs for errors

### No Recent Results Showing

- Verify selected league had matches in last 5 days
- Check Football-Data API response
- Clear cache and refresh

### Emails Not Sending

- Verify RESEND_API_KEY is set correctly
- Check Resend dashboard for delivery status
- Ensure EMAIL_FROM domain is verified in Resend

## Support

For issues or questions, check:

- Backend logs: `backend/logs/`
- Browser console: F12 > Console tab
- Supabase logs: Dashboard > Logs
- Resend logs: Dashboard > Logs
