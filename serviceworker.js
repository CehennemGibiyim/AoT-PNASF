// AoT-PNASF Service Worker
// GitHub Pages için önbellekleme sistemi

const CACHE_NAME = 'aot-pnasf-v1';
const CACHE_VERSION = 'v1';

// Önbelleğe alınacak kaynaklar
const STATIC_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/styles/main.css',
  '/styles/crafting.css',
  '/styles/market.css',
  '/styles/settings.css',
  '/js/main.js',
  '/js/lang.js',
  '/js/settings-panel.js',
  '/js/i18n-helper.js',
  '/js/image-cache.js',
  '/data/items-data.js',
  '/data/world-data.js',
  '/locales/tr-official.json',
  '/locales/tr.json'
];

// API kaynakları için önbellekleme stratejisi
const API_CACHE = [
  'https://render.albiononline.com',
  'https://europe.albion-online-data.com',
  'https://west.albion-online-data.com',
  'https://east.albion-online-data.com'
];

// Service Worker kurulumu
self.addEventListener('install', (event) => {
  console.log('[SW] Service Worker kuruluyor...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Statik kaynaklar önbelleğe alınıyor...');
      return cache.addAll(STATIC_CACHE.map(url => new Request(url, {cache: 'reload'})));
    }).catch((error) => {
      console.error('[SW] Önbellekleme hatası:', error);
    })
  );
  
  self.skipWaiting();
});

// Service Worker aktivasyonu
self.addEventListener('activate', (event) => {
  console.log('[SW] Service Worker aktif ediliyor...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Eski önbellek temizleniyor:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  self.clients.claim();
});

// Fetch isteklerini yönet
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // API istekleri için Network-First stratejisi
  if (API_CACHE.some(api => url.href.includes(api))) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Başarılı ise önbelleğe al
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Network hatası ise önbellekten döndür
          return caches.match(event.request);
        })
    );
    return;
  }
  
  // Statik kaynaklar için Cache-First stratejisi
  if (STATIC_CACHE.some(path => url.pathname.includes(path.replace('/', ''))) || 
      url.pathname.endsWith('.js') || 
      url.pathname.endsWith('.css') ||
      url.pathname.endsWith('.json')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Önbellekte varsa döndür ve arka planda güncelle
          fetchAndCache(event.request);
          return cachedResponse;
        }
        
        // Önbellekte yoksa network'ten al ve önbelleğe kaydet
        return fetchAndCache(event.request);
      })
    );
    return;
  }
  
  // Diğer istekler için network'e yönlendir
  event.respondWith(fetch(event.request));
});

// Yardımcı fonksiyon: Fetch ve Cache
async function fetchAndCache(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const responseClone = response.clone();
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, responseClone);
    }
    return response;
  } catch (error) {
    console.error('[SW] Fetch hatası:', error);
    throw error;
  }
}

// Mesaj dinleme (önbellek yönetimi için)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    console.log('[SW] Önbellek temizleniyor...');
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
    }).then(() => {
      event.ports[0].postMessage({status: 'cleared'});
    });
  }
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
