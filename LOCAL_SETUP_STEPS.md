# خطوات تشغيل NALP محلياً (Docker + بدون Docker)

## الخيار 1: Docker Compose (موصى به)

من جذر المشروع:

```powershell
cd c:\jassim-2\NALP\infra

# تشغيل الخدمات
docker compose up -d

# Migrations و Seed
docker compose exec web php artisan migrate
docker compose exec web php artisan db:seed
docker compose exec web php artisan storage:link
```

ملاحظة: خدمة `worker` تعمل تلقائياً مع `docker compose up` وتعالج الـ queue.

**الروابط:**
- Web: http://localhost:8080
- Generator: http://localhost:8001

---

## الخيار 2: تشغيل بدون Docker

### المتطلبات
- PHP 8.3+ (pdo, pdo_pgsql, pdo_sqlite, bcmath, zip, intl, redis)
- Composer, Node.js 18+
- PostgreSQL و Redis (أو استخدم `sync`/`database` للـ queue)

### الخطوات

```powershell
cd c:\jassim-2\NALP\apps\web

# التبعيات
composer install
npm install --legacy-peer-deps

# الإعداد
if (!(Test-Path .env)) { Copy-Item .env.example .env }
php artisan key:generate

# عدّل .env: DB_*, REDIS_*, GENERATOR_SERVICE_URL
# ثم:
php artisan migrate
php artisan db:seed
php artisan storage:link

# التشغيل (نوافذ منفصلة)
# نافذة 1:
php artisan serve

# نافذة 2:
php artisan queue:work redis

# نافذة 3:
npm run dev
```

### Generator (اختياري، بدون Docker)

```powershell
cd c:\jassim-2\NALP\services\generator
pip install -r requirements.txt
$env:GENERATOR_OUTPUT_DIR = "c:\jassim-2\NALP\apps\web\storage\app\public\design-outputs"
uvicorn main:app --reload --port 8001
```

ثم في `apps/web/.env`:
```
GENERATOR_SERVICE_URL=http://localhost:8001
```

---

## ملاحظة

بعد `git pull`، لـ Fly.io اتبع `FLY_SETUP_STEPS.md`.
