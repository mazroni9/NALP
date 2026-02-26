# نشر NALP على Fly.io

## التحضير

1. **تثبيت Fly CLI**
   ```powershell
   iwr https://fly.io/install.ps1 -useb | iex
   ```

2. **تسجيل الدخول**
   ```powershell
   fly auth login
   ```

## خطوات النشر

### 1. الدخول لمجلد Laravel
```powershell
cd NALP/apps/web
```

### 2. إطلاق التطبيق (أول مرة فقط)
```powershell
fly launch
```
- اختر Region قريب (مثلاً دبي أو فرانكفورت)
- **Use existing Dockerfile?** → نعم
- سيُنشئ Fly تطبيقاً وملف `fly.toml` في `apps/web`

### 3. إعداد الأسرار
```powershell
# من .env المحلي انسخ APP_KEY ثم:
fly secrets set APP_KEY="base64:xxxx..."

# اختياري - رابط التطبيق بعد النشر:
fly secrets set APP_URL="https://nalp.fly.dev"
```

### 4. النشر
```powershell
fly deploy
```

### 5. مراقبة السجلات
```powershell
fly logs
```

## إعدادات fly.toml (apps/web)

- `internal_port = 8080` يطابق Dockerfile
- لا يوجد release_command؛ المايغريشن يدوي
- MVP يستخدم SQLite (قاعدة ملف داخل الحاوية)

## ملاحظات

- **infra/docker-compose** للبيئة المحلية فقط، Fly لا يستخدمه
- لربط Fly Postgres و Redis لاحقاً: أنشئهم من Fly وراجع `fly postgres create` و `fly redis create`
- خطأ "No application encryption key": راجع أن `fly secrets set APP_KEY` تم تنفيذه
