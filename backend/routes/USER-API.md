# User API - توثيق مسارات المستخدم المحمية 👤

هذا الملف يشرح كيفية استخدام endpoints المستخدم المحمية.

---

## 📋 المحتويات

- [نظرة عامة](#نظرة-عامة)
- [المصادقة المطلوبة](#المصادقة-المطلوبة)
- [Endpoints](#endpoints)
- [أمثلة الاستخدام](#أمثلة-الاستخدام)

---

## نظرة عامة

جميع endpoints في هذا الملف **محمية** وتتطلب:
- ✅ تسجيل دخول صحيح
- ✅ JWT Token صالح في Header

---

## المصادقة المطلوبة

يجب إرسال JWT Token في كل طلب:

```http
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

**كيفية الحصول على Token:**
1. سجل دخول عبر `POST /api/auth/login`
2. احفظ Token من الاستجابة
3. أرسله في Header مع كل طلب

---

## Endpoints

### 1. الحصول على معلومات المستخدم (Profile)

```http
GET /api/user/profile
Authorization: Bearer <token>
```

**الوصف**: يرجع معلومات المستخدم الحالي المسجل دخوله

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "تم جلب بيانات المستخدم بنجاح",
  "user": {
    "id": 1,
    "username": "demo",
    "createdAt": "2024-01-15T10:30:45.123Z"
  }
}
```

**Response (Error - 401):**
```json
{
  "success": false,
  "message": "غير مصرح - Token مفقود",
  "error": "NO_TOKEN"
}
```

**Response (Error - 404):**
```json
{
  "success": false,
  "message": "المستخدم غير موجود"
}
```

---

### 2. معلومات المستخدم (اختصار)

```http
GET /api/user/me
Authorization: Bearer <token>
```

**الوصف**: نفس `/profile` لكن بمسار أقصر

**Response (Success - 200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "demo",
    "created_at": "2024-01-15T10:30:45.123Z"
  }
}
```

---

### 3. بيانات Dashboard

```http
GET /api/user/dashboard
Authorization: Bearer <token>
```

**الوصف**: يرجع بيانات Dashboard للمستخدم مع إحصائيات

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "مرحباً demo!",
  "dashboard": {
    "user": {
      "id": 1,
      "username": "demo",
      "memberSince": "2024-01-15T10:30:45.123Z",
      "daysSinceJoined": 5
    },
    "stats": {
      "loginCount": 1,
      "lastLogin": "2024-01-20T14:25:30.456Z"
    },
    "welcomeMessage": "مرحباً بك في لوحة التحكم، demo! 🎉"
  }
}
```

---

### 4. تسجيل الخروج

```http
POST /api/user/logout
Authorization: Bearer <token>
```

**الوصف**: تسجيل خروج (في الواقع يتم في Frontend بحذف Token)

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "تم تسجيل الخروج بنجاح",
  "note": "تأكد من حذف Token من localStorage في Frontend"
}
```

**ملاحظة**: في JWT، تسجيل الخروج يتم في Frontend بحذف Token من localStorage. هذا endpoint للتوثيق فقط.

---

### 5. اختبار المسار

```http
GET /api/user/test
Authorization: Bearer <token>
```

**الوصف**: مسار اختبار بسيط للتحقق من عمل المصادقة

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "مسارات المستخدم المحمية تعمل بنجاح!",
  "user": {
    "userId": 1,
    "username": "demo",
    "iat": 1705315845,
    "exp": 1705920645
  },
  "endpoints": {
    "profile": "GET /api/user/profile",
    "me": "GET /api/user/me",
    "dashboard": "GET /api/user/dashboard",
    "logout": "POST /api/user/logout"
  }
}
```

---

## أمثلة الاستخدام

### باستخدام curl

#### 1. الحصول على Token أولاً:

```bash
# تسجيل الدخول
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo123"}' \
  | jq -r '.token')

echo "Token: $TOKEN"
```

#### 2. استخدام Token للوصول إلى Profile:

```bash
curl -X GET http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer $TOKEN"
```

#### 3. الوصول إلى Dashboard:

```bash
curl -X GET http://localhost:5000/api/user/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

#### 4. تسجيل الخروج:

```bash
curl -X POST http://localhost:5000/api/user/logout \
  -H "Authorization: Bearer $TOKEN"
```

---

### باستخدام JavaScript (Fetch API)

```javascript
// دالة مساعدة لإرسال طلبات محمية
async function fetchProtected(endpoint) {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.error('لا يوجد token - يرجى تسجيل الدخول أولاً');
    return null;
  }
  
  try {
    const response = await fetch(`http://localhost:5000${endpoint}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (response.status === 401) {
      console.error('Token غير صالح أو منتهي - يرجى تسجيل الدخول مرة أخرى');
      localStorage.removeItem('token');
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('خطأ في الاتصال:', error);
    return null;
  }
}

// استخدام:

// 1. الحصول على Profile
const profile = await fetchProtected('/api/user/profile');
console.log('Profile:', profile);

// 2. الحصول على Dashboard
const dashboard = await fetchProtected('/api/user/dashboard');
console.log('Dashboard:', dashboard);

// 3. تسجيل الخروج
async function logout() {
  const token = localStorage.getItem('token');
  
  await fetch('http://localhost:5000/api/user/logout', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  // حذف Token من localStorage
  localStorage.removeItem('token');
  console.log('تم تسجيل الخروج');
  
  // إعادة التوجيه لصفحة تسجيل الدخول
  window.location.href = '/login';
}
```

---

### باستخدام Axios

```javascript
import axios from 'axios';

// إعداد Axios مع Token تلقائياً
const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// إضافة Token تلقائياً لكل طلب
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// معالجة أخطاء 401 تلقائياً
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Token منتهي - إعادة التوجيه لتسجيل الدخول');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// استخدام:

// 1. الحصول على Profile
const getProfile = async () => {
  try {
    const response = await api.get('/api/user/profile');
    console.log('Profile:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ:', error);
  }
};

// 2. الحصول على Dashboard
const getDashboard = async () => {
  try {
    const response = await api.get('/api/user/dashboard');
    console.log('Dashboard:', response.data);
    return response.data;
  } catch (error) {
    console.error('خطأ:', error);
  }
};

// 3. تسجيل الخروج
const logout = async () => {
  try {
    await api.post('/api/user/logout');
    localStorage.removeItem('token');
    window.location.href = '/login';
  } catch (error) {
    console.error('خطأ:', error);
  }
};
```

---

### باستخدام Postman

#### إعداد Postman:

1. **إنشاء Environment**:
   - اسم: `Learning Project`
   - متغير: `token` (سيتم ملؤه تلقائياً)
   - متغير: `baseUrl` = `http://localhost:5000`

2. **تسجيل الدخول وحفظ Token**:
   - Method: `POST`
   - URL: `{{baseUrl}}/api/auth/login`
   - Body (JSON):
     ```json
     {
       "username": "demo",
       "password": "demo123"
     }
     ```
   - في تبويب "Tests"، أضف:
     ```javascript
     const response = pm.response.json();
     if (response.token) {
       pm.environment.set("token", response.token);
     }
     ```

3. **استخدام Token في الطلبات**:
   - Method: `GET`
   - URL: `{{baseUrl}}/api/user/profile`
   - في تبويب "Authorization":
     - Type: `Bearer Token`
     - Token: `{{token}}`

---

## رموز الأخطاء

| Status Code | المعنى | السبب | الحل |
|-------------|--------|-------|------|
| 200 | نجاح | الطلب نجح | - |
| 401 | غير مصرح | Token مفقود أو غير صالح | سجل دخول مرة أخرى |
| 404 | غير موجود | المستخدم غير موجود | تحقق من البيانات |
| 500 | خطأ في الخادم | خطأ داخلي | راجع سجلات الخادم |

---

## Flow الكامل

```
1. المستخدم يسجل دخول
   POST /api/auth/login
   ↓
2. Frontend يحفظ Token في localStorage
   localStorage.setItem('token', token)
   ↓
3. المستخدم يطلب بياناته
   GET /api/user/profile
   Header: Authorization: Bearer <token>
   ↓
4. Backend يتحقق من Token (middleware)
   ↓
5. إذا صالح: يرجع البيانات
   إذا غير صالح: يرجع 401
   ↓
6. عند تسجيل الخروج
   POST /api/user/logout
   localStorage.removeItem('token')
```

---

## ملاحظات مهمة

### ✅ أفضل الممارسات:

1. **احفظ Token بشكل آمن** - استخدم localStorage أو sessionStorage
2. **تحقق من انتهاء Token** - تعامل مع 401 بإعادة التوجيه للـ Login
3. **لا ترسل Token في URL** - استخدم Header دائماً
4. **احذف Token عند الخروج** - لا تتركه في localStorage

### ⚠️ تجنب:

1. ❌ تخزين Token في Cookies بدون httpOnly
2. ❌ إرسال طلبات محمية بدون Token
3. ❌ عدم معالجة أخطاء 401
4. ❌ نسيان حذف Token عند تسجيل الخروج

---

## اختبار سريع

```bash
# 1. تسجيل الدخول
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo123"}'

# 2. نسخ Token من الاستجابة

# 3. اختبار Profile
curl http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# 4. اختبار Dashboard
curl http://localhost:5000/api/user/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

**مبروك! Protected Endpoints جاهزة للاستخدام! 🎉**
