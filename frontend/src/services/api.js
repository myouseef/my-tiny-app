// ملف خدمات API - للتعامل مع Backend
// يحتوي على جميع الدوال للتواصل مع الخادم

// رابط Backend API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// ===== دوال مساعدة =====

/**
 * التحقق من وجود Token في localStorage
 * @returns {string|null} Token أو null
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * حفظ Token في localStorage
 * @param {string} token - JWT Token
 */
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

/**
 * حذف Token من localStorage
 */
export const removeToken = () => {
  localStorage.removeItem('token');
};

/**
 * التحقق من تسجيل الدخول
 * @returns {boolean} true إذا كان مسجل دخول
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * دالة عامة لإرسال طلبات HTTP
 * @param {string} endpoint - المسار (مثل: /api/auth/login)
 * @param {object} options - خيارات fetch
 * @returns {Promise<object>} الاستجابة
 */
const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  // إعداد Headers الافتراضية
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // إضافة Token إذا كان موجوداً
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    const data = await response.json();
    
    // معالجة أخطاء 401 (Token منتهي أو غير صالح)
    if (response.status === 401) {
      removeToken();
      // يمكن إضافة إعادة توجيه هنا
      // window.location.href = '/login';
    }
    
    return {
      ok: response.ok,
      status: response.status,
      data,
    };
  } catch (error) {
    console.error('خطأ في الاتصال بالخادم:', error);
    throw new Error('فشل الاتصال بالخادم');
  }
};

// ===== Auth APIs =====

/**
 * تسجيل الدخول
 * @param {string} username - اسم المستخدم
 * @param {string} password - كلمة المرور
 * @returns {Promise<object>} الاستجابة مع Token
 */
export const login = async (username, password) => {
  const response = await fetchAPI('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  
  // حفظ Token إذا نجح تسجيل الدخول
  if (response.ok && response.data.token) {
    setToken(response.data.token);
  }
  
  return response;
};

/**
 * تسجيل الخروج
 * @returns {Promise<object>} الاستجابة
 */
export const logout = async () => {
  try {
    // إرسال طلب logout للخادم (اختياري)
    await fetchAPI('/api/user/logout', {
      method: 'POST',
    });
  } catch (error) {
    console.error('خطأ في تسجيل الخروج:', error);
  } finally {
    // حذف Token من localStorage
    removeToken();
  }
};

// ===== User APIs =====

/**
 * الحصول على معلومات المستخدم الحالي
 * @returns {Promise<object>} بيانات المستخدم
 */
export const getUserProfile = async () => {
  return await fetchAPI('/api/user/profile', {
    method: 'GET',
  });
};

/**
 * الحصول على بيانات Dashboard
 * @returns {Promise<object>} بيانات Dashboard
 */
export const getDashboard = async () => {
  return await fetchAPI('/api/user/dashboard', {
    method: 'GET',
  });
};

/**
 * الحصول على معلومات المستخدم (مسار مختصر)
 * @returns {Promise<object>} بيانات المستخدم
 */
export const getMe = async () => {
  return await fetchAPI('/api/user/me', {
    method: 'GET',
  });
};

// ===== Health Check =====

/**
 * التحقق من عمل الخادم
 * @returns {Promise<object>} حالة الخادم
 */
export const checkHealth = async () => {
  return await fetchAPI('/api/health', {
    method: 'GET',
  });
};

// تصدير API_URL للاستخدام في أماكن أخرى
export { API_URL };
