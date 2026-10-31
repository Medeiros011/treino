/* Meus Treinos — service worker v6
   - abre sem internet (app, dados, ícones, fonte e imagens dos exercícios já vistas)
   - página principal e dados: rede primeiro, então cada versão nova chega sozinha */
const CACHE = 'treinos-v9';
const ASSETS = ['./', './index.html', './app.js', './dados.js', './manifest.json', './icon.svg', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const proprio = url.origin === self.location.origin;
  const codigo = proprio && (req.mode === 'navigate' || /\.(html|js|json)$/.test(url.pathname) || url.pathname.endsWith('/'));
  if (codigo) {
    e.respondWith(fetch(req).then(res => { const c = res.clone(); caches.open(CACHE).then(x => x.put(req, c)); return res; })
      .catch(() => caches.match(req).then(r => r || caches.match('./index.html'))));
    return;
  }
  e.respondWith(caches.match(req).then(hit => {
    const rede = fetch(req).then(res => {
      if (res && (res.ok || res.type === 'opaque')) { const c = res.clone(); caches.open(CACHE).then(x => x.put(req, c)).catch(()=>{}); }
      return res;
    }).catch(() => hit);
    return hit || rede;
  }));
});
