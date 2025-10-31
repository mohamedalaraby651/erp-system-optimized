// ============================================
// ERP System - Enhanced Complete Frontend
// Version 2.0 with All Advanced Features
// ============================================

// Global State Management
const state = {
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    currentPage: 'login',
    currentModule: null,
    currentData: null,
    currentItem: null,
    dashboardStats: null,
    filters: {},
    theme: localStorage.getItem('theme') || 'light',
    language: localStorage.getItem('language') || 'ar',
    sidebarState: {},
    notifications: []
};

// Menu Structure with Main Categories and Subcategories
const menuStructure = {
    dashboard: {
        icon: 'fas fa-home',
        label: { ar: 'لوحة التحكم', en: 'Dashboard' },
        action: 'dashboard'
    },
    hr: {
        icon: 'fas fa-users-cog',
        label: { ar: 'الموارد البشرية', en: 'Human Resources' },
        subcategories: {
            employees: { icon: 'fas fa-user-tie', label: { ar: 'الموظفين', en: 'Employees' } },
            attendance: { icon: 'fas fa-calendar-check', label: { ar: 'الحضور والانصراف', en: 'Attendance' } },
            payroll: { icon: 'fas fa-money-bill-wave', label: { ar: 'الرواتب', en: 'Payroll' } },
            leaves: { icon: 'fas fa-umbrella-beach', label: { ar: 'الإجازات', en: 'Leaves' } },
            hr_reports: { icon: 'fas fa-chart-bar', label: { ar: 'تقارير الموارد البشرية', en: 'HR Reports' } }
        }
    },
    sales: {
        icon: 'fas fa-shopping-cart',
        label: { ar: 'المبيعات', en: 'Sales' },
        subcategories: {
            clients: { icon: 'fas fa-handshake', label: { ar: 'العملاء', en: 'Clients' } },
            sales_invoices: { icon: 'fas fa-file-invoice-dollar', label: { ar: 'فواتير المبيعات', en: 'Sales Invoices' } },
            contracts: { icon: 'fas fa-file-contract', label: { ar: 'العقود', en: 'Contracts' } },
            client_transactions: { icon: 'fas fa-exchange-alt', label: { ar: 'معاملات العملاء', en: 'Client Transactions' } },
            crm: { icon: 'fas fa-users', label: { ar: 'إدارة العلاقات', en: 'CRM' } },
            opportunities: { icon: 'fas fa-bullseye', label: { ar: 'الفرص', en: 'Opportunities' } }
        }
    },
    purchasing: {
        icon: 'fas fa-truck-loading',
        label: { ar: 'المشتريات', en: 'Purchasing' },
        subcategories: {
            suppliers: { icon: 'fas fa-truck', label: { ar: 'الموردين', en: 'Suppliers' } },
            purchase_invoices: { icon: 'fas fa-file-invoice', label: { ar: 'فواتير المشتريات', en: 'Purchase Invoices' } },
            purchase_orders: { icon: 'fas fa-clipboard-list', label: { ar: 'أوامر الشراء', en: 'Purchase Orders' } },
            inventory: { icon: 'fas fa-boxes', label: { ar: 'المخزون', en: 'Inventory' } },
            supplier_transactions: { icon: 'fas fa-exchange-alt', label: { ar: 'معاملات الموردين', en: 'Supplier Transactions' } }
        }
    },
    administration: {
        icon: 'fas fa-cog',
        label: { ar: 'الإدارة', en: 'Administration' },
        subcategories: {
            users: { icon: 'fas fa-users', label: { ar: 'المستخدمين', en: 'Users' } },
            departments: { icon: 'fas fa-sitemap', label: { ar: 'الأقسام', en: 'Departments' } },
            settings: { icon: 'fas fa-sliders-h', label: { ar: 'الإعدادات', en: 'Settings' } },
            profile: { icon: 'fas fa-user-circle', label: { ar: 'الملف الشخصي', en: 'Profile' } },
            themes: { icon: 'fas fa-palette', label: { ar: 'السمات', en: 'Themes' } }
        }
    }
};

