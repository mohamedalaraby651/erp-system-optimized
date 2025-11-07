// ============================================
// Dashboard Optimized Loading
// تحسين تحميل لوحة التحكم بشكل تدريجي
// ============================================

// تحميل بيانات Dashboard مع Caching
async function loadDashboardStatsOptimized() {
    const cacheKey = 'dashboard_stats';
    const cachedData = window.dataCache.get(cacheKey);
    
    // استخدام البيانات المخزنة مؤقتاً إذا كانت موجودة
    if (cachedData) {
        console.log('✅ Using cached dashboard stats');
        state.dashboardStats = cachedData;
        renderDashboardStats(cachedData);
        return;
    }
    
    // عرض skeleton loader
    const statsContainer = document.querySelector('.stats-grid');
    if (statsContainer) {
        SkeletonLoader.show(statsContainer, 'card', 4);
    }
    
    try {
        PerformanceMonitor.start('load-dashboard-stats');
        
        const response = await api.get('/dashboard/stats');
        
        if (response.data.success) {
            const stats = response.data.data;
            state.dashboardStats = stats;
            
            // حفظ في الكاش لمدة دقيقة واحدة
            window.dataCache.set(cacheKey, stats, 60 * 1000);
            
            renderDashboardStats(stats);
            
            PerformanceMonitor.end('load-dashboard-stats');
        }
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
        showNotification('خطأ في تحميل الإحصائيات', 'error');
    }
}

// عرض إحصائيات Dashboard
function renderDashboardStats(stats) {
    const statsContainer = document.querySelector('.stats-grid');
    if (!statsContainer) return;
    
    statsContainer.innerHTML = `
        <div class="stat-card bg-blue-500 text-white p-6 rounded-lg shadow-lg transform transition-all hover:scale-105">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm opacity-80">إجمالي الإيرادات</p>
                    <h3 class="text-3xl font-bold mt-2">${(stats.totalRevenue || 0).toLocaleString('ar-EG')} ج.م</h3>
                </div>
                <i class="fas fa-dollar-sign text-5xl opacity-20"></i>
            </div>
        </div>
        
        <div class="stat-card bg-green-500 text-white p-6 rounded-lg shadow-lg transform transition-all hover:scale-105">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm opacity-80">صافي الربح</p>
                    <h3 class="text-3xl font-bold mt-2">${(stats.netProfit || 0).toLocaleString('ar-EG')} ج.م</h3>
                </div>
                <i class="fas fa-chart-line text-5xl opacity-20"></i>
            </div>
        </div>
        
        <div class="stat-card bg-orange-500 text-white p-6 rounded-lg shadow-lg transform transition-all hover:scale-105">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm opacity-80">فواتير معلقة</p>
                    <h3 class="text-3xl font-bold mt-2">${stats.pendingInvoices || 0}</h3>
                </div>
                <i class="fas fa-file-invoice text-5xl opacity-20"></i>
            </div>
        </div>
        
        <div class="stat-card bg-purple-500 text-white p-6 rounded-lg shadow-lg transform transition-all hover:scale-105">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm opacity-80">إجمالي العملاء</p>
                    <h3 class="text-3xl font-bold mt-2">${stats.totalClients || 0}</h3>
                </div>
                <i class="fas fa-users text-5xl opacity-20"></i>
            </div>
        </div>
    `;
}

// تحميل الأنشطة الأخيرة مع Pagination
let activitiesLoader = null;

async function loadRecentActivities(reset = false) {
    if (reset) {
        activitiesLoader = new ProgressiveLoader();
        const container = document.getElementById('activitiesContainer');
        if (container) {
            container.innerHTML = '';
            SkeletonLoader.show(container, 'list', 3);
        }
    }
    
    if (!activitiesLoader) {
        activitiesLoader = new ProgressiveLoader();
    }
    
    await activitiesLoader.loadMore(
        '/dashboard/activities',
        (activities, hasMore) => {
            renderActivities(activities, hasMore);
        },
        (error) => {
            showNotification('خطأ في تحميل الأنشطة', 'error');
        }
    );
}

