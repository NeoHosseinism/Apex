const CV = 'ge-v3';
const ASSETS = ['/', '/index.html', '/manifest.json', '/sw.js', '/icon.svg',
  'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;600;700;800&display=swap'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CV).then(c => c.addAll(ASSETS).catch(() => {})));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CV).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
    const clone = res.clone();
    caches.open(CV).then(c => c.put(e.request, clone));
    return res;
  }).catch(() => cached)));
});
