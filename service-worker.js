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
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
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

// Skip SW for file picker operations
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // Ako je request za file-system API -> preskoči SW
  if (url.pathname.includes("file") || url.protocol === "blob:") {
    return;
  }
});

// Fetch handler
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // Ne diraj blob, file, drive API
  if (url.protocol === "blob:" || url.pathname.endsWith(".json")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => caches.match("index.html"));
    })
  );
});

