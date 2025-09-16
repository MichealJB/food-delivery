self.addEventListener('install', event => {
  event.waitUntil(caches.open('food-app').then(cache => {
    return cache.addAll([
      '/',
      '/index.html',
      '/body.css',
      '/script.js',
      '/manifest.json'
    ]);
  }));
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
