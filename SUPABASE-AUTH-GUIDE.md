# دليل استخدام Supabase Auth 🔐

## نظرة عامة

بدلاً من بناء Backend منفصل بـ Express، سنستخدم **Supabase** كـ Backend كامل:
- ✅ Authentication (تسجيل الدخول)
- ✅ Database (قاعدة البيانات)
- ✅ API (واجهة برمجية جاهزة)
- ✅ Real-time (تحديثات فورية)

**الميزة:** لا حاجة لنشر Backend منفصل على Render!

---

## الخطوة 1: تفعيل Supabase Auth

### 1.1 اذهب إلى Supabase Dashboard

```
https://supabase.com/dashboard
```

### 1.2 افتح مشروعك

اختر مشروع `my-tiny-app`

### 1.3 تفعيل Email Authentication

1. من القائمة الجانبية، اختر **Authentication**
2. اختر **Providers**
3. تأكد من تفعيل **Email** (يجب أن يكون مفعّل افتراضياً)

✅ تم! Authentication جاهز

---

## الخطوة 2: إنشاء مستخدم تجريبي

### 2.1 اذهب إلى Users

1. **Authentication** → **Users**
2. اضغط **Add user** → **Create new user**

### 2.2 املأ المعلومات

```
Email: demo@example.com
Password: demo123
Auto Confirm User: ✅ (مهم!)
```

3. اضغط **Create user**

✅ الآن لديك مستخدم تجريبي!

---

## الخطوة 3: الحصول على API Keys

### 3.1 اذهب إلى Project Settings

1. اضغط على أيقونة **الترس ⚙️** (Project Settings)
2. اختر **API** من القائمة الجانبية

### 3.2 انسخ المعلومات التالية

```
Project URL: https://uprbqxwyrduvjflxkrkf.supabase.co
anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **احفظ هذه المعلومات** - ستحتاجها في Frontend

---

## الخطوة 4: تثبيت Supabase Client في Frontend

### 4.1 افتح Terminal في مجلد frontend

```bash
cd frontend
npm install @supabase/supabase-js
```

### 4.2 إنشاء ملف Supabase Client

أنشئ ملف `frontend/src/supabaseClient.js`:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 4.3 تحديث frontend/.env

```env
VITE_SUPABASE_URL=https://uprbqxwyrduvjflxkrkf.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## الخطوة 5: تحديث LoginPage لاستخدام Supabase

### قبل (Express API):

```javascript
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
});
```

### بعد (Supabase Auth):

```javascript
import { supabase } from '../supabaseClient'

const handleLogin = async (e) => {
  e.preventDefault()
  setLoading(true)
  setError('')

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) throw error

    // تسجيل الدخول نجح!
    navigate('/dashboard')
  } catch (error) {
    setError(error.message)
  } finally {
    setLoading(false)
  }
}
```

---

## الخطوة 6: تحديث DashboardPage

### الحصول على معلومات المستخدم:

```javascript
import { supabase } from '../supabaseClient'
import { useEffect, useState } from 'react'

function DashboardPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // الحصول على المستخدم الحالي
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1>مرحباً {user?.email}</h1>
      <button onClick={handleLogout}>تسجيل الخروج</button>
    </div>
  )
}
```

---

## الخطوة 7: تحديث ProtectedRoute

```javascript
import { supabase } from '../supabaseClient'
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // التحقق من المستخدم
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    // الاستماع لتغييرات Auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) return <div>Loading...</div>

  return user ? children : <Navigate to="/login" />
}
```

---

## الخطوة 8: اختبار محلياً

### 8.1 شغّل Frontend فقط

```bash
cd frontend
npm run dev
```

⚠️ **لا حاجة لتشغيل Backend!** Supabase يوفر كل شيء

### 8.2 اختبر تسجيل الدخول

1. افتح http://localhost:5173
2. اذهب إلى صفحة Login
3. أدخل:
   ```
   Email: demo@example.com
   Password: demo123
   ```
4. يجب أن تنتقل إلى Dashboard

### 8.3 اختبر تسجيل الخروج

1. في Dashboard، اضغط "تسجيل الخروج"
2. يجب أن تعود للصفحة الرئيسية

✅ إذا عمل كل شيء، أنت جاهز!

---

## المقارنة: Express vs Supabase

### مع Express (الطريقة القديمة):

```
Frontend → Express API → PostgreSQL
         ↓
    يحتاج نشر على Render
    يحتاج CORS setup
    يحتاج JWT handling
```

### مع Supabase (الطريقة الجديدة):

```
Frontend → Supabase (كل شيء مدمج)
         ↓
    لا حاجة لنشر Backend
    CORS مُعد تلقائياً
    Auth مدمج
```

---

## الميزات الإضافية

### 1. Row Level Security (RLS)

يمكنك تأمين البيانات بحيث كل مستخدم يرى بياناته فقط:

```sql
-- في Supabase SQL Editor
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data"
ON users FOR SELECT
USING (auth.uid() = id);
```

### 2. Real-time Subscriptions

استمع للتغييرات في قاعدة البيانات فوراً:

```javascript
const subscription = supabase
  .channel('users')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, 
    payload => console.log('Change:', payload)
  )
  .subscribe()
```

### 3. Storage

رفع الملفات مباشرة:

```javascript
const { data, error } = await supabase.storage
  .from('avatars')
  .upload('user-avatar.png', file)
```

---

## استكشاف الأخطاء

### ❌ خطأ: "Invalid login credentials"

**الحل:**
- تأكد من Email و Password صحيحين
- تأكد من تفعيل "Auto Confirm User" عند إنشاء المستخدم

### ❌ خطأ: "supabaseUrl is required"

**الحل:**
- تأكد من وجود VITE_SUPABASE_URL في .env
- أعد تشغيل dev server بعد تحديث .env

### ❌ خطأ: "User not found"

**الحل:**
- تحقق من Users في Supabase Dashboard
- تأكد من إنشاء المستخدم التجريبي

---

## الخطوات التالية

بعد إكمال هذا الإعداد:

1. ✅ Frontend يستخدم Supabase Auth
2. ✅ لا حاجة لـ Express Backend
3. ✅ جاهز للنشر على Vercel فقط

**المهمة التالية:** نشر Frontend على Vercel (المهمة 16)

---

## روابط مفيدة

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Auth UI Components](https://supabase.com/docs/guides/auth/auth-helpers/auth-ui)

---

**تحديث:** 19 نوفمبر 2025  
**الحالة:** دليل جاهز لاستخدام Supabase Auth بدلاً من Express
