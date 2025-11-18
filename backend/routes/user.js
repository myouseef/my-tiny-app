// ملف مسارات المستخدم المحمية (Protected User Routes)
// جميع المسارات هنا تتطلب تسجيل دخول

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// تطبيق middleware المصادقة على جميع المسارات في هذا الملف
router.use(authenticateToken);

// ===== GET /api/user/profile =====
// الحصول على معلومات المستخدم الحالي

router.get('/profile', async (req, res) => {
  try {
    // الحصول على userId من Token (تم إضافته بواسطة middleware)
    const userId = req.user.userId;
    
    // جلب بيانات المستخدم من قاعدة البيانات
    const db = req.app.locals.db;
    const query = 'SELECT id, username, created_at FROM users WHERE id = $1';
    const result = await db.query(query, [userId]);
    
    // التحقق من وجود المستخدم
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }
    
    const user = result.rows[0];
    
    // إرسال الاستجابة
    res.json({
      success: true,
      message: 'تم جلب بيانات المستخدم بنجاح',
      user: {
        id: user.id,
        username: user.username,
        createdAt: user.created_at
      }
    });
    
    // طباعة رسالة في Console للتطوير
    console.log(`✅ تم جلب بيانات المستخدم: ${user.username}`);
    
  } catch (error) {
    console.error('❌ خطأ في جلب بيانات المستخدم:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في الخادم أثناء جلب بيانات المستخدم'
    });
  }
});

// ===== GET /api/user/me =====
// نفس /profile لكن بمسار أقصر (اختصار)

router.get('/me', async (req, res) => {
  try {
    const userId = req.user.userId;
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
    console.error('❌ خطأ:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في الخادم'
    });
  }
});

// ===== GET /api/user/dashboard =====
// بيانات Dashboard للمستخدم

router.get('/dashboard', async (req, res) => {
  try {
    const userId = req.user.userId;
    const username = req.user.username;
    const db = req.app.locals.db;
    
    // جلب معلومات المستخدم
    const userResult = await db.query(
      'SELECT id, username, created_at FROM users WHERE id = $1',
      [userId]
    );
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }
    
    const user = userResult.rows[0];
    
    // حساب عدد الأيام منذ التسجيل
    const createdDate = new Date(user.created_at);
    const now = new Date();
    const daysSinceJoined = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));
    
    // إرسال بيانات Dashboard
    res.json({
      success: true,
      message: `مرحباً ${username}!`,
      dashboard: {
        user: {
          id: user.id,
          username: user.username,
          memberSince: user.created_at,
          daysSinceJoined: daysSinceJoined
        },
        stats: {
          loginCount: 1, // يمكن تطويره لاحقاً
          lastLogin: new Date().toISOString()
        },
        welcomeMessage: `مرحباً بك في لوحة التحكم، ${username}! 🎉`
      }
    });
    
    console.log(`✅ تم عرض Dashboard للمستخدم: ${username}`);
    
  } catch (error) {
    console.error('❌ خطأ في Dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في الخادم'
    });
  }
});

// ===== POST /api/user/logout =====
// تسجيل الخروج (في الواقع يتم في Frontend بحذف Token)
// هذا endpoint للتوثيق فقط

router.post('/logout', (req, res) => {
  // في JWT، تسجيل الخروج يتم في Frontend بحذف Token من localStorage
  // لكن يمكننا تسجيل الحدث هنا
  
  const username = req.user.username;
  console.log(`👋 تسجيل خروج: ${username}`);
  
  res.json({
    success: true,
    message: 'تم تسجيل الخروج بنجاح',
    note: 'تأكد من حذف Token من localStorage في Frontend'
  });
});

// ===== GET /api/user/test =====
// مسار اختبار بسيط

router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'مسارات المستخدم المحمية تعمل بنجاح!',
    user: req.user,
    endpoints: {
      profile: 'GET /api/user/profile',
      me: 'GET /api/user/me',
      dashboard: 'GET /api/user/dashboard',
      logout: 'POST /api/user/logout'
    }
  });
});

module.exports = router;
