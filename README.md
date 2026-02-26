# NALP — Nabiyah Automotive & Logistics Park

Professional web platform combining:
- **Public marketing site** (Landing, Asset Zones, Financials, Location, Contact)
- **Investor portal** (Data Room, Scenarios compare)
- **Design Studio** (land/building design, 3D preview)
- **AI 3D generation** (Python generator stub ready for Blender integration)

## Folder structure

```
NALP/
├── apps/
│   └── web/                    # Laravel 12 + Inertia + React + Breeze
│       ├── app/
│       │   ├── Http/Controllers/
│       │   ├── Jobs/
│       │   ├── Models/
│       │   └── Services/
│       ├── database/migrations/
│       ├── resources/js/Pages/
│       └── routes/
├── services/
│   └── generator/               # Python FastAPI — design concept generator
├── infra/                      # Docker Compose, Dockerfiles
├── docs/
│   └── DESIGN-DECISIONS.md
├── Dockerfile                  # Root: build frontend + Laravel, port 8080
└── README.md
```

## Docker (recommended)

```bash
# From repo root
cd infra
docker compose up -d

# Migrations and seed
docker compose exec web php artisan migrate
docker compose exec web php artisan db:seed
docker compose exec web php artisan storage:link

# Queue worker (processes design generation jobs)
docker compose exec -d worker php artisan queue:work redis --tries=3 --timeout=300
```

**Services:**
- **Web**: http://localhost:8080
- **Generator**: http://localhost:8001
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## Local development (without Docker)

### Requirements

- PHP 8.3+ (pdo, pdo_pgsql, pdo_sqlite, bcmath, zip, intl, redis)
- Composer
- Node.js 18+
- PostgreSQL (or SQLite for quick testing)
- Redis (or use `sync`/`database` for QUEUE_CONNECTION)

### Setup

```bash
cd apps/web

composer install
npm install --legacy-peer-deps

cp .env.example .env
php artisan key:generate

# Configure .env: DB_*, REDIS_*, GENERATOR_SERVICE_URL
php artisan migrate
php artisan db:seed
php artisan storage:link

# Run (separate terminals)
php artisan serve
php artisan queue:work redis
npm run dev
```

### Generator without Docker

```bash
cd services/generator
pip install -r requirements.txt
# Output dir: Laravel storage or temp
export GENERATOR_OUTPUT_DIR=/tmp/nalp-design-outputs
uvicorn main:app --reload --port 8001
```

Then set in Laravel `.env`:

```
GENERATOR_SERVICE_URL=http://localhost:8001
```

Note: Design outputs use `design-outputs` volume in Docker. For local, configure the generator output dir to point to `storage/app/public/design-outputs` or similar, and ensure Laravel can serve those files.

## Routes

| Path | Description |
|------|-------------|
| `/` | Home |
| `/asset/zones` | Asset zones overview |
| `/asset/zone-a` | Zone A: Workforce Housing |
| `/asset/zone-b` | Zone B: Auto Services |
| `/financials` | Financial overview |
| `/location` | Location |
| `/contact` | Unified contact form (contact / NDA / data room) |
| `/portal/dashboard` | Investor dashboard |
| `/portal/data-room` | Data Room |
| `/portal/scenarios` | Scenarios |
| `/portal/scenarios/compare` | Compare two scenarios |
| `/studio` | Design Studio (auth required) |
| `/admin/data-room` | Admin: upload Data Room documents |

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/studio/generate` | Create design run |
| GET | `/api/studio/runs` | List runs |
| GET | `/api/studio/runs/{id}` | Run details |
| GET | `/api/data-room/documents` | List documents |
| GET | `/api/data-room/documents/{id}/download` | Download |

## Default admin user

After `php artisan db:seed`:
- **Email**: admin@nalp.local
- **Password**: password

Use this to access `/admin/data-room` (Data Room upload).

## Commands

```bash
php artisan migrate
php artisan db:seed
php artisan queue:work redis
php artisan storage:link
php artisan test
./vendor/bin/pint
```

## CI/CD Pipeline

التدفق التلقائي: **GitHub → Actions (Tests) → Fly.io (Deploy)**

| الحدث | الإجراء |
|-------|---------|
| `push` إلى `main` | تشغيل الاختبارات → عند النجاح، نشر تلقائي على Fly.io |
| `pull_request` إلى `main` | تشغيل الاختبارات فقط (بدون نشر) |
| `push` / `pull_request` إلى `develop` | تشغيل الاختبارات (workflow `ci.yml`) |

### الملفات

- **`.github/workflows/cd.yml`** — اختبارات + نشر على `main`
- **`apps/web/fly.toml`** — إعداد Fly.io الوحيد؛ GitHub Actions تستخدم الأمر:
  ```bash
  flyctl deploy . --config apps/web/fly.toml
  ```
- **`Dockerfile`** (جذر الريبو) — بناء Laravel من `apps/web`

### Secret المطلوب في GitHub

1. المستودع → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret**: `FLY_API_TOKEN`
3. الحصول على الـ token: `fly tokens create org` (محلياً بعد تثبيت Fly CLI)

### خطوة واحدة يدوية (أول مرة فقط)

قبل أول `push` إلى `main`، أنشئ تطبيق Fly وضبط الـ secrets يدوياً:

```powershell
cd apps/web
fly launch --name nalp --copy-config --no-deploy
fly secrets set APP_KEY="base64:xxxx..." --app nalp
```

بعد ذلك، أي `push` ناجح إلى `main` ينشر تلقائياً.

---

## Fly.io deployment (يدوي)

إعداد Fly موجود في **`apps/web/fly.toml`** فقط. للنشر:

```bash
cd <repo-root>
fly deploy . --config apps/web/fly.toml
```

أو أول مرة:
```bash
cd apps/web
fly launch --name nalp --copy-config --no-deploy
fly secrets set APP_KEY="base64:xxxx" --app nalp   # من .env المحلي
cd ../..
fly deploy . --config apps/web/fly.toml
```

See [docs/FLY-DEPLOY.md](docs/FLY-DEPLOY.md) and [FLY_SETUP_STEPS.md](FLY_SETUP_STEPS.md). MVP uses SQLite; add Fly Postgres/Redis when needed.

## Legal

All AI-generated outputs in Design Studio are **conceptual drafts – not for construction**. Final engineering requires licensed professional approval.

## Documentation

See [docs/DESIGN-DECISIONS.md](docs/DESIGN-DECISIONS.md) for TODOs and architecture notes.
