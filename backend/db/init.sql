-- ملف إعداد قاعدة البيانات PostgreSQL
-- هذا الملف يحتوي على جميع الأوامر اللازمة لإنشاء الجداول والبيانات الأولية

-- إنشاء جدول المستخدمين
-- id: معرف فريد لكل مستخدم (يتم إنشاؤه تلقائياً)
-- username: اسم المستخدم (يجب أن يكون فريداً)
-- hashed_password: كلمة المرور المشفرة (باستخدام bcrypt)
-- created_at: تاريخ إنشاء الحساب

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  hashed_password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- إنشاء فهرس (index) على حقل username لتسريع عمليات البحث
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- إضافة مستخدم تجريبي للاختبار
-- username: demo
-- password: demo123
-- الكلمة المشفرة أدناه هي نتيجة تشفير "demo123" باستخدام bcrypt مع salt rounds = 10
-- يمكنك استخدام هذا المستخدم لاختبار تسجيل الدخول

INSERT INTO users (username, hashed_password) 
VALUES ('demo', '$2b$10$o40XHNf5JQGqSoxfWHSnp.bWcFoILeIVrdyqjzpuit7TW2Foq5q0O')
ON CONFLICT (username) DO NOTHING;

-- ملاحظة: الكلمة المشفرة أعلاه هي مثال فقط
-- عند تشغيل التطبيق، سنستخدم bcrypt لتشفير كلمة المرور الحقيقية
-- يمكنك تشغيل السكريبت التالي في Node.js لتوليد كلمة مرور مشفرة:
-- const bcrypt = require('bcrypt');
-- bcrypt.hash('demo123', 10).then(hash => console.log(hash));

-- للتحقق من نجاح الإعداد، يمكنك تشغيل:
-- SELECT * FROM users;
