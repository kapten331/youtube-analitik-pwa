const CACHE_NAME = 'yt-analyzer-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// 1. Proses Instalasi PWA dan Caching UI Dasar
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache berhasil dibuka');
      return cache.addAll(urlsToCache);
    })
  );
});

// 2. Aktivasi Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 3. Strategi Fetch (Jangan cache data dari Google API agar selalu Real-Time)
self.addEventListener('fetch', (event) => {
  // Biarkan request ke API Google berjalan normal (tidak di-cache)
  if (event.request.url.includes('googleapis.com') || event.request.url.includes('google.com')) {
    event.respondWith(fetch(event.request));
    return;
  }
  
  // Untuk file HTML dan Manifest, ambil dari cache jika offline
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
