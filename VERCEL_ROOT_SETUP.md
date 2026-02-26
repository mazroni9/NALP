# ضبط مجلد الجذر في Vercel

الخطأ: `The specified Root Directory apps/nalp-vercel does not exist`

**الحل:** غيّر مجلد الجذر من `apps/nalp-vercel` إلى `nalp`

## الخطوات

1. ادخل إلى [Vercel Dashboard](https://vercel.com/dashboard)
2. اختر مشروع **nalp**
3. اذهب إلى **Settings** (الإعدادات)
4. في قسم **General** → **Root Directory**
5. غيّر القيمة من `apps/nalp-vercel` إلى `nalp`
6. احفظ التغييرات (Save)
7. اضغط **Redeploy** لآخر deployment أو ادفع أي تغيير جديد

بعدها سيعمل البناء لأن التطبيق موجود الآن في `nalp/`.
