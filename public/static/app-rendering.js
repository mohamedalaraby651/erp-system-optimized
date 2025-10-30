// ============================================
// ERP System - Rendering Functions
// All UI rendering logic
// ============================================

// Main Render Function
function render() {
    const app = document.getElementById('app');
    if (!state.token) {
        app.innerHTML = renderLoginPage();
    } else {
        app.innerHTML = renderMainLayout();
        if (state.currentPage === 'dashboard') {
            loadDashboardStats();
        }
        startNotificationPolling();
    }
}

// Login Page - Use Enhanced Version
function renderLoginPage() {
    return renderEnhancedLoginPage();
}

// Main Layout
function renderMainLayout() {
    return `
        <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-300">
            ${renderSidebar()}
            <main class="flex-1 overflow-y-auto transition-all duration-300">
                ${renderHeader()}
                <div id="pageContent" class="p-6"></div>
            </main>
        </div>
        ${renderModal()}
    `;
}

// Enhanced Sidebar with Categories
function renderSidebar() {
    let sidebarHTML = `
        <aside id="sidebar" class="glass-sidebar fixed md:relative w-80 h-screen overflow-y-auto z-50 transition-all duration-300">
            <div class="p-6">
                <div class="flex items-center justify-between mb-8 bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-xl shadow-lg">
                    <div class="flex items-center">
                        <i class="fas fa-building text-4xl text-white ml-3"></i>
                        <div>
                            <h1 class="text-xl font-bold text-white">نظام ERP</h1>
                            <p class="text-xs text-white opacity-75">الإدارة المتكاملة</p>
                        </div>
                    </div>
                    <button onclick="toggleSidebar()" class="md:hidden text-white text-2xl">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <nav class="space-y-2">
    `;

    // Dashboard
    sidebarHTML += `
        <a onclick="navigateTo('dashboard')" 
            class="nav-item ${state.currentPage === 'dashboard' ? 'active' : ''} flex items-center px-4 py-3 rounded-xl cursor-pointer transition-all group">
            <i class="${menuStructure.dashboard.icon} text-xl ml-3 text-blue-400 group-hover:scale-110 transition-transform"></i>
            <span class="font-medium">${menuStructure.dashboard.label[state.language]}</span>
        </a>
    `;

    // Categories
    const categories = ['hr', 'sales', 'purchasing', 'administration'];
    categories.forEach(categoryKey => {
        const category = menuStructure[categoryKey];
        const isOpen = state.sidebarState[categoryKey];
        
        sidebarHTML += `
            <div class="category-group">
                <button onclick="toggleCategory('${categoryKey}')" 
                    class="nav-item flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all w-full group hover:bg-white/10">
                    <div class="flex items-center">
                        <i class="${category.icon} text-xl ml-3 text-purple-400 group-hover:scale-110 transition-transform"></i>
                        <span class="font-medium">${category.label[state.language]}</span>
                    </div>
                    <i class="fas fa-chevron-${isOpen ? 'down' : (state.language === 'ar' ? 'left' : 'right')} text-sm transition-transform ${isOpen ? 'rotate-180' : ''}"></i>
                </button>
                
                <div class="subcategory-list ${isOpen ? 'open' : ''} mt-1">
        `;
        
        if (category.subcategories) {
            Object.entries(category.subcategories).forEach(([subKey, subCategory]) => {
                sidebarHTML += `
                    <a onclick="navigateTo('${subKey}')" 
                        class="nav-subitem ${state.currentPage === subKey ? 'active' : ''} flex items-center px-4 py-2 mr-8 rounded-lg cursor-pointer transition-all group">
                        <i class="${subCategory.icon} text-sm ml-2 group-hover:scale-110 transition-transform"></i>
                        <span class="text-sm">${subCategory.label[state.language]}</span>
                    </a>
                `;
            });
        }
        
        sidebarHTML += `
                </div>
            </div>
        `;
    });

    sidebarHTML += `
                </nav>
            </div>
            
            <div class="absolute bottom-0 w-80 p-6 glass-footer border-t border-white/10">
                <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center ml-3 shadow-lg">
                        <i class="fas fa-user text-white text-lg"></i>
                    </div>
                    <div class="flex-1">
                        <p class="font-semibold text-white">${state.user?.full_name || 'Mohamed'}</p>
                        <p class="text-xs text-gray-300">${state.user?.role_name_ar || 'مدير النظام'}</p>
                    </div>
                </div>
                <button onclick="logout()" class="modern-button-danger w-full">
                    <i class="fas fa-sign-out-alt ml-2"></i>${t('logout')}
                </button>
            </div>
        </aside>
    `;

    return sidebarHTML;
}

