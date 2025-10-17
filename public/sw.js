// Service Worker for Dating App PWA
const CACHE_NAME = "dating-app-v1";
const STATIC_CACHE = "dating-app-static-v1";
const DYNAMIC_CACHE = "dating-app-dynamic-v1";

// Static assets to cache on install
const STATIC_ASSETS = [
  "/",
  "/offline.html",
  "/icon.svg",
  "/favicon.ico",
  // Add other critical assets here
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("Service Worker: Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log("Service Worker: Static assets cached");
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("Service Worker: Failed to cache static assets", error);
      }),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log("Service Worker: Deleting old cache", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => {
        console.log("Service Worker: Activated");
        return self.clients.claim();
      }),
  );
});

// Fetch event - implement caching strategies
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip external requests (except for our API)
  if (url.origin !== location.origin && !url.pathname.startsWith("/api/")) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Return cached version if available
      if (cachedResponse) {
        console.log("Service Worker: Serving from cache", request.url);
        return cachedResponse;
      }

      // Otherwise, fetch from network
      return fetch(request)
        .then((networkResponse) => {
          // Check if we received a valid response
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type !== "basic"
          ) {
            return networkResponse;
          }

          // Clone the response since it can only be consumed once
          const responseToCache = networkResponse.clone();

          // Cache the response for future use
          if (shouldCache(request)) {
            caches.open(DYNAMIC_CACHE).then((cache) => {
              console.log("Service Worker: Caching new resource", request.url);
              cache.put(request, responseToCache);
            });
          }

          return networkResponse;
        })
        .catch(() => {
          // Network failed, try to serve from cache or offline page
          console.log("Service Worker: Network failed, trying cache");

          // For HTML pages, serve offline page
          if (request.destination === "document") {
            return caches.match("/offline.html") || caches.match("/");
          }

          // For other requests, just fail
          return new Response("Offline", {
            status: 503,
            statusText: "Service Unavailable",
          });
        });
    }),
  );
});

// Push notification event
self.addEventListener("push", (event) => {
  console.log("Service Worker: Push received");

  if (!event.data) {
    return;
  }

  const data = event.data.json();
  const options = {
    body: data.body || "You have a new notification!",
    icon: "/icon.svg",
    badge: "/icon.svg",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: data.id || "1",
      url: data.url || "/",
    },
    actions: [
      {
        action: "explore",
        title: "View",
        icon: "/icon.svg",
      },
      {
        action: "close",
        title: "Close",
        icon: "/icon.svg",
      },
    ],
    tag: "dating-app-notification",
    renotify: true,
    requireInteraction: false,
    silent: false,
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "Dating App", options),
  );
});

// Notification click event
self.addEventListener("notificationclick", (event) => {
  console.log("Service Worker: Notification click received");

  event.notification.close();

  const action = event.action;
  const notificationData = event.notification.data;

  if (action === "close") {
    return;
  }

  // Open the app to the specified URL
  const urlToOpen = notificationData?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      // Try to focus on existing window
      for (const client of clientList) {
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }

      // Open new window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    }),
  );
});

// Background sync event
self.addEventListener("sync", (event) => {
  console.log("Service Worker: Background sync", event.tag);

  if (event.tag === "background-sync") {
    event.waitUntil(doBackgroundSync());
  }
});

// Helper function to determine if a request should be cached
function shouldCache(request) {
  const url = new URL(request.url);

  // Don't cache API requests
  if (url.pathname.startsWith("/api/")) {
    return false;
  }

  // Cache static assets
  if (
    request.destination === "script" ||
    request.destination === "style" ||
    request.destination === "image" ||
    request.destination === "font"
  ) {
    return true;
  }

  // Cache navigation requests
  if (request.destination === "document") {
    return true;
  }

  return false;
}

// Helper function for background sync
async function doBackgroundSync() {
  try {
    // Implement your background sync logic here
    console.log("Service Worker: Performing background sync");

    // Example: Sync pending messages, update user data, etc.
  } catch (error) {
    console.error("Service Worker: Background sync failed", error);
  }
}

// Message event for communication with main app
self.addEventListener("message", (event) => {
  console.log("Service Worker: Message received", event.data);

  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

console.log("Service Worker: Loaded");
