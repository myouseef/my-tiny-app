# مجلد قاعدة البيانات (Database)

هذا المجلد يحتوي على ملفات إعداد قاعدة البيانات PostgreSQL.

## الملفات

### 1. init.sql
ملف SQL يحتوي على:
- إنشاء جدول المستخدمين (users table)
- إضافة قيود (constraints) مثل UNIQUE على username
- إضافة مستخدم تجريبي للاختبار

### 2. generate-hash.js
سكريبت Node.js لتوليد كلمات مرور مشفرة باستخدام bcrypt.

## كيفية الاستخدام

### الخطوة 1: تثبيت bcrypt (إذا لم يكن مثبتاً)
```bash
cd backend
npm install bcrypt
```

### الخطوة 2: توليد كلمة مرور مشفرة
```bash
node db/generate-hash.js
```

سيظهر لك الناتج:
```
=================================
كلمة المرور الأصلية: demo123
كلمة المرور المشفرة: $2b$10$...
=================================
```

### الخطوة 3: تحديث init.sql
انسخ كلمة المرور المشفرة وضعها في ملف `init.sql` في سطر INSERT.

### الخطوة 4: تشغيل السكريبت على قاعدة البيانات

#### للتطوير المحلي (Local Development):
```bash
# تأكد من تشغيل PostgreSQL أولاً
# ثم قم بتشغيل:
psql -U your_username -d your_database -f backend/db/init.sql
```

أو باستخدام pgAdmin:
1. افتح pgAdmin
2. اتصل بقاعدة البيانات
3. افتح Query Tool
4. انسخ محتوى init.sql والصقه
5. اضغط Execute

#### للإنتاج على Render:
1. اذهب إلى Render Dashboard
2. افتح PostgreSQL database الخاصة بك
3. اضغط على "Connect" → "External Connection"
4. استخدم الأمر:
```bash
psql -h <hostname> -U <username> -d <database> -f backend/db/init.sql
```

أو استخدم pgAdmin للاتصال بقاعدة بيانات Render.

## هيكل جدول المستخدمين

```sql
users
├── id (SERIAL PRIMARY KEY)
├── username (VARCHAR(50) UNIQUE NOT NULL)
├── hashed_password (VARCHAR(255) NOT NULL)
└── created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
```

## المستخدم التجريبي

بعد تشغيل init.sql، سيكون لديك مستخدم تجريبي:
- **اسم المستخدم**: demo
- **كلمة المرور**: demo123

يمكنك استخدام هذا المستخدم لاختبار تسجيل الدخول.

## ملاحظات مهمة

⚠️ **الأمان**:
- لا تضع كلمات مرور حقيقية في ملفات SQL
- استخدم متغيرات البيئة (Environment Variables) للمعلومات الحساسة
- المستخدم التجريبي للاختبار فقط - احذفه في الإنتاج

✅ **أفضل الممارسات**:
- استخدم bcrypt دائماً لتشفير كلمات المرور
- استخدم salt rounds = 10 أو أكثر
- لا تخزن كلمات المرور بدون تشفير أبداً
