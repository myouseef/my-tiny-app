// صفحة Dashboard المحمية
// تعرض معلومات المستخدم وإحصائيات

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboard, logout } from '../services/api';
import './DashboardPage.css';

function DashboardPage() {
  const navigate = useNavigate();
  
  // State للبيانات
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // جلب بيانات Dashboard عند تحميل الصفحة
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await getDashboard();
      
      if (response.ok && response.data.success) {
        setDashboardData(response.data.dashboard);
      } else {
        setError(response.data.message || 'فشل جلب البيانات');
      }
    } catch (err) {
      setError('حدث خطأ في الاتصال بالخادم');
      console.error('Dashboard error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // معالج تسجيل الخروج
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
      // حتى لو فشل الطلب، نحذف Token ونعيد التوجيه
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
            <button onClick={fetchDashboardData} className="retry-button">
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
              <p className="dashboard-subtitle">{dashboardData?.welcomeMessage}</p>
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
                <span className="info-label">اسم المستخدم:</span>
                <span className="info-value">{dashboardData?.user?.username}</span>
              </div>
              <div className="info-row">
                <span className="info-label">معرف المستخدم:</span>
                <span className="info-value">#{dashboardData?.user?.id}</span>
              </div>
              <div className="info-row">
                <span className="info-label">عضو منذ:</span>
                <span className="info-value">
                  {dashboardData?.user?.memberSince 
                    ? new Date(dashboardData.user.memberSince).toLocaleDateString('ar-EG', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'غير متوفر'}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">عدد الأيام:</span>
                <span className="info-value highlight">
                  {dashboardData?.user?.daysSinceJoined} يوم
                </span>
              </div>
            </div>
          </section>

          {/* Stats Card */}
          <section className="info-card stats-card">
            <div className="card-header">
              <div className="card-icon">📊</div>
              <h2 className="card-title">الإحصائيات</h2>
            </div>
            <div className="card-body">
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-icon">🔐</div>
                  <div className="stat-info">
                    <span className="stat-label">عدد تسجيلات الدخول</span>
                    <span className="stat-value">{dashboardData?.stats?.loginCount || 0}</span>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">⏰</div>
                  <div className="stat-info">
                    <span className="stat-label">آخر تسجيل دخول</span>
                    <span className="stat-value">
                      {dashboardData?.stats?.lastLogin 
                        ? new Date(dashboardData.stats.lastLogin).toLocaleString('ar-EG', {
                            hour: '2-digit',
                            minute: '2-digit',
                            day: 'numeric',
                            month: 'short'
                          })
                        : 'الآن'}
                    </span>
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
                  <span>نظام مصادقة آمن باستخدام JWT</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✅</span>
                  <span>حماية المسارات باستخدام ProtectedRoute</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✅</span>
                  <span>جلب البيانات من Backend API</span>
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
                <button className="action-button" onClick={fetchDashboardData}>
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
            مشروع تعليمي • Dashboard محمي بـ JWT Authentication
          </p>
        </footer>
      </div>
    </div>
  );
}

export default DashboardPage;
