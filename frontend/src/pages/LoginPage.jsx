// صفحة تسجيل الدخول (Login Page)
// تسمح للمستخدم بتسجيل الدخول باستخدام اسم المستخدم وكلمة المرور

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();
  
  // State للنموذج
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  // State للأخطاء
  const [error, setError] = useState('');
  
  // State للتحميل
  const [isLoading, setIsLoading] = useState(false);
  
  // State للنجاح
  const [success, setSuccess] = useState(false);

  // معالج تغيير الحقول
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // مسح الخطأ عند الكتابة
    if (error) setError('');
  };

  // معالج إرسال النموذج
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // التحقق من البيانات
    if (!formData.username || !formData.password) {
      setError('يرجى إدخال اسم المستخدم وكلمة المرور');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // إرسال طلب تسجيل الدخول
      const response = await login(formData.username, formData.password);
      
      if (response.ok && response.data.success) {
        // نجح تسجيل الدخول
        setSuccess(true);
        
        // الانتظار قليلاً لعرض رسالة النجاح
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        // فشل تسجيل الدخول
        setError(response.data.message || 'فشل تسجيل الدخول');
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال بالخادم');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // ملء البيانات التجريبية
  const fillDemoCredentials = () => {
    setFormData({
      username: 'demo',
      password: 'demo123'
    });
    setError('');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Back to Home Link */}
        <Link to="/" className="back-link">
          ← العودة للصفحة الرئيسية
        </Link>

        {/* Login Card */}
        <div className="login-card">
          {/* Header */}
          <div className="login-header">
            <div className="login-icon">🔐</div>
            <h1 className="login-title">تسجيل الدخول</h1>
            <p className="login-subtitle">
              مرحباً بك! يرجى تسجيل الدخول للمتابعة
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="success-message">
              <span className="success-icon">✅</span>
              <span>تم تسجيل الدخول بنجاح! جاري التحويل...</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <span className="error-icon">❌</span>
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="login-form">
            {/* Username Field */}
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                اسم المستخدم
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="form-input"
                placeholder="أدخل اسم المستخدم"
                disabled={isLoading || success}
                autoComplete="username"
              />
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                كلمة المرور
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="أدخل كلمة المرور"
                disabled={isLoading || success}
                autoComplete="current-password"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="submit-button"
              disabled={isLoading || success}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  جاري تسجيل الدخول...
                </>
              ) : success ? (
                <>
                  <span>✓</span>
                  تم بنجاح
                </>
              ) : (
                'تسجيل الدخول'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="demo-section">
            <div className="divider">
              <span>أو</span>
            </div>
            
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="demo-button"
              disabled={isLoading || success}
            >
              <span className="demo-icon">👤</span>
              استخدام المستخدم التجريبي
            </button>

            <div className="demo-info-box">
              <p className="demo-info-title">بيانات المستخدم التجريبي:</p>
              <div className="demo-credentials">
                <div className="demo-item">
                  <span className="demo-label">اسم المستخدم:</span>
                  <code>demo</code>
                </div>
                <div className="demo-item">
                  <span className="demo-label">كلمة المرور:</span>
                  <code>demo123</code>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="login-footer">
            <p>
              هذا مشروع تعليمي • 
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="footer-link"
              >
                GitHub
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
