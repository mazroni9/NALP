# NALP — Nabiyah Automotive & Logistics Park

منصة ويب احترافية لمشروع Nabiyah Automotive & Logistics Park تجمع بين:
- **موقع تسويقي** (Landing + Zones + Financials + Location + Contact)
- **بوابة مستثمرين** (Data Room + Scenarios)
- **Design Studio** (تصميم الأرض والمباني وعرض 3D)
- **طبقة توليد 3D بالذكاء** (Generator service stub جاهز للتوسعة)

## البنية

```
NALP/
├── apps/web/              # Laravel + Inertia + React
├── services/generator/    # Python FastAPI — توليد Concept (Stub)
├── infra/                 # Docker Compose + Dockerfiles
├── docs/                  # مستندات المشروع
└── README.md
```

## التشغيل عبر Docker (موصى به)

```bash
# من جذر المشروع
cd infra
docker compose up -d

# تشغيل migrations و seed
docker compose exec web php artisan migrate
docker compose exec web php artisan db:seed
docker compose exec web php artisan storage:link

# إنشاء مستخدم admin
docker compose exec web php artisan make:filament-user
# أو يدوياً: أنشئ user ثم أضفه إلى role admin
```

الخدمات:
- **Web**: http://localhost:8000
- **Generator**: http://localhost:8001
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## التشغيل المحلي (بدون Docker)

### المتطلبات
- PHP 8.3+
- Composer
- Node.js 18+
- PostgreSQL
- Redis

### خطوات التشغيل

```bash
cd apps/web

# 1. التبعيات
composer install
npm install --legacy-peer-deps

# 2. الإعداد
cp .env.example .env
php artisan key:generate

# 3. قاعدة البيانات (عدّل .env لـ PostgreSQL)
php artisan migrate
php artisan db:seed

# 4. Storage link
php artisan storage:link

# 5. تشغيل الخدمات (في نوافذ منفصلة)
php artisan serve
php artisan queue:work redis
npm run dev

# 6. Generator (في نافذة منفصلة)
cd ../../services/generator
pip install -r requirements.txt
export GENERATOR_OUTPUT_DIR=../apps/web/storage/app/public/design-outputs
uvicorn main:app --reload --port 8000
```

## الصفحات والمسارات

| المسار | الوصف |
|--------|-------|
| `/` | الصفحة الرئيسية |
| `/asset/zones` | نظرة عامة على المناطق |
| `/asset/zone-a` | Zone A: Workforce Housing |
| `/asset/zone-b` | Zone B: Auto Services |
| `/financials` | عرض مالي مبسط |
| `/location` | الموقع |
| `/contact` | نموذج تواصل + NDA + طلب Data Room |
| `/portal` | Dashboard المستثمر |
| `/portal/data-room` | Data Room |
| `/portal/scenarios` | سيناريوهات افتراضات |
| `/studio` | Design Studio |
| `/admin` | Filament Admin |

## API Endpoints

| Method | Endpoint | الوصف |
|--------|----------|-------|
| POST | `/api/studio/generate` | إنشاء Design Run |
| GET | `/api/studio/runs` | قائمة runs |
| GET | `/api/studio/runs/{id}` | تفاصيل run |
| GET | `/api/data-room/documents` | قائمة مستندات |
| GET | `/api/data-room/documents/{id}/download` | تحميل |

## أوامر مفيدة

```bash
# Migrate
php artisan migrate

# Seed
php artisan db:seed

# Queue worker
php artisan queue:work redis

# Filament admin user
php artisan make:filament-user

# Lint
./vendor/bin/pint

# Tests
php artisan test
```

## التنبيه القانوني

جميع مخرجات الذكاء الاصطناعي في Design Studio هي **Concept / Schematic Draft – Not for Construction** وتحتاج اعتماد مهندس مرخّص قبل أي تنفيذ.

## Filament Admin

- لوحة الإدارة: `/admin`
- إنشاء مستخدم Admin: `php artisan make:filament-user`
- لإظهار لوحة الإدارة للمستخدم، أضفه إلى role `admin` (شغّل `php artisan db:seed` لإنشاء الأدوار)

## نقاط مفتوحة للقرار

1. **PenguinUI**: الصفحات العامة تستخدم Tailwind مباشرة؛ لتفعيل PenguinUI الكامل يمكن إضافة Alpine.js للعناصر التفاعلية.
2. **Generator**: الـ Stub الحالي يكتب ملفات placeholder؛ التكامل مع Blender جاهز في البنية.
3. **Filament**: يستخدم v4 (متوافق مع Laravel 12). موارد CRUD إضافية يمكن إنشاؤها بـ `php artisan make:filament-resource Users --generate`.
4. **PHP**: للتشغيل المحلي بدون Docker، تحتاج `pdo_sqlite` أو `pdo_pgsql` حسب إعدادك.
