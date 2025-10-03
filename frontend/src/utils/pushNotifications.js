// Push Notification Utilities for PWA

// VAPID public key (with fallback)
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || 'BE3t_UWd2tMUBmYOEjIT0lz4toGXpoNtTaGr4x_fIck50tnXpgkPV7LImQXa1dPkUkj8u6PCxkxjJX9sqaT0VyA';

// API URL (with fallback)
const API_URL = import.meta.env.VITE_API_URL || 'https://footylytics.onrender.com/api';

// Convert VAPID key to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Check if push notifications are supported
export function isPushSupported() {
  return 'serviceWorker' in navigator && 
         'PushManager' in window && 
         'Notification' in window;
}

// Check if user has granted notification permission
export function hasNotificationPermission() {
  return Notification.permission === 'granted';
}

// Request notification permission
export async function requestNotificationPermission() {
  if (!isPushSupported()) {
    console.log('Push notifications not supported');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    console.log('Notification permission denied');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
}

// Subscribe to push notifications
export async function subscribeToPush(userId = 'anonymous') {
  try {
    if (!isPushSupported()) {
      throw new Error('Push notifications not supported');
    }

    // Request permission first
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      throw new Error('Notification permission not granted');
    }

    // Wait for service worker to be ready
    const registration = await navigator.serviceWorker.ready;
    
    // Check if already subscribed
    let subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      // Create new subscription
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });
    }
    
    // Send subscription to backend
    const response = await fetch(`${API_URL}/push/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...subscription.toJSON(),
        userId: userId
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to save subscription');
    }
    
    const result = await response.json();
    console.log('✅ Push subscription successful:', result.message);
    
    return subscription;
    
  } catch (error) {
    console.error('❌ Push subscription failed:', error);
    throw error;
  }
}

// Unsubscribe from push notifications
export async function unsubscribeFromPush(userId = 'anonymous') {
  try {
    if (!isPushSupported()) {
      return true;
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      // Unsubscribe from browser
      await subscription.unsubscribe();
    }
    
    // Remove from backend
    await fetch(`${API_URL}/push/unsubscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId })
    });
    
    console.log('✅ Push unsubscription successful');
    return true;
    
  } catch (error) {
    console.error('❌ Push unsubscription failed:', error);
    return false;
  }
}

// Check subscription status
export async function getPushStatus(userId = 'anonymous') {
  try {
    const response = await fetch(`${API_URL}/push/status?userId=${userId}`);
    const data = await response.json();
    
    return {
      supported: isPushSupported(),
      permission: Notification.permission,
      subscribed: data.subscribed,
      vapidConfigured: data.vapidConfigured
    };
    
  } catch (error) {
    console.error('Failed to get push status:', error);
    return {
      supported: isPushSupported(),
      permission: Notification.permission,
      subscribed: false,
      vapidConfigured: false
    };
  }
}

// Send a test notification (for testing purposes)
export async function sendTestNotification() {
  try {
    const response = await fetch(`${API_URL}/push/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: '⚽ Test Notification',
        body: 'This is a test push notification from Footylytics!',
        url: '/live-scores',
        tag: 'test-notification'
      })
    });
    
    const result = await response.json();
    console.log('Test notification sent:', result);
    return result;
    
  } catch (error) {
    console.error('Failed to send test notification:', error);
    throw error;
  }
}

// Auto-subscribe on app load (optional)
export async function autoSubscribeToPush(userId) {
  try {
    // Only auto-subscribe if user hasn't been asked before
    const hasAsked = localStorage.getItem('push-permission-asked');
    
    if (!hasAsked && isPushSupported()) {
      const status = await getPushStatus(userId);
      
      if (status.permission === 'default') {
        // Mark as asked to avoid repeated prompts
        localStorage.setItem('push-permission-asked', 'true');
        
        // Subscribe if user grants permission
        await subscribeToPush(userId);
      }
    }
  } catch (error) {
    console.log('Auto-subscribe skipped:', error.message);
  }
}

export default {
  isPushSupported,
  hasNotificationPermission,
  requestNotificationPermission,
  subscribeToPush,
  unsubscribeFromPush,
  getPushStatus,
  sendTestNotification,
  autoSubscribeToPush
};