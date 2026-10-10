// Ubah versi ke v2 agar browser tahu ini pembaruan dan menghapus cache lama
const CACHE_NAME = 'yt-analyzer-v2';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Hapus cache versi lama (v1)
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// STRATEGI BARU: Network First (Utamakan Internet, Offline sebagai cadangan)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).then((response) => {
      return response;
    }).catch(() => {
      // Jika tidak ada internet, baru panggil versi cache
      return caches.match(event.request);
    })
  );
});
