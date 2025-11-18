// الصفحة الرئيسية (Home Page)
// أول صفحة يراها المستخدم عند زيارة التطبيق

import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../services/api';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();
  const isLoggedIn = isAuthenticated();

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="home-page">
      <div className="home-container">
        {/* Header */}
        <header className="home-header">
          <h1 className="home-title">
            🚀 مشروع تعليمي للنشر والاستضافة
          </h1>
          <p className="home-subtitle">
            تعلم كيفية بناء ونشر تطبيق ويب كامل (Full-Stack)
          </p>
        </header>

        {/* Main Content */}
        <main className="home-content">
          {/* Welcome Section */}
          <section className="welcome-section">
            <h2>مرحباً بك! 👋</h2>
            <p>
              هذا مشروع تعليمي بسيط يهدف إلى تعلم واختبار مجموعة من الأدوات
              والتقنيات الحديثة في تطوير الويب.
            </p>
          </section>

          {/* Technologies Section */}
          <section className="tech-section">
            <h3>التقنيات المستخدمة 🛠️</h3>
            <div className="tech-grid">
              <div className="tech-card">
                <div className="tech-icon">⚛️</div>
                <h4>React + Vite</h4>
                <p>واجهة مستخدم تفاعلية وسريعة</p>
              </div>

              <div className="tech-card">
                <div className="tech-icon">🟢</div>
                <h4>Node.js + Express</h4>
                <p>خادم Backend قوي ومرن</p>
              </div>

              <div className="tech-card">
                <div className="tech-icon">🐘</div>
                <h4>PostgreSQL</h4>
                <p>قاعدة بيانات موثوقة</p>
              </div>

              <div className="tech-card">
                <div className="tech-icon">🔐</div>
                <h4>JWT Authentication</h4>
                <p>نظام مصادقة آمن</p>
              </div>

              <div className="tech-card">
                <div className="tech-icon">▲</div>
                <h4>Vercel</h4>
                <p>استضافة Frontend</p>
              </div>

              <div className="tech-card">
                <div className="tech-icon">🎨</div>
                <h4>Render</h4>
                <p>استضافة Backend + Database</p>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="features-section">
            <h3>الميزات ✨</h3>
            <ul className="features-list">
              <li>✅ نظام تسجيل دخول آمن</li>
              <li>✅ صفحة Dashboard محمية</li>
              <li>✅ تشفير كلمات المرور</li>
              <li>✅ JWT Tokens للمصادقة</li>
              <li>✅ React Router للتنقل</li>
              <li>✅ تصميم بسيط وواضح</li>
            </ul>
          </section>

          {/* CTA Section */}
          <section className="cta-section">
            <h3>جاهز للبدء؟ 🎯</h3>
            <p>
              {isLoggedIn 
                ? 'أنت مسجل دخول بالفعل! اذهب إلى Dashboard'
                : 'سجل دخول باستخدام المستخدم التجريبي'}
            </p>
            
            <button 
              className="cta-button"
              onClick={handleGetStarted}
            >
              {isLoggedIn ? 'اذهب إلى Dashboard' : 'تسجيل الدخول'}
            </button>

            {!isLoggedIn && (
              <div className="demo-credentials">
                <p className="demo-title">بيانات المستخدم التجريبي:</p>
                <div className="demo-info">
                  <span className="demo-label">اسم المستخدم:</span>
                  <code>demo</code>
                </div>
                <div className="demo-info">
                  <span className="demo-label">كلمة المرور:</span>
                  <code>demo123</code>
                </div>
              </div>
            )}
          </section>

          {/* About Section */}
          <section className="about-section">
            <h3>عن المشروع 📚</h3>
            <p>
              هذا المشروع تم بناؤه كجزء من رحلة تعلم تطوير الويب الحديث.
              يغطي المشروع جميع جوانب بناء تطبيق ويب كامل من الصفر حتى النشر.
            </p>
            <p>
              الهدف هو فهم كيفية عمل كل أداة وكيفية دمجها معاً لإنشاء تطبيق
              عملي يمكن نشره على الإنترنت.
            </p>
          </section>
        </main>

        {/* Footer */}
        <footer className="home-footer">
          <p>
            مشروع تعليمي • 2024 • 
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-link"
            >
              GitHub
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default HomePage;
