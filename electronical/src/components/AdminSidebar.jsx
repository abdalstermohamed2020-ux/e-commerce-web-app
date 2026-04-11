import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBox, FaShoppingCart, FaChartBar, FaSignOutAlt } from 'react-icons/fa';
import useStore from '../store/UseStore'; // استيراد الـ Store عشان الـ Logout

const AdminSidebar = () => {
  const logoutAdmin = useStore((state) => state.logoutAdmin);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    navigate('/'); // يرجعك للصفحة الرئيسية بعد الخروج
  };

  return (
    <div className="w-64 min-h-screen bg-indigo-900 text-white p-6 flex flex-col" dir="rtl">
      <h2 className="text-2xl font-black mb-10 border-b border-indigo-800 pb-4 text-center">
        لوحة التحكم
      </h2>
      
      <nav className="space-y-4 flex-grow">
        {/* لاحظ شلنا السلاش / والكلمة القديمة خالص */}
        <Link to="" className="flex items-center gap-3 p-3 hover:bg-indigo-800 rounded-xl transition-all">
          <FaChartBar /> <span>الإحصائيات</span>
        </Link>

        <Link to="products" className="flex items-center gap-3 p-3 hover:bg-indigo-800 rounded-xl transition-all">
          <FaBox /> <span>إدارة المنتجات</span>
        </Link>

        <Link to="orders" className="flex items-center gap-3 p-3 hover:bg-indigo-800 rounded-xl transition-all">
          <FaShoppingCart /> <span>الأوردرات</span>
        </Link>
      </nav>

      {/* زرار تسجيل الخروج (إضافة احترافية) */}
      <button 
        onClick={handleLogout}
        className="mt-auto flex items-center gap-3 p-3 bg-red-600/20 hover:bg-red-600 text-red-100 rounded-xl transition-all border border-red-600/30"
      >
        <FaSignOutAlt /> <span>تسجيل الخروج</span>
      </button>
    </div>
  );
};

export default AdminSidebar;