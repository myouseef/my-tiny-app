// ملف التطبيق الرئيسي
// يحتوي على React Router وجميع المسارات

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from './services/api';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* الصفحة الرئيسية */}
          <Route path="/" element={<HomePage />} />
          
          {/* صفحة تسجيل الدخول */}
          <Route 
            path="/login" 
            element={
              isAuthenticated() ? <Navigate to="/dashboard" replace /> : <LoginPage />
            } 
          />
          
          {/* صفحة Dashboard المحمية */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          
          {/* مسار غير موجود - إعادة توجيه للصفحة الرئيسية */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
