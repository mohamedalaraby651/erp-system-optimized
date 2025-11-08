# 🚀 دليل النشر على Cloudflare Pages

## 📋 نظرة عامة

هذا الدليل يشرح كيفية نشر نظام ERP على **Cloudflare Pages** مجاناً.

### مميزات Cloudflare Pages
- ✅ **مجاني** للاستخدام الشخصي والمشاريع الصغيرة
- ✅ **سريع جداً** - Deployed on Edge Network
- ✅ **SSL مجاني** - HTTPS تلقائياً
- ✅ **CI/CD تلقائي** - يتحدث تلقائياً من GitHub
- ✅ **Unlimited Requests** على الخطة المجانية
- ✅ **قاعدة بيانات D1** مجانية (10 GB)

---

## 🔑 الخطوة 1: إنشاء حساب Cloudflare

1. اذهب إلى: https://dash.cloudflare.com/sign-up
2. سجّل بالبريد الإلكتروني
3. تأكد من البريد الإلكتروني

---

## 🔧 الخطوة 2: تثبيت Wrangler CLI

```bash
# تثبيت Wrangler عالمياً
npm install -g wrangler

# تسجيل الدخول لـ Cloudflare
wrangler login

# سيفتح المتصفح للمصادقة
```

---

## 🗄️ الخطوة 3: إنشاء قاعدة بيانات D1

```bash
# إنشاء قاعدة البيانات
wrangler d1 create erp-production

# سيعطيك database_id - احتفظ به!
# مثال: database_id = "abc123-def456-ghi789"
```

### تحديث wrangler.jsonc
```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "erp-system",
  "compatibility_date": "2024-01-01",
  "pages_build_output_dir": "./dist",
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "erp-production",
      "database_id": "abc123-def456-ghi789"  // ضع الـ ID هنا
    }
  ]
}
```

### تطبيق Migrations على قاعدة البيانات الإنتاجية
```bash
# تطبيق هيكل قاعدة البيانات
wrangler d1 migrations apply erp-production

# إضافة البيانات التجريبية (اختياري)
wrangler d1 execute erp-production --file=./seed.sql
```

---

## 🏗️ الخطوة 4: بناء المشروع

```bash
# بناء المشروع للإنتاج
npm run build

# التأكد من وجود مجلد dist/
ls -la dist/
```

---

## 🌐 الخطوة 5: إنشاء Cloudflare Pages Project

### الطريقة الأولى: عبر Dashboard (موصى به للمبتدئين)

1. اذهب إلى: https://dash.cloudflare.com/
2. اضغط على **Pages** من القائمة الجانبية
3. اضغط **Create a project**
4. اختر **Connect to Git**
5. اختر **GitHub** وصل حسابك
6. اختر Repository: `erp-system-optimized`
7. إعدادات البناء:
   ```
   Framework preset: None
   Build command: npm run build
   Build output directory: dist
   Root directory: /
   ```
8. اضغط **Save and Deploy**

### الطريقة الثانية: عبر CLI (للمستخدمين المتقدمين)

```bash
# إنشاء المشروع
wrangler pages project create erp-system \
  --production-branch main \
  --compatibility-date 2024-01-01

# نشر أول مرة
wrangler pages deploy dist --project-name erp-system

# ستحصل على رابط مثل:
# https://erp-system.pages.dev
```

---

## 🔐 الخطوة 6: إعداد Environment Variables (إذا لزم الأمر)

### عبر Dashboard
1. اذهب إلى **Pages** → **erp-system**
2. **Settings** → **Environment variables**
3. أضف المتغيرات:
   ```
   NODE_ENV=production
   ```

### عبر CLI
```bash
# إضافة secret
wrangler pages secret put JWT_SECRET --project-name erp-system

# عند السؤال، أدخل قيمة سرية قوية
```

---

## 🔗 الخطوة 7: ربط Domain مخصص (اختياري)

### 1. إضافة Custom Domain
```bash
# عبر CLI
wrangler pages domain add yourdomain.com --project-name erp-system

# أو عبر Dashboard:
# Pages → erp-system → Custom domains → Set up a custom domain
```

### 2. تحديث DNS Records
في Cloudflare DNS، أضف:
```
Type: CNAME
Name: www (أو @)
Target: erp-system.pages.dev
Proxy: Enabled (البرتقالي)
```

---

## 📊 الخطوة 8: التحقق من النشر

### 1. فتح الموقع
```
https://erp-system.pages.dev
```

### 2. اختبار API
```bash
curl https://erp-system.pages.dev/api/health
```

### 3. تسجيل الدخول
```
Username: Mohamed
Password: Mohamed@123
```

---

## 🔄 التحديثات التلقائية

### إعداد GitHub Integration

بعد ربط GitHub، أي `git push` سيؤدي إلى:
1. Cloudflare Pages سيكتشف التغيير
2. سيبني المشروع تلقائياً
3. سينشر النسخة الجديدة

### Preview Deployments
كل branch سيحصل على رابط معاينة خاص:
```
https://branch-name.erp-system.pages.dev
```

---

## 💰 الحدود المجانية

