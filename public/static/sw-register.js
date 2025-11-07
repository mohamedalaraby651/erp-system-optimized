// ============================================
// Service Worker Registration
// تسجيل Service Worker
// ============================================

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        registerServiceWorker();
    });
}

async function registerServiceWorker() {
    try {
        console.log('[SW Register] Registering service worker...');
        
        const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
        });
        
        console.log('[SW Register] Service Worker registered successfully');
        console.log('[SW Register] Scope:', registration.scope);
        
        // التعامل مع التحديثات
        registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            console.log('[SW Register] New service worker found');
            
            newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    console.log('[SW Register] New version available');
                    
                    // إظهار إشعار للمستخدم
                    showUpdateNotification();
                }
            });
        });
        
        // التحقق من التحديثات كل ساعة
        setInterval(() => {
            registration.update();
        }, 60 * 60 * 1000);
        
    } catch (error) {
        console.error('[SW Register] Service Worker registration failed:', error);
    }
}

function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-4 rounded-lg shadow-2xl max-w-md';
    notification.innerHTML = `
        <div class="flex items-center justify-between">
            <div class="flex-1 ml-3">
                <p class="font-medium">تحديث متاح</p>
                <p class="text-sm opacity-90 mt-1">يوجد نسخة جديدة من النظام</p>
            </div>
            <button onclick="updateServiceWorker()" class="px-4 py-2 bg-white text-blue-600 rounded hover:bg-gray-100 transition">
                تحديث
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
}

async function updateServiceWorker() {
    try {
        const registration = await navigator.serviceWorker.getRegistration();
        
        if (registration && registration.waiting) {
            // إرسال رسالة للـ service worker الجديد لتفعيله
            registration.waiting.postMessage({ action: 'skipWaiting' });
            
            // إعادة تحميل الصفحة عند تفعيل الـ service worker الجديد
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                window.location.reload();
            });
        }
    } catch (error) {
        console.error('[SW Register] Update failed:', error);
    }
}

// تصدير الدوال
window.updateServiceWorker = updateServiceWorker;
window.registerServiceWorker = registerServiceWorker;

console.log('[SW Register] Script loaded');
