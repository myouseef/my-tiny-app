# دليل إعداد قاعدة البيانات PostgreSQL 📚

هذا الدليل يشرح خطوة بخطوة كيفية إعداد قاعدة البيانات للمشروع.

## 📋 المحتويات

1. [تثبيت PostgreSQL](#1-تثبيت-postgresql)
2. [إنشاء قاعدة البيانات](#2-إنشاء-قاعدة-البيانات)
3. [تشغيل سكريبت الإعداد](#3-تشغيل-سكريبت-الإعداد)
4. [اختبار الاتصال](#4-اختبار-الاتصال)
5. [حل المشاكل الشائعة](#5-حل-المشاكل-الشائعة)

---

## 1. تثبيت PostgreSQL

### Windows:
1. حمّل PostgreSQL من: https://www.postgresql.org/download/windows/
2. شغّل المثبت واتبع التعليمات
3. احفظ كلمة المرور التي تدخلها لمستخدم `postgres`
4. اختر Port 5432 (الافتراضي)

### macOS:
```bash
# باستخدام Homebrew
brew install postgresql@14
brew services start postgresql@14
```

### Linux (Ubuntu/Debian):
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### التحقق من التثبيت:
```bash
psql --version
# يجب أن يظهر: psql (PostgreSQL) 14.x أو أحدث
```

---

## 2. إنشاء قاعدة البيانات

### الطريقة 1: باستخدام سطر الأوامر (Command Line)

```bash
# الدخول إلى PostgreSQL
psql -U postgres

# إنشاء قاعدة بيانات جديدة
CREATE DATABASE learning_db;

# إنشاء مستخدم جديد (اختياري)
CREATE USER learning_user WITH PASSWORD 'your_password';

# منح الصلاحيات
GRANT ALL PRIVILEGES ON DATABASE learning_db TO learning_user;

# الخروج
\q
```

### الطريقة 2: باستخدام pgAdmin (واجهة رسومية)

1. افتح pgAdmin
2. اتصل بالخادم المحلي (localhost)
3. انقر بزر الماوس الأيمن على "Databases"
4. اختر "Create" → "Database"
5. أدخل الاسم: `learning_db`
6. اضغط "Save"

---

## 3. تشغيل سكريبت الإعداد

### الطريقة 1: باستخدام psql

```bash
# من مجلد المشروع الرئيسي
psql -U postgres -d learning_db -f backend/db/init.sql
```

إذا كنت تستخدم مستخدم مخصص:
```bash
psql -U learning_user -d learning_db -f backend/db/init.sql
```

### الطريقة 2: باستخدام pgAdmin

1. افتح pgAdmin
2. اتصل بقاعدة البيانات `learning_db`
3. افتح "Query Tool" (أيقونة البرق ⚡)
4. افتح ملف `backend/db/init.sql`
5. اضغط "Execute" (F5)

### الطريقة 3: باستخدام Node.js

```bash
# من مجلد backend
node db/run-init.js
```

---

## 4. اختبار الاتصال

### الخطوة 1: إعداد ملف .env

أنشئ ملف `.env` في مجلد `backend` إذا لم يكن موجوداً:

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/learning_db
JWT_SECRET=your_super_secret_key_here
PORT=5000
NODE_ENV=development
```

**ملاحظة**: استبدل `your_password` بكلمة المرور الفعلية.

### الخطوة 2: تشغيل سكريبت الاختبار

```bash
# من مجلد backend
node db/test-connection.js
```

### النتيجة المتوقعة:

```
🔄 جاري الاتصال بقاعدة البيانات...

✅ تم الاتصال بقاعدة البيانات بنجاح!

⏰ وقت الخادم: 2024-01-15 10:30:45
✅ جدول المستخدمين موجود

👥 عدد المستخدمين في قاعدة البيانات: 1

📋 قائمة المستخدمين:
  - ID: 1, Username: demo, Created: 2024-01-15 10:25:30

✅ تم إغلاق الاتصال بنجاح
```

---

## 5. حل المشاكل الشائعة

### ❌ المشكلة: "connection refused"

**السبب**: PostgreSQL غير مشغل

**الحل**:
```bash
# Windows (في Services)
# ابحث عن "postgresql" وشغّله

# macOS
brew services start postgresql@14

# Linux
sudo systemctl start postgresql
```

---

### ❌ المشكلة: "password authentication failed"

**السبب**: كلمة المرور خاطئة في DATABASE_URL

**الحل**:
1. تأكد من كلمة المرور في ملف `.env`
2. أو أعد تعيين كلمة المرور:
```bash
psql -U postgres
ALTER USER postgres PASSWORD 'new_password';
```

---

### ❌ المشكلة: "database does not exist"

**السبب**: قاعدة البيانات غير موجودة

**الحل**:
```bash
psql -U postgres
CREATE DATABASE learning_db;
\q
```

---

### ❌ المشكلة: "relation users does not exist"

**السبب**: لم يتم تشغيل init.sql

**الحل**:
```bash
psql -U postgres -d learning_db -f backend/db/init.sql
```

---

## 📊 هيكل قاعدة البيانات

### جدول users

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | معرف فريد للمستخدم |
| username | VARCHAR(50) | UNIQUE, NOT NULL | اسم المستخدم |
| hashed_password | VARCHAR(255) | NOT NULL | كلمة المرور المشفرة |
| created_at | TIMESTAMP | DEFAULT NOW() | تاريخ الإنشاء |

### Indexes (الفهارس)

- `idx_users_username`: فهرس على حقل username لتسريع البحث

---

## 🔐 المستخدم التجريبي

بعد تشغيل `init.sql`، سيكون لديك مستخدم تجريبي:

- **Username**: `demo`
- **Password**: `demo123`

يمكنك استخدامه لاختبار تسجيل الدخول في التطبيق.

---

## 🛠️ أوامر مفيدة

### الاتصال بقاعدة البيانات:
```bash
psql -U postgres -d learning_db
```

### عرض جميع الجداول:
```sql
\dt
```

### عرض هيكل جدول:
```sql
\d users
```

### عرض جميع المستخدمين:
```sql
SELECT id, username, created_at FROM users;
```

### حذف جميع البيانات (احذر!):
```sql
TRUNCATE TABLE users RESTART IDENTITY CASCADE;
```

### حذف جدول:
```sql
DROP TABLE users;
```

### إعادة تشغيل init.sql:
```bash
psql -U postgres -d learning_db -f backend/db/init.sql
```

---

## 📝 ملاحظات مهمة

1. **لا تشارك ملف .env**: أضفه إلى `.gitignore`
2. **استخدم كلمات مرور قوية**: خاصة في الإنتاج
3. **احفظ نسخة احتياطية**: استخدم `pg_dump` للنسخ الاحتياطي
4. **المستخدم التجريبي**: احذفه في بيئة الإنتاج

---

## 🚀 الخطوة التالية

بعد إعداد قاعدة البيانات بنجاح، يمكنك الانتقال إلى:
- **المهمة 2**: بناء Backend API - الإعداد الأساسي

---

## 📚 موارد إضافية

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [pgAdmin Documentation](https://www.pgadmin.org/docs/)
- [Node.js pg Library](https://node-postgres.com/)
- [bcrypt Documentation](https://www.npmjs.com/package/bcrypt)
