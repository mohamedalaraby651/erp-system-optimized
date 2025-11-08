# 🚀 دليل التثبيت والتشغيل المحلي

## 📋 المتطلبات الأساسية

قبل البدء، تأكد من تثبيت:

### 1. **Node.js** (الإصدار 18 أو أحدث)
```bash
# تحميل من: https://nodejs.org/
# تحقق من التثبيت:
node --version  # يجب أن يظهر v18.0.0 أو أحدث
npm --version   # يجب أن يظهر 9.0.0 أو أحدث
```

### 2. **Git** (لاستنساخ المشروع)
```bash
# تحميل من: https://git-scm.com/
# تحقق من التثبيت:
git --version
```

---

## 📥 الخطوة 1: تحميل المشروع

### الطريقة الأولى: من GitHub
```bash
# استنساخ المشروع
git clone https://github.com/mohamedalaraby651/erp-system-optimized.git

# الدخول للمجلد
cd erp-system-optimized
```

### الطريقة الثانية: من الملف المضغوط
```bash
# تحميل من:
https://page.gensparksite.com/project_backups/erp-system-source-code.tar.gz

# فك الضغط
tar -xzf erp-system-source-code.tar.gz

# الدخول للمجلد
cd home/user/webapp
```

---

## 📦 الخطوة 2: تثبيت الاعتماديات

```bash
# تثبيت جميع الحزم المطلوبة
npm install

# هذا سيأخذ 2-3 دقائق حسب سرعة الإنترنت
```

---

## 🗄️ الخطوة 3: إعداد قاعدة البيانات

### تثبيت Wrangler (أداة Cloudflare)
```bash
npm install -g wrangler
```

### تطبيق Migrations
```bash
# تطبيق هيكل قاعدة البيانات
npm run db:migrate:local

# إضافة البيانات التجريبية
npm run db:seed
```

**ملاحظة:** إذا حدث خطأ، قم بـ:
```bash
# حذف قاعدة البيانات القديمة وإعادة إنشائها
rm -rf .wrangler
npm run db:migrate:local
npm run db:seed
```

---

## 🏗️ الخطوة 4: بناء المشروع

```bash
# بناء المشروع للإنتاج
npm run build

# سيتم إنشاء مجلد dist/
```

---

## 🚀 الخطوة 5: تشغيل المشروع

### الطريقة الأولى: باستخدام npm
```bash
# تشغيل الخادم
npm run preview

# الخادم سيعمل على:
# http://localhost:3000
```

### الطريقة الثانية: باستخدام PM2 (مستحسن)
```bash
# تثبيت PM2 (إذا لم يكن مثبتاً)
npm install -g pm2

# تشغيل الخادم
pm2 start ecosystem.fast.config.cjs

# عرض حالة الخادم
pm2 list

# عرض اللوجات
pm2 logs webapp-fast

# إيقاف الخادم
pm2 stop webapp-fast

# إعادة تشغيل الخادم
pm2 restart webapp-fast
```

---

## 🌐 الخطوة 6: فتح المتصفح

افتح المتصفح واذهب إلى:
```
http://localhost:3000
```

### بيانات الدخول الافتراضية:
```
اسم المستخدم: Mohamed
كلمة المرور: Mohamed@123
```

---

## 🎯 الأوامر المفيدة

### التطوير
```bash
# وضع التطوير (مع Hot Reload)
npm run dev

# بناء المشروع
npm run build

# معاينة المشروع
npm run preview
```

### قاعدة البيانات
```bash
# تطبيق migrations جديدة
npm run db:migrate:local

# إضافة البيانات التجريبية
npm run db:seed

# إعادة تعيين قاعدة البيانات
npm run db:reset

# فتح console لقاعدة البيانات
npm run db:console:local
```

### PM2
```bash
# عرض قائمة العمليات
pm2 list

# عرض تفاصيل العملية
pm2 show webapp-fast

# مراقبة الموارد
pm2 monit

# عرض اللوجات
pm2 logs webapp-fast

# حذف العملية
pm2 delete webapp-fast
```

