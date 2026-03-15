// VitalWatch Service Worker v1.0
// Enables offline access and PWA installation

const CACHE_NAME = 'vitalwatch-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// External CDN resources to cache
const CDN_ASSETS = [
  'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600;700&family=Bebas+Neue&display=swap',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
];

// ── INSTALL: cache all static + CDN assets ──
self.addEventListener('install', event => {
  console.log('[SW] Installing VitalWatch Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      // Cache local assets
      await cache.addAll(STATIC_ASSETS);
      // Try caching CDN assets (non-fatal if fail)
      for (const url of CDN_ASSETS) {
        try {
          await cache.add(new Request(url, { mode: 'cors' }));
        } catch(e) {
          console.warn('[SW] Could not cache CDN asset:', url);
        }
      }
      console.log('[SW] All assets cached successfully');
    })
  );
  self.skipWaiting();
});

// ── ACTIVATE: clean old caches ──
self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => {
            console.log('[SW] Deleting old cache:', k);
            return caches.delete(k);
          })
      )
    )
  );
  self.clients.claim();
});

// ── FETCH: cache-first for static, network-first for API ──
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Network-first for RPi API calls (sensor data)
  if (url.hostname === '192.168.1.105' || url.pathname.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(request, clone));
          return res;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Cache-first for everything else
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(res => {
        if (!res || res.status !== 200 || res.type === 'opaque') return res;
        const clone = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(request, clone));
        return res;
      }).catch(() => {
        // Offline fallback
        if (request.destination === 'document') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

// ── BACKGROUND SYNC: queue sensor data when offline ──
self.addEventListener('sync', event => {
  if (event.tag === 'sync-vitals') {
    console.log('[SW] Background sync: vitals');
  }
});

// ── PUSH NOTIFICATIONS (future use) ──
self.addEventListener('push', event => {
  if (!event.data) return;
  const data = event.data.json();
  self.registration.showNotification(data.title || 'VitalWatch Alert', {
    body: data.body || 'Check your vitals now',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-72.png',
    tag: 'vitalwatch-alert',
    vibrate: [200, 100, 200]
  });
});
