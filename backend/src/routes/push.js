import express from 'express';
import webpush from 'web-push';
import { 
  generateNotification, 
  customizeNotification, 
  NOTIFICATION_TYPES, 
  PRIORITY_LEVELS 
} from '../utils/notificationTemplates.js';

const router = express.Router();

// Configure web-push with VAPID keys (will be set from environment)
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    'mailto:noreply@footylytics.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
  console.log('✅ Push notifications configured');
} else {
  console.log('⚠️ VAPID keys not found, push notifications disabled');
}

// In-memory storage for subscriptions (use database in production)
const subscriptions = new Map();

// Subscribe to push notifications
router.post('/subscribe', (req, res) => {
  try {
    const subscription = req.body;
    const userId = req.body.userId || 'anonymous';
    
    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ error: 'Invalid subscription data' });
    }
    
    // Store subscription
    subscriptions.set(userId, subscription);
    
    console.log('New push subscription:', userId);
    res.status(201).json({ 
      success: true, 
      message: 'Subscription saved successfully' 
    });
    
  } catch (error) {
    console.error('Push subscription error:', error);
    res.status(500).json({ error: 'Failed to save subscription' });
  }
});

// Unsubscribe from push notifications
router.post('/unsubscribe', (req, res) => {
  try {
    const userId = req.body.userId || 'anonymous';
    subscriptions.delete(userId);
    
    res.json({ 
      success: true, 
      message: 'Unsubscribed successfully' 
    });
    
  } catch (error) {
    console.error('Push unsubscribe error:', error);
    res.status(500).json({ error: 'Failed to unsubscribe' });
  }
});

// Send push notification to all subscribers
router.post('/send', async (req, res) => {
  try {
    const { title, body, url, image, tag, userId } = req.body;
    
    if (!process.env.VAPID_PUBLIC_KEY) {
      return res.status(500).json({ error: 'Push notifications not configured' });
    }
    
    const payload = JSON.stringify({
      title: title || 'Footylytics',
      body: body || 'New update available!',
      data: { 
        url: url || '/live-scores',
        timestamp: Date.now()
      },
      image: image,
      tag: tag || 'footylytics-notification'
    });
    
    let targetSubscriptions = [];
    
    if (userId) {
      // Send to specific user
      const subscription = subscriptions.get(userId);
      if (subscription) {
        targetSubscriptions = [subscription];
      }
    } else {
      // Send to all subscribers
      targetSubscriptions = Array.from(subscriptions.values());
    }
    
    if (targetSubscriptions.length === 0) {
      return res.json({ 
        success: true, 
        message: 'No active subscriptions found',
        sent: 0 
      });
    }
    
    const results = await Promise.allSettled(
      targetSubscriptions.map(async (subscription, index) => {
        try {
          await webpush.sendNotification(subscription, payload);
          return { success: true, index };
        } catch (error) {
          console.error('Push send failed:', error.message);
          
          // Remove invalid subscriptions
          if (error.statusCode === 410 || error.statusCode === 404) {
            // Find and remove invalid subscription
            for (const [key, sub] of subscriptions.entries()) {
              if (sub.endpoint === subscription.endpoint) {
                subscriptions.delete(key);
                break;
              }
            }
          }
          
          return { success: false, error: error.message, index };
        }
      })
    );
    
    const successful = results.filter(r => r.value?.success).length;
    const failed = results.length - successful;
    
    console.log(`Push notifications sent: ${successful} success, ${failed} failed`);
    
    res.json({ 
      success: true, 
      message: 'Push notifications processed',
      sent: successful,
      failed: failed,
      total: results.length
    });
    
  } catch (error) {
    console.error('Push send error:', error);
    res.status(500).json({ error: 'Failed to send notifications' });
  }
});

// Send match notification (helper endpoint)
router.post('/match-notification', async (req, res) => {
  try {
    const { homeTeam, awayTeam, matchTime, type = 'starting' } = req.body;
    
    let title, body, url;
    
    switch (type) {
      case 'starting':
        title = '⚽ Match Starting Soon!';
        body = `${homeTeam} vs ${awayTeam} kicks off in 30 minutes`;
        url = '/live-scores';
        break;
      case 'goal':
        title = '🎯 GOAL!';
        body = `${homeTeam} vs ${awayTeam} - Goal scored!`;
        url = '/live-scores';
        break;
      case 'result':
        title = '📊 Match Finished';
        body = `${homeTeam} vs ${awayTeam} - Final result available`;
        url = '/live-scores';
        break;
      default:
        title = '⚽ Football Update';
        body = `${homeTeam} vs ${awayTeam}`;
        url = '/live-scores';
    }
    
    // Send the notification
    const response = await fetch(`${req.protocol}://${req.get('host')}/api/push/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        body,
        url,
        tag: `match-${homeTeam}-${awayTeam}`.toLowerCase().replace(/\s+/g, '-')
      })
    });
    
    const result = await response.json();
    res.json(result);
    
  } catch (error) {
    console.error('Match notification error:', error);
    res.status(500).json({ error: 'Failed to send match notification' });
  }
});

// Get subscription status
router.get('/status', (req, res) => {
  const userId = req.query.userId || 'anonymous';
  const hasSubscription = subscriptions.has(userId);
  
  res.json({
    subscribed: hasSubscription,
    totalSubscriptions: subscriptions.size,
    vapidConfigured: !!(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY)
  });
});

export default router;