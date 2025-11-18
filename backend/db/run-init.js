// سكريبت لتشغيل init.sql تلقائياً من Node.js
// يقرأ ملف init.sql وينفذه على قاعدة البيانات

require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// إنشاء pool للاتصال بقاعدة البيانات
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function runInitSQL() {
  let client;
  
  try {
    console.log('\n🔄 جاري الاتصال بقاعدة البيانات...\n');
    
    // الاتصال بقاعدة البيانات
    client = await pool.connect();
    console.log('✅ تم الاتصال بنجاح!\n');
    
    // قراءة ملف init.sql
    const sqlFilePath = path.join(__dirname, 'init.sql');
    console.log('📄 جاري قراءة ملف init.sql...\n');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // تنفيذ السكريبت
    console.log('⚙️  جاري تنفيذ السكريبت...\n');
    await client.query(sqlContent);
    
    console.log('✅ تم تنفيذ init.sql بنجاح!\n');
    
    // التحقق من النتيجة
    const result = await client.query('SELECT COUNT(*) FROM users');
    console.log(`👥 عدد المستخدمين في قاعدة البيانات: ${result.rows[0].count}\n`);
    
    // عرض المستخدمين
    const users = await client.query('SELECT id, username, created_at FROM users');
    console.log('📋 قائمة المستخدمين:');
    users.rows.forEach(user => {
      console.log(`  - ID: ${user.id}, Username: ${user.username}`);
    });
    
    console.log('\n✅ تم إعداد قاعدة البيانات بنجاح! 🎉\n');
    
  } catch (error) {
    console.error('\n❌ حدث خطأ أثناء تنفيذ السكريبت:\n');
    console.error('   ', error.message);
    
    if (error.message.includes('does not exist')) {
      console.log('\n💡 تأكد من إنشاء قاعدة البيانات أولاً:');
      console.log('   psql -U postgres');
      console.log('   CREATE DATABASE learning_db;');
    } else if (error.message.includes('password')) {
      console.log('\n💡 تأكد من صحة DATABASE_URL في ملف .env');
    } else if (error.message.includes('connect')) {
      console.log('\n💡 تأكد من تشغيل PostgreSQL');
    }
    
    console.log('\n');
    process.exit(1);
    
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

// تشغيل السكريبت
runInitSQL();
