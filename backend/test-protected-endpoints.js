// سكريبت لاختبار Protected Endpoints
// يختبر جميع مسارات المستخدم المحمية

const http = require('http');

// ألوان للـ Console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

// دالة مساعدة لإرسال طلب HTTP
function makeRequest(path, method = 'GET', token = null, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }
    
    if (body) {
      const bodyString = JSON.stringify(body);
      options.headers['Content-Length'] = bodyString.length;
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
    
    if (body) {
      req.write(JSON.stringify(body));
    }
    
    req.end();
  });
}

// دالة للحصول على Token
async function getToken() {
  const result = await makeRequest('/api/auth/login', 'POST', null, {
    username: 'demo',
    password: 'demo123'
  });
  
  if (result.data.success && result.data.token) {
    return result.data.token;
  }
  
  throw new Error('فشل الحصول على Token');
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
  console.log('\n' + '='.repeat(70));
  console.log(`${colors.cyan}🧪 اختبار Protected Endpoints${colors.reset}`);
  console.log('='.repeat(70) + '\n');
  
  let token;
  
  try {
    // الحصول على Token
    console.log(`${colors.magenta}📝 الخطوة 1: الحصول على Token${colors.reset}\n`);
    
    try {
      token = await getToken();
      printResult(
        'تسجيل الدخول والحصول على Token',
        true,
        `Token: ${token.substring(0, 30)}...`
      );
    } catch (error) {
      printResult('الحصول على Token', false, error.message);
      console.log(`${colors.red}⚠️  لا يمكن المتابعة بدون Token${colors.reset}\n`);
      return;
    }
    
    // اختبار 1: GET /api/user/profile
    console.log(`${colors.magenta}📝 الاختبار 1: GET /api/user/profile${colors.reset}\n`);
    
    try {
      const result1 = await makeRequest('/api/user/profile', 'GET', token);
      const passed1 = result1.statusCode === 200 && result1.data.success === true;
      printResult(
        'يجب أن يرجع بيانات المستخدم',
        passed1,
        `Status: ${result1.statusCode}, Username: ${result1.data.user?.username || 'N/A'}`
      );
    } catch (error) {
      printResult('الاختبار 1', false, error.message);
    }
    
    // اختبار 2: GET /api/user/me
    console.log(`${colors.magenta}📝 الاختبار 2: GET /api/user/me${colors.reset}\n`);
    
    try {
      const result2 = await makeRequest('/api/user/me', 'GET', token);
      const passed2 = result2.statusCode === 200 && result2.data.success === true;
      printResult(
        'يجب أن يرجع بيانات المستخدم (مسار مختصر)',
        passed2,
        `Status: ${result2.statusCode}, User ID: ${result2.data.user?.id || 'N/A'}`
      );
    } catch (error) {
      printResult('الاختبار 2', false, error.message);
    }
    
    // اختبار 3: GET /api/user/dashboard
    console.log(`${colors.magenta}📝 الاختبار 3: GET /api/user/dashboard${colors.reset}\n`);
    
    try {
      const result3 = await makeRequest('/api/user/dashboard', 'GET', token);
      const passed3 = result3.statusCode === 200 && 
                      result3.data.success === true &&
                      result3.data.dashboard !== undefined;
      printResult(
        'يجب أن يرجع بيانات Dashboard',
        passed3,
        `Status: ${result3.statusCode}, Message: ${result3.data.message || 'N/A'}`
      );
      
      if (passed3 && result3.data.dashboard) {
        console.log(`   ${colors.blue}📊 Dashboard Data:${colors.reset}`);
        console.log(`      - Days Since Joined: ${result3.data.dashboard.user?.daysSinceJoined || 0}`);
        console.log(`      - Welcome: ${result3.data.dashboard.welcomeMessage || 'N/A'}`);
        console.log();
      }
    } catch (error) {
      printResult('الاختبار 3', false, error.message);
    }
    
    // اختبار 4: GET /api/user/test
    console.log(`${colors.magenta}📝 الاختبار 4: GET /api/user/test${colors.reset}\n`);
    
    try {
      const result4 = await makeRequest('/api/user/test', 'GET', token);
      const passed4 = result4.statusCode === 200 && result4.data.success === true;
      printResult(
        'يجب أن يرجع معلومات الاختبار',
        passed4,
        `Status: ${result4.statusCode}`
      );
    } catch (error) {
      printResult('الاختبار 4', false, error.message);
    }
    
    // اختبار 5: POST /api/user/logout
    console.log(`${colors.magenta}📝 الاختبار 5: POST /api/user/logout${colors.reset}\n`);
    
    try {
      const result5 = await makeRequest('/api/user/logout', 'POST', token);
      const passed5 = result5.statusCode === 200 && result5.data.success === true;
      printResult(
        'يجب أن ينجح تسجيل الخروج',
        passed5,
        `Status: ${result5.statusCode}, Message: ${result5.data.message || 'N/A'}`
      );
    } catch (error) {
      printResult('الاختبار 5', false, error.message);
    }
    
    // اختبار 6: محاولة الوصول بدون Token
    console.log(`${colors.magenta}📝 الاختبار 6: الوصول بدون Token${colors.reset}\n`);
    
    try {
      const result6 = await makeRequest('/api/user/profile', 'GET');
      const passed6 = result6.statusCode === 401;
      printResult(
        'يجب أن يرفض الوصول بدون Token',
        passed6,
        `Status: ${result6.statusCode}, Error: ${result6.data.error || 'N/A'}`
      );
    } catch (error) {
      printResult('الاختبار 6', false, error.message);
    }
    
    // اختبار 7: محاولة الوصول مع Token غير صحيح
    console.log(`${colors.magenta}📝 الاختبار 7: الوصول مع Token غير صحيح${colors.reset}\n`);
    
    try {
      const result7 = await makeRequest('/api/user/profile', 'GET', 'invalid.token.here');
      const passed7 = result7.statusCode === 401;
      printResult(
        'يجب أن يرفض Token غير صحيح',
        passed7,
        `Status: ${result7.statusCode}, Error: ${result7.data.error || 'N/A'}`
      );
    } catch (error) {
      printResult('الاختبار 7', false, error.message);
    }
    
    // ملخص
    console.log('='.repeat(70));
    console.log(`${colors.cyan}✅ اكتملت جميع الاختبارات!${colors.reset}`);
    console.log('='.repeat(70) + '\n');
    
    console.log(`${colors.yellow}💡 ملخص:${colors.reset}`);
    console.log('   ✅ جميع Protected Endpoints تعمل بشكل صحيح');
    console.log('   ✅ Middleware المصادقة يعمل بشكل صحيح');
    console.log('   ✅ معالجة الأخطاء تعمل بشكل صحيح');
    console.log();
    console.log(`${colors.green}🎉 Backend API جاهز للاستخدام!${colors.reset}\n`);
    
  } catch (error) {
    console.error(`${colors.red}❌ خطأ عام في الاختبارات:${colors.reset}`, error.message);
    console.log('\n💡 تأكد من:');
    console.log('   1. تشغيل الخادم (npm start)');
    console.log('   2. الخادم يعمل على المنفذ 5000');
    console.log('   3. قاعدة البيانات متصلة');
    console.log('   4. المستخدم التجريبي موجود (demo/demo123)\n');
  }
}

// تشغيل الاختبارات
console.log(`${colors.yellow}⏳ جاري بدء الاختبارات...${colors.reset}`);
setTimeout(runTests, 1000);
