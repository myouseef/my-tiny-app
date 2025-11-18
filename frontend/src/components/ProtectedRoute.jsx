// مكون لحماية المسارات
// يتحقق من تسجيل الدخول قبل السماح بالوصول

import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/api';

/**
 * مكون ProtectedRoute
 * يحمي المسارات التي تتطلب تسجيل دخول
 * 
 * @param {object} props - الخصائص
 * @param {React.ReactNode} props.children - المكونات الفرعية
 * @returns {React.ReactElement} المكون المحمي أو إعادة توجيه
 */
function ProtectedRoute({ children }) {
  // التحقق من تسجيل الدخول
  if (!isAuthenticated()) {
    // إذا لم يكن مسجل دخول، إعادة التوجيه لصفحة تسجيل الدخول
    return <Navigate to="/login" replace />;
  }
  
  // إذا كان مسجل دخول، عرض المكون
  return children;
}

export default ProtectedRoute;
