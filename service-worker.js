const CACHE_NAME = "pinkzone-v1";

const APP_SHELL = [
  "./index.html",
  "./testepz.html",
  "./apoio.html",
  "./sobre.html",
  "./sinais.html",
  "./denunciar.html",
  "./testepz.css",
  "./scriptpzteste.js",
  "./manifest.json",
  "./imagens/apoio.svg",
  "./imagens/sobre.svg",
  "./imagens/sinais.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-32.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (!url.protocol.startsWith("http")) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copia = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copia));
          }
          return response;
        })
        .catch(async () => {
          return (await caches.match(request)) || (await caches.match("./testepz.html"));
        })
    );
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const rede = fetch(request)
          .then((response) => {
            if (response && response.ok) {
              const copia = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, copia));
            }
            return response;
          })
          .catch(() => cached);

        return cached || rede;
      })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request)
        .then((response) => {
          if (response && (response.ok || response.type === "opaque")) {
            const copia = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copia));
          }
          return response;
        })
        .catch(() => cached);
    })
  );
});
