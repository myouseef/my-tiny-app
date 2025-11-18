// سكريبت لاختبار الاتصال بقاعدة البيانات PostgreSQL
// يمكنك استخدام هذا السكريبت للتحقق من أن قاعدة البيانات تعمل بشكل صحيح

require('dotenv').config();
const { Pool } = require('pg');

// إنشاء pool للاتصال بقاعدة البيانات
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function testConnection() {
  try {
    console.log('\n🔄 جاري الاتصال بقاعدة البيانات...\n');
    
    // اختبار الاتصال
    const client = await pool.connect();
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح!\n');
    
    // اختبار استعلام بسيط
    const result = await client.query('SELECT NOW()');
    console.log('⏰ وقت الخادم:', result.rows[0].now);
    
    // التحقق من وجود جدول المستخدمين
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `);
    
    if (tableCheck.rows[0].exists) {
      console.log('✅ جدول المستخدمين موجود\n');
      
      // عرض عدد المستخدمين
      const countResult = await client.query('SELECT COUNT(*) FROM users');
      console.log('👥 عدد المستخدمين في قاعدة البيانات:', countResult.rows[0].count);
      
      // عرض أسماء المستخدمين (بدون كلمات المرور)
      const usersResult = await client.query('SELECT id, username, created_at FROM users');
      console.log('\n📋 قائمة المستخدمين:');
      usersResult.rows.forEach(user => {
        console.log(`  - ID: ${user.id}, Username: ${user.username}, Created: ${user.created_at}`);
      });
    } else {
      console.log('⚠️  جدول المستخدمين غير موجود!');
      console.log('💡 قم بتشغيل ملف init.sql أولاً لإنشاء الجداول');
    }
    
    client.release();
    console.log('\n✅ تم إغلاق الاتصال بنجاح\n');
    
  } catch (error) {
    console.error('\n❌ خطأ في الاتصال بقاعدة البيانات:');
    console.error('   ', error.message);
    console.log('\n💡 تأكد من:');
    console.log('   1. تشغيل PostgreSQL');
    console.log('   2. صحة DATABASE_URL في ملف .env');
    console.log('   3. وجود قاعدة البيانات المحددة\n');
  } finally {
    await pool.end();
  }
}

// تشغيل الاختبار
testConnection();
