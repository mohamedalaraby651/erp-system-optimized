// ============================================
// Service Worker for PWA and Caching
// خدمة التخزين المؤقت و PWA
// ============================================

const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `erp-cache-${CACHE_VERSION}`;

// الموارد التي سيتم تخزينها مؤقتاً عند التثبيت
const STATIC_ASSETS = [
    '/',
    '/static/performance-optimization.js',
    '/static/module-loader.js',
    '/static/app-dashboard-optimized.js',
    '/static/app-enhanced.js',
    '/static/app-login-enhanced.js',
    '/static/app-rendering.js',
    '/static/app-forms.js',
    '/static/styles-enhanced.css',
    '/static/styles-login.css',
    '/static/styles-responsive.css'
];

// الموارد الخارجية
const EXTERNAL_ASSETS = [
    'https://cdn.tailwindcss.com',
    'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
    'https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js'
];

// ============================================
// Install Event
// ============================================
self.addEventListener('install', (event) => {
    console.log('[ServiceWorker] Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[ServiceWorker] Caching static assets...');
                // تخزين الموارد الأساسية
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('[ServiceWorker] Installed successfully');
                // تفعيل Service Worker فوراً
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[ServiceWorker] Installation failed:', error);
            })
    );
});

// ============================================
// Activate Event
// ============================================
self.addEventListener('activate', (event) => {
    console.log('[ServiceWorker] Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                // حذف الـ caches القديمة
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('[ServiceWorker] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[ServiceWorker] Activated successfully');
                // السيطرة على كل التبويبات فوراً
                return self.clients.claim();
            })
    );
});

// ============================================
// Fetch Event - استراتيجية التخزين
// ============================================
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // تجاهل طلبات non-GET
    if (request.method !== 'GET') {
        return;
    }
    
    // استراتيجية مختلفة حسب نوع المورد
    if (url.pathname.startsWith('/api/')) {
        // API requests: Network First, fallback to Cache
        event.respondWith(networkFirst(request));
    } else if (url.pathname.startsWith('/static/')) {
        // Static assets: Cache First, fallback to Network
        event.respondWith(cacheFirst(request));
    } else if (url.origin === location.origin) {
        // HTML pages: Network First, fallback to Cache
        event.respondWith(networkFirst(request));
    } else {
        // External resources: Cache First
        event.respondWith(cacheFirst(request));
    }
});

// ============================================
// استراتيجية Cache First
// ============================================
async function cacheFirst(request) {
    try {
        // البحث في الكاش أولاً
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            // وجدنا النسخة المخزنة
            console.log('[ServiceWorker] Serving from cache:', request.url);
            
            // تحديث الكاش في الخلفية
            updateCache(request);
            
            return cachedResponse;
        }
        
        // إذا لم نجد، نجلب من الشبكة
        return await fetchAndCache(request);
    } catch (error) {
        console.error('[ServiceWorker] Cache First error:', error);
        return new Response('Offline', { status: 503 });
    }
}

// ============================================
// استراتيجية Network First
// ============================================
async function networkFirst(request) {
    try {
        // محاولة جلب من الشبكة أولاً
        const networkResponse = await fetch(request);
        
        // تخزين النسخة الجديدة
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        // إذا فشلت الشبكة، نستخدم الكاش
        console.log('[ServiceWorker] Network failed, trying cache:', request.url);
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // إذا لم نجد في الكاش أيضاً
        return new Response(
            JSON.stringify({ 
                success: false, 
                error: 'لا يوجد اتصال بالإنترنت' 
            }),
            {
                status: 503,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}

// ============================================
// جلب وتخزين
// ============================================
async function fetchAndCache(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('[ServiceWorker] Fetch failed:', error);
        throw error;
    }
}

// ============================================
// تحديث الكاش في الخلفية
// ============================================
function updateCache(request) {
    fetch(request)
        .then((response) => {
            if (response && response.status === 200) {
                caches.open(CACHE_NAME)
                    .then((cache) => {
                        cache.put(request, response);
                    });
            }
        })
        .catch((error) => {
            // تجاهل أخطاء التحديث في الخلفية
        });
}

// ============================================
// Background Sync (اختياري)
// ============================================
self.addEventListener('sync', (event) => {
    console.log('[ServiceWorker] Background sync:', event.tag);
    
    if (event.tag === 'sync-data') {
        event.waitUntil(syncData());
    }
});

async function syncData() {
    // يمكن إضافة منطق لمزامنة البيانات
    console.log('[ServiceWorker] Syncing data...');
}

// ============================================
// Push Notifications (اختياري)
// ============================================
self.addEventListener('push', (event) => {
    console.log('[ServiceWorker] Push received');
    
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'نظام ERP';
    const options = {
        body: data.body || 'لديك إشعار جديد',
        icon: '/static/icon-192.png',
        badge: '/static/badge-72.png',
        vibrate: [200, 100, 200],
        data: data
    };
    
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', (event) => {
    console.log('[ServiceWorker] Notification clicked');
    
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow(event.notification.data.url || '/')
    );
});

// ============================================
// Message Handler
// ============================================
self.addEventListener('message', (event) => {
    console.log('[ServiceWorker] Message received:', event.data);
    
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
    
    if (event.data.action === 'clearCache') {
        event.waitUntil(
            caches.delete(CACHE_NAME).then(() => {
                console.log('[ServiceWorker] Cache cleared');
            })
        );
    }
});

console.log('[ServiceWorker] Script loaded');
