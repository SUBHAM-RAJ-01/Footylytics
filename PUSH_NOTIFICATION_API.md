# 🔔 Push Notification API Documentation

## Overview

Complete guide to using Footylytics push notifications with examples and customization options.

## API Endpoints

### 1. Subscribe to Push Notifications

```http
POST /api/push/subscribe
Content-Type: application/json

{
  "endpoint": "https://fcm.googleapis.com/fcm/send/...",
  "keys": {
    "p256dh": "...",
    "auth": "..."
  },
  "userId": "user123"
}
```

### 2. Send Basic Notification

```http
POST /api/push/send
Content-Type: application/json

{
  "title": "⚽ Match Update",
  "body": "Manchester United vs Liverpool - Live now!",
  "url": "/live-scores",
  "tag": "match-update",
  "userId": "user123"  // Optional: send to specific user
}
```

### 3. Send Match Notification (Enhanced)

```http
POST /api/push/match-notification
Content-Type: application/json

{
  "homeTeam": "Manchester United",
  "awayTeam": "Liverpool",
  "type": "goal",
  "score": { "home": 2, "away": 1 },
  "player": "Marcus Rashford",
  "minute": 67,
  "priority": "URGENT",
  "userId": "user123"
}
```

### 4. Send Template Notification

```http
POST /api/push/send-template
Content-Type: application/json

{
  "type": "goal_scored",
  "data": {
    "homeTeam": "Arsenal",
    "awayTeam": "Chelsea",
    "score": { "home": 1, "away": 0 },
    "player": "Bukayo Saka",
    "minute": 23
  },
  "priority": "HIGH",
  "customOptions": {
    "requireInteraction": true,
    "silent": false
  }
}
```

## Notification Types

### Available Types:

- `match_starting` - Match about to begin
- `goal_scored` - Goal scored during match
- `match_finished` - Match completed
- `team_news` - Team updates and news
- `league_update` - League standings changes
- `prediction_ready` - AI prediction available
- `custom` - Custom notification

### Priority Levels:

- `LOW` - Basic notification, no vibration
- `NORMAL` - Standard notification with vibration
- `HIGH` - Requires interaction, strong vibration
- `URGENT` - Persistent notification, intense vibration

## Examples

### 1. Match Starting Notification

```javascript
// Automatic template
fetch("/api/push/match-notification", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    homeTeam: "Manchester United",
    awayTeam: "Liverpool",
    type: "starting",
    priority: "HIGH",
  }),
});

// Result: "⚽ Match Starting Soon! Manchester United vs Liverpool - Kicks off in 30 minutes"
```

### 2. Goal Notification

```javascript
fetch("/api/push/send-template", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    type: "goal_scored",
    data: {
      homeTeam: "Arsenal",
      awayTeam: "Tottenham",
      score: { home: 2, away: 1 },
      player: "Martin Ødegaard",
      minute: 78,
    },
    priority: "URGENT",
  }),
});

// Result: "🎯 GOAL! Arsenal 2-1 Tottenham - Martin Ødegaard 78'"
```

### 3. Team News

```javascript
fetch("/api/push/send-template", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    type: "team_news",
    data: {
      team: "Manchester City",
      news: "Erling Haaland signs contract extension until 2029!",
    },
    priority: "NORMAL",
  }),
});

// Result: "🚨 Manchester City News - Erling Haaland signs contract extension until 2029!"
```

### 4. Custom Notification

```javascript
fetch("/api/push/send", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    title: "🏆 Champions League Draw",
    body: "The Champions League quarter-final draw is now live!",
    url: "/fixtures",
    tag: "ucl-draw",
    image: "/web/icon-512.png",
  }),
});
```

## Customization Options

### Custom Notification Options:

```javascript
{
  "addVibration": true,           // Add vibration pattern
  "silent": false,                // Silent notification
  "requireInteraction": false,    // Require user interaction
  "badge": "/web/icon-192.png",   // Badge icon
  "icon": "/web/icon-192.png",    // Notification icon
  "renotify": false,              // Re-notify if same tag
  "timestamp": 1640995200000      // Custom timestamp
}
```

### Vibration Patterns:

- `[200, 100, 200]` - Normal (short-pause-short)
- `[300, 100, 300, 100, 300]` - High priority
- `[500, 200, 500, 200, 500]` - Urgent

### Action Buttons:

```javascript
{
  "actions": [
    {
      "action": "view",
      "title": "View Match",
      "icon": "/web/icon-192.png"
    },
    {
      "action": "share",
      "title": "Share",
      "icon": "/web/icon-192.png"
    }
  ]
}
```

## Frontend Usage

### Subscribe to Push Notifications:

```javascript
import { subscribeToPush } from "./utils/pushNotifications";

// Subscribe user
await subscribeToPush("user123");
```

### Check Subscription Status:

```javascript
import { getPushStatus } from "./utils/pushNotifications";

const status = await getPushStatus("user123");
console.log(status);
// { supported: true, permission: 'granted', subscribed: true }
```

### Send Test Notification:

```javascript
import { sendTestNotification } from "./utils/pushNotifications";

await sendTestNotification();
```

## Integration Examples

### 1. Match Events Integration

```javascript
// When a goal is scored in your live score system
async function onGoalScored(matchData) {
  await fetch("/api/push/match-notification", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      homeTeam: matchData.homeTeam,
      awayTeam: matchData.awayTeam,
      type: "goal",
      score: matchData.score,
      player: matchData.goalScorer,
      minute: matchData.minute,
      priority: "URGENT",
    }),
  });
}
```

### 2. Scheduled Notifications

```javascript
// Send match reminder 30 minutes before kickoff
function scheduleMatchReminder(match) {
  const reminderTime = new Date(match.kickoff) - 30 * 60 * 1000;

  setTimeout(async () => {
    await fetch("/api/push/match-notification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        type: "starting",
        priority: "HIGH",
      }),
    });
  }, reminderTime - Date.now());
}
```

### 3. Bulk Notifications

```javascript
// Send notifications to all subscribers
async function notifyAllUsers(notification) {
  await fetch("/api/push/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(notification),
    // No userId = send to all subscribers
  });
}
```

## Error Handling

### Common Errors:

- `400` - Invalid subscription data
- `404` - User not found
- `500` - VAPID keys not configured
- `410` - Subscription expired (automatically removed)

### Error Response:

```json
{
  "success": false,
  "error": "Failed to send notifications",
  "details": "VAPID keys not configured"
}
```

## Testing

### Test in Developer Page:

1. Go to `/developer`
2. Click "Show Examples" in Notification Examples section
3. Test different notification types
4. Use custom notification builder

### Manual Testing:

```bash
# Test basic notification
curl -X POST http://localhost:5000/api/push/send \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","body":"Hello World!","url":"/live-scores"}'

# Test match notification
curl -X POST http://localhost:5000/api/push/match-notification \
  -H "Content-Type: application/json" \
  -d '{"homeTeam":"Arsenal","awayTeam":"Chelsea","type":"goal","priority":"HIGH"}'
```

## Production Deployment

### Environment Variables:

```env
# Backend (.env)
VAPID_PUBLIC_KEY=your_public_key
VAPID_PRIVATE_KEY=your_private_key

# Frontend (.env)
VITE_VAPID_PUBLIC_KEY=your_public_key
```

### PWABuilder Compatibility:

- All notifications work in PWABuilder-generated APK
- Service worker handles push events automatically
- VAPID keys ensure secure delivery
- Notifications work even when app is closed

---

**Your push notification system is now ready for production! 🚀⚽**
