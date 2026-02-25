# دفع المشروع إلى GitHub

استبدل **YOUR_GITHUB_USERNAME** باسم مستخدمك على GitHub، ثم نفّذ في Terminal:

```powershell
cd c:\jassim-2\NALP

git remote add origin https://github.com/YOUR_GITHUB_USERNAME/NALP.git
git push -u origin main
```

**مثال** إذا كان اسمك `ahmad123`:
```powershell
git remote add origin https://github.com/ahmad123/NALP.git
git push -u origin main
```

إذا طُلب منك تسجيل الدخول، استخدم **Personal Access Token** بدلاً من كلمة المرور.