// Enhanced Header
function renderHeader() {
    return `
        <header class="glass-header sticky top-0 z-40 p-4 border-b border-white/10">
            <div class="flex items-center justify-between">
                <div class="flex items-center space-x-4 space-x-reverse">
                    <button onclick="toggleSidebar()" class="md:hidden text-gray-700 dark:text-white text-2xl">
                        <i class="fas fa-bars"></i>
                    </button>
                    <h2 class="text-3xl font-bold text-gray-800 dark:text-white" id="pageTitle">
                        ${t('welcome')}
                    </h2>
                </div>
                
                <div class="flex items-center space-x-4 space-x-reverse">
                    <!-- Language Toggle -->
                    <button onclick="toggleLanguage()" 
                        class="icon-button" 
                        title="${t('language')}">
                        <i class="fas fa-language text-xl"></i>
                    </button>
                    
                    <!-- Theme Toggle -->
                    <button onclick="toggleTheme()" 
                        class="icon-button" 
                        title="${state.theme === 'dark' ? t('light_mode') : t('dark_mode')}">
                        <i class="fas fa-${state.theme === 'dark' ? 'sun' : 'moon'} text-xl"></i>
                    </button>
                    
                    <!-- Notifications -->
                    <button class="icon-button relative" onclick="showNotifications()">
                        <i class="fas fa-bell text-xl"></i>
                        <span id="notificationBadge" 
                            class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center animate-pulse" 
                            style="display: none;">0</span>
                    </button>
                    
                    <!-- Date -->
                    <div class="hidden md:block text-right">
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            ${new Date().toLocaleDateString(state.language === 'ar' ? 'ar-EG' : 'en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    `;
}

