const CACHE_NAME = 'multi-spinner-cache-v1';
const PRE_CACHE_RESOURCES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg'
];

// Installation phase: pre-cache primary app skeleton
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRE_CACHE_RESOURCES))
      .then(() => self.skipWaiting())
  );
});

// Activation phase: purge older caches to keep storage optimal
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Intercept fetch requests: prioritize cached assets, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests within our scope
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // Filter paths/files of interest (dynamic assets like assets/*, styles, scripts, pages)
  const isCacheable = 
    url.pathname.includes('/assets/') || 
    url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|gif|webp|woff|woff2|json)$/i) ||
    url.pathname === '/' ||
    url.pathname === '/index.html';

  if (isCacheable) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        // Cache First strategy: return cached response if matched
        if (cachedResponse) {
          // Asynchronously revalidate in background to keep data fresh (stale-while-revalidate style)
          fetch(request).then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, networkResponse);
              });
            }
          }).catch(() => { /* offline or transient network error: benign */ });
          
          return cachedResponse;
        }

        // Otherwise fetch from remote network, then cache cloned response
        return fetch(request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });

          return networkResponse;
        }).catch(() => {
          // Offline fallback could go here
        });
      })
    );
  }
});
