# NALP — مجمع النابية للسيارات والخدمات اللوجستية

منصة ويب احترافية تتضمن:
- **موقع عام**: المناطق، الجدوى المالية، الموقع، التواصل
- **بوابة المستثمر**: غرفة البيانات، سيناريوهات مالية
- **استوديو التصميم**: تخطيط الأرض، المناطق الأربع، عرض 2D و 3D

## هيكل المشروع

```
NALP/
└── nalp/                 # تطبيق Next.js
    ├── src/
    ├── public/
    └── package.json
```

## التشغيل المحلي

```bash
cd nalp
npm install
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000).

## النشر على Vercel

1. اربط المستودع بمشروع Vercel
2. عيّن **Root Directory** إلى `nalp`
3. Production Branch: `main`

## الأوامر

| الأمر | الوصف |
|-------|--------|
| `npm run dev` | خادم التطوير |
| `npm run build` | بناء الإنتاج |
| `npm run start` | تشغيل الإنتاج |
| `npm run lint` | ESLint |
| `npm run test` | Vitest |

---

## ملاحظة: حذف المجلد القديم

إذا بقي مجلد `apps/` من الهيكل السابق:

1. **أوقف خادم التطوير** (`Ctrl+C` في الطرفية التي تشغّل `npm run dev`)
2. احذف مجلد `apps` يدوياً من المستكشف أو بأمر:
   ```powershell
   Remove-Item -Path apps -Recurse -Force
   ```
