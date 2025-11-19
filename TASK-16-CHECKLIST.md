# المهمة 16: Checklist - نشر على Vercel ✅

## الإعداد المحلي

- [x] ملف vercel.json موجود في frontend/
- [x] Frontend يعمل محلياً
- [x] Supabase Auth يعمل محلياً
- [x] Environment Variables جاهزة

---

## خطوات النشر على Vercel

### 1. إنشاء حساب
- [ ] اذهب إلى https://vercel.com
- [ ] Sign up with GitHub

### 2. إنشاء مشروع
- [ ] Add New → Project
- [ ] Import من GitHub
- [ ] اختر مستودع learning-deployment-project

### 3. إعداد المشروع
- [ ] Project Name: my-tiny-app
- [ ] Framework Preset: Vite
- [ ] Root Directory: **frontend** ⚠️ مهم!

### 4. Environment Variables
- [ ] VITE_SUPABASE_URL: https://uprbqxwyrduvjflxkrkf.supabase.co
- [ ] VITE_SUPABASE_ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

### 5. النشر
- [ ] اضغط Deploy
- [ ] انتظر حتى يكتمل البناء (1-3 دقائق)
- [ ] نسخ رابط التطبيق

### 6. الاختبار
- [ ] افتح رابط Vercel
- [ ] اختبر تسجيل الدخول (demo@example.com / demo123)
- [ ] اختبر Dashboard
- [ ] اختبر تسجيل الخروج
- [ ] تحقق من Developer Console (لا أخطاء)

---

## معلومات مهمة

### Environment Variables:
```
VITE_SUPABASE_URL=https://uprbqxwyrduvjflxkrkf.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwcmJxeHd5cmR1dmpmbHhrcmtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0OTEzNjAsImV4cCI6MjA3OTA2NzM2MH0.68w2O8lZhJHwnSFXbouktIoRhMhY2M4XHp30kyNHtBA
```

### Root Directory:
```
frontend
```
⚠️ **لا تنسَ هذا!** وإلا سيفشل البناء

---

## بعد النشر

- [ ] احفظ رابط Vercel
- [ ] شارك الرابط للاختبار
- [ ] انتقل للمهمة 18

---

**الدليل الكامل:** راجع `VERCEL-DEPLOYMENT-GUIDE.md`
