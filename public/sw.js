self.addEventListener('push', function (event) {
  if (event.data) {
    const data = event.data.json()
    const options = {
      body: data.body,
      icon: data.icon || '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '2',
      },
      actions: [
        {
          action: 'explore',
          title: 'Explore matches',
          icon: '/icons/icon-96x96.png',
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/icons/icon-96x96.png',
        },
      ],
    }
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    )
  }
})

self.addEventListener('notificationclick', function (event) {
  console.log('Notification click received.')

  event.notification.close()

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/discover')
    )
  } else if (event.action === 'close') {
    // Just close the notification
    return
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})

self.addEventListener('install', function (event) {
  console.log('Service worker installing...')
  self.skipWaiting()
})

self.addEventListener('activate', function (event) {
  console.log('Service worker activating...')
  event.waitUntil(
    clients.claim()
  )
})

// Cache strategy for offline support
self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') {
    return
  }

  event.respondWith(
    caches.match(event.request).then(function (response) {
      // Return cached version or fetch from network
      return response || fetch(event.request).then(function (response) {
        // Cache successful responses
        if (response.status === 200) {
          return caches.open('dating-app-v1').then(function (cache) {
            cache.put(event.request, response.clone())
            return response
          })
        }
        return response
      }).catch(function () {
        // Offline fallback for HTML pages
        if (event.request.destination === 'document') {
          return caches.match('/')
        }
      })
    })
  )
})
