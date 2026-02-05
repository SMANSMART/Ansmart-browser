const CACHE_NAME = "ansmart-browser-v1";

// Files to cache
const urlsToCache = [
  "./index.html",
  "./pages/home.html",
  "./pages/bookmarks.html",
  "./pages/history.html",
  "./pages/downloads.html",
  "./pages/settings.html",
  "./errors/404.html",
  "./errors/offline.html",
  "./css/style.css",
  "./css/light.css",
  "./css/dark.css",
  "./js/browser.js",
  "./js/tabs.js",
  "./js/settings.js",
  "./js/storage.js",
  "./assets/icons/logo-192.png",
  "./assets/icons/logo-512.png",
  "./assets/images/logo.png",
  "./assets/fonts/Roboto-Regular.ttf",
  "./assets/fonts/Montserrat-Bold.woff2",
  "./assets/fonts/OpenSans-Regular.woff"
];

// Install service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log("Caching files...");
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate service worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => 
      Promise.all(
        cacheNames.map((cache) => {
          if(cache !== CACHE_NAME) {
            console.log("Deleting old cache:", cache);
            return caches.delete(cache);
          }
        })
      )
    )
  );
});

// Fetch cached files
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached response if available
        if(cachedResponse) {
          return cachedResponse;
        }
        // Else fetch from network
        return fetch(event.request).catch(() => {
          // If offline and request fails, show offline page
          if(event.request.mode === "navigate") {
            return caches.match("./errors/offline.html");
          }
        });
      })
  );
});
