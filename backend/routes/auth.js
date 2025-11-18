// ملف مسارات المصادقة (Authentication Routes)
// يحتوي على endpoint تسجيل الدخول

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

// ===== POST /api/auth/login =====
// تسجيل الدخول باستخدام اسم المستخدم وكلمة المرور

router.post('/login', async (req, res) => {
  try {
    // 1. استخراج البيانات من الطلب
    const { username, password } = req.body;
    
    // 2. التحقق من وجود البيانات المطلوبة
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'يرجى إدخال اسم المستخدم وكلمة المرور'
      });
    }
    
    // 3. البحث عن المستخدم في قاعدة البيانات
    const db = req.app.locals.db;
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await db.query(query, [username]);
    
    // 4. التحقق من وجود المستخدم
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'اسم المستخدم أو كلمة المرور غير صحيحة'
      });
    }
    
    const user = result.rows[0];
    
    // 5. التحقق من كلمة المرور باستخدام bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.hashed_password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'اسم المستخدم أو كلمة المرور غير صحيحة'
      });
    }
    
    // 6. إنشاء JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d' // صالح لمدة 7 أيام
      }
    );
    
    // 7. إرسال الاستجابة الناجحة
    res.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      token: token,
      user: {
        id: user.id,
        username: user.username,
        createdAt: user.created_at
      }
    });
    
    // طباعة رسالة في Console للتطوير
    console.log(`✅ تسجيل دخول ناجح: ${username}`);
    
  } catch (error) {
    console.error('❌ خطأ في تسجيل الدخول:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في الخادم أثناء تسجيل الدخول'
    });
  }
});

// ===== POST /api/auth/verify =====
// التحقق من صحة JWT token (اختياري - للاختبار)

router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token مفقود'
      });
    }
    
    // التحقق من Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    res.json({
      success: true,
      message: 'Token صالح',
      data: decoded
    });
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token غير صالح'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token منتهي الصلاحية'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في التحقق من Token'
    });
  }
});

// ===== GET /api/auth/test =====
// مسار اختبار بسيط

router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'مسار المصادقة يعمل بنجاح!',
    endpoints: {
      login: 'POST /api/auth/login',
      verify: 'POST /api/auth/verify'
    }
  });
});

module.exports = router;