function renderActivities(activities, hasMore) {
    const container = document.getElementById('activitiesContainer');
    if (!container) return;
    
    // إزالة skeleton loader في أول تحميل
    if (activitiesLoader.currentOffset === 20) {
        container.innerHTML = '';
    }
    
    activities.forEach(activity => {
        const activityCard = document.createElement('div');
        activityCard.className = 'activity-item p-4 border-b hover:bg-gray-50 transition';
        activityCard.innerHTML = `
            <div class="flex items-start">
                <div class="flex-shrink-0">
                    <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <i class="fas fa-${getActivityIcon(activity.action)} text-blue-600"></i>
                    </div>
                </div>
                <div class="mr-4 flex-1">
                    <p class="text-sm font-medium text-gray-900">${activity.user_name}</p>
                    <p class="text-sm text-gray-500">${getActivityText(activity)}</p>
                    <p class="text-xs text-gray-400 mt-1">${formatDateTime(activity.created_at)}</p>
                </div>
            </div>
        `;
        container.appendChild(activityCard);
    });
    
    // إضافة زر "تحميل المزيد" إذا كانت هناك بيانات أخرى
    let loadMoreBtn = document.getElementById('loadMoreActivitiesBtn');
    if (loadMoreBtn) {
        loadMoreBtn.remove();
    }
    
    if (hasMore) {
        loadMoreBtn = document.createElement('button');
        loadMoreBtn.id = 'loadMoreActivitiesBtn';
        loadMoreBtn.className = 'w-full py-3 text-blue-600 hover:bg-blue-50 transition';
        loadMoreBtn.innerHTML = '<i class="fas fa-chevron-down ml-2"></i> تحميل المزيد';
        loadMoreBtn.onclick = () => loadRecentActivities(false);
        container.appendChild(loadMoreBtn);
    }
}

function getActivityIcon(action) {
    const icons = {
        'create': 'plus-circle',
        'update': 'edit',
        'delete': 'trash-alt',
        'read': 'eye'
    };
    return icons[action] || 'info-circle';
}

function getActivityText(activity) {
    const actions = {
        'create': 'أضاف',
        'update': 'عدّل',
        'delete': 'حذف',
        'read': 'عرض'
    };
    
    const modules = {
        'users': 'مستخدم',
        'employees': 'موظف',
        'clients': 'عميل',
        'invoices': 'فاتورة',
        'departments': 'قسم'
    };
    
    const action = actions[activity.action] || activity.action;
    const module = modules[activity.module] || activity.module;
    
    return `${action} ${module}`;
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    if (days < 7) return `منذ ${days} يوم`;
    
    return date.toLocaleDateString('ar-EG');
}

// تحميل الإشعارات مع Polling محسّن
let notificationsLoader = null;
let notificationPollingOptimized = null;

async function loadNotificationsOptimized() {
    try {
        const response = await api.get('/dashboard/notifications', {
            params: { limit: 10, unread: true }
        });
        
        if (response.data.success) {
            state.notifications = response.data.data;
            updateNotificationBadge();
            renderNotificationsList(response.data.data);
            
            // تحديث عدد الإشعارات غير المقروءة
            const unreadCount = response.data.unreadCount || 0;
            const badge = document.getElementById('notificationBadge');
            if (badge) {
                badge.textContent = unreadCount;
                badge.style.display = unreadCount > 0 ? 'block' : 'none';
            }
        }
    } catch (error) {
        console.error('Error loading notifications:', error);
    }
}

