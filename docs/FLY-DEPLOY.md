# نشر NALP على Fly.io

## بعد الدفع إلى GitHub

إذا كان تطبيق `nalp` مربوطًا بالريبو على Fly.io، ستبدأ عملية النشر تلقائياً.

## المتغيرات المطلوبة (Secrets)

شغّل محلياً من جذر المشروع:

```bash
cd apps/web
fly secrets set APP_KEY=$(php artisan key:generate --show)
fly secrets set APP_URL=https://nalp.fly.dev
```

## إعادة النشر يدوياً

```bash
fly deploy
```

## رابط التطبيق

بعد نجاح النشر: **https://nalp.fly.dev**
