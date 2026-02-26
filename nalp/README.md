# NALP — Nabiyah Automotive & Logistics Park

تطبيق Next.js 14+ جاهز للنشر على **Vercel**.

## التشغيل المحلي

```bash
cd nalp
npm install
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000).

## هيكل المشروع

```
src/
├── app/
│   ├── (public)/          # الموقع العام (/, /asset-zones, /financials, إلخ)
│   ├── (portal)/portal/   # بوابة المستثمر
│   ├── (studio)/studio/   # استوديو التصميم مع عرض 3D
│   └── api/               # API (contact, studio/generate, studio/runs)
├── components/
├── lib/
└── styles/
```

## الصفحات الرئيسية

| المسار | الوصف |
|--------|--------|
| `/` | الرئيسية |
| `/asset-zones` | نظرة على المناطق الأربع |
| `/asset-zones/zone-a` إلى `zone-d` | تفاصيل كل منطقة |
| `/financials` | الجدوى المالية |
| `/location` | الموقع |
| `/contact` | التواصل |
| `/portal` | بوابة المستثمر |
| `/studio` | استوديو التصميم |

## متغيرات البيئة

انسخ `.env.example` إلى `.env.local`:

```
NEXT_PUBLIC_APP_NAME=NALP
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```
