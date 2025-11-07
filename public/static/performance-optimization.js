// ============================================
// Performance Optimization Module
// تحسينات الأداء - Lazy Loading, Caching, etc.
// ============================================

// ============================================
// 1. Lazy Loading للصور باستخدام Intersection Observer
// ============================================

class LazyImageLoader {
    constructor() {
        this.imageObserver = null;
        this.init();
    }

    init() {
        // تحقق من دعم Intersection Observer
        if ('IntersectionObserver' in window) {
            this.imageObserver = new IntersectionObserver(
                (entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            this.loadImage(img);
                            observer.unobserve(img);
                        }
                    });
                },
                {
                    root: null,
                    rootMargin: '50px', // تحميل الصور قبل 50px من ظهورها
                    threshold: 0.01
                }
            );

            this.observeImages();
        } else {
            // Fallback للمتصفحات القديمة
            this.loadAllImages();
        }
    }

    observeImages() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            this.imageObserver.observe(img);
        });
    }

    loadImage(img) {
        const src = img.getAttribute('data-src');
        const srcset = img.getAttribute('data-srcset');
        
        if (!src) return;

        // إضافة placeholder أو blur effect
        img.style.filter = 'blur(5px)';
        img.style.transition = 'filter 0.3s';

        // تحميل الصورة
        img.src = src;
        if (srcset) {
            img.srcset = srcset;
        }

        img.onload = () => {
            img.style.filter = 'none';
            img.classList.add('loaded');
            img.removeAttribute('data-src');
            img.removeAttribute('data-srcset');
        };

        img.onerror = () => {
            img.style.filter = 'none';
            // يمكن إضافة صورة placeholder عند الفشل
            console.error('Failed to load image:', src);
        };
    }

    loadAllImages() {
        // Fallback: تحميل كل الصور مباشرة
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => this.loadImage(img));
    }

    // إضافة صور جديدة للمراقبة
    observe(selector) {
        if (!this.imageObserver) return;
        
        const images = document.querySelectorAll(selector);
        images.forEach(img => {
            if (img.hasAttribute('data-src')) {
                this.imageObserver.observe(img);
            }
        });
    }
}

// ============================================
// 2. Data Caching Layer
// ============================================

class DataCache {
    constructor(maxAge = 5 * 60 * 1000) { // 5 minutes default
        this.cache = new Map();
        this.maxAge = maxAge;
    }

    set(key, data, customMaxAge = null) {
        this.cache.set(key, {
            data: data,
            timestamp: Date.now(),
            maxAge: customMaxAge || this.maxAge
        });
    }

    get(key) {
        const cached = this.cache.get(key);
        
        if (!cached) return null;
        
        const age = Date.now() - cached.timestamp;
        
        if (age > cached.maxAge) {
            this.cache.delete(key);
            return null;
        }
        
        return cached.data;
    }

    has(key) {
        return this.get(key) !== null;
    }

    clear() {
        this.cache.clear();
    }

    remove(key) {
        this.cache.delete(key);
    }

    // حذف العناصر المنتهية الصلاحية
    cleanup() {
        const now = Date.now();
        for (const [key, value] of this.cache.entries()) {
            if (now - value.timestamp > value.maxAge) {
                this.cache.delete(key);
            }
        }
    }
}

// ============================================
// 3. Debounce و Throttle للأداء
// ============================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================
// 4. Skeleton Screen Loader
// ============================================

const SkeletonLoader = {
    create(type = 'card') {
        const skeletons = {
            card: `
                <div class="skeleton-card animate-pulse">
                    <div class="skeleton-image bg-gray-300 rounded-lg h-48 mb-4"></div>
                    <div class="skeleton-text bg-gray-300 rounded h-4 mb-2"></div>
                    <div class="skeleton-text bg-gray-300 rounded h-4 w-3/4"></div>
                </div>
            `,
            table: `
                <div class="skeleton-table animate-pulse">
                    <div class="skeleton-row bg-gray-300 rounded h-12 mb-2"></div>
                    <div class="skeleton-row bg-gray-200 rounded h-10 mb-2"></div>
                    <div class="skeleton-row bg-gray-200 rounded h-10 mb-2"></div>
                    <div class="skeleton-row bg-gray-200 rounded h-10 mb-2"></div>
                </div>
            `,
            list: `
                <div class="skeleton-list animate-pulse">
                    <div class="skeleton-item flex items-center mb-4">
                        <div class="skeleton-avatar bg-gray-300 rounded-full w-12 h-12 ml-4"></div>
                        <div class="flex-1">
                            <div class="skeleton-text bg-gray-300 rounded h-4 mb-2"></div>
                            <div class="skeleton-text bg-gray-200 rounded h-3 w-2/3"></div>
                        </div>
                    </div>
                </div>
            `,
            text: `
                <div class="skeleton-text-block animate-pulse">
                    <div class="skeleton-line bg-gray-300 rounded h-4 mb-2"></div>
                    <div class="skeleton-line bg-gray-300 rounded h-4 mb-2"></div>
                    <div class="skeleton-line bg-gray-300 rounded h-4 w-3/4"></div>
                </div>
            `
        };

        return skeletons[type] || skeletons.card;
    },

    show(container, type = 'card', count = 1) {
        if (typeof container === 'string') {
            container = document.querySelector(container);
        }
        
        if (!container) return;

        const skeletonHTML = Array(count).fill(this.create(type)).join('');
        container.innerHTML = skeletonHTML;
    },

    hide(container) {
        if (typeof container === 'string') {
            container = document.querySelector(container);
        }
        
        if (!container) return;
        
        container.innerHTML = '';
    }
};

