const CACHE_NAME = 'bca-app-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './images/icon-192.png',
  './images/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // optionally cache new requests (commented for simplicity)
        // if (response && response.status === 200 && response.type === 'basic') {
        //   const respClone = response.clone();
        //   caches.open(CACHE_NAME).then(cache => cache.put(event.request, respClone));
        // }
        return response;
      }).catch(() => caches.match('./index.html'));
    })
  );
});