# دليل Middleware - التحقق من المصادقة 🔐

هذا الدليل يشرح كيفية استخدام middleware المصادقة لحماية endpoints.

---

## 📋 المحتويات

- [ما هو Middleware؟](#ما-هو-middleware)
- [Middlewares المتاحة](#middlewares-المتاحة)
- [كيفية الاستخدام](#كيفية-الاستخدام)
- [أمثلة عملية](#أمثلة-عملية)
- [رموز الأخطاء](#رموز-الأخطاء)

---

## ما هو Middleware؟

**Middleware** هو دالة تعمل بين استقبال الطلب (Request) وإرسال الاستجابة (Response).

```
Request → Middleware → Route Handler → Response
```

في حالتنا، الـ middleware يتحقق من JWT Token قبل السماح بالوصول إلى endpoint محمي.

---

## Middlewares المتاحة

### 1. authenticateToken

**الوظيفة**: التحقق من وجود وصحة JWT Token (مطلوب)

**الاستخدام**: للـ endpoints المحمية التي تتطلب تسجيل دخول

**السلوك**:
- ✅ إذا كان Token صالح: يسمح بالمرور ويضيف `req.user`
- ❌ إذا كان Token مفقود أو غير صالح: يرجع 401 Unauthorized

### 2. optionalAuth

**الوظيفة**: التحقق من Token إذا كان موجوداً (اختياري)

**الاستخدام**: للـ endpoints التي تعمل مع وبدون تسجيل دخول

**السلوك**:
- ✅ إذا كان Token صالح: يضيف `req.user`
- ✅ إذا لم يكن Token موجود: يضع `req.user = null` ويتابع

### 3. checkUserOwnership

**الوظيفة**: التحقق من أن المستخدم يطلب بياناته الخاصة

**الاستخدام**: بعد `authenticateToken` للتحقق من الصلاحيات

**السلوك**:
- ✅ إذا كان userId في الطلب = userId المصادق: يسمح بالمرور
- ❌ إذا كان مختلف: يرجع 403 Forbidden

---

## كيفية الاستخدام

### الخطوة 1: استيراد Middleware

```javascript
const { authenticateToken, optionalAuth, checkUserOwnership } = require('../middleware/auth');
```

### الخطوة 2: تطبيق Middleware على Route

```javascript
// endpoint محمي - يتطلب تسجيل دخول
router.get('/profile', authenticateToken, (req, res) => {
  // req.user متاح هنا
  res.json({ user: req.user });
});
```

### الخطوة 3: استخدام معلومات المستخدم

```javascript
router.get('/dashboard', authenticateToken, async (req, res) => {
  // الوصول إلى معلومات المستخدم من Token
  const userId = req.user.userId;
  const username = req.user.username;
  
  // استخدام المعلومات
  const data = await getUserData(userId);
  res.json({ username, data });
});
```

---

## أمثلة عملية

### مثال 1: Endpoint محمي بسيط

```javascript
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// GET /api/user/profile - يتطلب تسجيل دخول
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // جلب بيانات المستخدم من قاعدة البيانات
    const db = req.app.locals.db;
    const result = await db.query(
      'SELECT id, username, created_at FROM users WHERE id = $1',
      [userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }
    
    res.json({
      success: true,
      user: result.rows[0]
    });
    
  } catch (error) {
    console.error('خطأ:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في الخادم'
    });
  }
});

module.exports = router;
```

### مثال 2: Endpoint مع Optional Auth

```javascript
// GET /api/posts - يعمل مع وبدون تسجيل دخول
router.get('/posts', optionalAuth, async (req, res) => {
  try {
    const db = req.app.locals.db;
    
    // إذا كان المستخدم مسجل دخول
    if (req.user) {
      // عرض المنشورات الخاصة والعامة
      const posts = await db.query(
        'SELECT * FROM posts WHERE user_id = $1 OR is_public = true',
        [req.user.userId]
      );
      return res.json({ posts: posts.rows, authenticated: true });
    }
    
    // إذا لم يكن مسجل دخول
    // عرض المنشورات العامة فقط
    const posts = await db.query('SELECT * FROM posts WHERE is_public = true');
    res.json({ posts: posts.rows, authenticated: false });
    
  } catch (error) {
    console.error('خطأ:', error);
    res.status(500).json({ success: false, message: 'حدث خطأ' });
  }
});
```

### مثال 3: Endpoint مع User Ownership Check

```javascript
// GET /api/user/:userId/settings - يتطلب أن يكون المستخدم نفسه
router.get('/:userId/settings', 
  authenticateToken,           // أولاً: التحقق من Token
  checkUserOwnership,          // ثانياً: التحقق من الصلاحية
  async (req, res) => {
    try {
      const userId = req.user.userId;
      
      // جلب إعدادات المستخدم
      const db = req.app.locals.db;
      const result = await db.query(
        'SELECT * FROM user_settings WHERE user_id = $1',
        [userId]
      );
      
      res.json({
        success: true,
        settings: result.rows[0]
      });
      
    } catch (error) {
      console.error('خطأ:', error);
      res.status(500).json({ success: false, message: 'حدث خطأ' });
    }
  }
);
```

### مثال 4: تطبيق Middleware على مجموعة Routes

```javascript
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// تطبيق middleware على جميع routes في هذا الملف
router.use(authenticateToken);

// جميع هذه الـ routes محمية تلقائياً
router.get('/dashboard', (req, res) => {
  res.json({ message: 'Dashboard', user: req.user });
});

router.get('/settings', (req, res) => {
  res.json({ message: 'Settings', user: req.user });
});

router.post('/update-profile', (req, res) => {
  res.json({ message: 'Profile updated', user: req.user });
});

module.exports = router;
```

---

## رموز الأخطاء

### 401 Unauthorized

**السبب**: Token مفقود، غير صالح، أو منتهي

**الاستجابات الممكنة**:

```json
// Token مفقود
{
  "success": false,
  "message": "غير مصرح - Token مفقود",
  "error": "NO_TOKEN"
}

// Token منتهي
{
  "success": false,
  "message": "Token منتهي الصلاحية - يرجى تسجيل الدخول مرة أخرى",
  "error": "TOKEN_EXPIRED",
  "expiredAt": "2024-01-15T10:30:45.000Z"
}

// Token غير صالح
{
  "success": false,
  "message": "Token غير صالح",
  "error": "INVALID_TOKEN"
}
```

### 403 Forbidden

**السبب**: المستخدم مصادق لكن لا يملك الصلاحية

```json
{
  "success": false,
  "message": "غير مصرح - لا يمكنك الوصول إلى بيانات مستخدم آخر",
  "error": "FORBIDDEN"
}
```

### 500 Internal Server Error

**السبب**: خطأ في الخادم

```json
{
  "success": false,
  "message": "حدث خطأ في التحقق من المصادقة",
  "error": "INTERNAL_ERROR"
}
```

---

## كيفية إرسال Token من Frontend

### باستخدام Fetch API

```javascript
const token = localStorage.getItem('token');

fetch('http://localhost:5000/api/user/profile', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

### باستخدام Axios

```javascript
import axios from 'axios';

const token = localStorage.getItem('token');

axios.get('http://localhost:5000/api/user/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(response => console.log(response.data))
.catch(error => console.error('Error:', error));
```

### باستخدام curl

```bash
curl -X GET http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## معلومات req.user

بعد المرور عبر `authenticateToken`، يحتوي `req.user` على:

```javascript
{
  userId: 1,                    // معرف المستخدم
  username: "demo",             // اسم المستخدم
  iat: 1705315845,             // وقت إصدار Token (Unix timestamp)
  exp: 1705920645              // وقت انتهاء Token (Unix timestamp)
}
```

---

## نصائح مهمة

### ✅ أفضل الممارسات:

1. **استخدم HTTPS في الإنتاج** - لحماية Token أثناء النقل
2. **لا تخزن معلومات حساسة في Token** - Token يمكن فك تشفيره
3. **استخدم مدة صلاحية معقولة** - حالياً 7 أيام
4. **تحقق من Token في كل طلب** - لا تثق بالـ Frontend
5. **احفظ JWT_SECRET بشكل آمن** - لا ترفعه على GitHub

### ⚠️ تجنب:

1. ❌ إرسال Token في URL (استخدم Header)
2. ❌ تخزين Token في Cookies بدون httpOnly
3. ❌ استخدام نفس JWT_SECRET في التطوير والإنتاج
4. ❌ عدم التحقق من انتهاء صلاحية Token

---

## اختبار Middleware

### اختبار بدون Token:

```bash
curl http://localhost:5000/api/user/profile
# النتيجة: 401 Unauthorized
```

### اختبار مع Token صحيح:

```bash
# أولاً: احصل على Token
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"demo","password":"demo123"}' \
  | jq -r '.token')

# ثانياً: استخدم Token
curl http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer $TOKEN"
# النتيجة: 200 OK مع بيانات المستخدم
```

### اختبار مع Token منتهي:

```bash
curl http://localhost:5000/api/user/profile \
  -H "Authorization: Bearer expired_token_here"
# النتيجة: 401 Token منتهي الصلاحية
```

---

## الخطوة التالية

بعد إتمام Middleware:
- ✅ المهمة 4: بناء Middleware للحماية - **مكتملة**
- ⏭️ المهمة 5: بناء Protected Endpoints

---

**مبروك! Middleware جاهز للاستخدام! 🎉**
