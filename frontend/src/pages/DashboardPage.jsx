// صفحة Dashboard المحمية
// تعرض معلومات المستخدم وإحصائيات

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './DashboardPage.css';

function DashboardPage() {
  const navigate = useNavigate();
  
  // State للبيانات
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // جلب بيانات المستخدم عند تحميل الصفحة
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        setError('فشل جلب بيانات المستخدم');
        console.error('Error:', error);
      } else if (user) {
        setUser(user);
        console.log('✅ تم جلب بيانات المستخدم:', user.email);
      } else {
        setError('لم يتم العثور على مستخدم');
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال');
      console.error('Dashboard error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // معالج تسجيل الخروج
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      console.log('✅ تم تسجيل الخروج');
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
      navigate('/');
    }
  };

  // عرض Loading
  if (isLoading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>جاري تحميل البيانات...</p>
          </div>
        </div>
      </div>
    );
  }

  // عرض الخطأ
  if (error) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-container">
          <div className="error-container">
            <div className="error-icon">❌</div>
            <h2>حدث خطأ</h2>
            <p>{error}</p>
            <button onClick={fetchUserData} className="retry-button">
              إعادة المحاولة
            </button>
            <button onClick={handleLogout} className="logout-button-alt">
              تسجيل الخروج
            </button>
          </div>
        </div>
      </div>
    );
  }

  // عرض Dashboard
  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-content">
            <div className="header-left">
              <h1 className="dashboard-title">لوحة التحكم</h1>
              <p className="dashboard-subtitle">مرحباً {user?.email}</p>
            </div>
            <button onClick={handleLogout} className="logout-button">
              <span className="logout-icon">🚪</span>
              تسجيل الخروج
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="dashboard-content">
          {/* User Info Card */}
          <section className="info-card user-card">
            <div className="card-header">
              <div className="card-icon">👤</div>
              <h2 className="card-title">معلومات المستخدم</h2>
            </div>
            <div className="card-body">
              <div className="info-row">
                <span className="info-label">البريد الإلكتروني:</span>
                <span className="info-value">{user?.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">معرف المستخدم:</span>
                <span className="info-value">#{user?.id?.substring(0, 8)}...</span>
              </div>
              <div className="info-row">
                <span className="info-label">عضو منذ:</span>
                <span className="info-value">
                  {user?.created_at 
                    ? new Date(user.created_at).toLocaleDateString('ar-EG', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'غير متوفر'}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">آخر تسجيل دخول:</span>
                <span className="info-value highlight">
                  {user?.last_sign_in_at 
                    ? new Date(user.last_sign_in_at).toLocaleString('ar-EG', {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: 'numeric',
                        month: 'short'
                      })
                    : 'الآن'}
                </span>
              </div>
            </div>
          </section>

          {/* Stats Card */}
          <section className="info-card stats-card">
            <div className="card-header">
              <div className="card-icon">📊</div>
              <h2 className="card-title">معلومات الحساب</h2>
            </div>
            <div className="card-body">
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-icon">✅</div>
                  <div className="stat-info">
                    <span className="stat-label">حالة التأكيد</span>
                    <span className="stat-value">{user?.email_confirmed_at ? 'مؤكد' : 'غير مؤكد'}</span>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">🔐</div>
                  <div className="stat-info">
                    <span className="stat-label">نوع المصادقة</span>
                    <span className="stat-value">Supabase Auth</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Welcome Card */}
          <section className="info-card welcome-card">
            <div className="card-header">
              <div className="card-icon">🎉</div>
              <h2 className="card-title">مرحباً بك!</h2>
            </div>
            <div className="card-body">
              <p className="welcome-text">
                أنت الآن في صفحة Dashboard المحمية. هذه الصفحة لا يمكن الوصول إليها
                إلا بعد تسجيل الدخول بنجاح.
              </p>
              <div className="features-list">
                <div className="feature-item">
                  <span className="feature-icon">✅</span>
                  <span>نظام مصادقة آمن باستخدام Supabase Auth</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✅</span>
                  <span>حماية المسارات باستخدام ProtectedRoute</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✅</span>
                  <span>Backend as a Service (BaaS)</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✅</span>
                  <span>تصميم متجاوب وعصري</span>
                </div>
              </div>
            </div>
          </section>

          {/* Actions Card */}
          <section className="info-card actions-card">
            <div className="card-header">
              <div className="card-icon">⚙️</div>
              <h2 className="card-title">الإجراءات</h2>
            </div>
            <div className="card-body">
              <div className="actions-grid">
                <button className="action-button" onClick={fetchUserData}>
                  <span className="action-icon">🔄</span>
                  <span>تحديث البيانات</span>
                </button>
                <button className="action-button" onClick={() => navigate('/')}>
                  <span className="action-icon">🏠</span>
                  <span>الصفحة الرئيسية</span>
                </button>
                <button className="action-button danger" onClick={handleLogout}>
                  <span className="action-icon">🚪</span>
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="dashboard-footer">
          <p>
            مشروع تعليمي • Dashboard محمي بـ Supabase Authentication
          </p>
        </footer>
      </div>
    </div>
  );
}

export default DashboardPage;
