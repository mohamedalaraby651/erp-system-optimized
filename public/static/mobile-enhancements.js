/* ============================================
   ERP System - Mobile Enhancements
   نظام ERP - تحسينات الموبايل
   ============================================ */

// ==========================================
// 1. Mobile Detection & Device Info
// ==========================================
const MobileDetect = {
    // Check if device is mobile
    isMobile() {
        return window.innerWidth <= 768 || 
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    
    // Check if device is iOS
    isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    },
    
    // Check if device is Android
    isAndroid() {
        return /Android/i.test(navigator.userAgent);
    },
    
    // Check if standalone PWA
    isStandalone() {
        return window.matchMedia('(display-mode: standalone)').matches ||
               window.navigator.standalone ||
               document.referrer.includes('android-app://');
    },
    
    // Get device orientation
    getOrientation() {
        return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
    }
};

// ==========================================
// 2. Mobile Sidebar Manager
// ==========================================
class MobileSidebar {
    constructor() {
        this.sidebar = null;
        this.overlay = null;
        this.isOpen = false;
        this.init();
    }
    
    init() {
        if (!MobileDetect.isMobile()) return;
        
        this.createMobileSidebar();
        this.createOverlay();
        this.attachEventListeners();
        
        console.log('✅ Mobile Sidebar initialized');
    }
    
    createMobileSidebar() {
        this.sidebar = document.getElementById('sidebar');
        if (!this.sidebar) return;
        
        // Make sidebar fixed and hidden on mobile
        if (window.innerWidth <= 768) {
            this.sidebar.classList.add('mobile-drawer');
        }
    }
    
    createOverlay() {
        // Create overlay element
        this.overlay = document.createElement('div');
        this.overlay.id = 'mobile-overlay';
        this.overlay.className = 'mobile-overlay';
        document.body.appendChild(this.overlay);
        
        // Click overlay to close
        this.overlay.addEventListener('click', () => this.close());
    }
    
    attachEventListeners() {
        // Menu button click
        document.addEventListener('click', (e) => {
            if (e.target.closest('.mobile-menu-btn')) {
                this.toggle();
            }
        });
        
        // Close on navigation
        document.addEventListener('click', (e) => {
            if (e.target.closest('.nav-item')) {
                setTimeout(() => this.close(), 300);
            }
        });
        
        // Swipe to close
        this.addSwipeGesture();
    }
    
    toggle() {
        this.isOpen ? this.close() : this.open();
    }
    
    open() {
        if (!this.sidebar) return;
        
        this.sidebar.classList.add('active');
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        this.isOpen = true;
        
        console.log('📱 Sidebar opened');
    }
    
    close() {
        if (!this.sidebar) return;
        
        this.sidebar.classList.remove('active');
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
        this.isOpen = false;
        
        console.log('📱 Sidebar closed');
    }
    
    addSwipeGesture() {
        let touchStartX = 0;
        let touchEndX = 0;
        
        if (this.sidebar) {
            this.sidebar.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            });
            
            this.sidebar.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe(touchStartX, touchEndX);
            });
        }
    }
    
    handleSwipe(startX, endX) {
        const swipeDistance = endX - startX;
        
        // Swipe left to close (for RTL)
        if (swipeDistance < -50) {
            this.close();
        }
    }
}

// ==========================================
// 3. Mobile Header Manager
// ==========================================
class MobileHeader {
    constructor() {
        this.header = null;
        this.init();
    }
    
    init() {
        if (!MobileDetect.isMobile()) return;
        
        this.createMobileHeader();
        this.handleScroll();
        
        console.log('✅ Mobile Header initialized');
    }
    
    createMobileHeader() {
        // Check if header already exists
        if (document.querySelector('.mobile-header')) return;
        
        const header = document.createElement('div');
        header.className = 'mobile-header';
        header.innerHTML = `
            <button class="mobile-header-btn mobile-menu-btn">
                <i class="fas fa-bars"></i>
            </button>
            <div class="mobile-header-title">نظام ERP</div>
            <button class="mobile-header-btn mobile-notifications-btn">
                <i class="fas fa-bell"></i>
                <span class="notification-badge" style="display: none;">0</span>
            </button>
        `;
        
        document.body.insertBefore(header, document.body.firstChild);
        this.header = header;
        
        // Add notification click handler
        header.querySelector('.mobile-notifications-btn').addEventListener('click', () => {
            this.showNotifications();
        });
    }
    
