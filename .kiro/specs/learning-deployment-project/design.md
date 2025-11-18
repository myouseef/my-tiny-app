# وثيقة التصميم - مشروع تعليمي للنشر والاستضافة

## نظرة عامة

هذا المشروع التعليمي يهدف إلى بناء تطبيق ويب كامل (Full-Stack) باستخدام أحدث التقنيات والأدوات. سنبني تطبيق بسيط يتكون من:
- **Frontend**: واجهة مستخدم تفاعلية باستخدام React + Vite
- **Backend**: خادم API باستخدام Node.js + Express
- **Database**: قاعدة بيانات PostgreSQL
- **Deployment**: نشر على Vercel (Frontend) و Render (Backend + Database)
- **Version Control**: إدارة الكود عبر GitHub

## شرح الأدوات المستخدمة

### 1. React (مكتبة JavaScript للواجهات)
**ما هي؟** مكتبة JavaScript تساعدك في بناء واجهات مستخدم تفاعلية بطريقة مكونات (Components).

**لماذا نستخدمها؟**
- سهلة التعلم والاستخدام
- تحديث الواجهة تلقائياً عند تغيير البيانات
- مجتمع كبير ومكتبات كثيرة

**كيف تعمل؟** تقسم الواجهة إلى مكونات صغيرة قابلة لإعادة الاستخدام.

### 2. Vite (أداة بناء سريعة)
**ما هي؟** أداة حديثة لبناء وتطوير تطبيقات JavaScript بسرعة فائقة.

**لماذا نستخدمها؟**
- سرعة عالية جداً في التطوير (Hot Module Replacement)
- بناء مُحسّن للإنتاج
- سهلة الإعداد

**كيف تعمل؟** تستخدم ES Modules الأصلية في المتصفح أثناء التطوير، وتبني ملفات محسنة للإنتاج.

### 3. Node.js + Express (خادم Backend)
**ما هي؟**
- **Node.js**: بيئة تشغيل JavaScript على الخادم
- **Express**: إطار عمل بسيط لبناء APIs

**لماذا نستخدمها؟**
- نفس اللغة (JavaScript) للـ Frontend والـ Backend
- سريعة وخفيفة
- سهلة في بناء REST APIs

**كيف تعمل؟** تستقبل طلبات HTTP من المتصفح وترد عليها ببيانات JSON.

### 4. PostgreSQL (قاعدة بيانات)
**ما هي؟** قاعدة بيانات علائقية (Relational Database) قوية ومفتوحة المصدر.

**لماذا نستخدمها؟**
- موثوقة وآمنة
- تدعم استعلامات SQL المعقدة
- مجانية ومدعومة من معظم منصات الاستضافة

**كيف تعمل؟** تخزن البيانات في جداول (Tables) مع علاقات بينها.

### 5. Vercel (استضافة Frontend)
**ما هي؟** منصة استضافة متخصصة في تطبيقات Frontend (خاصة React, Next.js).

**لماذا نستخدمها؟**
- نشر تلقائي من GitHub
- سريعة جداً (CDN عالمي)
- مجانية للمشاريع الشخصية
- HTTPS تلقائي

**كيف تعمل؟** تربط مستودع GitHub الخاص بك، وعند كل Push تبني وتنشر التطبيق تلقائياً.

### 6. Render (استضافة Backend + Database)
**ما هي؟** منصة استضافة شاملة للخوادم وقواعد البيانات.

**لماذا نستخدمها؟**
- تدعم Node.js و PostgreSQL
- نشر تلقائي من GitHub
- خطة مجانية متاحة
- سهلة الإعداد

**كيف تعمل؟** تربط مستودع GitHub، وتوفر قاعدة بيانات PostgreSQL، وتنشر الخادم تلقائياً.

### 7. GitHub (إدارة الكود)
**ما هي؟** منصة لاستضافة الكود المصدري باستخدام Git.

**لماذا نستخدمها؟**
- تتبع التغييرات في الكود
- التعاون مع الآخرين
- تفعيل النشر التلقائي (CI/CD)
- نسخ احتياطية للكود

**كيف تعمل؟** تحفظ نسخ من كودك مع سجل كامل للتغييرات.

## البنية المعمارية (Architecture)

