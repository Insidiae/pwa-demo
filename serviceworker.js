const assetsName = "PWA_DEMO_ASSETS";
const urls = [
  "/",
  "/js/app.js",
  "/js/handlers.js",
  "/data/activities.json",
  "/styles.css",
  "https://fonts.gstatic.com/s/materialicons/v67/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2",
];

//* Runs when the service worker gets installed
self.addEventListener("install", (event) => {
  // Pre-cache the assets
  caches.open(assetsName).then((cache) => {
    cache.addAll(urls);
  });
});

//* Runs when PWA requests a file from the network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    // Search in the cache
    caches.match(event.request).then((cacheResponse) => {
      // Even if the response is in the cache, we fetch it
      // and update the cache for future usage
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          caches.open(assetsName).then(function (cache) {
            // update the cache
            if (event.request.url in urls) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        })
        .catch((error) => {
          console.log("Fetching data from cache...");
        });
      // We use the currently cached version if it's there
      return cacheResponse || fetchPromise;
    })
  );
});

//* Cache First
// self.addEventListener("fetch", event => {
//     event.respondWith(
//         caches.match(event.request)    // searching in the cache
//             .then( response => {
//                 if (response) {
//                     // The request is in the cache, CACHE HIT
//                     return response;
//                 } else {
//                     // We need to go to the network, CACHE MISS
//                     return fetch(event.request);
//                 }
//             })
//     );
// });