    handleScroll() {
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (!this.header) return;
            
            // Hide header when scrolling down, show when scrolling up
            if (currentScroll > lastScroll && currentScroll > 100) {
                this.header.style.transform = 'translateY(-100%)';
            } else {
                this.header.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        });
    }
    
    updateTitle(title) {
        if (this.header) {
            const titleElement = this.header.querySelector('.mobile-header-title');
            if (titleElement) {
                titleElement.textContent = title;
            }
        }
    }
    
    updateNotificationBadge(count) {
        if (this.header) {
            const badge = this.header.querySelector('.notification-badge');
            if (badge) {
                if (count > 0) {
                    badge.textContent = count > 99 ? '99+' : count;
                    badge.style.display = 'block';
                } else {
                    badge.style.display = 'none';
                }
            }
        }
    }
    
    showNotifications() {
        // Trigger notification display (integrate with existing notification system)
        if (window.showNotifications) {
            window.showNotifications();
        } else {
            console.log('📱 Show notifications');
            // Fallback: show alert
            alert('الإشعارات ستظهر هنا');
        }
    }
}

// ==========================================
// 4. Touch Gesture Handler
// ==========================================
class TouchGestureHandler {
    constructor() {
        this.init();
    }
    
    init() {
        if (!MobileDetect.isMobile()) return;
        
        this.addPullToRefresh();
        this.addSwipeActions();
        this.improveScrolling();
        
        console.log('✅ Touch Gestures initialized');
    }
    
    addPullToRefresh() {
        let touchStartY = 0;
        let touchEndY = 0;
        let isPulling = false;
        
        document.addEventListener('touchstart', (e) => {
            if (window.pageYOffset === 0) {
                touchStartY = e.touches[0].clientY;
            }
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            if (window.pageYOffset === 0) {
                touchEndY = e.touches[0].clientY;
                const pullDistance = touchEndY - touchStartY;
                
                if (pullDistance > 80 && !isPulling) {
                    isPulling = true;
                    this.triggerRefresh();
                }
            }
        }, { passive: true });
        
        document.addEventListener('touchend', () => {
            touchStartY = 0;
            touchEndY = 0;
            isPulling = false;
        }, { passive: true });
    }
    
    triggerRefresh() {
        console.log('🔄 Pull to refresh triggered');
        
        // Show refresh indicator
        const indicator = document.createElement('div');
        indicator.className = 'ptr-indicator active';
        indicator.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i>';
        document.body.appendChild(indicator);
        
        // Reload current page data
        setTimeout(() => {
            if (window.location.hash) {
                // Reload current section
                window.render();
            } else {
                // Reload dashboard
                if (window.loadDashboardProgressively) {
                    window.loadDashboardProgressively();
                }
            }
            
            indicator.remove();
        }, 1000);
    }
    
    addSwipeActions() {
        // Add swipe-to-delete on list items
        document.addEventListener('touchstart', (e) => {
            const item = e.target.closest('.swipeable-item');
            if (!item) return;
            
            let touchStartX = e.touches[0].clientX;
            let currentX = touchStartX;
            
            const handleMove = (e) => {
                currentX = e.touches[0].clientX;
                const diff = currentX - touchStartX;
                
                if (diff < 0) {
                    item.style.transform = `translateX(${diff}px)`;
                }
            };
            
            const handleEnd = () => {
                const diff = currentX - touchStartX;
                
                if (diff < -100) {
                    // Show delete button
                    item.classList.add('show-delete');
                } else {
                    item.style.transform = '';
                }
                
                document.removeEventListener('touchmove', handleMove);
                document.removeEventListener('touchend', handleEnd);
            };
            
            document.addEventListener('touchmove', handleMove);
            document.addEventListener('touchend', handleEnd);
        });
    }
    
    improveScrolling() {
        // Smooth scroll for all scroll containers
        document.querySelectorAll('.scroll-container').forEach(container => {
            container.style.webkitOverflowScrolling = 'touch';
        });
    }
}

// ==========================================
// 5. Mobile Form Enhancements
// ==========================================
class MobileFormEnhancer {
    constructor() {
        this.init();
    }
    
