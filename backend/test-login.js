// سكريبت بسيط لاختبار تسجيل الدخول
// يرسل طلب POST إلى /api/auth/login

const http = require('http');

// بيانات تسجيل الدخول
const loginData = JSON.stringify({
  username: 'demo',
  password: 'demo123'
});

// إعدادات الطلب
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': loginData.length
  }
};

console.log('\n🔄 جاري اختبار تسجيل الدخول...\n');
console.log('📤 إرسال طلب إلى: http://localhost:5000/api/auth/login');
console.log('📝 البيانات:', { username: 'demo', password: 'demo123' });
console.log('\n' + '='.repeat(60) + '\n');

// إرسال الطلب
const req = http.request(options, (res) => {
  let data = '';
  
  // تجميع البيانات
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  // عند انتهاء الاستجابة
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      
      console.log('📥 الاستجابة:');
      console.log('   Status Code:', res.statusCode);
      console.log('   Success:', response.success);
      console.log('   Message:', response.message);
      
      if (response.success) {
        console.log('\n✅ تم تسجيل الدخول بنجاح!\n');
        console.log('👤 معلومات المستخدم:');
        console.log('   ID:', response.user.id);
        console.log('   Username:', response.user.username);
        console.log('\n🔑 Token:');
        console.log('   ', response.token.substring(0, 50) + '...');
        console.log('\n💡 يمكنك استخدام هذا Token للوصول إلى endpoints المحمية');
      } else {
        console.log('\n❌ فشل تسجيل الدخول');
        console.log('   السبب:', response.message);
      }
      
    } catch (error) {
      console.error('❌ خطأ في تحليل الاستجابة:', error.message);
      console.log('البيانات الخام:', data);
    }
    
    console.log('\n' + '='.repeat(60) + '\n');
  });
});

// معالجة الأخطاء
req.on('error', (error) => {
  console.error('\n❌ خطأ في الاتصال:', error.message);
  console.log('\n💡 تأكد من:');
  console.log('   1. تشغيل الخادم (npm start)');
  console.log('   2. الخادم يعمل على المنفذ 5000');
  console.log('\n');
});

// إرسال البيانات
req.write(loginData);
req.end();