// Translations
const translations = {
    ar: {
        welcome: 'مرحباً',
        logout: 'تسجيل الخروج',
        add_new: 'إضافة جديد',
        edit: 'تعديل',
        delete: 'حذف',
        save: 'حفظ',
        cancel: 'إلغاء',
        search: 'بحث',
        filter: 'تصفية',
        export_excel: 'تصدير Excel',
        export_pdf: 'تصدير PDF',
        print: 'طباعة',
        no_data: 'لا توجد بيانات',
        confirm_delete: 'هل أنت متأكد من الحذف؟',
        success: 'تمت العملية بنجاح',
        error: 'حدث خطأ',
        loading: 'جاري التحميل...',
        personal_info: 'البيانات الشخصية',
        financial_transactions: 'المعاملات المالية',
        documents: 'المستندات',
        activity: 'السجل',
        total_revenue: 'إجمالي الإيرادات',
        net_profit: 'صافي الربح',
        pending_invoices: 'فواتير معلقة',
        total_clients: 'إجمالي العملاء',
        dark_mode: 'الوضع الداكن',
        light_mode: 'الوضع المضيء',
        language: 'اللغة'
    },
    en: {
        welcome: 'Welcome',
        logout: 'Logout',
        add_new: 'Add New',
        edit: 'Edit',
        delete: 'Delete',
        save: 'Save',
        cancel: 'Cancel',
        search: 'Search',
        filter: 'Filter',
        export_excel: 'Export Excel',
        export_pdf: 'Export PDF',
        print: 'Print',
        no_data: 'No data available',
        confirm_delete: 'Are you sure you want to delete?',
        success: 'Operation completed successfully',
        error: 'An error occurred',
        loading: 'Loading...',
        personal_info: 'Personal Information',
        financial_transactions: 'Financial Transactions',
        documents: 'Documents',
        activity: 'Activity Log',
        total_revenue: 'Total Revenue',
        net_profit: 'Net Profit',
        pending_invoices: 'Pending Invoices',
        total_clients: 'Total Clients',
        dark_mode: 'Dark Mode',
        light_mode: 'Light Mode',
        language: 'Language'
    }
};

// Translation Helper
function t(key) {
    return translations[state.language][key] || key;
}

// API Configuration
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

// Theme Management
function toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', state.theme);
    document.documentElement.setAttribute('data-theme', state.theme);
    showNotification(
        state.theme === 'dark' ? 'تم تفعيل الوضع الداكن' : 'تم تفعيل الوضع المضيء',
        'success'
    );
}

function toggleLanguage() {
    state.language = state.language === 'ar' ? 'en' : 'ar';
    localStorage.setItem('language', state.language);
    document.documentElement.setAttribute('dir', state.language === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', state.language);
    render();
    showNotification(
        state.language === 'ar' ? 'تم التبديل إلى العربية' : 'Switched to English',
        'success'
    );
}

// Initialize Theme on Load
function initTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    document.documentElement.setAttribute('dir', state.language === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', state.language);
}

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

// Dashboard with Charts
async function loadDashboardStats() {
    try {
        const response = await api.get('/dashboard/stats');
        if (response.data.success) {
            state.dashboardStats = response.data.data;
            renderDashboard();
            initCharts();
        }
    } catch (error) {
        console.error('Dashboard error:', error);
    }
}

// Initialize Charts (Chart.js)
function initCharts() {
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
                datasets: [{
                    label: 'الإيرادات',
                    data: [120000, 190000, 150000, 220000, 180000, 250000],
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'المصروفات',
                    data: [80000, 110000, 95000, 140000, 120000, 160000],
                    borderColor: 'rgb(239, 68, 68)',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true, position: 'top' }
                }
            }
        });
    }

    // Sales Breakdown Chart
    const salesCtx = document.getElementById('salesChart');
    if (salesCtx) {
        new Chart(salesCtx, {
            type: 'doughnut',
            data: {
                labels: ['منتجات', 'خدمات', 'استشارات', 'أخرى'],
                datasets: [{
                    data: [45, 30, 15, 10],
                    backgroundColor: [
                        'rgb(59, 130, 246)',
                        'rgb(16, 185, 129)',
                        'rgb(245, 158, 11)',
                        'rgb(139, 92, 246)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: true, position: 'bottom' }
                }
            }
        });
    }
}

// Generic CRUD Operations
async function loadData(module, filters = {}) {
    try {
        showLoading();
        const params = new URLSearchParams(filters);
        const response = await api.get(`/${module}?${params}`);
        if (response.data.success) {
            state.currentData = response.data.data;
            state.currentModule = module;
            renderModulePage(module);
        }
    } catch (error) {
        showNotification('خطأ في تحميل البيانات', 'error');
    } finally {
        hideLoading();
    }
}

async function saveData(module, data, id = null) {
    try {
        showLoading();
        const response = id 
            ? await api.put(`/${module}/${id}`, data)
            : await api.post(`/${module}`, data);
        
        if (response.data.success) {
            showNotification(response.data.message || t('success'), 'success');
            loadData(module);
            closeModal();
        }
    } catch (error) {
        showNotification(error.response?.data?.error || t('error'), 'error');
    } finally {
        hideLoading();
    }
}

async function deleteData(module, id) {
    if (!confirm(t('confirm_delete'))) return;
    
    try {
        showLoading();
        const response = await api.delete(`/${module}/${id}`);
        if (response.data.success) {
            showNotification('تم الحذف بنجاح', 'success');
            loadData(module);
        }
    } catch (error) {
        showNotification('خطأ في الحذف', 'error');
    } finally {
        hideLoading();
    }
}

// Profile Pages
async function viewProfile(module, id) {
    try {
        showLoading();
        const response = await api.get(`/${module}/${id}`);
        if (response.data.success) {
            state.currentItem = response.data.data;
            renderProfilePage(module, response.data.data);
        }
    } catch (error) {
        showNotification('خطأ في تحميل البيانات', 'error');
    } finally {
        hideLoading();
    }
}

// Export Functions
function exportToExcel(module) {
    if (!state.currentData || state.currentData.length === 0) {
        showNotification('لا توجد بيانات للتصدير', 'warning');
        return;
    }

    const ws = XLSX.utils.json_to_sheet(state.currentData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, module);
    XLSX.writeFile(wb, `${module}_${new Date().toISOString().split('T')[0]}.xlsx`);
    showNotification('تم التصدير بنجاح', 'success');
}

function exportToPDF(elementId, filename) {
    const element = document.getElementById(elementId);
    if (!element) {
        showNotification('عنصر غير موجود', 'error');
        return;
    }

    html2canvas(element, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
        showNotification('تم التصدير بنجاح', 'success');
    });
}