    init() {
        if (!MobileDetect.isMobile()) return;
        
        this.preventZoom();
        this.improveInputs();
        this.addVirtualKeyboardHandling();
        
        console.log('✅ Mobile Form Enhancements initialized');
    }
    
    preventZoom() {
        // Prevent zoom on input focus (iOS)
        document.querySelectorAll('input, textarea, select').forEach(input => {
            // Ensure font size is at least 16px to prevent zoom
            const computedStyle = window.getComputedStyle(input);
            const fontSize = parseInt(computedStyle.fontSize);
            
            if (fontSize < 16) {
                input.style.fontSize = '16px';
            }
        });
    }
    
    improveInputs() {
        // Add proper input types for mobile keyboards
        document.querySelectorAll('input').forEach(input => {
            // Email inputs
            if (input.name && input.name.includes('email')) {
                input.type = 'email';
            }
            
            // Phone inputs
            if (input.name && (input.name.includes('phone') || input.name.includes('tel'))) {
                input.type = 'tel';
            }
            
            // Number inputs
            if (input.name && (input.name.includes('price') || input.name.includes('amount'))) {
                input.type = 'number';
                input.inputMode = 'decimal';
            }
        });
    }
    
    addVirtualKeyboardHandling() {
        // Handle virtual keyboard appearance
        let originalHeight = window.innerHeight;
        
        window.addEventListener('resize', () => {
            const currentHeight = window.innerHeight;
            const heightDiff = originalHeight - currentHeight;
            
            // Keyboard is open if height decreased significantly
            if (heightDiff > 150) {
                document.body.classList.add('keyboard-open');
                
                // Scroll active input into view
                const activeElement = document.activeElement;
                if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
                    setTimeout(() => {
                        activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 300);
                }
            } else {
                document.body.classList.remove('keyboard-open');
            }
        });
    }
}

// ==========================================
// 6. Mobile Table Enhancer
// ==========================================
class MobileTableEnhancer {
    constructor() {
        this.init();
    }
    
    init() {
        if (!MobileDetect.isMobile()) return;
        
        this.enhanceTables();
        
        console.log('✅ Mobile Tables enhanced');
    }
    
    enhanceTables() {
        document.querySelectorAll('table').forEach(table => {
            // Add data-label attributes for mobile view
            const headers = table.querySelectorAll('thead th');
            const rows = table.querySelectorAll('tbody tr');
            
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                cells.forEach((cell, index) => {
                    if (headers[index]) {
                        cell.setAttribute('data-label', headers[index].textContent.trim());
                    }
                });
            });
            
            // Make table scrollable horizontally as fallback
            if (!table.parentElement.classList.contains('table-responsive')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'table-responsive scroll-x-mobile';
                table.parentNode.insertBefore(wrapper, table);
                wrapper.appendChild(table);
            }
        });
    }
}

// ==========================================
// 7. Mobile PWA Install Prompt
// ==========================================
class MobilePWAInstaller {
    constructor() {
        this.deferredPrompt = null;
        this.init();
    }
    
    init() {
        if (!MobileDetect.isMobile()) return;
        
        this.listenForInstallPrompt();
        this.checkIfInstalled();
        
        console.log('✅ PWA Installer initialized');
    }
    
    listenForInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });
        
        window.addEventListener('appinstalled', () => {
            console.log('✅ PWA installed successfully');
            this.hideInstallButton();
        });
    }
    
    showInstallButton() {
        // Create install button
        const installBtn = document.createElement('button');
        installBtn.id = 'pwa-install-btn';
        installBtn.className = 'fab';
        installBtn.innerHTML = '<i class="fas fa-download"></i>';
        installBtn.title = 'تثبيت التطبيق';
        
        installBtn.addEventListener('click', () => {
            this.promptInstall();
        });
        
        document.body.appendChild(installBtn);
    }
    
    hideInstallButton() {
        const installBtn = document.getElementById('pwa-install-btn');
        if (installBtn) {
            installBtn.remove();
        }
    }
    
    async promptInstall() {
        if (!this.deferredPrompt) return;
        
        this.deferredPrompt.prompt();
        
        const { outcome } = await this.deferredPrompt.userChoice;
        console.log(`User response to install prompt: ${outcome}`);
        
        this.deferredPrompt = null;
        this.hideInstallButton();
    }
    
    checkIfInstalled() {
        if (MobileDetect.isStandalone()) {
            console.log('✅ App is running in standalone mode (installed)');
            document.body.classList.add('pwa-installed');
        }
    }
}

