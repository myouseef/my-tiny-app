# Authentication API - توثيق مسارات المصادقة 🔐

هذا الملف يشرح كيفية استخدام endpoints المصادقة في Backend API.

---

## 📋 المحتويات

- [نظرة عامة](#نظرة-عامة)
- [Endpoints](#endpoints)
- [أمثلة الاستخدام](#أمثلة-الاستخدام)
- [رموز الأخطاء](#رموز-الأخطاء)

---

## نظرة عامة

نظام المصادقة يستخدم:
- **bcrypt** لتشفير كلمات المرور
- **JWT (JSON Web Tokens)** للمصادقة
- **Token صالح لمدة 7 أيام**

---

## Endpoints

### 1. تسجيل الدخول (Login)

```http
POST /api/auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "demo",
  "password": "demo123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "تم تسجيل الدخول بنجاح",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "demo",
    "createdAt": "2024-01-15T10:30:45.123Z"
  }
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "يرجى إدخال اسم المستخدم وكلمة المرور"
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "اسم المستخدم أو كلمة المرور غير صحيحة"
}
```

---

### 2. التحقق من Token (Verify)

```http
POST /api/auth/verify
Content-Type: application/json
```

**Request Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Token صالح",
  "data": {
    "userId": 1,
    "username": "demo",
    "iat": 1705315845,
    "exp": 1705920645
  }
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "Token غير صالح"
}
```

أو:
```json
{
  "success": false,
  "message": "Token منتهي الصلاحية"
}
```

---

### 3. اختبار المسار (Test)

```http
GET /api/auth/test
```

**Response (200):**
```json
{
  "success": true,
  "message": "مسار المصادقة يعمل بنجاح!",
  "endpoints": {
    "login": "POST /api/auth/login",
    "verify": "POST /api/auth/verify"
  }
}
```

---

## أمثلة الاستخدام

### باستخدام curl

#### تسجيل الدخول:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"demo\",\"password\":\"demo123\"}"
```

#### التحقق من Token:
```bash
curl -X POST http://localhost:5000/api/auth/verify \
  -H "Content-Type: application/json" \
  -d "{\"token\":\"YOUR_TOKEN_HERE\"}"
```

---

### باستخدام JavaScript (Fetch API)

#### تسجيل الدخول:
```javascript
async function login(username, password) {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
      // حفظ Token في localStorage
      localStorage.setItem('token', data.token);
      console.log('تم تسجيل الدخول بنجاح!');
      return data;
    } else {
      console.error('خطأ:', data.message);
      return null;
    }
  } catch (error) {
    console.error('خطأ في الاتصال:', error);
    return null;
  }
}

// استخدام:
login('demo', 'demo123');
```

#### التحقق من Token:
```javascript
async function verifyToken(token) {
  try {
    const response = await fetch('http://localhost:5000/api/auth/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token })
    });
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('خطأ في التحقق:', error);
    return false;
  }
}

// استخدام:
const token = localStorage.getItem('token');
const isValid = await verifyToken(token);
```

---

### باستخدام Postman

#### تسجيل الدخول:

1. افتح Postman
2. أنشئ طلب جديد:
   - Method: `POST`
   - URL: `http://localhost:5000/api/auth/login`
3. اذهب إلى تبويب "Body"
4. اختر "raw" و "JSON"
5. أدخل:
```json
{
  "username": "demo",
  "password": "demo123"
}
```
6. اضغط "Send"
7. انسخ الـ `token` من الاستجابة

---

## رموز الأخطاء

| Status Code | المعنى | السبب |
|-------------|--------|-------|
| 200 | نجاح | تم تسجيل الدخول بنجاح |
| 400 | طلب خاطئ | بيانات مفقودة (username أو password) |
| 401 | غير مصرح | بيانات اعتماد خاطئة أو token غير صالح |
| 500 | خطأ في الخادم | خطأ داخلي في الخادم |

---

## كيفية عمل النظام

### 1. تسجيل الدخول (Login Flow)

```
1. المستخدم يرسل username و password
   ↓
2. Backend يبحث عن المستخدم في قاعدة البيانات
   ↓
3. Backend يقارن كلمة المرور باستخدام bcrypt.compare()
   ↓
4. إذا كانت صحيحة، Backend ينشئ JWT token
   ↓
5. Backend يرسل Token للمستخدم
   ↓
6. Frontend يحفظ Token في localStorage
```

### 2. استخدام Token

```
1. Frontend يرسل طلب لـ endpoint محمي
   ↓
2. Frontend يضيف Token في Header:
   Authorization: Bearer <token>
   ↓
3. Backend يتحقق من Token باستخدام jwt.verify()
   ↓
4. إذا كان صالحاً، Backend يسمح بالوصول
   ↓
5. إذا كان غير صالح، Backend يرجع 401 Unauthorized
```

---

## JWT Token Structure

عند فك تشفير Token، ستجد:

```json
{
  "userId": 1,
  "username": "demo",
  "iat": 1705315845,    // وقت الإصدار (Issued At)
  "exp": 1705920645     // وقت الانتهاء (Expiration)
}
```

- **iat**: وقت إنشاء Token (Unix timestamp)
- **exp**: وقت انتهاء صلاحية Token (Unix timestamp)
- **صلاحية Token**: 7 أيام من وقت الإنشاء

---

## الأمان

### ✅ ما يتم فعله:
- تشفير كلمات المرور باستخدام bcrypt
- استخدام JWT للمصادقة
- عدم إرجاع كلمة المرور في الاستجابة
- رسائل خطأ عامة (لا تكشف إذا كان username موجود أم لا)

### ⚠️ ملاحظات مهمة:
- احفظ Token في localStorage (أو sessionStorage)
- لا تشارك Token مع أحد
- Token صالح لمدة 7 أيام فقط
- استخدم HTTPS في الإنتاج

---

## اختبار سريع

### 1. اختبار المسار:
```bash
curl http://localhost:5000/api/auth/test
```

### 2. تسجيل دخول بالمستخدم التجريبي:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"demo\",\"password\":\"demo123\"}"
```

### 3. نسخ Token من الاستجابة واختباره:
```bash
curl -X POST http://localhost:5000/api/auth/verify \
  -H "Content-Type: application/json" \
  -d "{\"token\":\"YOUR_TOKEN_HERE\"}"
```

---

## الخطوة التالية

بعد إتمام نظام المصادقة:
- ✅ المهمة 3: بناء نظام المصادقة - **مكتملة**
- ⏭️ المهمة 4: بناء Middleware للحماية
- ⏭️ المهمة 5: بناء Protected Endpoints

---

**مبروك! نظام المصادقة جاهز! 🎉**