### Cloudflare Pages Free Tier
- ✅ **Unlimited Requests**
- ✅ **Unlimited Bandwidth**
- ✅ **500 Builds/month**
- ✅ **1 Build at a time**

### D1 Database Free Tier
- ✅ **10 GB Storage**
- ✅ **5 Million Reads/day**
- ✅ **100,000 Writes/day**

**كافية لمعظم المشاريع الصغيرة والمتوسطة!**

---

## 🔧 أوامر مفيدة

### إدارة Deployments
```bash
# عرض قائمة Deployments
wrangler pages deployment list --project-name erp-system

# حذف deployment معين
wrangler pages deployment delete [deployment-id] --project-name erp-system

# Rollback لـ deployment سابق
wrangler pages deployment rollback [deployment-id] --project-name erp-system
```

### إدارة قاعدة البيانات
```bash
# عرض قائمة Databases
wrangler d1 list

# تنفيذ استعلام SQL
wrangler d1 execute erp-production --command="SELECT COUNT(*) FROM users"

# تنفيذ ملف SQL
wrangler d1 execute erp-production --file=./query.sql

# فتح console تفاعلي
wrangler d1 execute erp-production
```

### Logs & Monitoring
```bash
# عرض logs مباشرة
wrangler pages deployment tail --project-name erp-system

# عرض analytics
# اذهب إلى Dashboard → Pages → erp-system → Analytics
```

---

## 🔐 الأمان

### 1. تغيير بيانات الدخول الافتراضية
بعد أول نشر:
1. سجّل دخول بالبيانات الافتراضية
2. اذهب لإعدادات المستخدم
3. غيّر كلمة المرور فوراً

### 2. إعداد JWT Secret
```bash
# إنشاء secret قوي
wrangler pages secret put JWT_SECRET --project-name erp-system

# أدخل قيمة عشوائية طويلة (32+ حرف)
```

### 3. تفعيل Security Headers
تأكد من أن `src/index.tsx` يحتوي على:
```typescript
app.use('*', async (c, next) => {
  await next();
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('X-Frame-Options', 'DENY');
  c.header('X-XSS-Protection', '1; mode=block');
  // ...
});
```

---

## 📈 مراقبة الأداء

### 1. Cloudflare Analytics
- **Dashboard** → **Pages** → **erp-system** → **Analytics**
- يعرض:
  - Requests per day
  - Bandwidth
  - Cache hit rate
  - Status codes

### 2. Real User Monitoring (RUM)
أضف في `src/index.tsx`:
```typescript
// إحصائيات الأداء
app.use('*', async (c, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  c.header('X-Response-Time', `${ms}ms`);
});
```

---

## 🚨 حل المشاكل الشائعة

### 1. Build Failed
```bash
# تحقق من logs
wrangler pages deployment tail --project-name erp-system

# أسباب شائعة:
# - package.json missing scripts
# - node_modules not ignored
# - build errors

# الحل:
# تأكد من .gitignore يحتوي على:
node_modules/
.wrangler/
dist/
```

### 2. Database Connection Failed
```bash
# تحقق من database_id في wrangler.jsonc
# تحقق من تطبيق migrations:
wrangler d1 migrations list erp-production

# إذا لم تُطبق:
wrangler d1 migrations apply erp-production
```

### 3. 404 Errors
```bash
# تأكد من وجود _routes.json في dist/
ls -la dist/_routes.json

# إذا لم يوجد، أعد البناء:
npm run build
```

### 4. Slow Performance
- تحقق من Analytics في Dashboard
- تأكد من تفعيل Caching
- راجع Database Queries
- استخدم Performance Monitoring Tools

---

## 🔄 Workflow الموصى به

### للتطوير
```bash
# 1. عمل branch جديد
git checkout -b feature/new-feature

# 2. التطوير المحلي
npm run dev

# 3. الاختبار
npm run build
npm run preview

# 4. Commit & Push
git add .
git commit -m "Add new feature"
git push origin feature/new-feature

# 5. سيتم نشر Preview Deployment تلقائياً
# رابط: https://feature-new-feature.erp-system.pages.dev
```

### للإنتاج
```bash
# 1. Merge إلى main
git checkout main
git merge feature/new-feature

# 2. Push
git push origin main

# 3. سيتم النشر تلقائياً على:
# https://erp-system.pages.dev
```

---

## 📚 موارد إضافية

- **Cloudflare Pages Docs**: https://developers.cloudflare.com/pages/
- **Wrangler Docs**: https://developers.cloudflare.com/workers/wrangler/
- **D1 Database Docs**: https://developers.cloudflare.com/d1/
- **Hono Framework**: https://hono.dev/

---

## 💡 نصائح Pro

1. **استخدم Preview Deployments** للاختبار قبل الإنتاج
2. **راقب Analytics** لفهم استخدام النظام
3. **احفظ نسخة احتياطية** من قاعدة البيانات بانتظام
4. **استخدم Custom Domain** للمظهر الاحترافي
5. **فعّل Cloudflare Analytics** للإحصائيات المتقدمة

---

**🎉 مبروك! نظامك الآن منشور على الإنترنت!**

**الإصدار:** 2.0 - Performance Optimized  
**آخر تحديث:** 7 نوفمبر 2025
