# استخدام Supabase مع Backend

## لماذا Supabase؟

- ✅ مجاني (500 MB)
- ✅ سهل الإعداد
- ✅ واجهة رسومية لإدارة البيانات
- ✅ لا حاجة لتثبيت PostgreSQL محلياً

---

## الإعداد السريع

### 1. إنشاء قاعدة البيانات

1. اذهب إلى https://supabase.com
2. أنشئ مشروع جديد
3. في SQL Editor، شغّل محتوى `db/init.sql`

### 2. تحديث .env

احصل على Connection String من:
```
Project Settings → Database → Connection String (URI)
```

ثم حدّث `.env`:
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxx.supabase.co:5432/postgres
```

### 3. اختبر الاتصال

```bash
npm start
```

يجب أن ترى:
```
✅ Database connected successfully
```

---

## الاختلافات عن PostgreSQL المحلي

### Connection String

**محلي:**
```
postgresql://postgres:password@localhost:5432/mydb
```

**Supabase:**
```
postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
```

### الميزات الإضافية

مع Supabase تحصل على:
- 📊 Table Editor - لعرض وتعديل البيانات
- 🔍 SQL Editor - لتشغيل استعلامات SQL
- 📈 Reports - لمراقبة الاستخدام
- 🔐 Row Level Security - للأمان المتقدم

---

## نصائح

### الأمان
- لا ترفع ملف `.env` إلى GitHub
- استخدم كلمات مرور قوية
- غيّر `JWT_SECRET` في الإنتاج

### الأداء
- Supabase يوفر Connection Pooling تلقائياً
- استخدم Indexes للاستعلامات السريعة (موجودة في init.sql)

### المراقبة
- راقب استخدامك من Reports في Supabase
- الخطة المجانية: 500 MB كافية لمشروع تعليمي

---

## استكشاف الأخطاء

### خطأ: "connection refused"
- تأكد من Connection String صحيح
- تأكد من الإنترنت متصل

### خطأ: "password authentication failed"
- تأكد من استبدال `[YOUR-PASSWORD]` بكلمة مرورك الفعلية
- لا تترك أقواس معقوفة []

### خطأ: "relation users does not exist"
- شغّل `db/init.sql` من SQL Editor في Supabase

---

## روابط مفيدة

- 📚 [Supabase Docs](https://supabase.com/docs)
- 🎥 [Supabase YouTube](https://www.youtube.com/c/Supabase)
- 💬 [Supabase Discord](https://discord.supabase.com)

---

**للتعليمات المفصلة**: راجع `../SUPABASE-SETUP-GUIDE.md` في المجلد الرئيسي
