// Сервис-воркер «Рабочего таймера»: сначала сеть (чтобы всегда была свежая версия), без сети — сохранённая копия страницы.
const C = 'timer-v2';
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return; // сервер синхронизации и Telegram — не трогаем
  e.respondWith(fetch(r).then(res => { const copy = res.clone(); caches.open(C).then(c => c.put(r, copy)); return res; })
    .catch(() => caches.match(r).then(m => m || caches.match('./'))));
});
