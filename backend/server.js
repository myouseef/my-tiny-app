// ملف الخادم الرئيسي (Main Server File)
// هذا الملف يحتوي على إعداد Express server وجميع الإعدادات الأساسية

// استيراد المكتبات المطلوبة
require('dotenv').config(); // لقراءة متغيرات البيئة من ملف .env
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

// إنشاء تطبيق Express
const app = express();

// قراءة رقم المنفذ من متغيرات البيئة أو استخدام 5000 كقيمة افتراضية
const PORT = process.env.PORT || 5000;

// ===== إعداد قاعدة البيانات (Database Setup) =====
// إنشاء pool للاتصال بقاعدة البيانات PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// اختبار الاتصال بقاعدة البيانات عند بدء التشغيل
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ خطأ في الاتصال بقاعدة البيانات:', err.message);
    console.log('💡 تأكد من:');
    console.log('   1. تشغيل PostgreSQL');
    console.log('   2. صحة DATABASE_URL في ملف .env');
    console.log('   3. وجود قاعدة البيانات المحددة\n');
  } else {
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح!');
    release(); // إطلاق الاتصال
  }
});

// جعل pool متاحاً لجميع الملفات الأخرى
app.locals.db = pool;

// ===== Middleware (البرمجيات الوسيطة) =====

// 1. CORS - للسماح للـ Frontend بالوصول إلى الـ Backend
// CORS = Cross-Origin Resource Sharing
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // رابط Frontend
  credentials: true, // للسماح بإرسال cookies
};
app.use(cors(corsOptions));

// 2. Body Parser - لقراءة JSON من الطلبات
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Logger - لطباعة معلومات عن كل طلب (للتطوير فقط)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.path}`);
    next();
  });
}

// ===== Routes (المسارات) =====

// المسار الرئيسي - للتحقق من عمل الخادم
app.get('/', (req, res) => {
  res.json({
    message: 'مرحباً! الخادم يعمل بنجاح 🚀',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth/*',
      user: '/api/user/*'
    }
  });
});

// مسار الصحة (Health Check) - للتحقق من عمل الخادم وقاعدة البيانات
app.get('/api/health', async (req, res) => {
  try {
    // اختبار الاتصال بقاعدة البيانات
    const result = await pool.query('SELECT NOW()');
    
    res.json({
      status: 'ok',
      message: 'الخادم يعمل بشكل صحيح',
      database: 'connected',
      timestamp: result.rows[0].now,
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    console.error('❌ خطأ في health check:', error);
    res.status(500).json({
      status: 'error',
      message: 'خطأ في الاتصال بقاعدة البيانات',
      database: 'disconnected'
    });
  }
});

// مسارات المصادقة (Authentication Routes)
app.use('/api/auth', require('./routes/auth'));

// مسارات المستخدم المحمية (Protected User Routes)
app.use('/api/user', require('./routes/user'));

// ===== Error Handling (معالجة الأخطاء) =====

// معالجة المسارات غير الموجودة (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'المسار غير موجود',
    path: req.path
  });
});

// معالجة الأخطاء العامة (Error Handler)
app.use((err, req, res, next) => {
  console.error('❌ خطأ في الخادم:', err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'حدث خطأ في الخادم',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ===== بدء تشغيل الخادم (Start Server) =====
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log('🚀 الخادم يعمل الآن!');
  console.log('📍 العنوان:', `http://localhost:${PORT}`);
  console.log('🌍 البيئة:', process.env.NODE_ENV || 'development');
  console.log('='.repeat(50) + '\n');
  console.log('💡 للاختبار، افتح المتصفح على:');
  console.log(`   http://localhost:${PORT}`);
  console.log(`   http://localhost:${PORT}/api/health`);
  console.log('\n⏹️  للإيقاف: اضغط Ctrl+C\n');
});

// معالجة إيقاف التشغيل بشكل صحيح (Graceful Shutdown)
process.on('SIGTERM', async () => {
  console.log('\n⏹️  جاري إيقاف الخادم...');
  await pool.end();
  console.log('✅ تم إغلاق الاتصالات بنجاح');
  process.exit(0);
});
