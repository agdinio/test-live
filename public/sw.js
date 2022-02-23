importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js'
)

workbox.routing.registerRoute(
  new RegExp('^/*'),
  new workbox.strategies.CacheFirst({
    cacheName: 'static-site',
  })
)

this.addEventListener('fetch', evt => {})
