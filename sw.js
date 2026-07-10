/* Service Worker — permite usar o app offline */
const CACHE = 'treinos-v5';
const ASSETS = [
  './',
  './index.html',
  './treinos.js',
  './manifest.json',
  './icon.svg',
  './cbum2024.jpg',
  './cbum.jpg'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      const net = fetch(e.request).then(res => {
        // guarda no cache imagens/gifs de exercícios para funcionar offline depois
        if (res && res.status === 200 && (e.request.url.startsWith(self.location.origin) || res.type === 'basic')) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
        }
        return res;
      }).catch(() => cached);
      return cached || net;
    })
  );
});
