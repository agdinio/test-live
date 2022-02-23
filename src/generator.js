const workbox = require('workbox-build')

workbox.generateSW({
  cacheId: 'pwa_example',
  globDirectory: './',
  globPatterns: ['**/*.{png,jpg,jpeg,gif,svg,css,js}'],
  swDest: 'public/sw.js',
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /\.(?:html|htm|xml)$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'markup',
        expiration: {
          maxAgeSeconds: 24 * 60 * 60,
        },
      },
    },
  ],
})
