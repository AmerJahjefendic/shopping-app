// =======================================
//     Shopping Lista — Service Worker v2.0
//     NO CACHE MODE (fix JSON problems)
// =======================================

self.addEventListener("install", event => {
  self.skipWaiting(); // aktiviraj odmah
});

self.addEventListener("activate", event => {
  // obriši SVE stare SW keševe
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(key => caches.delete(key))))
  );

  self.clients.claim();
});

// NO CACHE – uvijek povuci svježu verziju
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return new Response(
        "<h1>Offline</h1><p>Aplikacija zahtijeva internet konekciju.</p>",
        { headers: { "Content-Type": "text/html" } }
      );
    })
  );
});
