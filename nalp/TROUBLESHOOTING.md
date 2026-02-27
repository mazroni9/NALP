# حل مشاكل عرض المشروع

## إذا كانت الشاشة لا تعرض شيئاً

### 1. التطوير المحلي (Local)

- **المنفذ:** غالباً يعمل السيرفر على `http://localhost:3001` وليس 3000 (إذا كان 3000 مستخدماً).
- **تشغيل المشروع:**
  ```bash
  # من جذر المشروع
  npm run dev
  
  # أو من مجلد nalp
  cd nalp && npm run dev
  ```
- **الرابط:** افتح `http://localhost:3001` في المتصفح.

### 2. Vercel (الإنتاج)

- **مجلد الجذر:** تأكد أن **Root Directory** في Vercel مضبوط على `nalp` وليس `apps/nalp-vercel`.
- **الخطوات:** Settings → General → Root Directory → `nalp` → Save → Redeploy.

### 3. مسح الكاش

- جرّب Hard Refresh: `Ctrl+Shift+R` (أو `Cmd+Shift+R` على Mac).
- أو مسح كاش المتصفح لإعادة تحميل الملفات.
