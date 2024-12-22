self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('qr-scanner-cache').then((cache) => {
      return cache.addAll([
        '/',
        '/scanner',
        '/success-sound.mp3',
        '/images/background-simplon-pattern.svg',
        '/styles.css',
        '/components/layout/vigile/Navbar.js',
        'https://unpkg.com/react-web-qr-reader', // Cache dynamique si possible
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