```
┌─────────────────────────────────────────────────────────────┐
│                         المستخدم                             │
│                         (Browser)                            │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ HTTPS
                 │
┌────────────────▼────────────────────────────────────────────┐
│                    Vercel (Frontend)                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  React Application                                    │   │
│  │  - Home Page (/)                                      │   │
│  │  - Login Page (/login)                                │   │
│  │  - Dashboard Page (/dashboard) [Protected]           │   │
│  │  - React Router                                       │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ HTTPS API Calls
                 │
┌────────────────▼────────────────────────────────────────────┐
│                    Render (Backend)                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Express API Server                                   │   │
│  │  - POST /api/auth/login                               │   │
│  │  - GET /api/user/profile [Protected]                  │   │
│  │  - Middleware: JWT Verification                       │   │
│  └──────────────┬───────────────────────────────────────┘   │
│                 │                                             │
│                 │ SQL Queries                                 │
│                 │                                             │
│  ┌──────────────▼───────────────────────────────────────┐   │
│  │  PostgreSQL Database                                  │   │
│  │  - users table                                        │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                         GitHub                               │
│  - Source Code Repository                                    │
│  - Triggers Auto-Deployment to Vercel & Render              │
└─────────────────────────────────────────────────────────────┘
```

## المكونات والواجهات (Components & Interfaces)

### Frontend Components

#### 1. App Component (المكون الرئيسي)
```javascript
// المسؤول عن التوجيه (Routing) الرئيسي
- يحتوي على React Router
- يحدد المسارات (Routes)
- يدير حالة المصادقة العامة
```

#### 2. HomePage Component
```javascript
// الصفحة الرئيسية
- عرض رسالة ترحيب
- رابط لصفحة تسجيل الدخول
- شرح بسيط عن المشروع
```

#### 3. LoginPage Component
```javascript
// صفحة تسجيل الدخول
- نموذج (Form) باسم المستخدم وكلمة المرور
- زر تسجيل الدخول
- عرض رسائل الخطأ
- إعادة التوجيه بعد النجاح
```

#### 4. DashboardPage Component
```javascript
// الصفحة المحمية
- عرض معلومات المستخدم
- زر تسجيل الخروج
- محمية بـ ProtectedRoute
```

#### 5. ProtectedRoute Component
```javascript
// مكون حماية المسارات
- يتحقق من وجود Token
- يعيد التوجيه للـ Login إذا لم يكن مسجل دخول
```

### Backend API Endpoints

#### 1. POST /api/auth/login
```javascript
Request Body:
{
  "username": "string",
  "password": "string"
}

Response (Success - 200):
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "username": "user123"
  }
}

Response (Error - 401):
{
  "success": false,
  "message": "اسم المستخدم أو كلمة المرور غير صحيحة"
}
```

#### 2. GET /api/user/profile
```javascript
Headers:
{
  "Authorization": "Bearer jwt_token_here"
}

Response (Success - 200):
{
  "success": true,
  "user": {
    "id": 1,
    "username": "user123"
  }
}

Response (Error - 401):
{
  "success": false,
  "message": "غير مصرح"
}
```

#### 3. GET /api/health
```javascript
// للتحقق من عمل الخادم
Response (200):
{
  "status": "ok",
  "database": "connected"
}
```

## نماذج البيانات (Data Models)

### Users Table (جدول المستخدمين)

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  hashed_password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- مستخدم تجريبي للاختبار
-- username: demo
-- password: demo123
INSERT INTO users (username, hashed_password) 
VALUES ('demo', '$2b$10$...');  -- سيتم تشفيرها بـ bcrypt
```

### JWT Token Structure

```javascript
{
  "userId": 1,
  "username": "demo",
  "iat": 1234567890,  // وقت الإصدار
  "exp": 1234654290   // وقت الانتهاء (7 أيام)
}
```

## معالجة الأخطاء (Error Handling)

### Frontend Error Handling

1. **Network Errors**: عرض رسالة "خطأ في الاتصال بالخادم"
2. **401 Unauthorized**: إعادة التوجيه لصفحة تسجيل الدخول
3. **Validation Errors**: عرض رسائل تحت حقول الإدخال
4. **Loading States**: عرض مؤشر تحميل أثناء الطلبات

### Backend Error Handling

```javascript
// Middleware للأخطاء العامة
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'حدث خطأ في الخادم'
  });
});

// معالجة أخطاء قاعدة البيانات
try {
  // database operation
} catch (error) {
  if (error.code === '23505') {  // Unique violation
    return res.status(400).json({
      success: false,
      message: 'اسم المستخدم موجود بالفعل'
    });
  }
  throw error;
}
```

## الأمان (Security)

### 1. تشفير كلمات المرور
```javascript
// استخدام bcrypt لتشفير كلمات المرور
const bcrypt = require('bcrypt');
const saltRounds = 10;

// عند التسجيل
const hashedPassword = await bcrypt.hash(password, saltRounds);

