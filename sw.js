const CACHE_NAME = 'replace-deeds-v6';
const ASSETS = ['./index.html', './manifest.json', './icon-192.svg', './icon-512.svg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => caches.match('./index.html'))));
});

// Background notifications
self.addEventListener('message', async (event) => {
  if (event.data?.type === 'SHOW_NOTIFICATION') {
    await self.registration.showNotification(event.data.title, {
      body: event.data.body,
      icon: '/icon-192.svg',
      requireInteraction: true
    });
  }
});
