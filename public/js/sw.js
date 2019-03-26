const cache_url = [
  '../',
  '../index.html',
  './index.js',
  './index2.js'
];

// self.addEventListener('install', e => {
//   console.log('read');
//   e.waitUntil(
//     caches.open('videos').then(cache => {
//       // return cache.addAll(cache_url.map(url => new Request(url, {credentials: 'same-origin'})));
//       return cache.addAll(cache_url);
//     })
//   );
// });
//
// self.addEventListener('fetch', function(e) {
//   console.log(e.request.url);
//   e.respondWith(
//     caches.match(e.request).then(function(response) {
//       return response || fetch(e.request);
//     })
//   );
// });

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('video-store').then(function(cache) {
      return cache.addAll(cache_url);
    })
  );
});

self.addEventListener('fetch', function(e) {
  console.log(e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
