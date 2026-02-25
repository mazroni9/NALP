# خطوات إعداد ونشر NALP على Fly.io

بعد `git pull`، اتّبع هذه الأوامر بالضبط. لأي خطأ في `fly deploy` أو `fly logs` أرسله للتشخيص.

للتشغيل المحلي: راجع `LOCAL_SETUP_STEPS.md`.

---

## GitHub Actions (Deploy تلقائي)

للنشر التلقائي عند push إلى `main`، يجب إضافة **FLY_API_TOKEN** في GitHub:

1. **إنشاء التوكن من Fly.io:**
   ```powershell
   fly tokens create deploy --app nalp
   ```
   انسخ الناتج (سلسلة طويلة).

2. **إضافته في GitHub:**
   - اذهب إلى: https://github.com/mazroni9/NALP/settings/secrets/actions
   - اضغط **New repository secret**
   - الاسم: `FLY_API_TOKEN`
   - القيمة: الصق التوكن الذي أنشأته

3. بعدها، كل push إلى `main` سيُشغّل `.github/workflows/cd.yml` (اختبارات ثم نشر).

### إلغاء تكامل Fly.io مع GitHub (مهم)

لتفادي تعارض "app not found" أو أسماء تطبيقات عشوائية، استخدم **فقط** GitHub Actions للنشر:

1. اذهب إلى: **https://fly.io/dashboard**
2. **Settings** (أيقونة الترس) → **Integrations** أو **GitHub**
3. احذف الربط مع مستودع NALP إن وُجد
4. النشر سيتم حصرياً عبر `.github/workflows/cd.yml` → تطبيق `nalp` ✓

---

## A) أول مرة: إعداد Fly CLI وتسجيل الدخول (على جهازك)

```powershell
# تثبيت Fly CLI (مرة واحدة)
iwr https://fly.io/install.ps1 -useb | iex

# تسجيل الدخول
fly auth login
```

---

## B) أول مرة: إنشاء التطبيق

من جذر المشروع `NALP`:

```powershell
cd c:\jassim-2\NALP\apps\web

# إطلاق التطبيق لأول مرة
fly launch `
  --name nalp `
  --copy-config `
  --no-deploy
```

**ملاحظات:**
- `--name nalp` يمكن تغييره لو محجوز
- عند السؤال: اختر **Region** مناسبة (مثلاً Dubai أو Frankfurt)
- **Use existing Dockerfile?** → Yes

---

## C) إعداد الأسرار (APP_KEY)

```powershell
cd c:\jassim-2\NALP\apps\web

# انسخ APP_KEY من .env المحلي ثم:
fly secrets set APP_KEY="base64:xxxx..." --app nalp
```

---

## D) النشر

```powershell
cd c:\jassim-2\NALP

# من جذر المشروع (سياق البناء للـ Dockerfile الجذر)
# استخدم اسم التطبيق الفعلي من fly.toml (مثل nalp)
fly deploy . --config apps/web/fly.toml --app nalp
```

---

## D2) بعد أول deploy — أوامر يدوية (إن لم تُنفَّذ تلقائياً)

```powershell
cd c:\jassim-2\NALP\apps\web

# Migrations
fly ssh console -C "php artisan migrate --force" --app nalp

# Seed
fly ssh console -C "php artisan db:seed --force" --app nalp

# Storage link
fly ssh console -C "php artisan storage:link" --app nalp
```

---

## E) إضافة PostgreSQL (اختياري)

من أي مكان بعد تسجيل الدخول:

```powershell
# إنشاء قاعدة بيانات Postgres
fly postgres create `
  --name nalp-db `
  --region <region> `
  --vm-size shared-cpu-1x `
  --volume-size 10

# ربط قاعدة البيانات بتطبيق NALP
fly postgres attach nalp-db --app nalp
```

استبدل `<region>` بـ region مناسب (مثلاً: `dxb` دبي، `fra` فرانكفورت، `ams` أمستردام).

بعد الربط، Fly يضبط `DATABASE_URL` تلقائياً. قد تحتاج تحديث `fly.toml` أو env لاستخدام `pgsql` بدلاً من `sqlite`.

---

## F) أوامر مفيدة

```powershell
# عرض السجلات
fly logs --app nalp

# فتح التطبيق في المتصفح
fly open --app nalp

# الدخول إلى الـ shell
fly ssh console --app nalp
```

---

## استكشاف الأخطاء: نشر GitHub يفشل (أيقونة حمراء)

إن ظهرت ❌ على **Deployments → production** في GitHub:
1. تأكد من إضافة `FLY_API_TOKEN` في Settings → Secrets (انظر أعلاه).
2. إن ظهر "app not found" أو اسم مثل `app-lingering-sunset-xxxx`: ألغِ تكامل Fly.io مع GitHub (انظر أعلاه) واترك النشر لـ GitHub Actions فقط.
3. راجع Actions: https://github.com/mazroni9/NALP/actions لمعرفة رسالة الخطأ.
