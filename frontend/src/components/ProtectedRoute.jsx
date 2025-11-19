// مكون لحماية المسارات
// يتحقق من تسجيل الدخول قبل السماح بالوصول

import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

/**
 * مكون ProtectedRoute
 * يحمي المسارات التي تتطلب تسجيل دخول
 * 
 * @param {object} props - الخصائص
 * @param {React.ReactNode} props.children - المكونات الفرعية
 * @returns {React.ReactElement} المكون المحمي أو إعادة توجيه
 */
function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // التحقق من المستخدم الحالي
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });

    // الاستماع لتغييرات حالة المصادقة
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // عرض Loading أثناء التحقق
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem'
      }}>
        جاري التحقق...
      </div>
    );
  }

  // إذا لم يكن مسجل دخول، إعادة التوجيه لصفحة تسجيل الدخول
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // إذا كان مسجل دخول، عرض المكون
  return children;
}

export default ProtectedRoute;
