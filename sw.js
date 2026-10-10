const CACHE_NAME = 'yt-analyzer-v3';
const urlsToCache = ['./', './index.html', './manifest.json'];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Paksa langsung aktif
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(cacheNames.map((name) => {
        if (name !== CACHE_NAME) return caches.delete(name);
      }));
    })
  );
  return self.clients.claim(); // Langsung ambil alih kontrol browser
});

self.addEventListener('fetch', (event) => {
  // ATURAN BARU: Abaikan semua link Google, biarkan browser yang mengurusnya langsung
  if (event.request.url.includes('googleapis.com') || event.request.url.includes('google.com') || event.request.url.includes('gstatic.com')) {
    return; // Keluar dari Service Worker
  }
  
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
