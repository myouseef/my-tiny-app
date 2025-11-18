// سكريبت لتوليد كلمة مرور مشفرة باستخدام bcrypt
// هذا السكريبت يساعدك في إنشاء كلمات مرور مشفرة لإضافتها إلى قاعدة البيانات

const bcrypt = require('bcrypt');

// عدد جولات التشفير (salt rounds)
// كلما زاد الرقم، زاد الأمان ولكن زاد الوقت المطلوب
const saltRounds = 10;

// كلمة المرور التي نريد تشفيرها
const password = 'demo123';

// تشفير كلمة المرور
bcrypt.hash(password, saltRounds)
  .then(hash => {
    console.log('\n=================================');
    console.log('كلمة المرور الأصلية:', password);
    console.log('كلمة المرور المشفرة:', hash);
    console.log('=================================\n');
    console.log('يمكنك نسخ الكلمة المشفرة أعلاه واستخدامها في ملف init.sql');
    console.log('\n');
  })
  .catch(err => {
    console.error('خطأ في التشفير:', err);
  });
