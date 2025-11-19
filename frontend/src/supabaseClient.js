// Supabase Client Configuration
// هذا الملف يحتوي على إعداد Supabase client للاتصال بـ Backend

import { createClient } from '@supabase/supabase-js'

// قراءة المتغيرات من .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// التحقق من وجود المتغيرات
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase URL or Anon Key is missing!')
  console.log('💡 تأكد من إضافة VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY في ملف .env')
}

// إنشاء Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// تصدير helper functions مفيدة
export const auth = supabase.auth

// دالة للتحقق من حالة تسجيل الدخول
export const isAuthenticated = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return !!user
}

// دالة للحصول على المستخدم الحالي
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Error getting user:', error)
    return null
  }
  return user
}

// دالة لتسجيل الخروج
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Error signing out:', error)
    throw error
  }
}