// ==========================================
// 8. Mobile Performance Monitor
// ==========================================
class MobilePerformanceMonitor {
    constructor() {
        this.init();
    }
    
    init() {
        if (!MobileDetect.isMobile()) return;
        
        this.monitorFPS();
        this.monitorMemory();
        
        console.log('✅ Performance Monitor initialized');
    }
    
    monitorFPS() {
        let lastTime = performance.now();
        let frames = 0;
        
        const checkFPS = () => {
            frames++;
            const currentTime = performance.now();
            
            if (currentTime >= lastTime + 1000) {
                const fps = Math.round((frames * 1000) / (currentTime - lastTime));
                
                // Warn if FPS is low
                if (fps < 30) {
                    console.warn(`⚠️ Low FPS detected: ${fps}`);
                }
                
                frames = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(checkFPS);
        };
        
        requestAnimationFrame(checkFPS);
    }
    
    monitorMemory() {
        if ('memory' in performance) {
            setInterval(() => {
                const used = Math.round(performance.memory.usedJSHeapSize / 1048576);
                const limit = Math.round(performance.memory.jsHeapSizeLimit / 1048576);
                
                // Warn if memory usage is high
                if (used / limit > 0.9) {
                    console.warn(`⚠️ High memory usage: ${used}MB / ${limit}MB`);
                }
            }, 10000);
        }
    }
}

// ==========================================
// 9. Mobile Orientation Handler
// ==========================================
class MobileOrientationHandler {
    constructor() {
        this.init();
    }
    
    init() {
        if (!MobileDetect.isMobile()) return;
        
        window.addEventListener('orientationchange', () => {
            this.handleOrientationChange();
        });
        
        console.log('✅ Orientation Handler initialized');
    }
    
    handleOrientationChange() {
        const orientation = MobileDetect.getOrientation();
        console.log(`📱 Orientation changed to: ${orientation}`);
        
        document.body.classList.remove('portrait', 'landscape');
        document.body.classList.add(orientation);
        
        // Reload layout if needed
        setTimeout(() => {
            if (window.render) {
                window.render();
            }
        }, 300);
    }
}

// ==========================================
// 10. Initialize All Mobile Features
// ==========================================
class MobileApp {
    constructor() {
        this.sidebar = null;
        this.header = null;
        this.gestures = null;
        this.forms = null;
        this.tables = null;
        this.pwa = null;
        this.performance = null;
        this.orientation = null;
    }
    
    init() {
        if (!MobileDetect.isMobile()) {
            console.log('ℹ️ Desktop mode detected - Mobile features disabled');
            return;
        }
        
        console.log('📱 Initializing Mobile App...');
        console.log(`Device: ${MobileDetect.isIOS() ? 'iOS' : MobileDetect.isAndroid() ? 'Android' : 'Other'}`);
        console.log(`Standalone: ${MobileDetect.isStandalone() ? 'Yes' : 'No'}`);
        
        // Initialize all mobile features
        this.sidebar = new MobileSidebar();
        this.header = new MobileHeader();
        this.gestures = new TouchGestureHandler();
        this.forms = new MobileFormEnhancer();
        this.tables = new MobileTableEnhancer();
        this.pwa = new MobilePWAInstaller();
        this.performance = new MobilePerformanceMonitor();
        this.orientation = new MobileOrientationHandler();
        
        // Add mobile class to body
        document.body.classList.add('mobile-device');
        
        console.log('✅ Mobile App initialized successfully!');
    }
    
    updateHeaderTitle(title) {
        if (this.header) {
            this.header.updateTitle(title);
        }
    }
    
    updateNotifications(count) {
        if (this.header) {
            this.header.updateNotificationBadge(count);
        }
    }
}

// ==========================================
// Initialize Mobile App
// ==========================================
const mobileApp = new MobileApp();

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        mobileApp.init();
    });
} else {
    mobileApp.init();
}

// Export for use in other scripts
window.MobileApp = mobileApp;
window.MobileDetect = MobileDetect;

console.log('📱 Mobile Enhancements script loaded');