function printInvoice(invoiceId) {
    const printWindow = window.open('', '_blank');
    const invoiceContent = generateInvoiceHTML(invoiceId);
    printWindow.document.write(invoiceContent);
    printWindow.document.close();
    setTimeout(() => {
        printWindow.print();
    }, 500);
}

function generateInvoiceHTML(invoiceId) {
    // Find invoice data
    const invoice = state.currentData?.find(inv => inv.id === invoiceId);
    if (!invoice) return '';

    return `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
            <meta charset="UTF-8">
            <title>فاتورة ${invoice.invoice_number}</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; }
                .invoice-header { text-align: center; border-bottom: 3px solid #3B82F6; padding-bottom: 20px; margin-bottom: 30px; }
                .invoice-header h1 { color: #3B82F6; font-size: 32px; margin: 0; }
                .invoice-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
                .invoice-details { background: #F3F4F6; padding: 20px; border-radius: 8px; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { padding: 12px; text-align: right; border-bottom: 1px solid #E5E7EB; }
                th { background: #3B82F6; color: white; }
                .total { font-size: 20px; font-weight: bold; text-align: left; }
                .footer { margin-top: 50px; text-align: center; color: #6B7280; border-top: 2px solid #E5E7EB; padding-top: 20px; }
                @media print { body { padding: 20px; } }
            </style>
        </head>
        <body>
            <div class="invoice-header">
                <h1>فاتورة ${invoice.invoice_type === 'sales' ? 'مبيعات' : 'مشتريات'}</h1>
                <p>رقم الفاتورة: <strong>${invoice.invoice_number}</strong></p>
            </div>
            
            <div class="invoice-info">
                <div class="invoice-details">
                    <h3>بيانات الشركة</h3>
                    <p><strong>الاسم:</strong> شركة المثال للتجارة</p>
                    <p><strong>العنوان:</strong> القاهرة - مصر</p>
                    <p><strong>الهاتف:</strong> 01234567890</p>
                </div>
                <div class="invoice-details">
                    <h3>بيانات ${invoice.invoice_type === 'sales' ? 'العميل' : 'المورد'}</h3>
                    <p><strong>الاسم:</strong> ${invoice.party_name || 'غير محدد'}</p>
                    <p><strong>التاريخ:</strong> ${new Date(invoice.invoice_date).toLocaleDateString('ar-EG')}</p>
                </div>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>الصنف</th>
                        <th>الكمية</th>
                        <th>السعر</th>
                        <th>المجموع</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>صنف تجريبي</td>
                        <td>1</td>
                        <td>${(invoice.total_amount || 0).toLocaleString('ar-EG')} ج.م</td>
                        <td>${(invoice.total_amount || 0).toLocaleString('ar-EG')} ج.م</td>
                    </tr>
                </tbody>
            </table>
            
            <div class="total">
                <p>المجموع الكلي: ${(invoice.total_amount || 0).toLocaleString('ar-EG')} ج.م</p>
            </div>
            
            <div class="footer">
                <p>شكراً لتعاملكم معنا</p>
                <p>نظام ERP المتكامل - جميع الحقوق محفوظة © ${new Date().getFullYear()}</p>
            </div>
        </body>
        </html>
    `;
}

