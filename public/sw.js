const CACHE_NAME = 'seneca-v3'
const PRECACHE_URLS = [
  './',
  './index.html',
  './data/letters.json',
  './fonts/eb-garamond-latin-400.woff2',
  './fonts/eb-garamond-latin-400-italic.woff2',
  './manifest.json',
]

// Install: precache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS)
    })
  )
  self.skipWaiting()
})

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    })
  )
  self.clients.claim()
})

// Fetch: cache-first for assets, network-first for navigation
self.addEventListener('fetch', (event) => {
  const { request } = event

  // Navigation requests: network first, fallback to cached index
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('./index.html'))
    )
    return
  }

  // All other requests: cache first, then network
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached

      return fetch(request).then((response) => {
        // Cache successful responses for JS/CSS/fonts/JSON
        if (response.ok && (
          request.url.endsWith('.js') ||
          request.url.endsWith('.css') ||
          request.url.endsWith('.woff2') ||
          request.url.endsWith('.json') ||
          request.url.endsWith('.png')
        )) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
        }
        return response
      })
    })
  )
})
