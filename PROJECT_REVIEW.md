# مراجعة المشروع NALP قبل الدفع إلى GitHub

## هيكل المشروع الحالي

```
NALP/
├── nalp/                          # التطبيق الرئيسي (Next.js)
│   ├── src/
│   │   ├── app/
│   │   │   ├── (public)/          # الموقع العام
│   │   │   │   ├── page.tsx       # الرئيسية
│   │   │   │   ├── asset-zones/   # المناطق الأربع
│   │   │   │   ├── financials/
│   │   │   │   ├── location/
│   │   │   │   └── contact/
│   │   │   ├── (portal)/portal/   # بوابة المستثمر
│   │   │   ├── (studio)/studio/   # استوديو التصميم
│   │   │   └── api/               # API
│   │   ├── components/
│   │   └── lib/
│   ├── public/
│   └── package.json
├── .github/workflows/             # CI/CD
├── README.md
└── .gitignore
```

## الصفحات المتاحة

| المسار | الوصف |
|-------|--------|
| `/` | الرئيسية |
| `/asset-zones` | المناطق الأربع |
| `/asset-zones/zone-a` إلى `zone-d` | تفاصيل كل منطقة مع اسكتش الأبعاد |
| `/financials` | الجدوى المالية |
| `/location` | الموقع (خريطة ملاعب الكلاسكو) |
| `/contact` | التواصل |
| `/portal` | بوابة المستثمر |
| `/studio` | استوديو التصميم (2D + 3D) |

## فتح المعاينة في Cursor

1. **فتح Simple Browser:**
   - اضغط `Ctrl+Shift+P` (أو `Cmd+Shift+P`)
   - اكتب: `Simple Browser: Show`
   - اختر الأمر

2. **أدخل الرابط:**
   - إذا الخادم على 3000: `http://localhost:3000`
   - إذا على 3001: `http://localhost:3001`

3. **التنقل للمراجعة:**
   - `/` الرئيسية
   - `/asset-zones` المناطق
   - `/asset-zones/zone-a` منطقة المزاد
   - `/location` الخريطة
   - `/studio` استوديو التصميم

## التأكد من تشغيل الخادم

```bash
cd nalp
npm run dev
```
