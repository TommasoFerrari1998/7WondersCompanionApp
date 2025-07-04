const CACHE_NAME = '7wonders-companion-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icona-app.png',
  '/favicon.png',
  'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Cinzel:wght@700&display=swap',
  'https://i.imgur.com/p1PgYrh.png', // Logo 2ed
  'https://i.postimg.cc/8zKZnZ89/pngegg.png', // Logo 1ed
  'https://i.postimg.cc/mgqzt9fK/arc-common-logo-1630334595b-VXy-Z-large.png', // Logo Architects
  'https://i.postimg.cc/vmV19mGT/7WDuel.png', // Logo Duel
  'https://i.postimg.cc/hj0x6wFB/pngimg-com-paypal-PNG7.png', // Logo PayPal
  'https://i.postimg.cc/y6gd7hgg/compasso.png', // Science icon
  'https://i.postimg.cc/7b8j4rCV/tavoletta.png', // Science icon
  'https://i.postimg.cc/C12WvqS9/ingranaggio.png', // Science icon
  'https://i.postimg.cc/43WC90Mf/serie.png' // Science icon
  // Aggiungi qui tutti gli altri asset statici (immagini, CSS esterni, ecc.) che vuoi che siano disponibili offline
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and can only be consumed once. We need the original to return to the browser
            // and a clone to add to the cache.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
