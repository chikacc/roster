/* 班表：離線快取
   網頁（index.html、help.html）每次先連網拿最新版，沒網路才用快取；
   圖示、程式庫用快取；換了 vendor 或 icons 裡的檔案時，把 CACHE 的版本號加 1。 */
const CACHE = "roster-v2";
const CORE = [
  "./", "index.html", "help.html", "manifest.webmanifest",
  "vendor/html2canvas.min.js",
  "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png", "icons/maskable-512.png"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // 網頁：先連網，失敗才用快取
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then(res => { const copy = res.clone(); if (res.ok) caches.open(CACHE).then(c => c.put(req, copy)); return res; })
      .catch(() => caches.match(req, { ignoreSearch: true }).then(hit => hit || caches.match(url.pathname.endsWith("/help.html") ? "help.html" : "index.html"))));
    return;
  }
  // 國定假日資料：先連網拿最新的，沒網路才用快取
  if (url.origin === location.origin && url.pathname.endsWith("/holidays.json")) {
    e.respondWith(fetch(req).then(res => { const copy = res.clone(); if (res.ok) caches.open(CACHE).then(c => c.put(req, copy)); return res; })
      .catch(() => caches.match(req)));
    return;
  }
  // Google 字型：有快取先用，背景更新
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    e.respondWith(caches.open(CACHE).then(c => c.match(req).then(hit => {
      const net = fetch(req).then(res => { c.put(req, res.clone()); return res; }).catch(() => hit);
      return hit || net;
    })));
    return;
  }
  // 同網站的其他檔案：快取優先
  if (url.origin === location.origin) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res; })));
  }
});