function renderNotificationsList(notifications) {
    const container = document.getElementById('notificationsListContainer');
    if (!container) return;
    
    if (notifications.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <i class="fas fa-bell-slash text-4xl mb-3"></i>
                <p>لا توجد إشعارات جديدة</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = notifications.map(notification => `
        <div class="notification-item p-4 border-b hover:bg-gray-50 cursor-pointer ${!notification.is_read ? 'bg-blue-50' : ''}"
             onclick="markNotificationAsRead(${notification.id})">
            <div class="flex items-start">
                <div class="flex-shrink-0">
                    <div class="w-10 h-10 rounded-full ${getNotificationColor(notification.type)} flex items-center justify-center">
                        <i class="fas fa-${getNotificationIcon(notification.type)} text-white"></i>
                    </div>
                </div>
                <div class="mr-4 flex-1">
                    <p class="text-sm font-medium text-gray-900">${notification.title}</p>
                    <p class="text-sm text-gray-600">${notification.message}</p>
                    <p class="text-xs text-gray-400 mt-1">${formatDateTime(notification.created_at)}</p>
                </div>
                ${!notification.is_read ? '<div class="w-2 h-2 rounded-full bg-blue-600"></div>' : ''}
            </div>
        </div>
    `).join('');
}

function getNotificationColor(type) {
    const colors = {
        'info': 'bg-blue-500',
        'success': 'bg-green-500',
        'warning': 'bg-yellow-500',
        'error': 'bg-red-500'
    };
    return colors[type] || 'bg-gray-500';
}

function getNotificationIcon(type) {
    const icons = {
        'info': 'info-circle',
        'success': 'check-circle',
        'warning': 'exclamation-triangle',
        'error': 'exclamation-circle'
    };
    return icons[type] || 'bell';
}

async function markNotificationAsRead(id) {
    try {
        await api.put(`/dashboard/notifications/${id}/read`);
        
        // تحديث الحالة المحلية
        const notification = state.notifications.find(n => n.id === id);
        if (notification) {
            notification.is_read = true;
        }
        
        // إعادة تحميل الإشعارات
        await loadNotificationsOptimized();
    } catch (error) {
        console.error('Error marking notification as read:', error);
    }
}

// بدء Notification Polling المحسّن
function startNotificationPollingOptimized() {
    if (notificationPollingOptimized) return;
    
    // تحميل أول مرة
    loadNotificationsOptimized();
    
    // Polling كل 30 ثانية باستخدام throttle
    notificationPollingOptimized = setInterval(() => {
        loadNotificationsOptimized();
    }, 30000);
}

function stopNotificationPollingOptimized() {
    if (notificationPollingOptimized) {
        clearInterval(notificationPollingOptimized);
        notificationPollingOptimized = null;
    }
}

// تحميل Dashboard بالكامل بشكل تدريجي
async function loadDashboardProgressively() {
    console.log('🚀 Loading dashboard progressively...');
    
    // المرحلة 1: تحميل الإحصائيات الأساسية فوراً
    await loadDashboardStatsOptimized();
    
    // المرحلة 2: تحميل الأنشطة بعد 100ms
    setTimeout(() => {
        loadRecentActivities(true);
    }, 100);
    
    // المرحلة 3: تحميل الإشعارات بعد 200ms
    setTimeout(() => {
        startNotificationPollingOptimized();
    }, 200);
    
    // المرحلة 4: تحميل الرسوم البيانية بعد 500ms (إذا وجدت)
    setTimeout(() => {
        if (typeof initializeDashboardCharts === 'function') {
            initializeDashboardCharts();
        }
    }, 500);
    
    console.log('✅ Dashboard loaded progressively');
}

// تصدير الدوال للاستخدام العام
window.loadDashboardStatsOptimized = loadDashboardStatsOptimized;
window.loadRecentActivities = loadRecentActivities;
window.loadNotificationsOptimized = loadNotificationsOptimized;
window.startNotificationPollingOptimized = startNotificationPollingOptimized;
window.stopNotificationPollingOptimized = stopNotificationPollingOptimized;
window.loadDashboardProgressively = loadDashboardProgressively;
window.markNotificationAsRead = markNotificationAsRead;

console.log('✅ Dashboard Optimized Module loaded');