// Notifications System
let notificationPolling = null;

function startNotificationPolling() {
    if (notificationPolling) return;
    
    notificationPolling = setInterval(async () => {
        try {
            const response = await api.get('/notifications/unread');
            if (response.data.success && response.data.data.length > 0) {
                state.notifications = response.data.data;
                updateNotificationBadge();
            }
        } catch (error) {
            console.error('Notification polling error:', error);
        }
    }, 30000); // Poll every 30 seconds
}

function stopNotificationPolling() {
    if (notificationPolling) {
        clearInterval(notificationPolling);
        notificationPolling = null;
    }
}

function updateNotificationBadge() {
    const badge = document.getElementById('notificationBadge');
    if (badge) {
        badge.textContent = state.notifications.length;
        badge.style.display = state.notifications.length > 0 ? 'block' : 'none';
    }
}

// UI Helpers
function showNotification(message, type = 'info') {
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
    };
    
    const notification = document.createElement('div');
    notification.className = `fixed top-4 ${state.language === 'ar' ? 'right-4' : 'left-4'} z-50 px-6 py-4 rounded-lg shadow-2xl text-white ${colors[type]} transform transition-all duration-300 animate-slide-in`;
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} text-2xl ${state.language === 'ar' ? 'ml-3' : 'mr-3'}"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('animate-slide-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function showLoading() {
    const loader = document.createElement('div');
    loader.id = 'globalLoader';
    loader.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    loader.innerHTML = `
        <div class="bg-white rounded-2xl p-8 shadow-2xl text-center">
            <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p class="text-gray-700 font-semibold">${t('loading')}</p>
        </div>
    `;
    document.body.appendChild(loader);
}

function hideLoading() {
    const loader = document.getElementById('globalLoader');
    if (loader) loader.remove();
}

function openModal(title, content) {
    const modal = document.getElementById('modal');
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalContent').innerHTML = content;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

// Sidebar Toggle
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('sidebar-hidden');
}

function toggleCategory(category) {
    state.sidebarState[category] = !state.sidebarState[category];
    renderSidebar();
}

// Navigation
function navigateTo(page) {
    state.currentPage = page;
    
    const pageContent = document.getElementById('pageContent');
    if (pageContent) {
        pageContent.innerHTML = '';
    }
    
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        pageTitle.textContent = getPageTitle(page);
    }
    
    if (page === 'dashboard') {
        loadDashboardStats();
    } else {
        loadData(page);
    }
}

function getPageTitle(page) {
    // Search in menu structure
    for (const [key, value] of Object.entries(menuStructure)) {
        if (key === page) {
            return value.label[state.language];
        }
        if (value.subcategories) {
            for (const [subKey, subValue] of Object.entries(value.subcategories)) {
                if (subKey === page) {
                    return subValue.label[state.language];
                }
            }
        }
    }
    return page;
}

// ============================================
// Main Render Function
// ============================================
function render() {
    const app = document.getElementById('app');
    
    if (!state.token) {
        // Show login page
        app.innerHTML = renderLoginPage();
        return;
    }
    
    // Show main application
    app.innerHTML = `
        ${renderSidebar()}
        <div class="main-content">
            ${renderHeader()}
            <div id="pageContent" class="p-6">
                <!-- Dynamic content loaded here -->
            </div>
        </div>
        ${renderNotificationCenter()}
    `;
    
    // Navigate to default page
    if (state.currentPage === 'login') {
        state.currentPage = 'dashboard';
    }
    navigateTo(state.currentPage);
    
    // Start notifications polling
    startNotificationPolling();
}

// ============================================
// Initialize Application
// ============================================
function initApp() {
    // Initialize theme
    initTheme();
    
    // Render application
    render();
}

// Start application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
