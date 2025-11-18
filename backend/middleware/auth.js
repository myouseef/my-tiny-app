// Middleware للتحقق من JWT Token
// يستخدم هذا الـ middleware لحماية endpoints التي تتطلب تسجيل دخول

const jwt = require('jsonwebtoken');

/**
 * Middleware للتحقق من صحة JWT Token
 * 
 * كيفية الاستخدام:
 * router.get('/protected-route', authenticateToken, (req, res) => {
 *   // req.user يحتوي على معلومات المستخدم من Token
 *   res.json({ user: req.user });
 * });
 */
const authenticateToken = (req, res, next) => {
  try {
    // 1. استخراج Token من Header
    // التنسيق المتوقع: "Authorization: Bearer <token>"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // استخراج Token بعد كلمة Bearer
    
    // 2. التحقق من وجود Token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'غير مصرح - Token مفقود',
        error: 'NO_TOKEN'
      });
    }
    
    // 3. التحقق من صحة Token باستخدام JWT_SECRET
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        // معالجة أنواع مختلفة من الأخطاء
        
        if (err.name === 'TokenExpiredError') {
          // Token منتهي الصلاحية
          return res.status(401).json({
            success: false,
            message: 'Token منتهي الصلاحية - يرجى تسجيل الدخول مرة أخرى',
            error: 'TOKEN_EXPIRED',
            expiredAt: err.expiredAt
          });
        }
        
        if (err.name === 'JsonWebTokenError') {
          // Token غير صالح
          return res.status(401).json({
            success: false,
            message: 'Token غير صالح',
            error: 'INVALID_TOKEN'
          });
        }
        
        // خطأ آخر
        return res.status(401).json({
          success: false,
          message: 'فشل التحقق من Token',
          error: 'VERIFICATION_FAILED'
        });
      }
      
      // 4. Token صالح - إضافة معلومات المستخدم إلى request
      req.user = {
        userId: decoded.userId,
        username: decoded.username,
        iat: decoded.iat,  // وقت الإصدار
        exp: decoded.exp   // وقت الانتهاء
      };
      
      // طباعة رسالة في Console للتطوير
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔐 مستخدم مصادق: ${req.user.username} (ID: ${req.user.userId})`);
      }
      
      // 5. الانتقال إلى الـ middleware أو route handler التالي
      next();
    });
    
  } catch (error) {
    console.error('❌ خطأ في middleware المصادقة:', error);
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ في التحقق من المصادقة',
      error: 'INTERNAL_ERROR'
    });
  }
};

/**
 * Middleware اختياري للتحقق من Token (لا يرفض الطلب إذا لم يكن موجود)
 * مفيد للـ endpoints التي تعمل مع وبدون تسجيل دخول
 */
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      // لا يوجد token - نتابع بدون مصادقة
      req.user = null;
      return next();
    }
    
    // محاولة التحقق من Token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        // Token غير صالح - نتابع بدون مصادقة
        req.user = null;
      } else {
        // Token صالح - نضيف معلومات المستخدم
        req.user = {
          userId: decoded.userId,
          username: decoded.username
        };
      }
      next();
    });
    
  } catch (error) {
    console.error('❌ خطأ في optional auth middleware:', error);
    req.user = null;
    next();
  }
};

/**
 * Middleware للتحقق من أن المستخدم هو نفسه المطلوب
 * مفيد لـ endpoints مثل /api/user/:userId
 */
const checkUserOwnership = (req, res, next) => {
  try {
    const requestedUserId = parseInt(req.params.userId);
    const authenticatedUserId = req.user.userId;
    
    if (requestedUserId !== authenticatedUserId) {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح - لا يمكنك الوصول إلى بيانات مستخدم آخر',
        error: 'FORBIDDEN'
      });
    }
    
    next();
  } catch (error) {
    console.error('❌ خطأ في checkUserOwnership middleware:', error);
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ في التحقق من الصلاحيات'
    });
  }
};

// تصدير الـ middlewares
module.exports = {
  authenticateToken,
  optionalAuth,
  checkUserOwnership
};
