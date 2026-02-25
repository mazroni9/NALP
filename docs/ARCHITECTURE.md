# NALP Architecture

## Tech Stack

- **Backend**: Laravel 12, PostgreSQL, Redis, Inertia.js
- **Frontend**: React 18, Vite, Tailwind CSS
- **Admin**: Filament v4
- **3D**: React Three Fiber + drei
- **Generator**: Python FastAPI (stub)

## Design Decisions

1. **SPA via Inertia**: لا فصل بين مشروعين؛ SPA داخل Laravel.
2. **PenguinUI**: للصفحات العامة فقط (Landing)؛ Design Studio و Portal يستخدمان React components.
3. **Generator منفصل**: خدمة Python مستقلة قابلة للتوسعة (Blender لاحقاً).
4. **Queue**: Redis للـ jobs.
