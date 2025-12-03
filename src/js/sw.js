/**
 * Service Worker for KaLI PWA
 * Caches app shell on install, runtime cache for assets
 * Offline support with queued sync
 */

const CACHE_NAME = "kali-v1"
const CRITICAL_ASSETS = [
  "/",
  "/src/index.html",
  "/src/css/app.css",
  "/src/js/app.js",
  "/src/js/i18n.js",
  "/src/js/mockData.js",
  "/src/js/router.js",
  "/manifest.json",
]

self.addEventListener("install", (event) => {
  console.log("[SW] Installing...")
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Caching app shell...")
      return cache.addAll(CRITICAL_ASSETS).catch((err) => {
        console.warn("[SW] Cache error:", err)
      })
    }),
  )
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  console.log("[SW] Activating...")
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)))
    }),
  )
  self.clients.claim()
})

self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET or external requests
  if (request.method !== "GET" || url.origin !== self.location.origin) {
    return
  }

  // Network-first for navigation
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          caches.open(CACHE_NAME).then((cache) => cache.put(request, response))
          return response.clone()
        })
        .catch(() => caches.match(request) || new Response("Offline")),
    )
  } else {
    // Cache-first for assets
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached
        return fetch(request).then((response) => {
          if (response.ok) {
            caches.open(CACHE_NAME).then((cache) => cache.put(request, response))
          }
          return response.clone()
        })
      }),
    )
  }
})

// Handle background sync (if available)
self.addEventListener("sync", (event) => {
  if (event.tag === "kali-sync") {
    event.waitUntil(syncPendingUploads())
  }
})

async function syncPendingUploads() {
  console.log("[SW] Syncing pending uploads...")
  // Emulate sync: in production, this would POST to an API
}
