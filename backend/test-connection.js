// سكريبت اختبار الاتصال بقاعدة البيانات
// يمكنك تشغيله بـ: node test-connection.js

require('dotenv').config();
const { Pool } = require('pg');

console.log('\n🔍 اختبار الاتصال بقاعدة البيانات...\n');

// عرض معلومات الاتصال (بدون كلمة المرور)
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('❌ DATABASE_URL غير موجود في ملف .env');
  process.exit(1);
}

// استخراج معلومات الاتصال
try {
  const url = new URL(dbUrl);
  console.log('📊 معلومات الاتصال:');
  console.log('   Host:', url.hostname);
  console.log('   Port:', url.port);
  console.log('   Database:', url.pathname.substring(1));
  console.log('   User:', url.username);
  console.log('   Password:', '***' + url.password.substring(url.password.length - 4));
  console.log('');
} catch (error) {
  console.error('❌ خطأ في تحليل DATABASE_URL:', error.message);
  console.log('💡 تأكد من أن DATABASE_URL بالصيغة الصحيحة:');
  console.log('   postgresql://user:password@host:port/database');
  process.exit(1);
}

// إنشاء pool
const pool = new Pool({
  connectionString: dbUrl,
});

// اختبار الاتصال
async function testConnection() {
  try {
    console.log('⏳ جاري الاتصال...');
    
    // اختبار 1: الاتصال الأساسي
    const client = await pool.connect();
    console.log('✅ الاتصال بقاعدة البيانات نجح!');
    
    // اختبار 2: استعلام بسيط
    const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
    console.log('\n📅 الوقت الحالي:', result.rows[0].current_time);
    console.log('🗄️  إصدار PostgreSQL:', result.rows[0].pg_version.split(' ')[0] + ' ' + result.rows[0].pg_version.split(' ')[1]);
    
    // اختبار 3: التحقق من جدول users
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      ) as table_exists
    `);
    
    if (tableCheck.rows[0].table_exists) {
      console.log('✅ جدول users موجود');
      
      // عد المستخدمين
      const userCount = await client.query('SELECT COUNT(*) as count FROM users');
      console.log('👥 عدد المستخدمين:', userCount.rows[0].count);
      
      // عرض المستخدمين
      const users = await client.query('SELECT id, username, created_at FROM users ORDER BY id');
      console.log('\n📋 قائمة المستخدمين:');
      users.rows.forEach(user => {
        console.log(`   - ID: ${user.id}, Username: ${user.username}, Created: ${new Date(user.created_at).toLocaleDateString('ar-EG')}`);
      });
    } else {
      console.log('⚠️  جدول users غير موجود');
      console.log('💡 قم بتشغيل backend/db/init.sql من Supabase SQL Editor');
    }
    
    client.release();
    
    console.log('\n✅ جميع الاختبارات نجحت!');
    console.log('🚀 Backend جاهز للاستخدام\n');
    
  } catch (error) {
    console.error('\n❌ فشل الاتصال بقاعدة البيانات!');
    console.error('📝 الخطأ:', error.message);
    console.log('\n💡 الحلول المحتملة:');
    
    if (error.message.includes('ENOTFOUND') || error.message.includes('ENOENT')) {
      console.log('   1. تحقق من عنوان الخادم في DATABASE_URL');
      console.log('   2. تأكد من أن المشروع موجود على Supabase');
      console.log('   3. تحقق من اتصالك بالإنترنت');
    } else if (error.message.includes('password authentication failed')) {
      console.log('   1. تحقق من كلمة المرور في DATABASE_URL');
      console.log('   2. تأكد من استبدال [YOUR-PASSWORD] بكلمة المرور الفعلية');
    } else if (error.message.includes('timeout')) {
      console.log('   1. تحقق من اتصالك بالإنترنت');
      console.log('   2. تحقق من إعدادات Firewall');
      console.log('   3. تأكد من أن المشروع نشط (Active) على Supabase');
    } else {
      console.log('   1. راجع ملف SUPABASE-TROUBLESHOOTING.md');
      console.log('   2. تحقق من Supabase Dashboard');
    }
    
    console.log('\n📚 للمزيد من المساعدة، راجع:');
    console.log('   - SUPABASE-TROUBLESHOOTING.md');
    console.log('   - SUPABASE-SETUP-GUIDE.md\n');
    
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// تشغيل الاختبار
testConnection();
