// ============================================
// Enhanced Login Page with User Guide
// صفحة تسجيل دخول محسّنة مع دليل الاستخدام
// ============================================

// Enhanced Login Page Rendering
function renderEnhancedLoginPage() {
    return `
        <div class="login-container">
            <!-- Animated Background -->
            <div class="login-background">
                <div class="animated-shapes">
                    <div class="shape shape-1"></div>
                    <div class="shape shape-2"></div>
                    <div class="shape shape-3"></div>
                    <div class="shape shape-4"></div>
                    <div class="shape shape-5"></div>
                </div>
            </div>
            
            <!-- Login Content -->
            <div class="login-content">
                <!-- Logo & Welcome Section -->
                <div class="login-header animate-fade-in">
                    <div class="logo-container">
                        <div class="logo-circle">
                            <i class="fas fa-building"></i>
                        </div>
                        <div class="logo-pulse"></div>
                    </div>
                    <h1 class="login-title">${t('system_title') || 'نظام ERP المتكامل'}</h1>
                    <p class="login-subtitle">${t('system_subtitle') || 'إدارة شاملة لجميع عمليات الشركة'}</p>
                </div>
                
                <!-- Login Form Card -->
                <div class="login-card animate-slide-up">
                    <div class="card-glow"></div>
                    
                    <!-- Tabs: Login / User Guide -->
                    <div class="login-tabs">
                        <button class="login-tab active" onclick="switchLoginTab('login')">
                            <i class="fas fa-sign-in-alt ml-2"></i>
                            <span>تسجيل الدخول</span>
                        </button>
                        <button class="login-tab" onclick="switchLoginTab('guide')">
                            <i class="fas fa-book-open ml-2"></i>
                            <span>دليل الاستخدام</span>
                        </button>
                    </div>
                    
                    <!-- Login Form Tab -->
                    <div id="loginFormTab" class="tab-content active">
                        <form id="loginForm" class="login-form" onsubmit="event.preventDefault(); handleEnhancedLogin();">
                            <!-- Username Input -->
                            <div class="input-wrapper">
                                <div class="input-icon">
                                    <i class="fas fa-user"></i>
                                </div>
                                <input 
                                    type="text" 
                                    id="username" 
                                    class="login-input" 
                                    placeholder="اسم المستخدم"
                                    required
                                    autocomplete="username"
                                    dir="auto">
                                <div class="input-border"></div>
                            </div>
                            
                            <!-- Password Input -->
                            <div class="input-wrapper">
                                <div class="input-icon">
                                    <i class="fas fa-lock"></i>
                                </div>
                                <input 
                                    type="password" 
                                    id="password" 
                                    class="login-input" 
                                    placeholder="كلمة المرور"
                                    required
                                    autocomplete="current-password"
                                    dir="auto">
                                <button type="button" class="toggle-password" onclick="togglePasswordVisibility()">
                                    <i class="fas fa-eye" id="passwordToggleIcon"></i>
                                </button>
                                <div class="input-border"></div>
                            </div>
                            
                            <!-- Remember Me & Forgot Password -->
                            <div class="login-options">
                                <label class="remember-me">
                                    <input type="checkbox" id="rememberMe">
                                    <span class="checkmark"></span>
                                    <span>تذكرني</span>
                                </label>
                                <a href="#" class="forgot-password" onclick="showForgotPassword(); return false;">
                                    نسيت كلمة المرور؟
                                </a>
                            </div>
                            
                            <!-- Login Button -->
                            <button type="submit" class="login-button">
                                <span class="button-text">
                                    <i class="fas fa-sign-in-alt ml-2"></i>
                                    دخول
                                </span>
                                <div class="button-loader" style="display: none;">
                                    <div class="spinner"></div>
                                </div>
                            </button>
                            
                            <!-- Demo Credentials Info -->
                            <div class="demo-info">
                                <div class="demo-badge">
                                    <i class="fas fa-info-circle ml-1"></i>
                                    حساب تجريبي
                                </div>
                                <div class="demo-credentials">
                                    <div class="credential-item">
                                        <span class="credential-label">المستخدم:</span>
                                        <code class="credential-value" onclick="copyToClipboard('Mohamed')">Mohamed</code>
                                    </div>
                                    <div class="credential-item">
                                        <span class="credential-label">كلمة المرور:</span>
                                        <code class="credential-value" onclick="copyToClipboard('Mohamed@123')">Mohamed@123</code>
                                    </div>
                                    <p class="demo-hint">
                                        <i class="fas fa-mouse-pointer ml-1"></i>
                                        انقر على البيانات للنسخ
                                    </p>
                                </div>
                            </div>
                            
                            <!-- Quick Fill Button -->
                            <button type="button" class="quick-fill-button" onclick="quickFillLogin()">
                                <i class="fas fa-bolt ml-2"></i>
                                ملء سريع للبيانات التجريبية
                            </button>
                        </form>
                    </div>
                    
                    <!-- User Guide Tab -->
                    <div id="userGuideTab" class="tab-content">
                        ${renderUserGuide()}
                    </div>
                </div>
                
                <!-- Features Showcase -->
                <div class="features-showcase animate-fade-in-up">
                    <div class="feature-item">
                        <div class="feature-icon">
                            <i class="fas fa-shield-alt"></i>
                        </div>
                        <div class="feature-text">
                            <h4>أمان عالي</h4>
                            <p>تشفير متقدم</p>
                        </div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">
                            <i class="fas fa-bolt"></i>
                        </div>
                        <div class="feature-text">
                            <h4>سريع</h4>
                            <p>أداء ممتاز</p>
                        </div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">
                            <i class="fas fa-mobile-alt"></i>
                        </div>
                        <div class="feature-text">
                            <h4>متجاوب</h4>
                            <p>جميع الأجهزة</p>
                        </div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">
                            <i class="fas fa-globe"></i>
                        </div>
                        <div class="feature-text">
                            <h4>متعدد اللغات</h4>
                            <p>عربي/إنجليزي</p>
                        </div>
                    </div>
                </div>
                
                <!-- Footer -->
                <div class="login-footer animate-fade-in">
                    <p>© ${new Date().getFullYear()} نظام ERP المتكامل. جميع الحقوق محفوظة.</p>
                    <div class="footer-links">
                        <a href="#" onclick="showPrivacyPolicy(); return false;">سياسة الخصوصية</a>
                        <span>•</span>
                        <a href="#" onclick="showTerms(); return false;">شروط الاستخدام</a>
                        <span>•</span>
                        <a href="#" onclick="showSupport(); return false;">الدعم الفني</a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// User Guide Content
function renderUserGuide() {
    return `
        <div class="user-guide">
            <div class="guide-header">
                <i class="fas fa-book-reader guide-icon"></i>
                <h3>مرحباً بك في نظام ERP المتكامل</h3>
                <p>دليل شامل للبدء باستخدام النظام</p>
            </div>
            
            <!-- Quick Start Steps -->
            <div class="guide-section">
                <h4><i class="fas fa-rocket ml-2"></i>البدء السريع</h4>
                <div class="steps-container">
                    <div class="step-item">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <h5>تسجيل الدخول</h5>
                            <p>استخدم البيانات التجريبية المتوفرة للدخول إلى النظام</p>
                        </div>
                    </div>
                    <div class="step-item">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <h5>استكشف لوحة التحكم</h5>
                            <p>شاهد الإحصائيات والرسوم البيانية التفاعلية</p>
                        </div>
                    </div>
                    <div class="step-item">
                        <div class="step-number">3</div>
                        <div class="step-content">
                            <h5>تصفح الأقسام</h5>
                            <p>انتقل بين أقسام HR والمبيعات والمشتريات والإدارة</p>
                        </div>
                    </div>
                    <div class="step-item">
                        <div class="step-number">4</div>
                        <div class="step-content">
                            <h5>جرّب الميزات</h5>
                            <p>أضف، عدّل، احذف البيانات وجرّب التصدير والطباعة</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Main Features -->
            <div class="guide-section">
                <h4><i class="fas fa-star ml-2"></i>الميزات الرئيسية</h4>
                <div class="features-grid">
                    <div class="feature-card">
                        <i class="fas fa-users feature-card-icon"></i>
                        <h5>إدارة الموارد البشرية</h5>
                        <p>الموظفين، الحضور، الرواتب، الإجازات</p>
                    </div>
                    <div class="feature-card">
                        <i class="fas fa-shopping-cart feature-card-icon"></i>
                        <h5>إدارة المبيعات</h5>
                        <p>العملاء، الفواتير، العقود، CRM</p>
                    </div>
                    <div class="feature-card">
                        <i class="fas fa-truck feature-card-icon"></i>
                        <h5>إدارة المشتريات</h5>
                        <p>الموردين، أوامر الشراء، المخزون</p>
                    </div>
                    <div class="feature-card">
                        <i class="fas fa-chart-line feature-card-icon"></i>
                        <h5>التقارير والرسوم</h5>
                        <p>رسوم بيانية تفاعلية وتقارير تفصيلية</p>
                    </div>
                </div>
            </div>
            
            <!-- Keyboard Shortcuts -->
            <div class="guide-section">
                <h4><i class="fas fa-keyboard ml-2"></i>اختصارات لوحة المفاتيح</h4>
                <div class="shortcuts-list">
                    <div class="shortcut-item">
                        <kbd>Ctrl</kbd> + <kbd>K</kbd>
                        <span>البحث السريع</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Ctrl</kbd> + <kbd>N</kbd>
                        <span>إضافة جديد</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Ctrl</kbd> + <kbd>S</kbd>
                        <span>حفظ</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Esc</kbd>
                        <span>إغلاق النافذة</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Ctrl</kbd> + <kbd>P</kbd>
                        <span>طباعة</span>
                    </div>
                    <div class="shortcut-item">
                        <kbd>Ctrl</kbd> + <kbd>E</kbd>
                        <span>تصدير</span>
                    </div>
                </div>
            </div>
            
            <!-- Tips & Tricks -->
            <div class="guide-section">
                <h4><i class="fas fa-lightbulb ml-2"></i>نصائح مفيدة</h4>
                <div class="tips-list">
                    <div class="tip-item">
                        <i class="fas fa-check-circle tip-icon"></i>
                        <p>استخدم زر <strong>الوضع الداكن</strong> في الأعلى للتبديل بين الأوضاع</p>
                    </div>
                    <div class="tip-item">
                        <i class="fas fa-check-circle tip-icon"></i>
                        <p>غيّر <strong>اللغة</strong> من الإنجليزية إلى العربية والعكس</p>
                    </div>
                    <div class="tip-item">
                        <i class="fas fa-check-circle tip-icon"></i>
                        <p>اضغط على <strong>عين العميل/المورد/الموظف</strong> لعرض البروفايل الكامل</p>
                    </div>
                    <div class="tip-item">
                        <i class="fas fa-check-circle tip-icon"></i>
                        <p>استخدم أزرار <strong>التصدير</strong> لحفظ البيانات بصيغة Excel أو PDF</p>
                    </div>
                    <div class="tip-item">
                        <i class="fas fa-check-circle tip-icon"></i>
                        <p>جميع الأقسام الرئيسية قابلة <strong>للطي والفتح</strong> من القائمة الجانبية</p>
                    </div>
                </div>
            </div>
            
            <!-- Video Tutorial Button -->
            <div class="guide-action">
                <button class="video-tutorial-btn" onclick="showVideoTutorial()">
                    <i class="fas fa-play-circle ml-2"></i>
                    شاهد الفيديو التعليمي
                </button>
                <button class="support-btn" onclick="showSupport()">
                    <i class="fas fa-headset ml-2"></i>
                    تواصل مع الدعم الفني
                </button>
            </div>
        </div>
    `;
}

// Switch Login Tabs
function switchLoginTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.login-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.login-tab').classList.add('active');
    
    // Update tab content
    const loginFormTab = document.getElementById('loginFormTab');
    const userGuideTab = document.getElementById('userGuideTab');
    
    if (tab === 'login') {
        loginFormTab.classList.add('active');
        userGuideTab.classList.remove('active');
    } else {
        loginFormTab.classList.remove('active');
        userGuideTab.classList.add('active');
    }
}

// Toggle Password Visibility
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('passwordToggleIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

// Quick Fill Login
function quickFillLogin() {
    document.getElementById('username').value = 'Mohamed';
    document.getElementById('password').value = 'Mohamed@123';
    
    // Animate inputs
    document.querySelectorAll('.input-wrapper').forEach((wrapper, index) => {
        setTimeout(() => {
            wrapper.classList.add('filled');
        }, index * 100);
    });
    
    showNotification('تم ملء البيانات بنجاح! 🎉', 'success');
}

// Copy to Clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('تم النسخ: ' + text, 'success');
    });
}

// Enhanced Login Handler
async function handleEnhancedLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Show loading
    const button = document.querySelector('.login-button');
    const buttonText = button.querySelector('.button-text');
    const buttonLoader = button.querySelector('.button-loader');
    
    button.disabled = true;
    buttonText.style.display = 'none';
    buttonLoader.style.display = 'flex';
    
    try {
        // Call login function
        await login(username, password);
        
        // Save remember me preference
        if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
            localStorage.setItem('savedUsername', username);
        } else {
            localStorage.removeItem('rememberMe');
            localStorage.removeItem('savedUsername');
        }
        
        // Success animation
        button.classList.add('success');
        setTimeout(() => {
            // Navigation happens in login function
        }, 500);
        
    } catch (error) {
        // Error handling
        button.classList.add('error');
        setTimeout(() => {
            button.classList.remove('error');
            button.disabled = false;
            buttonText.style.display = 'flex';
            buttonLoader.style.display = 'none';
        }, 1000);
    }
}

// Show Forgot Password Modal
function showForgotPassword() {
    const content = `
        <div class="forgot-password-modal">
            <div class="modal-icon">
                <i class="fas fa-key"></i>
            </div>
            <h3>استعادة كلمة المرور</h3>
            <p>أدخل بريدك الإلكتروني وسنرسل لك رابط استعادة كلمة المرور</p>
            <form onsubmit="event.preventDefault(); handlePasswordReset();">
                <div class="input-wrapper">
                    <input type="email" id="resetEmail" class="modern-input" placeholder="البريد الإلكتروني" required>
                </div>
                <div class="modal-actions">
                    <button type="button" onclick="closeModal()" class="modern-button-secondary">
                        <i class="fas fa-times ml-2"></i>إلغاء
                    </button>
                    <button type="submit" class="modern-button">
                        <i class="fas fa-paper-plane ml-2"></i>إرسال
                    </button>
                </div>
            </form>
        </div>
    `;
    openModal('استعادة كلمة المرور', content);
}

// Handle Password Reset
function handlePasswordReset() {
    const email = document.getElementById('resetEmail').value;
    showNotification('تم إرسال رابط الاستعادة إلى: ' + email, 'success');
    closeModal();
}

// Show Privacy Policy
function showPrivacyPolicy() {
    const content = `
        <div class="policy-content">
            <h3><i class="fas fa-shield-alt ml-2"></i>سياسة الخصوصية</h3>
            <p>نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية.</p>
            <h4>جمع البيانات</h4>
            <p>نقوم بجمع البيانات اللازمة فقط لتشغيل النظام بكفاءة.</p>
            <h4>استخدام البيانات</h4>
            <p>البيانات المجمعة تستخدم فقط لأغراض إدارة النظام ولن يتم مشاركتها مع أطراف ثالثة.</p>
            <h4>الأمان</h4>
            <p>نستخدم تقنيات تشفير متقدمة لحماية بياناتك.</p>
        </div>
    `;
    openModal('سياسة الخصوصية', content);
}

// Show Terms
function showTerms() {
    const content = `
        <div class="policy-content">
            <h3><i class="fas fa-file-contract ml-2"></i>شروط الاستخدام</h3>
            <p>باستخدامك لهذا النظام، فإنك توافق على الشروط التالية:</p>
            <h4>الاستخدام المسموح</h4>
            <p>يجب استخدام النظام للأغراض المصرح بها فقط.</p>
            <h4>المسؤولية</h4>
            <p>المستخدم مسؤول عن جميع الأنشطة التي تتم باستخدام حسابه.</p>
            <h4>الملكية الفكرية</h4>
            <p>جميع الحقوق محفوظة لنظام ERP المتكامل.</p>
        </div>
    `;
    openModal('شروط الاستخدام', content);
}

// Show Support
function showSupport() {
    const content = `
        <div class="support-content">
            <div class="support-header">
                <i class="fas fa-headset"></i>
                <h3>الدعم الفني</h3>
                <p>نحن هنا لمساعدتك</p>
            </div>
            <div class="support-options">
                <div class="support-option">
                    <i class="fas fa-envelope"></i>
                    <h4>البريد الإلكتروني</h4>
                    <a href="mailto:support@erp-system.com">support@erp-system.com</a>
                </div>
                <div class="support-option">
                    <i class="fas fa-phone"></i>
                    <h4>الهاتف</h4>
                    <a href="tel:+201234567890">+20 123 456 7890</a>
                </div>
                <div class="support-option">
                    <i class="fas fa-comments"></i>
                    <h4>الدردشة المباشرة</h4>
                    <button class="modern-button" onclick="startLiveChat()">
                        بدء محادثة
                    </button>
                </div>
            </div>
            <div class="support-hours">
                <i class="fas fa-clock ml-2"></i>
                <span>ساعات العمل: من السبت إلى الخميس، 9 صباحاً - 5 مساءً</span>
            </div>
        </div>
    `;
    openModal('الدعم الفني', content);
}

// Show Video Tutorial
function showVideoTutorial() {
    const content = `
        <div class="video-tutorial">
            <div class="video-placeholder">
                <i class="fas fa-play-circle"></i>
                <p>الفيديو التعليمي قريباً</p>
            </div>
            <div class="tutorial-links">
                <h4>دروس مفيدة:</h4>
                <ul>
                    <li><i class="fas fa-video ml-2"></i>مقدمة إلى النظام</li>
                    <li><i class="fas fa-video ml-2"></i>إدارة الموظفين</li>
                    <li><i class="fas fa-video ml-2"></i>إنشاء الفواتير</li>
                    <li><i class="fas fa-video ml-2"></i>التقارير والتحليلات</li>
                </ul>
            </div>
        </div>
    `;
    openModal('الفيديو التعليمي', content);
}

// Start Live Chat
function startLiveChat() {
    showNotification('ميزة الدردشة المباشرة قريباً!', 'info');
}

// Load Remember Me on Page Load
function loadRememberMe() {
    if (localStorage.getItem('rememberMe') === 'true') {
        const savedUsername = localStorage.getItem('savedUsername');
        if (savedUsername) {
            setTimeout(() => {
                const usernameInput = document.getElementById('username');
                if (usernameInput) {
                    usernameInput.value = savedUsername;
                    document.getElementById('rememberMe').checked = true;
                }
            }, 100);
        }
    }
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadRememberMe);
} else {
    loadRememberMe();
}
