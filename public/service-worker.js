const CACHE_NAME = "simplon-pointage-v1";
const assetsToCache = [
  "/",
  "/manifest.json",
  "/success-sound.mp3",
  "/images/background-simplon-pattern.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(assetsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
