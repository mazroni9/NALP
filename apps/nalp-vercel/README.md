# NALP — Nabiyah Automotive & Logistics Park

Next.js 14+ frontend and API project, ready to deploy on **Vercel**.

> **ملاحظة:** هذا المشروع داخل monorepo. المسار الصحيح للتشغيل والنشر هو `apps/nalp-vercel`.

---

## تشغيل محلي (Local Development)

```bash
cd apps/nalp-vercel
npm install
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000).

---

## تنظيم الفروع (Branch Strategy)

| الفرع | الاستخدام |
|-------|-----------|
| **main** | إنتاج (Production) — النشر المباشر |
| **staging** | تجربة (Preview) — بيئة اختبار قبل الإنتاج |

### عند ربط Vercel بالمستودع

1. **Production Branch:** `main`
2. **Preview Branches:** جميع الفروع الأخرى (بما فيها `staging`) تُنشر كـ Preview URLs قابلة للمشاركة.

---

## النشر على Vercel (Deploy)

**Vercel Project ID:** `prj_h9FWAGULyDeCFHBjOCkPo0OzKh09`

### الإعداد المطلوب (مرة واحدة)

1. اربط المستودع بـ Vercel: [vercel.com](https://vercel.com) → **New Project** → اختر الريبو.
2. عيّن **Root Directory** إلى `apps/nalp-vercel`:
   - **Settings** → **General** → **Root Directory** → `apps/nalp-vercel`
3. تأكد أن **Production Branch** = `main`.

### سلوك النشر

| الحدث | النتيجة |
|-------|---------|
| `push` أو `merge` إلى `main` | نشر على Production |
| `push` أو إنشاء PR من `staging` أو أي فرع آخر | نشر Preview (رابط مؤقت للمراجعة) |

لا حاجة لإعداد إضافي؛ Vercel يتعرّف على Next.js تلقائياً.

---

## Scripts المتوفرة

| الأمر | الوصف |
|-------|--------|
| `npm run dev` | تشغيل خادم التطوير |
| `npm run build` | بناء الإنتاج |
| `npm run start` | تشغيل خادم الإنتاج |
| `npm run lint` | تشغيل ESLint |
| `npm run test` | تشغيل Vitest |

---

## Build & Production (محلياً)

```bash
cd apps/nalp-vercel
npm run build
npm start
```

---

## Project Structure

```
src/
├── app/
│   ├── (public)/          # Public website (/, /asset-zones, /financials, etc.)
│   ├── (portal)/portal/   # Investor Portal (dashboard, data-room, scenarios)
│   ├── (studio)/studio/   # Design Studio with 3D viewer
│   └── api/               # API routes (contact, studio/generate, studio/runs)
├── components/            # Reusable UI and layout components
├── lib/                   # Utilities, mock data, API client
└── styles/                # Global styles
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home |
| `/asset-zones` | Asset zones overview |
| `/asset-zones/zone-a-workforce-housing` | Zone A: Workforce Housing |
| `/asset-zones/zone-b-auto-services` | Zone B: Auto Services |
| `/financials` | Financial overview & assumptions |
| `/location` | Location (Jubail–Dammam axis) |
| `/contact` | Contact form |
| `/portal` | Redirects to portal dashboard |
| `/portal/dashboard` | Investor Portal dashboard |
| `/portal/data-room` | Data room (mock) |
| `/portal/scenarios` | Financial scenarios |
| `/studio` | Design Studio (land input, zones, 3D viewer) |

## Environment

انسخ `.env.example` إلى `.env.local` وعدّل القيم:

```
NEXT_PUBLIC_APP_NAME=NALP
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

في Vercel، أضف نفس المتغيرات في **Settings** → **Environment Variables** (اختياري).

## Tests

```bash
cd apps/nalp-vercel
npm run test
```

## Next Steps

- **Auth**: إضافة مصادقة حقيقية (Keycloak / NextAuth / custom) للبوابة.
- **Backend**: ربط API مع backend خارجي (Laravel / FastAPI) عبر `src/lib/apiClient.ts`.
- **3D Generator**: استبدال mock الـ Studio بمولد 3D حقيقي.
- **Data Room**: تخزين ملفات Data Room في قاعدة بيانات أو storage.
- **Contact**: تخزين رسائل التواصل في قاعدة بيانات أو CRM.
