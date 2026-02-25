# NALP Design Decisions

## Structure summary

```
NALP/
├── apps/web/                    # Laravel 12, Inertia, React, Breeze
│   ├── app/
│   │   ├── Http/Controllers/     # Web + API + Admin
│   │   ├── Jobs/                 # GenerateDesignConceptJob
│   │   ├── Models/
│   │   └── Services/             # DesignGeneratorClient
│   ├── database/migrations/
│   ├── resources/js/Pages/       # Public, Portal, Studio, Admin
│   └── routes/                  # web.php, api.php
├── services/generator/           # Python FastAPI stub
├── infra/                       # Docker Compose
├── Dockerfile                   # Root: frontend build + Laravel on 8080
└── docs/
```

## Key decisions

### Routes & pages
- `/portal/dashboard` — main portal entry (redirect from `/portal`)
- Public asset pages: `AssetZonesOverview`, `ZoneAWorkforceHousing`, `ZoneBAutoServices`
- Contact: single unified form with `name`, `email`, `message`, `request_nda`, `request_type` (contact/nda/data_room)

### Design Studio
- Land types: rectangle (length/width) and polygon (points as `[[x,y], ...]`)
- Area/perimeter: Shoelace formula for polygon
- 33,000 m² target warning when deviation > 5,000 m²
- Generator returns `pdf_summary` in outputs (stored in `design_runs.outputs`)

### Generator service
- `POST /generate-concept` — primary endpoint (DesignGeneratorClient)
- `POST /api/generate` — legacy alias
- Accepts `land.type`, `land.points` for polygon

### Scenarios
- Inputs stored as JSON in `scenarios.inputs`
- Compare page: `/portal/scenarios/compare` — side-by-side table

### Data room
- Documents stored in `storage/app/data-room` (disk `data-room`)
- Admin upload: `/admin/data-room` (requires `admin` role)
- Investor can list and download; cannot upload

### Auth & roles
- Spatie permission / custom roles (`admin`, `investor`, etc.)
- `EnsureUserIsAdmin` middleware for admin routes
- Filament panel registration deferred (skip for now)

## TODOs

1. **Filament Admin** — Complete panel registration; add CRUD resources for Documents, Scenarios, etc.
2. **Generator** — Replace placeholder GLB/PNG with Blender integration
3. **Design Run outputs** — Surface `pdf_summary` in Studio UI
4. **Data room** — Optional S3 backend via `FILESYSTEM_DISK`
5. **PenguinUI** — Consider Alpine.js for public page interactivity
