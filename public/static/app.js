// ============================================
// ERP System - Complete Frontend Application
// ============================================

// Global state
const state = {
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    currentPage: 'login',
    currentModule: null,
    currentData: null,
    dashboardStats: null,
    filters: {},
};

// API configuration
const api = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(config => {
    if (state.token) config.headers.Authorization = `Bearer ${state.token}`;
    return config;
});

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) logout();
        return Promise.reject(error);
    }
);

// Authentication
async function login(username, password) {
    try {
        const response = await api.post('/auth/login', { username, password });
        if (response.data.success) {
            state.token = response.data.token;
            state.user = response.data.user;
            localStorage.setItem('token', state.token);
            localStorage.setItem('user', JSON.stringify(state.user));
            state.currentPage = 'dashboard';
            render();
            loadDashboardStats();
        } else {
            showNotification(response.data.error || 'خطأ في تسجيل الدخول', 'error');
        }
    } catch (error) {
        showNotification(error.response?.data?.error || 'خطأ في تسجيل الدخول', 'error');
    }
}

function logout() {
    state.token = null;
    state.user = null;
    state.currentPage = 'login';
    localStorage.clear();
    render();
}

// Dashboard
async function loadDashboardStats() {
    try {
        const response = await api.get('/dashboard/stats');
        if (response.data.success) {
            state.dashboardStats = response.data.data;
            renderDashboard();
        }
    } catch (error) {
        console.error('Dashboard error:', error);
    }
}

// Generic CRUD operations
async function loadData(module, filters = {}) {
    try {
        const params = new URLSearchParams(filters);
        const response = await api.get(`/${module}?${params}`);
        if (response.data.success) {
            state.currentData = response.data.data;
            state.currentModule = module;
            renderModulePage(module);
        }
    } catch (error) {
        showNotification('خطأ في تحميل البيانات', 'error');
    }
}

async function saveData(module, data, id = null) {
    try {
        const response = id 
            ? await api.put(`/${module}/${id}`, data)
            : await api.post(`/${module}`, data);
        
        if (response.data.success) {
            showNotification(response.data.message, 'success');
            loadData(module);
            closeModal();
        }
    } catch (error) {
        showNotification(error.response?.data?.error || 'خطأ في حفظ البيانات', 'error');
    }
}

async function deleteData(module, id) {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    
    try {
        const response = await api.delete(`/${module}/${id}`);
        if (response.data.success) {
            showNotification('تم الحذف بنجاح', 'success');
            loadData(module);
        }
    } catch (error) {
        showNotification('خطأ في الحذف', 'error');
    }
}

// Notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white ${
        type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    }`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Modal management
function openModal(title, content) {
    const modal = document.getElementById('modal');
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalContent').innerHTML = content;
    modal.classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
}

// Render functions
function render() {
    const app = document.getElementById('app');
    if (!state.token) {
        app.innerHTML = renderLoginPage();
    } else {
        app.innerHTML = renderMainLayout();
        if (state.currentPage === 'dashboard') {
            loadDashboardStats();
        }
    }
}

function navigateTo(page) {
    state.currentPage = page;
    document.getElementById('pageTitle').textContent = getPageTitle(page);
    
    if (page === 'dashboard') {
        loadDashboardStats();
    } else {
        loadData(page);
    }
}

function getPageTitle(page) {
    const titles = {
        dashboard: 'لوحة التحكم',
        departments: 'الأقسام',
        employees: 'الموظفين',
        clients: 'العملاء',
        suppliers: 'الموردين',
        invoices: 'الفواتير',
        inventory: 'المخزون',
        attendance: 'الحضور والانصراف',
        payroll: 'الرواتب',
        reports: 'التقارير'
    };
    return titles[page] || page;
}

function renderLoginPage() {
    return `
        <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
            <div class="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
                <div class="text-center mb-8">
                    <i class="fas fa-building text-7xl text-blue-600 mb-4"></i>
                    <h1 class="text-4xl font-bold text-gray-800 mb-2">نظام ERP المتكامل</h1>
                    <p class="text-gray-600">إدارة شاملة لجميع عمليات الشركة</p>
                </div>
                
                <form id="loginForm" class="space-y-6" onsubmit="event.preventDefault(); login(
                    document.getElementById('username').value,
                    document.getElementById('password').value
                );">
                    <div>
                        <label class="block text-gray-700 mb-2 font-semibold">
                            <i class="fas fa-user ml-2"></i>اسم المستخدم
                        </label>
                        <input type="text" id="username" 
                            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                            placeholder="Mohamed" required>
                    </div>
                    
                    <div>
                        <label class="block text-gray-700 mb-2 font-semibold">
                            <i class="fas fa-lock ml-2"></i>كلمة المرور
                        </label>
                        <input type="password" id="password" 
                            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                            placeholder="Mohamed@123" required>
                    </div>
                    
                    <button type="submit" 
                        class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-bold 
                               hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
                        <i class="fas fa-sign-in-alt ml-2"></i>تسجيل الدخول
                    </button>
                </form>
                
                <div class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p class="text-sm text-gray-700 text-center">
                        <i class="fas fa-info-circle ml-1 text-blue-600"></i>
                        <span class="font-semibold">بيانات التجربة:</span> Mohamed / Mohamed@123
                    </p>
                </div>
            </div>
        </div>
    `;
}

function renderMainLayout() {
    return `
        <div class="min-h-screen bg-gray-50 flex">
            ${renderSidebar()}
            <main class="flex-1 overflow-y-auto">
                ${renderHeader()}
                <div id="pageContent" class="p-6"></div>
            </main>
        </div>
        ${renderModal()}
    `;
}

function renderSidebar() {
    return `
        <aside class="fixed md:relative w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white h-screen overflow-y-auto shadow-2xl z-50">
            <div class="p-6">
                <div class="flex items-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-xl shadow-lg">
                    <i class="fas fa-building text-4xl ml-3"></i>
                    <div>
                        <h1 class="text-xl font-bold">نظام ERP</h1>
                        <p class="text-xs opacity-75">الإدارة المتكاملة</p>
                    </div>
                </div>
                
                <nav class="space-y-1">
                    <a onclick="navigateTo('dashboard')" class="nav-item flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-all">
                        <i class="fas fa-home ml-3 text-blue-400"></i>
                        <span>لوحة التحكم</span>
                    </a>
                    
                    <div class="mt-4">
                        <p class="text-gray-500 text-xs uppercase mb-2 px-4 font-semibold">الإدارة</p>
                        <a onclick="navigateTo('departments')" class="nav-item flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-all">
                            <i class="fas fa-sitemap ml-3 text-green-400"></i>
                            <span>الأقسام</span>
                        </a>
                        <a onclick="navigateTo('employees')" class="nav-item flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-all">
                            <i class="fas fa-user-tie ml-3 text-purple-400"></i>
                            <span>الموظفين</span>
                        </a>
                    </div>
                    
                    <div class="mt-4">
                        <p class="text-gray-500 text-xs uppercase mb-2 px-4 font-semibold">المبيعات</p>
                        <a onclick="navigateTo('clients')" class="nav-item flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-all">
                            <i class="fas fa-handshake ml-3 text-yellow-400"></i>
                            <span>العملاء</span>
                        </a>
                        <a onclick="navigateTo('suppliers')" class="nav-item flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-all">
                            <i class="fas fa-truck ml-3 text-orange-400"></i>
                            <span>الموردين</span>
                        </a>
                        <a onclick="navigateTo('invoices')" class="nav-item flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-all">
                            <i class="fas fa-file-invoice ml-3 text-red-400"></i>
                            <span>الفواتير</span>
                        </a>
                    </div>
                    
                    <div class="mt-4">
                        <p class="text-gray-500 text-xs uppercase mb-2 px-4 font-semibold">المخزون</p>
                        <a onclick="navigateTo('inventory')" class="nav-item flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-all">
                            <i class="fas fa-boxes ml-3 text-indigo-400"></i>
                            <span>المخزون</span>
                        </a>
                    </div>
                    
                    <div class="mt-4">
                        <p class="text-gray-500 text-xs uppercase mb-2 px-4 font-semibold">الموارد البشرية</p>
                        <a onclick="navigateTo('attendance')" class="nav-item flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-all">
                            <i class="fas fa-calendar-check ml-3 text-teal-400"></i>
                            <span>الحضور</span>
                        </a>
                        <a onclick="navigateTo('payroll')" class="nav-item flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-all">
                            <i class="fas fa-money-bill-wave ml-3 text-pink-400"></i>
                            <span>الرواتب</span>
                        </a>
                    </div>
                    
                    <div class="mt-4">
                        <p class="text-gray-500 text-xs uppercase mb-2 px-4 font-semibold">التقارير</p>
                        <a onclick="navigateTo('reports')" class="nav-item flex items-center px-4 py-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-all">
                            <i class="fas fa-chart-line ml-3 text-cyan-400"></i>
                            <span>التقارير المالية</span>
                        </a>
                    </div>
                </nav>
            </div>
            
            <div class="absolute bottom-0 w-64 p-6 bg-gray-900 border-t border-gray-700">
                <div class="flex items-center mb-4">
                    <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center ml-3 shadow-lg">
                        <i class="fas fa-user text-white text-lg"></i>
                    </div>
                    <div>
                        <p class="font-semibold">${state.user?.full_name || 'مستخدم'}</p>
                        <p class="text-xs text-gray-400">${state.user?.role_name_ar || 'موظف'}</p>
                    </div>
                </div>
                <button onclick="logout()" class="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg">
                    <i class="fas fa-sign-out-alt ml-2"></i>تسجيل الخروج
                </button>
            </div>
        </aside>
    `;
}

function renderHeader() {
    return `
        <header class="bg-white shadow-md p-4 sticky top-0 z-40">
            <div class="flex items-center justify-between">
                <h2 class="text-3xl font-bold text-gray-800" id="pageTitle">لوحة التحكم</h2>
                <div class="flex items-center space-x-4 space-x-reverse">
                    <button class="text-gray-600 hover:text-gray-800 relative p-2 rounded-full hover:bg-gray-100 transition-all">
                        <i class="fas fa-bell text-2xl"></i>
                        <span class="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                    </button>
                    <div class="text-right">
                        <p class="text-sm text-gray-600">${new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                </div>
            </div>
        </header>
    `;
}

function renderModal() {
    return `
        <div id="modal" class="fixed inset-0 bg-black bg-opacity-50 hidden flex items-center justify-center z-50">
            <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto">
                <div class="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-2xl">
                    <h3 id="modalTitle" class="text-2xl font-bold"></h3>
                    <button onclick="closeModal()" class="text-white hover:text-gray-200 text-3xl">&times;</button>
                </div>
                <div id="modalContent" class="p-6"></div>
            </div>
        </div>
    `;
}

function renderDashboard() {
    const stats = state.dashboardStats;
    if (!stats) return;
    
    const content = `
        <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div class="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm opacity-90 mb-1">إجمالي الإيرادات</p>
                            <h3 class="text-3xl font-bold">${stats.totalRevenue.toLocaleString('ar-EG')} ج.م</h3>
                        </div>
                        <i class="fas fa-dollar-sign text-5xl opacity-30"></i>
                    </div>
                </div>
                
                <div class="bg-gradient-to-br from-green-500 to-green-700 text-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm opacity-90 mb-1">صافي الربح</p>
                            <h3 class="text-3xl font-bold">${stats.netProfit.toLocaleString('ar-EG')} ج.م</h3>
                        </div>
                        <i class="fas fa-chart-line text-5xl opacity-30"></i>
                    </div>
                </div>
                
                <div class="bg-gradient-to-br from-orange-500 to-red-600 text-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm opacity-90 mb-1">فواتير معلقة</p>
                            <h3 class="text-3xl font-bold">${stats.pendingInvoices}</h3>
                        </div>
                        <i class="fas fa-file-invoice text-5xl opacity-30"></i>
                    </div>
                </div>
                
                <div class="bg-gradient-to-br from-purple-500 to-indigo-700 text-white rounded-2xl shadow-xl p-6 transform hover:scale-105 transition-all">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm opacity-90 mb-1">إجمالي العملاء</p>
                            <h3 class="text-3xl font-bold">${stats.totalClients}</h3>
                        </div>
                        <i class="fas fa-users text-5xl opacity-30"></i>
                    </div>
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-white rounded-2xl shadow-lg p-6 border-r-4 border-blue-500">
                    <div class="flex items-center mb-4">
                        <i class="fas fa-user-tie text-3xl text-blue-600 ml-3"></i>
                        <h3 class="text-xl font-semibold">الموظفين</h3>
                    </div>
                    <p class="text-4xl font-bold text-gray-800">${stats.totalEmployees}</p>
                    <p class="text-sm text-gray-600 mt-2">موظف نشط</p>
                </div>
                
                <div class="bg-white rounded-2xl shadow-lg p-6 border-r-4 border-green-500">
                    <div class="flex items-center mb-4">
                        <i class="fas fa-truck text-3xl text-green-600 ml-3"></i>
                        <h3 class="text-xl font-semibold">الموردين</h3>
                    </div>
                    <p class="text-4xl font-bold text-gray-800">${stats.totalSuppliers}</p>
                    <p class="text-sm text-gray-600 mt-2">مورد نشط</p>
                </div>
                
                <div class="bg-white rounded-2xl shadow-lg p-6 border-r-4 border-red-500">
                    <div class="flex items-center mb-4">
                        <i class="fas fa-exclamation-triangle text-3xl text-red-600 ml-3"></i>
                        <h3 class="text-xl font-semibold">فواتير متأخرة</h3>
                    </div>
                    <p class="text-4xl font-bold text-red-600">${stats.overdueInvoices}</p>
                    <p class="text-sm text-gray-600 mt-2">تحتاج متابعة</p>
                </div>
            </div>
            
            <div class="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-2xl shadow-2xl p-8">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-3xl font-bold mb-2">مرحباً، ${state.user?.full_name || 'Mohamed'}!</h2>
                        <p class="text-lg opacity-90">نظام إدارة شامل لجميع عمليات شركتك - ERP System</p>
                    </div>
                    <i class="fas fa-rocket text-6xl opacity-50"></i>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('pageContent').innerHTML = content;
}

