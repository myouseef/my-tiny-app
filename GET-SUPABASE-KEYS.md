# كيفية الحصول على Supabase API Keys 🔑

## الخطوات السريعة

### 1. اذهب إلى Supabase Dashboard
```
https://supabase.com/dashboard
```

### 2. افتح مشروعك
اختر مشروع `my-tiny-app`

### 3. اذهب إلى Project Settings
اضغط على أيقونة **الترس ⚙️** في الأسفل

### 4. اختر API من القائمة الجانبية

### 5. انسخ المعلومات التالية:

#### Project URL:
```
https://uprbqxwyrduvjflxkrkf.supabase.co
```
**الموقع:** تحت "Project URL"

#### anon public key:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwcmJxeHd5cmR1dmpmbHhrcmtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE5NzU5ODcsImV4cCI6MjA0NzU1MTk4N30...
```
**الموقع:** تحت "Project API keys" → "anon public"

---

## ⚠️ مهم

- **anon public key** آمن للاستخدام في Frontend
- **service_role key** لا تستخدمه في Frontend أبداً!

---

## 📝 بعد الحصول على المفاتيح

أرسل لي:
1. Project URL
2. anon public key

وسأقوم بتحديث ملف `.env` تلقائياً!

---

**أو يمكنك تحديث `frontend/.env` يدوياً:**

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