### Git
```bash
# عرض الحالة
npm run git:status

# عمل commit
npm run git:commit "رسالة التغيير"

# عرض السجل
npm run git:log
```

---

## 🔧 حل المشاكل الشائعة

### 1. خطأ: "Port 3000 already in use"
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID [رقم_العملية] /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9

# أو
pm2 delete all
```

### 2. خطأ: "Cannot find module"
```bash
# إعادة تثبيت الاعتماديات
rm -rf node_modules package-lock.json
npm install
```

### 3. خطأ في قاعدة البيانات
```bash
# إعادة إنشاء قاعدة البيانات
rm -rf .wrangler
npm run db:migrate:local
npm run db:seed
```

### 4. خطأ في البناء
```bash
# تنظيف الـ build
rm -rf dist
npm run build
```

### 5. مشكلة في الأذونات (Linux/Mac)
```bash
# إعطاء أذونات للملفات
chmod -R 755 .
```

---

## 📱 الوصول من أجهزة أخرى في نفس الشبكة

### 1. تعديل إعدادات Vite
في ملف `vite.config.ts`:
```typescript
server: {
  host: '0.0.0.0',  // السماح بالوصول الخارجي
  port: 3000
}
```

### 2. معرفة عنوان IP الخاص بك
```bash
# Windows
ipconfig

# Linux/Mac
ifconfig
# أو
ip addr show
```

### 3. الوصول من الأجهزة الأخرى
```
http://[عنوان_IP]:3000
مثال: http://192.168.1.100:3000
```

---

## 🔐 إعدادات الأمان

### 1. تغيير كلمة المرور الافتراضية
بعد أول تسجيل دخول:
1. اذهب إلى **الإعدادات** → **الملف الشخصي**
2. غيّر كلمة المرور

### 2. إنشاء مستخدمين جدد
من لوحة التحكم:
1. **الإدارة** → **المستخدمين**
2. **إضافة مستخدم جديد**

---

## 📊 مراقبة الأداء

### باستخدام PM2
```bash
# مراقبة مباشرة
pm2 monit

# عرض الإحصائيات
pm2 show webapp-fast
```

### باستخدام المتصفح
افتح: `http://localhost:3000/api/health`

---

## 🚀 النشر على الإنتاج

### على Cloudflare Pages (موصى به)
راجع ملف `DEPLOYMENT_GUIDE.md`

### على VPS/Dedicated Server
```bash
# تثبيت PM2
npm install -g pm2

# تشغيل المشروع
pm2 start ecosystem.fast.config.cjs

# حفظ قائمة PM2
pm2 save

# إعداد PM2 للبدء التلقائي
pm2 startup
```

---

## 📚 ملفات إضافية مفيدة

- **README.md** - معلومات عامة عن المشروع
- **OPTIMIZATION_COMPLETE_REPORT.md** - تقرير التحسينات الشامل
- **SUMMARY_AR.md** - ملخص بالعربية
- **DEPLOYMENT_GUIDE.md** - دليل النشر على Cloudflare

---

## 💡 نصائح مهمة

1. **استخدم PM2** للتشغيل في الإنتاج - أكثر استقراراً
2. **احفظ نسخة احتياطية** من قاعدة البيانات بانتظام
3. **راقب السجلات** باستخدام `pm2 logs`
4. **قم بالتحديث** بانتظام: `git pull && npm install && npm run build`
5. **غيّر بيانات الدخول** الافتراضية فوراً

---

## 📞 الدعم والمساعدة

إذا واجهت أي مشاكل:
1. راجع قسم **حل المشاكل الشائعة** أعلاه
2. تحقق من السجلات: `pm2 logs webapp-fast`
3. راجع GitHub Issues: https://github.com/mohamedalaraby651/erp-system-optimized/issues

---

**🎉 مبروك! نظام ERP جاهز للعمل على جهازك المحلي!**

**الإصدار:** 2.0 - Performance Optimized  
**آخر تحديث:** 7 نوفمبر 2025
