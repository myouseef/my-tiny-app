// سكريبت لاختبار Middleware المصادقة
// يختبر السيناريوهات المختلفة: بدون token، token صحيح، token خاطئ

const http = require('http');

// ألوان للـ Console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// دالة مساعدة لإرسال طلب HTTP
function makeRequest(path, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    // إضافة Token إذا كان موجوداً
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }
    
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            data: JSON.parse(data)
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            data: data
          });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.end();
  });
}

// دالة للحصول على Token صحيح
function getValidToken() {
  return new Promise((resolve, reject) => {
    const loginData = JSON.stringify({
      username: 'demo',
      password: 'demo123'
    });
    
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
    
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.success && response.token) {
            resolve(response.token);
          } else {
            reject(new Error('فشل الحصول على Token'));
          }
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.write(loginData);
    req.end();
  });
}

// دالة لطباعة النتيجة
function printResult(testName, passed, details) {
  const icon = passed ? '✅' : '❌';
  const color = passed ? colors.green : colors.red;
  console.log(`${color}${icon} ${testName}${colors.reset}`);
  if (details) {
    console.log(`   ${details}`);
  }
  console.log();
}

// تشغيل الاختبارات
async function runTests() {
  console.log('\n' + '='.repeat(60));
  console.log(`${colors.cyan}🧪 اختبار Middleware المصادقة${colors.reset}`);
  console.log('='.repeat(60) + '\n');
  
  try {
    // اختبار 1: الوصول بدون Token
    console.log(`${colors.blue}📝 الاختبار 1: الوصول إلى endpoint محمي بدون Token${colors.reset}\n`);
    
    try {
      const result1 = await makeRequest('/api/user/profile');
      const passed1 = result1.statusCode === 401 && result1.data.error === 'NO_TOKEN';
      printResult(
        'يجب أن يرجع 401 مع رسالة "Token مفقود"',
        passed1,
        `Status: ${result1.statusCode}, Error: ${result1.data.error}`
      );
    } catch (error) {
      printResult('الاختبار 1', false, `خطأ: ${error.message}`);
    }
    
    // اختبار 2: الحصول على Token صحيح
    console.log(`${colors.blue}📝 الاختبار 2: الحصول على Token صحيح${colors.reset}\n`);
    
    let validToken;
    try {
      validToken = await getValidToken();
      printResult(
        'يجب أن ينجح تسجيل الدخول ويرجع Token',
        !!validToken,
        `Token: ${validToken.substring(0, 30)}...`
      );
    } catch (error) {
      printResult('الاختبار 2', false, `خطأ: ${error.message}`);
      console.log(`${colors.red}⚠️  لا يمكن المتابعة بدون Token صحيح${colors.reset}\n`);
      return;
    }
    
    // اختبار 3: الوصول مع Token صحيح
    console.log(`${colors.blue}📝 الاختبار 3: الوصول إلى endpoint محمي مع Token صحيح${colors.reset}\n`);
    
    try {
      const result3 = await makeRequest('/api/user/profile', validToken);
      const passed3 = result3.statusCode === 200 && result3.data.success === true;
      printResult(
        'يجب أن يسمح بالوصول ويرجع بيانات المستخدم',
        passed3,
        `Status: ${result3.statusCode}, User: ${result3.data.user?.username || 'N/A'}`
      );
    } catch (error) {
      printResult('الاختبار 3', false, `خطأ: ${error.message}`);
    }
    
    // اختبار 4: الوصول مع Token غير صحيح
    console.log(`${colors.blue}📝 الاختبار 4: الوصول مع Token غير صحيح${colors.reset}\n`);
    
    try {
      const invalidToken = 'invalid.token.here';
      const result4 = await makeRequest('/api/user/profile', invalidToken);
      const passed4 = result4.statusCode === 401 && result4.data.error === 'INVALID_TOKEN';
      printResult(
        'يجب أن يرجع 401 مع رسالة "Token غير صالح"',
        passed4,
        `Status: ${result4.statusCode}, Error: ${result4.data.error}`
      );
    } catch (error) {
      printResult('الاختبار 4', false, `خطأ: ${error.message}`);
    }
    
    // اختبار 5: الوصول مع Token بصيغة خاطئة
    console.log(`${colors.blue}📝 الاختبار 5: الوصول مع Token بصيغة خاطئة (بدون Bearer)${colors.reset}\n`);
    
    try {
      // إرسال Token بدون كلمة Bearer
      const result5 = await makeRequest('/api/user/profile', validToken.replace('Bearer ', ''));
      const passed5 = result5.statusCode === 401;
      printResult(
        'يجب أن يرجع 401',
        passed5,
        `Status: ${result5.statusCode}`
      );
    } catch (error) {
      printResult('الاختبار 5', false, `خطأ: ${error.message}`);
    }
    
    // ملخص
    console.log('='.repeat(60));
    console.log(`${colors.cyan}✅ اكتملت جميع الاختبارات!${colors.reset}`);
    console.log('='.repeat(60) + '\n');
    
    console.log(`${colors.yellow}💡 ملاحظات:${colors.reset}`);
    console.log('   - تأكد من تشغيل الخادم (npm start) قبل تشغيل الاختبارات');
    console.log('   - Middleware يعمل بشكل صحيح إذا نجحت جميع الاختبارات');
    console.log('   - يمكنك الآن استخدام authenticateToken لحماية endpoints\n');
    
  } catch (error) {
    console.error(`${colors.red}❌ خطأ عام في الاختبارات:${colors.reset}`, error.message);
    console.log('\n💡 تأكد من:');
    console.log('   1. تشغيل الخادم (npm start)');
    console.log('   2. الخادم يعمل على المنفذ 5000');
    console.log('   3. قاعدة البيانات متصلة\n');
  }
}

// تشغيل الاختبارات
console.log(`${colors.yellow}⏳ جاري بدء الاختبارات...${colors.reset}`);
setTimeout(runTests, 1000); // انتظار ثانية واحدة قبل البدء
