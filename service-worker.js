const CACHE_NAME = "shopping-app-v1";
const FILES_TO_CACHE = [
  "index.html",
  "manifest.json",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-1024.png"
];

// Install SW
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// Activate SW
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch handler (JEDINI!)
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // ❌ Ne presreći FilePicker / blob / JSON backup
  if (
    url.protocol === "blob:" ||
    url.pathname.includes("file") ||
    url.pathname.endsWith(".json")
  ) {
    return; // pusti browser da obradi sam
  }

  // Ostalo ide u cache fallback
  event.respondWith(
    caches.match(event.request).then(response => {
      return (
        response ||
        fetch(event.request).catch(() => {
          // Offline fallback — uvijek vrati index.html (PWA standard)
          return caches.match("index.html");
        })
      );
    })
  );
});