function renderModulePage(module) {
    const content = `
        <div class="space-y-6">
            <div class="bg-white rounded-xl shadow-md p-6">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-2xl font-bold text-gray-800">
                        <i class="fas fa-list ml-2"></i>
                        قائمة ${getPageTitle(module)}
                    </h3>
                    <button onclick="showAddForm('${module}')" 
                        class="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 
                               transform hover:scale-105 transition-all shadow-lg">
                        <i class="fas fa-plus ml-2"></i>إضافة جديد
                    </button>
                </div>
                
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gradient-to-r from-gray-100 to-gray-200">
                            <tr>
                                ${getTableHeaders(module)}
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200">
                            ${renderTableRows(module)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('pageContent').innerHTML = content;
}

function getTableHeaders(module) {
    const headers = {
        departments: '<th class="px-4 py-3 text-right">اسم القسم</th><th>المدير</th><th>الميزانية</th><th>الإجراءات</th>',
        employees: '<th class="px-4 py-3 text-right">كود الموظف</th><th>الاسم</th><th>القسم</th><th>الوظيفة</th><th>المرتب</th><th>الإجراءات</th>',
        clients: '<th class="px-4 py-3 text-right">كود العميل</th><th>الاسم</th><th>الهاتف</th><th>البريد</th><th>النوع</th><th>الإجراءات</th>',
        suppliers: '<th class="px-4 py-3 text-right">كود المورد</th><th>الاسم</th><th>الشركة</th><th>الهاتف</th><th>الإجراءات</th>',
        invoices: '<th class="px-4 py-3 text-right">رقم الفاتورة</th><th>النوع</th><th>العميل/المورد</th><th>التاريخ</th><th>المبلغ</th><th>الحالة</th><th>الإجراءات</th>',
        inventory: '<th class="px-4 py-3 text-right">كود الصنف</th><th>اسم الصنف</th><th>الكمية</th><th>سعر الشراء</th><th>سعر البيع</th><th>الإجراءات</th>',
    };
    return headers[module] || '<th>البيانات</th><th>الإجراءات</th>';
}

function renderTableRows(module) {
    if (!state.currentData || state.currentData.length === 0) {
        return '<tr><td colspan="10" class="text-center py-8 text-gray-500">لا توجد بيانات</td></tr>';
    }
    
    return state.currentData.map(item => {
        let row = '<tr class="hover:bg-gray-50 transition-colors">';
        
        if (module === 'departments') {
            row += `
                <td class="px-4 py-4">${item.name_ar}</td>
                <td>${item.manager_name || '-'}</td>
                <td>${(item.budget || 0).toLocaleString('ar-EG')} ج.م</td>
            `;
        } else if (module === 'employees') {
            row += `
                <td class="px-4 py-4 font-mono">${item.employee_code}</td>
                <td>${item.full_name_ar || item.full_name}</td>
                <td>${item.department_name || '-'}</td>
                <td>${item.position_ar || item.position}</td>
                <td>${(item.salary || 0).toLocaleString('ar-EG')} ج.م</td>
            `;
        } else if (module === 'clients') {
            row += `
                <td class="px-4 py-4 font-mono">${item.client_code}</td>
                <td>${item.name_ar || item.name}</td>
                <td>${item.phone}</td>
                <td>${item.email || '-'}</td>
                <td><span class="px-3 py-1 rounded-full text-sm ${item.client_type === 'company' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}">
                    ${item.client_type === 'company' ? 'شركة' : 'فرد'}
                </span></td>
            `;
        } else if (module === 'invoices') {
            row += `
                <td class="px-4 py-4 font-mono">${item.invoice_number}</td>
                <td><span class="px-3 py-1 rounded-full text-sm ${item.invoice_type === 'sales' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}">
                    ${item.invoice_type === 'sales' ? 'مبيعات' : 'مشتريات'}
                </span></td>
                <td>${item.party_name || '-'}</td>
                <td>${new Date(item.invoice_date).toLocaleDateString('ar-EG')}</td>
                <td>${(item.total_amount || 0).toLocaleString('ar-EG')} ج.م</td>
                <td><span class="px-3 py-1 rounded-full text-sm ${
                    item.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 
                    item.payment_status === 'partial' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                }">
                    ${item.payment_status === 'paid' ? 'مدفوع' : item.payment_status === 'partial' ? 'جزئي' : 'معلق'}
                </span></td>
            `;
        }
        
        row += `
            <td class="px-4 py-4">
                <button onclick="editItem('${module}', ${item.id})" 
                    class="text-blue-600 hover:text-blue-800 mx-1 transition-colors">
                    <i class="fas fa-edit text-lg"></i>
                </button>
                <button onclick="deleteData('${module}', ${item.id})" 
                    class="text-red-600 hover:text-red-800 mx-1 transition-colors">
                    <i class="fas fa-trash text-lg"></i>
                </button>
            </td>
        </tr>`;
        
        return row;
    }).join('');
}

function showAddForm(module) {
    // Implementation for different modules
    showNotification('النموذج قيد التطوير', 'info');
}

function editItem(module, id) {
    showNotification('التعديل قيد التطوير', 'info');
}

// Initialize
document.addEventListener('DOMContentLoaded', render);