// عند تسجيل الدخول
const isValid = await bcrypt.compare(password, hashedPassword);
```

### 2. JWT Tokens
```javascript
// إنشاء Token
const jwt = require('jsonwebtoken');
const token = jwt.sign(
  { userId: user.id, username: user.username },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

// التحقق من Token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

### 3. CORS Configuration
```javascript
// السماح للـ Frontend بالوصول للـ Backend
const cors = require('cors');
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### 4. Environment Variables
```javascript
// عدم تخزين المعلومات الحساسة في الكود
// استخدام ملف .env
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret_key_here
PORT=5000
```

## استراتيجية الاختبار (Testing Strategy)

### 1. Manual Testing (اختبار يدوي)
- اختبار تسجيل الدخول بمعلومات صحيحة
- اختبار تسجيل الدخول بمعلومات خاطئة
- اختبار الوصول للصفحة المحمية بدون تسجيل دخول
- اختبار تسجيل الخروج

### 2. Database Testing
- التحقق من الاتصال بقاعدة البيانات
- اختبار إضافة مستخدم جديد
- اختبار القيود (Constraints) مثل unique username

### 3. API Testing
- اختبار endpoints باستخدام Postman أو Thunder Client
- التحقق من استجابات الأخطاء
- اختبار JWT token validation

### 4. Deployment Testing
- التحقق من عمل التطبيق على Vercel
- التحقق من عمل API على Render
- اختبار الاتصال بين Frontend و Backend في الإنتاج

## إعداد البيئة (Environment Setup)

### متطلبات التطوير المحلي

```bash
# 1. Node.js (v18 أو أحدث)
# تحميل من: https://nodejs.org/

# 2. PostgreSQL (v14 أو أحدث)
# تحميل من: https://www.postgresql.org/download/

# 3. Git
# تحميل من: https://git-scm.com/

# 4. محرر كود (VS Code مُوصى به)
# تحميل من: https://code.visualstudio.com/
```

### هيكل المشروع

```
learning-deployment-project/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── .env
│   └── vercel.json
├── backend/
│   ├── db/
│   │   └── init.sql
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── user.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── .gitignore
└── README.md
```

## ملفات الإعداد (Configuration Files)

### 1. frontend/vite.config.js
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
})
```

### 2. frontend/vercel.json
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 3. backend/.env (مثال)
```
DATABASE_URL=postgresql://user:password@localhost:5432/learning_db
JWT_SECRET=your_super_secret_key_change_this
PORT=5000
NODE_ENV=development
```

### 4. frontend/.env (مثال)
```
VITE_API_URL=http://localhost:5000
```

## خطوات النشر (Deployment Steps)

### نشر Frontend على Vercel

1. **إنشاء حساب على Vercel**
   - اذهب إلى: https://vercel.com
   - سجل دخول باستخدام GitHub

2. **ربط المستودع**
   - اضغط "New Project"
   - اختر مستودع GitHub الخاص بك
   - حدد مجلد `frontend` كـ Root Directory

3. **إعداد Environment Variables**
   - أضف `VITE_API_URL` مع رابط Render API

4. **النشر**
   - اضغط "Deploy"
   - انتظر حتى ينتهي البناء

### نشر Backend على Render

1. **إنشاء حساب على Render**
   - اذهب إلى: https://render.com
   - سجل دخول باستخدام GitHub

2. **إنشاء PostgreSQL Database**
   - اضغط "New +" → "PostgreSQL"
   - اختر الخطة المجانية
   - احفظ الـ Internal Database URL

3. **إنشاء Web Service**
   - اضغط "New +" → "Web Service"
   - اختر مستودع GitHub
   - حدد مجلد `backend` كـ Root Directory
   - Build Command: `npm install`
   - Start Command: `node server.js`

4. **إعداد Environment Variables**
   - أضف `DATABASE_URL` (من خطوة 2)
   - أضف `JWT_SECRET`
   - أضف `NODE_ENV=production`

5. **النشر**
   - اضغط "Create Web Service"
   - انتظر حتى ينتهي النشر

## المراجع والموارد التعليمية

### وثائق رسمية
- React: https://react.dev/
- Vite: https://vitejs.dev/
- Express: https://expressjs.com/
- PostgreSQL: https://www.postgresql.org/docs/
- Vercel: https://vercel.com/docs
- Render: https://render.com/docs

### دروس مفيدة (بالعربية)
- أساسيات React
- Node.js و Express للمبتدئين
- SQL و PostgreSQL
- Git و GitHub

### أدوات مساعدة
- Postman: لاختبار APIs
- pgAdmin: لإدارة PostgreSQL
- VS Code Extensions:
  - ES7+ React/Redux/React-Native snippets
  - Thunder Client (اختبار APIs)
  - PostgreSQL (إدارة قواعد البيانات)
