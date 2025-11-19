# كيفية الحصول على Connection Pooling من Supabase 📸

## ⚠️ مهم جداً

**لا تستخدم** Connection String العادي (Port 5432) - لن يعمل مع IPv4!

**استخدم** Connection Pooling (Port 6543) - يعمل مع IPv4 ✅

---

## 📝 الخطوات بالتفصيل

### الخطوة 1: افتح Supabase Dashboard

اذهب إلى:
```
https://supabase.com/dashboard
```

---

### الخطوة 2: افتح مشروعك

اختر مشروع `my-tiny-app` (أو أي اسم أعطيته)

---

### الخطوة 3: اذهب إلى Database Settings

1. اضغط على أيقونة **الترس ⚙️** في الأسفل (Project Settings)
2. من القائمة الجانبية، اختر **Database**

---

### الخطوة 4: ابحث عن Connection Pooling

في صفحة Database، ستجد عدة أقسام:

#### ❌ القسم الأول: Connection string (لا تستخدم هذا)
```
┌─────────────────────────────────────┐
│ Connection string                    │
├─────────────────────────────────────┤
│ URI                                  │
│ postgresql://postgres:...@db....    │
│ Port: 5432                          │
└─────────────────────────────────────┘
```
**هذا لن يعمل مع IPv4!**

#### ✅ القسم الثاني: Connection Pooling (استخدم هذا)
```
┌─────────────────────────────────────┐
│ Connection Pooling                   │
├─────────────────────────────────────┤
│ Mode: Transaction | Session          │
│                                      │
│ Connection string                    │
│ postgresql://postgres.[ref]:...     │
│ Port: 6543                          │
└─────────────────────────────────────┘
```
**هذا سيعمل مع IPv4!**

---

### الخطوة 5: اختر Session Mode

في قسم Connection Pooling:

1. ستجد تبويبين أو خيارين:
   - **Transaction** (للاستعلامات القصيرة)
   - **Session** (للتطبيقات العادية) ← **اختر هذا**

2. اضغط على **Session**

---

### الخطوة 6: انسخ Connection String

بعد اختيار Session mode، ستجد Connection String بهذا الشكل:

```
postgresql://postgres.uprbqxwyrduvjflxkrkf:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

**لاحظ:**
- ✅ اسم المستخدم: `postgres.uprbqxwyrduvjflxkrkf` (مع نقطة ورقم المشروع)
- ✅ العنوان: `aws-0-eu-central-1.pooler.supabase.com` (يحتوي على pooler)
- ✅ المنفذ: `6543` (وليس 5432)

---

### الخطوة 7: استبدل كلمة المرور

في Connection String، استبدل `[YOUR-PASSWORD]` بكلمة المرور الفعلية:

**قبل:**
```
postgresql://postgres.uprbqxwyrduvjflxkrkf:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

**بعد:**
```
postgresql://postgres.uprbqxwyrduvjflxkrkf:mmasd122334356@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

---

## 🎯 Connection String النهائي

يجب أن يكون بهذا الشكل **بالضبط**:

```
postgresql://postgres.uprbqxwyrduvjflxkrkf:mmasd122334356@aws-0-REGION.pooler.supabase.com:6543/postgres
```

**حيث:**
- `postgres.uprbqxwyrduvjflxkrkf` = اسم المستخدم مع Project Reference
- `mmasd122334356` = كلمة المرور
- `aws-0-REGION` = المنطقة (مثل eu-central-1)
- `pooler.supabase.com` = عنوان Pooler
- `6543` = منفذ Session Pooler

---

## ✅ التحقق من صحة Connection String

تأكد من أن Connection String يحتوي على:

- ✅ `postgres.` في اسم المستخدم (مع نقطة)
- ✅ `pooler.supabase.com` في العنوان
- ✅ `:6543` كمنفذ
- ✅ كلمة المرور الصحيحة (بدون أقواس)

---

## ❌ أخطاء شائعة

### خطأ 1: استخدام Direct Connection
```
❌ postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
```
**المشكلة:** Port 5432 و db.xxx (Direct Connection)

### خطأ 2: نسيان Project Reference
```
❌ postgresql://postgres:password@pooler.supabase.com:6543/postgres
```
**المشكلة:** اسم المستخدم يجب أن يكون `postgres.PROJECT_REF`

### خطأ 3: Port خاطئ
```
❌ postgresql://postgres.xxx:password@pooler.supabase.com:5432/postgres
```
**المشكلة:** يجب استخدام Port 6543 (وليس 5432)

---

## 🔍 إذا لم تجد Connection Pooling

إذا لم تجد قسم "Connection Pooling" في صفحة Database:

1. **تأكد من أنك في الصفحة الصحيحة:**
   ```
   Project Settings → Database
   ```

2. **قد يكون في الأسفل** - scroll down في الصفحة

3. **قد يكون باسم آخر:**
   - "Pooler"
   - "Connection Pool"
   - "Session Pooler"

4. **إذا لم تجده:**
   - قد يكون المشروع قديم جداً
   - حاول إنشاء مشروع جديد

---

## 📞 بعد الحصول على Connection String

1. **حدّث `backend/.env`:**
   ```env
   DATABASE_URL=postgresql://postgres.uprbqxwyrduvjflxkrkf:mmasd122334356@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
   ```

2. **اختبر الاتصال:**
   ```bash
   node backend/test-connection.js
   ```

3. **يجب أن ترى:**
   ```
   ✅ الاتصال بقاعدة البيانات نجح!
   ```

---

## 💡 نصيحة

إذا كنت تواجه صعوبة في إيجاد Connection Pooling:

1. **ابحث في الصفحة عن كلمة "Pooling"**
2. **أو ابحث عن Port "6543"**
3. **أو ابحث عن "Session mode"**

كل هذه الكلمات تدل على Connection Pooling الصحيح.

---

**بعد الحصول على Connection String الصحيح، أخبرني لنختبر الاتصال!** 🚀
