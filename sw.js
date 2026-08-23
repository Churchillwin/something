const CACHE_NAME = "anime-tap-clicker-v34";
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.json",
  "./assets/anime-tap-core.webp",
  "./assets/skin-sakura.webp",
  "./assets/skin-gold.webp",
  "./assets/skin-mint.webp",
  "./assets/companion-aliya-idle.webp",
  "./assets/companion-aliya-lean.webp",
  "./assets/companion-aliya-magic.webp",
  "./assets/companion-aliya-cute.webp",
  "./assets/companion-aliya-sleep.webp",
  "./assets/companion-aliya-focus.webp",
  "./assets/aliya-outfit-base.png",
  "./assets/aliya-outfit-oracle.png",
  "./assets/aliya-outfit-celestial.png",
  "./assets/aliya-outfit-mirage.png",
  "./assets/aliya-coin-hug.png",
  "./assets/aliya-coin-guard.png",
  "./assets/aliya-coin-point.png",
  "./assets/gem-skin-teal.png",
  "./assets/gem-skin-coral.png",
  "./assets/gem-skin-gold.png",
  "./assets/gem-skin-mint.png",
  "./assets/gem-skin-violet.png",
  "./assets/gem-skin-ice.png",
  "./assets/bomb-skin-small.png",
  "./assets/bomb-skin-medium.png",
  "./assets/bomb-skin-large.png",
  "./assets/bomb-skin-horizontal.png",
  "./assets/bomb-skin-vertical.png",
  "./assets/bomb-skin-cross.png",
  "./assets/bomb-skin-diagonal.png",
  "./assets/card-aliya.webp",
  "./assets/coin-backdrop-guild.webp",
  "./assets/coin-backdrop-ruins.webp",
  "./assets/coin-backdrop-forge.webp",
  "./assets/anime-tap-icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    }),
  );
});
