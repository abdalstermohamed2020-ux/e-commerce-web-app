import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/UseStore';
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
      toast.success(result.message);
      navigate('/secret-portal-mis');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">دخول الأدمن</h1>
          <p className="text-gray-600 dark:text-gray-400">أدخل بياناتك للدخول إلى لوحة التحكم</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">اسم المستخدم</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="أدخل اسم المستخدم"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="أدخل كلمة المرور"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105"
          >
            دخول
          </button>
        </form>
        
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-bold"
          >
            العودة للصفحة الرئيسية
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;