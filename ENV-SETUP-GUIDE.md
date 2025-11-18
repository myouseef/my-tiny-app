# دليل إعداد متغيرات البيئة (Environment Variables) 🔐

هذا الدليل يشرح كيفية إعداد متغيرات البيئة للمشروع في بيئات مختلفة.

---

## 📋 المحتويات

- [ما هي متغيرات البيئة؟](#ما-هي-متغيرات-البيئة)
- [Backend Environment Variables](#backend-environment-variables)
- [Frontend Environment Variables](#frontend-environment-variables)
- [إعداد التطوير المحلي](#إعداد-التطوير-المحلي)
- [إعداد الإنتاج](#إعداد-الإنتاج)
- [الأمان](#الأمان)

---

## ما هي متغيرات البيئة؟

**متغيرات البيئة (Environment Variables)** هي قيم يمكن تغييرها حسب البيئة (تطوير، إنتاج، اختبار) بدون تعديل الكود.

**لماذا نستخدمها؟**
- 🔐 حماية المعلومات الحساسة (كلمات المرور، مفاتيح API)
- 🔄 تغيير الإعدادات حسب البيئة
- 🚀 سهولة النشر على منصات مختلفة

---

## Backend Environment Variables

### الملف: `backend/.env`

```env
# ===== قاعدة البيانات (Database) =====
DATABASE_URL=postgresql://username:password@host:port/database_name

# ===== الأمان (Security) =====
JWT_SECRET=your_super_secret_key_here

# ===== الخادم (Server) =====
PORT=5000
NODE_ENV=development

# ===== Frontend =====
FRONTEND_URL=http://localhost:3000
```

### شرح المتغيرات:

#### 1. DATABASE_URL
**الوصف**: رابط الاتصال بقاعدة البيانات PostgreSQL

**الصيغة**:
```
postgresql://username:password@host:port/database_name
```

**أمثلة**:
```env
# التطوير المحلي
DATABASE_URL=postgresql://postgres:mypassword@localhost:5432/learning_db

# Render (الإنتاج)
DATABASE_URL=postgresql://user:pass@dpg-xxxxx.oregon-postgres.render.com/dbname
```

**كيفية الحصول عليه**:
- **محلياً**: استخدم بيانات PostgreSQL المحلية
- **Render**: انسخه من Render Dashboard → PostgreSQL → Internal Database URL

---

#### 2. JWT_SECRET
**الوصف**: مفتاح سري لتشفير JWT Tokens

**المتطلبات**:
- يجب أن يكون طويل (32 حرف على الأقل)
- يجب أن يكون عشوائي
- يجب أن يكون مختلف في كل بيئة

**كيفية توليده**:
```bash
# باستخدام Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# أو استخدم أي مولد عشوائي
```

**مثال**:
```env
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

⚠️ **مهم جداً**: لا تشارك هذا المفتاح أبداً!

---

#### 3. PORT
**الوصف**: رقم المنفذ الذي سيعمل عليه الخادم

**القيم الشائعة**:
- `5000` - التطوير المحلي
- `3000` - بديل
- يتم تعيينه تلقائياً في Render

**مثال**:
```env
PORT=5000
```

---

#### 4. NODE_ENV
**الوصف**: بيئة التشغيل

**القيم الممكنة**:
- `development` - التطوير
- `production` - الإنتاج
- `test` - الاختبار

**مثال**:
```env
# التطوير
NODE_ENV=development

# الإنتاج
NODE_ENV=production
```

---

#### 5. FRONTEND_URL
**الوصف**: رابط تطبيق Frontend (للـ CORS)

**أمثلة**:
```env
# التطوير المحلي
FRONTEND_URL=http://localhost:3000

# الإنتاج (Vercel)
FRONTEND_URL=https://your-app.vercel.app
```

---

## Frontend Environment Variables

### الملف: `frontend/.env`

```env
# رابط Backend API
VITE_API_URL=http://localhost:5000
```

### ⚠️ ملاحظة مهمة عن Vite:

في Vite، يجب أن تبدأ جميع المتغيرات بـ `VITE_`:

```env
✅ صحيح
VITE_API_URL=http://localhost:5000

❌ خطأ (لن يعمل)
API_URL=http://localhost:5000
```

### شرح المتغيرات:

#### VITE_API_URL
**الوصف**: رابط Backend API

**أمثلة**:
```env
# التطوير المحلي
VITE_API_URL=http://localhost:5000

# الإنتاج (Render)
VITE_API_URL=https://your-backend.onrender.com
```

### كيفية الوصول إليها في الكود:

```javascript
// في Vite
const apiUrl = import.meta.env.VITE_API_URL;

// ❌ لا تستخدم (هذا لـ Node.js فقط)
const apiUrl = process.env.VITE_API_URL;
```

---

## إعداد التطوير المحلي

### الخطوة 1: Backend

1. انتقل إلى مجلد backend:
```bash
cd backend
```

2. انسخ ملف `.env.example` إلى `.env`:
```bash
copy .env.example .env
```

3. عدّل ملف `.env`:
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/mydb
JWT_SECRET=your_generated_secret_key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

4. استبدل:
   - `YOUR_PASSWORD` بكلمة مرور PostgreSQL الخاصة بك
   - `your_generated_secret_key` بمفتاح عشوائي

### الخطوة 2: Frontend

1. انتقل إلى مجلد frontend:
```bash
cd frontend
```

2. انسخ ملف `.env.example` إلى `.env`:
```bash
copy .env.example .env
```

3. عدّل ملف `.env`:
```env
VITE_API_URL=http://localhost:5000
```

---

## إعداد الإنتاج

### Backend (Render)

1. اذهب إلى Render Dashboard
2. افتح Web Service الخاص بك
3. اذهب إلى "Environment"
4. أضف المتغيرات:

```
DATABASE_URL = [انسخه من PostgreSQL Internal URL]
JWT_SECRET = [مفتاح جديد للإنتاج]
NODE_ENV = production
FRONTEND_URL = https://your-app.vercel.app
```

### Frontend (Vercel)

1. اذهب إلى Vercel Dashboard
2. افتح Project الخاص بك
3. اذهب إلى "Settings" → "Environment Variables"
4. أضف:

```
VITE_API_URL = https://your-backend.onrender.com
```

5. اضغط "Redeploy" لتطبيق التغييرات

---

## الأمان

### ✅ أفضل الممارسات:

1. **لا ترفع ملفات .env على GitHub**
   - تأكد من وجودها في `.gitignore`
   - استخدم `.env.example` كنموذج

2. **استخدم مفاتيح مختلفة لكل بيئة**
   - مفتاح للتطوير
   - مفتاح مختلف للإنتاج

3. **لا تشارك المفاتيح السرية**
   - لا ترسلها في رسائل
   - لا تنشرها في منتديات
   - لا تضعها في الكود

4. **استخدم مفاتيح قوية**
   - طويلة (32+ حرف)
   - عشوائية
   - تحتوي على أحرف ورموز

### ⚠️ تجنب:

1. ❌ رفع `.env` على GitHub
2. ❌ استخدام نفس المفتاح في التطوير والإنتاج
3. ❌ كتابة المفاتيح مباشرة في الكود
4. ❌ مشاركة ملف `.env` مع الآخرين

---

## التحقق من الإعداد

### Backend:

```bash
cd backend
npm run db:test
```

يجب أن ترى:
```
✅ تم الاتصال بقاعدة البيانات بنجاح!
```

### Frontend:

```bash
cd frontend
npm run dev
```

يجب أن يعمل على: http://localhost:5173

---

## حل المشاكل

### المشكلة: "DATABASE_URL is not defined"

**الحل**:
1. تأكد من وجود ملف `.env` في مجلد `backend`
2. تأكد من صحة اسم المتغير: `DATABASE_URL`
3. أعد تشغيل الخادم

### المشكلة: "VITE_API_URL is undefined"

**الحل**:
1. تأكد من أن المتغير يبدأ بـ `VITE_`
2. أعد تشغيل خادم التطوير (`npm run dev`)
3. استخدم `import.meta.env` وليس `process.env`

### المشكلة: "password authentication failed"

**الحل**:
1. تحقق من كلمة المرور في `DATABASE_URL`
2. تأكد من تشغيل PostgreSQL
3. تأكد من صحة اسم قاعدة البيانات

---

## ملفات .env.example

### Backend (.env.example):

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/learning_db
JWT_SECRET=your_super_secret_key_change_this
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.example):

```env
VITE_API_URL=http://localhost:5000
```

---

## الخلاصة

✅ ملفات `.env` موجودة في `backend/` و `frontend/`
✅ ملفات `.env.example` موجودة كنماذج
✅ `.gitignore` يمنع رفع `.env` على GitHub
✅ المتغيرات مُعدّة للتطوير المحلي
✅ جاهز للنشر على Render و Vercel

---

**مبروك! متغيرات البيئة جاهزة! 🎉**
