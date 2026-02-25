# NALP — دليل النشر

## 1. ربط المشروع بـ GitHub

### أنشئ Repository جديد على GitHub
1. اذهب إلى [github.com/new](https://github.com/new)
2. اسم الريبو: `NALP` (أو أي اسم تفضله)
3. اختر **Public**
4. لا تضف README أو .gitignore (المشروع يحتوي عليهما)
5. انقر **Create repository**

### ادفع الكود إلى GitHub
```bash
cd c:\jassim-2\NALP

# أضف الريبو (استبدل YOUR_USERNAME و REPO_NAME بمعلوماتك)
git remote add origin https://github.com/YOUR_USERNAME/NALP.git

# ادفع
git branch -M main
git push -u origin main
```

---

## 2. النشر (بديل عن Vercel)

⚠️ **Vercel لا يدعم Laravel/PHP** — Vercel مصمم لمواقع ثابتة و Next.js/React، ولا يعمل مع Laravel + Inertia.

### الخيار الموصى به: Render.com

يدعم Laravel و Postgres و Redis ويمكنه تشغيل المشروع بالكامل.

1. سجّل على [render.com](https://render.com)
2. **New** → **Web Service**
3. اربط الريبو من GitHub
4. الإعدادات:
   - **Root Directory**: `apps/web`
   - **Runtime**: Docker (أو Native مع PHP)
   - **Build Command**: `composer install && npm install --legacy-peer-deps && npm run build`
   - **Start Command**: `php artisan serve --host=0.0.0.0 --port=$PORT`

5. أضف خدمات:
   - **PostgreSQL** (من Render) → احصل على `DATABASE_URL`
   - **Redis** (من Render أو Upstash)

6. متغيرات البيئة:
   - `APP_KEY` (شغّل `php artisan key:generate` محلياً وانسخ المفتاح)
   - `DB_CONNECTION=pgsql`
   - `DATABASE_URL` (من خدمة Postgres)
   - `REDIS_URL` (إذا استخدمت Redis)
   - `APP_ENV=production`
   - `APP_DEBUG=false`

### خيار آخر: Railway.app

يدعم Docker، يمكنك رفع `docker-compose` أو إنشاء خدمة Laravel مباشرة.

---

## 3. ملاحظة للمستقبل

إذا أردت استخدام Vercel مستقبلاً، ستحتاج لتغيير البنية إلى:
- **Frontend**: تطبيق React مستقل (بدون Inertia) على Vercel
- **Backend**: Laravel API على Render/Railway/DigitalOcean

هذا يلزم إعادة هيكلة كبيرة (فصل API عن الواجهة).
