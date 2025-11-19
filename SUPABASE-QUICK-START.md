# Supabase - البدء السريع ⚡

## 4 خطوات فقط!

### 1️⃣ إنشاء حساب
```
https://supabase.com → Sign in with GitHub
```

### 2️⃣ إنشاء Project
- **Name**: `my-tiny-app`
- **Password**: كلمة مرور قوية (احفظها!)
- **Region**: اختر الأقرب لك
- **Plan**: Free

### 3️⃣ تشغيل init.sql
1. اذهب إلى **SQL Editor**
2. اضغط **New query**
3. انسخ محتوى `backend/db/init.sql`
4. الصق والصق **Run**

✅ تم!

### 4️⃣ احصل على Connection String
1. **Project Settings** → **Database**
2. **Connection String** → **URI**
3. انسخ الرابط واستبدل `[YOUR-PASSWORD]` بكلمة مرورك

مثال:
```
postgresql://postgres:YOUR_PASSWORD@db.xxx.supabase.co:5432/postgres
```

### 5️⃣ حدّث backend/.env
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxx.supabase.co:5432/postgres
```

### 6️⃣ اختبر!
```bash
cd backend
npm start
```

يجب أن ترى:
```
✅ Database connected successfully
🚀 Server running on http://localhost:5000
```

---

## اختبار تسجيل الدخول

**POST** `http://localhost:5000/api/auth/login`

```json
{
  "username": "demo",
  "password": "demo123"
}
```

يجب أن تحصل على token ✅

---

**للتعليمات المفصلة**: راجع `SUPABASE-SETUP-GUIDE.md`
