// Minimal Service Worker for PWA - Focus on notifications only
const CACHE_NAME = 'footylytics-v4';

// Install event - minimal caching
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event - clean up and take control
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - MINIMAL interference
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // ONLY handle specific cases, let everything else pass through
  
  // Skip ALL asset requests to avoid interference
  if (
    url.pathname.startsWith('/assets/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.mjs') ||
    request.destination === 'script' ||
    request.destination === 'style'
  ) {
    // Let these requests go through normally - DO NOT INTERCEPT
    return;
  }

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // ONLY handle HTML document requests for offline fallback
  if (request.destination === 'document' && url.pathname !== '/') {
    event.respondWith(
      fetch(request).catch(() => {
        // Only fallback to index.html if network fails
        return caches.match('/') || fetch('/');
      })
    );
  }
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view' || !event.action) {
    // Open the app
    event.waitUntil(
      clients.openWindow(event.notification.data?.url || '/live-scores')
    );
  }
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event.notification.tag);
});

// Push event - Handle incoming push notifications
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  
  let notificationData = {
    title: 'Footylytics',
    body: 'New football update available!',
    icon: '/web/icon-192.png',
    badge: '/web/icon-192.png',
    data: { url: '/live-scores' }
  };
  
  // Parse push data if available
  if (event.data) {
    try {
      const pushData = event.data.json();
      notificationData = { ...notificationData, ...pushData };
    } catch (error) {
      console.log('Push data parsing failed, using defaults');
    }
  }
  
  const options = {
    body: notificationData.body,
    icon: notificationData.icon,
    badge: notificationData.badge,
    image: notificationData.image,
    data: notificationData.data,
    actions: [
      {
        action: 'view',
        title: 'View Match',
        icon: '/web/icon-192.png'
      },
      {
        action: 'close',
        title: 'Dismiss'
      }
    ],
    tag: notificationData.tag || 'footylytics-push',
    requireInteraction: false,
    vibrate: [200, 100, 200],
    silent: false
  };
  
  event.waitUntil(
    self.registration.showNotification(notificationData.title, options)
  );
});
