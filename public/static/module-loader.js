// ============================================
// Dynamic Module Loader
// تحميل ديناميكي للوحدات - Code Splitting
// ============================================

class ModuleLoader {
    constructor() {
        this.loadedModules = new Set();
        this.loadingModules = new Map();
        this.moduleCache = new Map();
    }

    /**
     * تحميل module بشكل ديناميكي
     * @param {string} moduleName - اسم الوحدة
     * @param {string} modulePath - مسار الملف
     * @returns {Promise<any>}
     */
    async loadModule(moduleName, modulePath) {
        // إذا كانت الوحدة محملة مسبقاً
        if (this.loadedModules.has(moduleName)) {
            console.log(`✅ Module ${moduleName} already loaded`);
            return this.moduleCache.get(moduleName);
        }

        // إذا كانت الوحدة قيد التحميل حالياً
        if (this.loadingModules.has(moduleName)) {
            console.log(`⏳ Module ${moduleName} is loading...`);
            return this.loadingModules.get(moduleName);
        }

        // بدء تحميل الوحدة
        console.log(`🔄 Loading module: ${moduleName}`);
        PerformanceMonitor.start(`load-${moduleName}`);

        const loadPromise = this.loadScript(modulePath)
            .then(() => {
                this.loadedModules.add(moduleName);
                this.loadingModules.delete(moduleName);
                
                const duration = PerformanceMonitor.end(`load-${moduleName}`);
                console.log(`✅ Module ${moduleName} loaded successfully in ${duration}ms`);
                
                // حفظ في الكاش
                const moduleExport = window[moduleName];
                this.moduleCache.set(moduleName, moduleExport);
                
                return moduleExport;
            })
            .catch(error => {
                this.loadingModules.delete(moduleName);
                console.error(`❌ Failed to load module ${moduleName}:`, error);
                throw error;
            });

        this.loadingModules.set(moduleName, loadPromise);
        return loadPromise;
    }

    /**
     * تحميل script بشكل ديناميكي
     * @param {string} src - مسار الملف
     * @returns {Promise<void>}
     */
    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
            
            document.head.appendChild(script);
        });
    }

    /**
     * تحميل CSS بشكل ديناميكي
     * @param {string} href - مسار الملف
     * @returns {Promise<void>}
     */
    loadCSS(href) {
        return new Promise((resolve, reject) => {
            // تحقق من أن الملف ليس محملاً مسبقاً
            const existingLink = document.querySelector(`link[href="${href}"]`);
            if (existingLink) {
                resolve();
                return;
            }

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            
            link.onload = () => resolve();
            link.onerror = () => reject(new Error(`Failed to load CSS: ${href}`));
            
            document.head.appendChild(link);
        });
    }

    /**
     * تحميل عدة modules
     * @param {Array<{name: string, path: string}>} modules
     * @returns {Promise<Array>}
     */
    async loadModules(modules) {
        return Promise.all(
            modules.map(({ name, path }) => this.loadModule(name, path))
        );
    }

    /**
     * Pre-load modules في الخلفية
     * @param {Array<{name: string, path: string}>} modules
     */
    preloadModules(modules) {
        // استخدام requestIdleCallback للتحميل في الخلفية
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                modules.forEach(({ name, path }) => {
                    this.loadModule(name, path).catch(() => {
                        // تجاهل الأخطاء في preload
                    });
                });
            });
        } else {
            setTimeout(() => {
                modules.forEach(({ name, path }) => {
                    this.loadModule(name, path).catch(() => {});
                });
            }, 1000);
        }
    }

    /**
     * إزالة module من الذاكرة
     * @param {string} moduleName
     */
    unloadModule(moduleName) {
        this.loadedModules.delete(moduleName);
        this.moduleCache.delete(moduleName);
        console.log(`🗑️ Module ${moduleName} unloaded`);
    }

    /**
     * تنظيف الذاكرة
     */
    clearCache() {
        this.loadedModules.clear();
        this.moduleCache.clear();
        this.loadingModules.clear();
        console.log('🗑️ Module cache cleared');
    }
}

