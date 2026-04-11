import React, { useState } from 'react';
import useStore from '../store/UseStore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserShield, FaLock, FaUserAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const loginAdmin = useStore((state) => state.loginAdmin);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const result = loginAdmin(username, password);
    
    if (result.success) {
      // رسالة نجاح
      toast.success(result.message || "تم تسجيل الدخول بنجاح! جاري التحويل...");
      
      // تأخير بسيط عشان نضمن تحديث الـ State في الـ Store ومنع صفحة الـ Error
      setTimeout(() => {
        navigate('/secret-portal-mis'); 
      }, 1000);
    } else {
      // رسالة خطأ واضحة (جديد)
      toast.error(result.message || "بيانات الدخول غير صحيحة!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4" dir="rtl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl p-10 border-t-8 border-indigo-600"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaUserShield size={40} />
          </div>
          <h2 className="text-3xl font-black dark:text-white">دخول الإدارة</h2>
          <p className="text-gray-500 mt-2 text-sm italic">برجاء إدخال بيانات الوصول المؤمنة</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            {/* أيقونة اليوزر بقيت في الشمال عشان dir="rtl" */}
            <FaUserAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="اسم المستخدم" 
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700 dark:text-white border border-transparent focus:border-indigo-500 outline-none transition-all font-bold"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="password" 
              placeholder="كلمة المرور" 
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 dark:bg-gray-700 dark:text-white border border-transparent focus:border-indigo-500 outline-none transition-all font-bold"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
          >
            تسجيل الدخول
          </button>
        </form>

        <p className="text-center mt-8 text-xs text-gray-400">
          نظام إدارة متجر MIS - 2026
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLogin;