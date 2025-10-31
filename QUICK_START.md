# 🚀 دليل التشغيل السريع - Quick Start Guide
## نظام ERP المتكامل

---

## 📦 المتطلبات الأساسية

```bash
✓ Node.js 18+
✓ npm 9+
✓ PM2 (مثبّت تلقائياً)
✓ Wrangler CLI (مثبّت تلقائياً)
```

---

## ⚡ التشغيل السريع (3 خطوات)

### **1. تثبيت الاعتماديات:**
```bash
cd /home/user/webapp
npm install
```

### **2. إعداد قاعدة البيانات:**
```bash
# تطبيق Migrations
npm run db:migrate:local

# إضافة البيانات التجريبية
npm run db:seed
```

### **3. بناء وتشغيل:**
```bash
# بناء المشروع
npm run build

# تشغيل مع PM2
pm2 start ecosystem.config.cjs

# أو: تشغيل مباشرة (للتطوير)
npm run dev:d1
```

---

## 🔐 بيانات الدخول

```
👤 اسم المستخدم: Mohamed
🔑 كلمة المرور: Mohamed@123
```

---

## 🌐 الوصول للنظام

### **محلي (Local):**
```
http://localhost:3000
```

### **عام (Public):**
```
https://3000-ijigpe794bi3pkpjagx9g-2e77fc33.sandbox.novita.ai
```

---

## 📋 الأوامر المتاحة

### **التطوير:**
```bash
npm run dev              # Vite dev server
npm run dev:sandbox      # Wrangler dev (no D1)
npm run dev:d1           # Wrangler dev with D1
npm run build            # Build for production
npm run preview          # Preview production build
```

### **قاعدة البيانات:**
```bash
npm run db:migrate:local    # Apply migrations (local)
npm run db:migrate:prod     # Apply migrations (production)
npm run db:seed             # Seed with test data
npm run db:reset            # Reset database
npm run db:console:local    # Database console (local)
```

### **النشر:**
```bash
npm run deploy           # Deploy to Cloudflare Pages
npm run deploy:prod      # Deploy to production
```

### **PM2:**
```bash
pm2 list                 # List processes
pm2 logs webapp          # View logs
pm2 restart webapp       # Restart app
pm2 stop webapp          # Stop app
pm2 delete webapp        # Remove from PM2
```

### **Git:**
```bash
npm run git:status       # Git status
npm run git:commit       # Git commit
npm run git:log          # Git log
```

### **الاختبار:**
```bash
npm run test             # Test server
npm run clean-port       # Clean port 3000
./test-system.sh         # Comprehensive tests
```

---

## 🔧 استكشاف الأخطاء

### **المشكلة: الصفحة لا تحمّل**
```bash
# 1. تأكد من بناء المشروع
npm run build

# 2. تأكد من تشغيل PM2
pm2 list

# 3. أعد التشغيل
fuser -k 3000/tcp
pm2 restart webapp

# 4. اختبر
curl http://localhost:3000
```

### **المشكلة: قاعدة البيانات فارغة**
```bash
# أعد إنشاء قاعدة البيانات
npm run db:reset

# أو يدوياً:
rm -rf .wrangler/state/v3/d1
npm run db:migrate:local
npm run db:seed
```

### **المشكلة: Port 3000 مشغول**
```bash
# إيقاف العمليات على Port 3000
npm run clean-port
# أو
fuser -k 3000/tcp
```

### **المشكلة: Build فشل**
```bash
# تنظيف وإعادة البناء
rm -rf dist node_modules/.vite
npm run build
```

---

## 📊 هيكل المشروع

```
webapp/
├── src/
│   ├── index.tsx                 # Main entry point
│   └── routes/                   # API routes (60+ endpoints)
├── public/
│   └── static/
│       ├── app-enhanced.js       # Core functionality
│       ├── app-login-enhanced.js # Enhanced login
│       ├── app-rendering.js      # UI rendering
│       ├── app-forms.js          # Forms & profiles
│       ├── styles-enhanced.css   # Main styles
│       ├── styles-login.css      # Login styles
│       └── styles-responsive.css # Responsive design
├── migrations/
│   └── 0001_initial_schema.sql   # Database schema
├── seed.sql                       # Basic seed data
├── seed-extended.sql              # Extended test data
├── ecosystem.config.cjs           # PM2 configuration
├── wrangler.jsonc                 # Cloudflare config
├── package.json                   # Dependencies
├── test-system.sh                 # Testing script
└── README.md                      # Full documentation
```

---

## 🎯 المميزات الرئيسية

### **✨ الوظائف:**
- ✓ لوحة تحكم تفاعلية
- ✓ إدارة الموارد البشرية
- ✓ إدارة المبيعات
- ✓ إدارة المشتريات
- ✓ نظام الإشعارات
- ✓ تصدير Excel/PDF
- ✓ طباعة الفواتير

### **🎨 التصميم:**
- ✓ Glass Morphism
- ✓ Dark Mode
- ✓ Responsive (Mobile-first)
- ✓ RTL/LTR Support
- ✓ Animations
- ✓ Accessibility

### **🔐 الأمان:**
- ✓ JWT Authentication
- ✓ bcrypt Hashing
- ✓ Input Validation
- ✓ XSS Protection

---

## 📚 التوثيق الكامل

- **README.md** - التوثيق الشامل
- **SYSTEM_REVIEW_REPORT.md** - تقرير المراجعة
- **NEW_FEATURES_DOCUMENTATION.md** - توثيق الميزات
- **FUTURE_ENHANCEMENTS.md** - خارطة الطريق
- **BUGFIX_REPORT.md** - تقرير الإصلاحات
- **COMPLETION_SUMMARY.md** - ملخص الإنجاز

---

## 🆘 الدعم

### **المشاكل الشائعة:**
1. **JavaScript لا يعمل**: تأكد من `npm run build`
2. **Login لا يعمل**: تأكد من قاعدة البيانات (`npm run db:seed`)
3. **Port مشغول**: استخدم `npm run clean-port`
4. **PM2 لا يعمل**: `pm2 kill && pm2 start ecosystem.config.cjs`

### **الاختبار الشامل:**
```bash
./test-system.sh
```
يختبر:
- ✓ Server status
- ✓ HTML loading
- ✓ JavaScript files (4)
- ✓ CSS files (3)
- ✓ API endpoints
- ✓ Authentication
- ✓ Dashboard

---

## 🎉 جاهز!

النظام الآن جاهز للاستخدام:

```bash
# 1. تثبيت
npm install

# 2. قاعدة البيانات
npm run db:migrate:local && npm run db:seed

# 3. بناء
npm run build

# 4. تشغيل
pm2 start ecosystem.config.cjs

# 5. فتح
http://localhost:3000

# 6. تسجيل دخول
Username: Mohamed
Password: Mohamed@123
```

**🚀 استمتع بنظام ERP المتكامل!**

---

**الإصدار**: 2.0.1  
**آخر تحديث**: 2025-10-31  
**الحالة**: ✅ جاهز للإنتاج