// ============================================
// Route-based Code Splitting
// ============================================

const RouteModules = {
    // تعريف الوحدات المطلوبة لكل صفحة
    modules: {
        'dashboard': [
            { name: 'ChartModule', path: '/static/modules/charts.js' }
        ],
        'employees': [
            { name: 'EmployeeModule', path: '/static/modules/employees.js' }
        ],
        'clients': [
            { name: 'ClientModule', path: '/static/modules/clients.js' }
        ],
        'invoices': [
            { name: 'InvoiceModule', path: '/static/modules/invoices.js' }
        ],
        'reports': [
            { name: 'ReportModule', path: '/static/modules/reports.js' },
            { name: 'ChartModule', path: '/static/modules/charts.js' }
        ]
    },

    /**
     * تحميل الوحدات المطلوبة للصفحة
     * @param {string} routeName
     * @returns {Promise<void>}
     */
    async loadForRoute(routeName) {
        const modules = this.modules[routeName];
        
        if (!modules || modules.length === 0) {
            console.log(`ℹ️ No modules required for route: ${routeName}`);
            return;
        }

        console.log(`📦 Loading modules for route: ${routeName}`);
        
        try {
            await window.moduleLoader.loadModules(modules);
            console.log(`✅ All modules loaded for route: ${routeName}`);
        } catch (error) {
            console.error(`❌ Failed to load modules for route ${routeName}:`, error);
            throw error;
        }
    },

    /**
     * Preload modules للصفحات المتوقعة
     * @param {Array<string>} routes
     */
    preloadForRoutes(routes) {
        const allModules = [];
        
        routes.forEach(route => {
            const routeModules = this.modules[route];
            if (routeModules) {
                allModules.push(...routeModules);
            }
        });

        // إزالة التكرارات
        const uniqueModules = Array.from(
            new Map(allModules.map(m => [m.name, m])).values()
        );

        window.moduleLoader.preloadModules(uniqueModules);
    }
};

// ============================================
// Component Lazy Loader
// ============================================

const ComponentLoader = {
    /**
     * تحميل component بشكل ديناميكي عند الحاجة
     * @param {string} componentName
     * @param {HTMLElement} container
     * @param {Object} props
     */
    async loadComponent(componentName, container, props = {}) {
        try {
            // عرض skeleton loader
            SkeletonLoader.show(container, 'card');

            // تحميل الـ component
            const componentPath = `/static/components/${componentName}.js`;
            await window.moduleLoader.loadModule(componentName, componentPath);

            // الحصول على الـ component
            const Component = window[componentName];
            
            if (!Component) {
                throw new Error(`Component ${componentName} not found`);
            }

            // render الـ component
            if (typeof Component.render === 'function') {
                const html = Component.render(props);
                container.innerHTML = html;
                
                // استدعاء lifecycle method
                if (typeof Component.mounted === 'function') {
                    Component.mounted(container, props);
                }
            } else {
                throw new Error(`Component ${componentName} has no render method`);
            }

            console.log(`✅ Component ${componentName} loaded and rendered`);
        } catch (error) {
            console.error(`❌ Failed to load component ${componentName}:`, error);
            container.innerHTML = `
                <div class="text-center py-8">
                    <i class="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
                    <p class="text-red-600">فشل تحميل المكون</p>
                </div>
            `;
        }
    }
};

// ============================================
// Initialize
// ============================================

window.moduleLoader = new ModuleLoader();
window.RouteModules = RouteModules;
window.ComponentLoader = ComponentLoader;

// Preload critical modules بعد تحميل الصفحة
window.addEventListener('load', () => {
    // Preload modules للصفحات الأكثر استخداماً
    RouteModules.preloadForRoutes(['dashboard', 'employees', 'clients']);
});

console.log('✅ Module Loader initialized successfully');