// Dashboard with Charts
function renderDashboard() {
    const stats = state.dashboardStats;
    if (!stats) return;
    
    const content = `
        <div class="space-y-6">
            <!-- Stats Cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div class="stat-card stat-card-1">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm opacity-90 mb-1">${t('total_revenue')}</p>
                            <h3 class="text-3xl font-bold">${stats.totalRevenue.toLocaleString(state.language === 'ar' ? 'ar-EG' : 'en-US')} ${state.language === 'ar' ? 'ج.م' : 'EGP'}</h3>
                            <p class="text-xs opacity-75 mt-1">
                                <i class="fas fa-arrow-up ml-1"></i>+12% من الشهر الماضي
                            </p>
                        </div>
                        <i class="fas fa-dollar-sign text-5xl opacity-30"></i>
                    </div>
                </div>
                
                <div class="stat-card stat-card-2">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm opacity-90 mb-1">${t('net_profit')}</p>
                            <h3 class="text-3xl font-bold">${stats.netProfit.toLocaleString(state.language === 'ar' ? 'ar-EG' : 'en-US')} ${state.language === 'ar' ? 'ج.م' : 'EGP'}</h3>
                            <p class="text-xs opacity-75 mt-1">
                                <i class="fas fa-arrow-up ml-1"></i>+8% من الشهر الماضي
                            </p>
                        </div>
                        <i class="fas fa-chart-line text-5xl opacity-30"></i>
                    </div>
                </div>
                
                <div class="stat-card stat-card-3">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm opacity-90 mb-1">${t('pending_invoices')}</p>
                            <h3 class="text-3xl font-bold">${stats.pendingInvoices}</h3>
                            <p class="text-xs opacity-75 mt-1">تحتاج إلى متابعة</p>
                        </div>
                        <i class="fas fa-file-invoice text-5xl opacity-30"></i>
                    </div>
                </div>
                
                <div class="stat-card stat-card-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm opacity-90 mb-1">${t('total_clients')}</p>
                            <h3 class="text-3xl font-bold">${stats.totalClients}</h3>
                            <p class="text-xs opacity-75 mt-1">عميل نشط</p>
                        </div>
                        <i class="fas fa-users text-5xl opacity-30"></i>
                    </div>
                </div>
            </div>
            
            <!-- Charts Section -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div class="glass-card">
                    <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">
                        <i class="fas fa-chart-line ml-2 text-blue-600"></i>
                        الإيرادات والمصروفات
                    </h3>
                    <div style="height: 300px;">
                        <canvas id="revenueChart"></canvas>
                    </div>
                </div>
                
                <div class="glass-card">
                    <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">
                        <i class="fas fa-pie-chart ml-2 text-green-600"></i>
                        توزيع المبيعات
                    </h3>
                    <div style="height: 300px;">
                        <canvas id="salesChart"></canvas>
                    </div>
                </div>
            </div>
            
            <!-- Additional Stats -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="glass-card border-r-4 border-blue-500">
                    <div class="flex items-center mb-4">
                        <i class="fas fa-user-tie text-3xl text-blue-600 ml-3"></i>
                        <h3 class="text-xl font-semibold dark:text-white">الموظفين</h3>
                    </div>
                    <p class="text-4xl font-bold text-gray-800 dark:text-white">${stats.totalEmployees}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">موظف نشط</p>
                </div>
                
                <div class="glass-card border-r-4 border-green-500">
                    <div class="flex items-center mb-4">
                        <i class="fas fa-truck text-3xl text-green-600 ml-3"></i>
                        <h3 class="text-xl font-semibold dark:text-white">الموردين</h3>
                    </div>
                    <p class="text-4xl font-bold text-gray-800 dark:text-white">${stats.totalSuppliers}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">مورد نشط</p>
                </div>
                
                <div class="glass-card border-r-4 border-red-500">
                    <div class="flex items-center mb-4">
                        <i class="fas fa-exclamation-triangle text-3xl text-red-600 ml-3"></i>
                        <h3 class="text-xl font-semibold dark:text-white">فواتير متأخرة</h3>
                    </div>
                    <p class="text-4xl font-bold text-red-600">${stats.overdueInvoices}</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">تحتاج متابعة</p>
                </div>
            </div>
            
            <!-- Welcome Banner -->
            <div class="glass-card bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white border-0">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-3xl font-bold mb-2">${t('welcome')}, ${state.user?.full_name || 'Mohamed'}!</h2>
                        <p class="text-lg opacity-90">نظام إدارة شامل لجميع عمليات شركتك - ERP System</p>
                        <div class="mt-4 flex space-x-4 space-x-reverse">
                            <button onclick="navigateTo('employees')" class="modern-button-light">
                                <i class="fas fa-user-tie ml-2"></i>إدارة الموظفين
                            </button>
                            <button onclick="navigateTo('clients')" class="modern-button-light">
                                <i class="fas fa-handshake ml-2"></i>إدارة العملاء
                            </button>
                        </div>
                    </div>
                    <i class="fas fa-rocket text-8xl opacity-20 hidden lg:block"></i>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('pageContent').innerHTML = content;
}

// Module Page with Data Table
function renderModulePage(module) {
    const content = `
        <div class="space-y-6">
            <div class="glass-card">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-2xl font-bold text-gray-800 dark:text-white">
                        <i class="fas fa-list ml-2"></i>
                        قائمة ${getPageTitle(module)}
                    </h3>
                    <div class="flex space-x-2 space-x-reverse">
                        <button onclick="exportToExcel('${module}')" 
                            class="modern-button-success"
                            title="${t('export_excel')}">
                            <i class="fas fa-file-excel ml-2"></i>${t('export_excel')}
                        </button>
                        <button onclick="exportToPDF('pageContent', '${module}')" 
                            class="modern-button-danger"
                            title="${t('export_pdf')}">
                            <i class="fas fa-file-pdf ml-2"></i>${t('export_pdf')}
                        </button>
                        <button onclick="showAddForm('${module}')" 
                            class="modern-button">
                            <i class="fas fa-plus ml-2"></i>${t('add_new')}
                        </button>
                    </div>
                </div>
                
                <!-- Search and Filter -->
                <div class="mb-4 flex space-x-4 space-x-reverse">
                    <div class="flex-1">
                        <input type="text" 
                            placeholder="${t('search')}..." 
                            class="modern-input w-full"
                            onkeyup="filterTable(this.value)">
                    </div>
                </div>
                
                <div class="overflow-x-auto">
                    <table class="w-full modern-table" id="dataTable">
                        <thead>
                            <tr>
                                ${getTableHeaders(module)}
                            </tr>
                        </thead>
                        <tbody>
                            ${renderTableRows(module)}
                        </tbody>
                    </table>
                </div>
                
                <!-- Pagination -->
                <div class="mt-4 flex items-center justify-between">
                    <p class="text-sm text-gray-600 dark:text-gray-400">
                        عرض ${state.currentData?.length || 0} من إجمالي ${state.currentData?.length || 0} سجل
                    </p>
                    <div class="flex space-x-2 space-x-reverse">
                        <button class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                        <button class="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
                        <button class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('pageContent').innerHTML = content;
}

// Continue to forms and profile pages...