// ============================================
// 5. Progressive Data Loading
// ============================================

class ProgressiveLoader {
    constructor() {
        this.loading = false;
        this.hasMore = true;
        this.currentOffset = 0;
        this.limit = 20;
    }

    async loadMore(endpoint, onDataReceived, onError) {
        if (this.loading || !this.hasMore) return;

        this.loading = true;

        try {
            const response = await axios.get(endpoint, {
                params: {
                    limit: this.limit,
                    offset: this.currentOffset
                },
                headers: {
                    'Authorization': `Bearer ${state.token}`
                }
            });

            if (response.data.success) {
                const data = response.data.data;
                this.currentOffset += this.limit;
                
                if (response.data.pagination) {
                    this.hasMore = response.data.pagination.hasMore;
                } else {
                    this.hasMore = data.length === this.limit;
                }

                onDataReceived(data, this.hasMore);
            } else {
                throw new Error(response.data.error);
            }
        } catch (error) {
            console.error('Progressive loading error:', error);
            if (onError) onError(error);
        } finally {
            this.loading = false;
        }
    }

    reset() {
        this.loading = false;
        this.hasMore = true;
        this.currentOffset = 0;
    }
}

// ============================================
// 6. Infinite Scroll Handler
// ============================================

class InfiniteScroll {
    constructor(container, loader, options = {}) {
        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        this.loader = loader;
        this.options = {
            threshold: options.threshold || 200, // pixels from bottom
            onLoad: options.onLoad || (() => {}),
            onError: options.onError || (() => {})
        };
        
        this.init();
    }

    init() {
        this.scrollHandler = throttle(() => {
            const scrollTop = this.container.scrollTop;
            const scrollHeight = this.container.scrollHeight;
            const clientHeight = this.container.clientHeight;
            
            const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
            
            if (distanceFromBottom < this.options.threshold && !this.loader.loading && this.loader.hasMore) {
                this.options.onLoad();
            }
        }, 200);

        this.container.addEventListener('scroll', this.scrollHandler);
    }

    destroy() {
        this.container.removeEventListener('scroll', this.scrollHandler);
    }
}

// ============================================
// 7. Resource Preloading
// ============================================

const ResourcePreloader = {
    preloadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    },

    preloadImages(sources) {
        return Promise.all(sources.map(src => this.preloadImage(src)));
    },

    preloadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    },

    prefetchData(url) {
        // استخدام fetch API مع cache
        return fetch(url, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        })
        .then(response => response.json())
        .catch(error => console.error('Prefetch error:', error));
    }
};

// ============================================
// 8. Performance Monitoring
// ============================================

const PerformanceMonitor = {
    marks: {},

    start(name) {
        this.marks[name] = performance.now();
    },

    end(name) {
        if (!this.marks[name]) {
            console.warn(`No start mark found for: ${name}`);
            return null;
        }

        const duration = performance.now() - this.marks[name];
        delete this.marks[name];
        
        console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
        return duration;
    },

    measure(name, callback) {
        this.start(name);
        const result = callback();
        this.end(name);
        return result;
    },

    async measureAsync(name, callback) {
        this.start(name);
        const result = await callback();
        this.end(name);
        return result;
    }
};

// ============================================
// Initialize Global Objects
// ============================================

// إنشاء instances عامة
window.lazyImageLoader = new LazyImageLoader();
window.dataCache = new DataCache();
window.SkeletonLoader = SkeletonLoader;
window.ProgressiveLoader = ProgressiveLoader;
window.InfiniteScroll = InfiniteScroll;
window.ResourcePreloader = ResourcePreloader;
window.PerformanceMonitor = PerformanceMonitor;
window.debounce = debounce;
window.throttle = throttle;

// تنظيف الـ cache كل 10 دقائق
setInterval(() => {
    window.dataCache.cleanup();
}, 10 * 60 * 1000);

console.log('✅ Performance Optimization Module loaded successfully');
