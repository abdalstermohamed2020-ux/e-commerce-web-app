import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaBox, 
  FaShoppingCart, 
  FaChartLine, 
  FaUndo, 
  FaLayerGroup, 
  FaSignOutAlt, 
  FaColumns 
} from 'react-icons/fa';
import useStore from '../store/UseStore';

const AdminSidebar = () => {
  const { logoutAdmin } = useStore();

  const menuItems = [
    { path: '.', icon: <FaColumns />, label: 'نظرة عامة' },
    { path: 'products', icon: <FaBox />, label: 'إدارة المنتجات' },
    { path: 'manage-bundles', icon: <FaLayerGroup />, label: 'إدارة العروض (Bundles)' },
    { path: 'orders', icon: <FaShoppingCart />, label: 'إدارة الطلبات' },
    { path: 'sales', icon: <FaChartLine />, label: 'سجل المبيعات' }, // الزرار المنتظر
    { path: 'returns', icon: <FaUndo />, label: 'سجل المرتجعات' },
  ];

  return (
    <div className="w-72 bg-[#1e293b] text-gray-300 flex flex-col h-screen sticky top-0 border-l border-white/5" dir="rtl">
      
      {/* لوجو لوحة التحكم */}
      <div className="p-8 border-b border-white/5 text-center">
        <h2 className="text-2xl font-black text-indigo-400 italic tracking-tighter">
          MIS <span className="text-white">Admin</span>
        </h2>
      </div>

      {/* الروابط */}
      <nav className="flex-grow p-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '.'} 
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all duration-300 ${
                isActive 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                : 'hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* تسجيل الخروج */}
      <div className="p-4 border-t border-white/5">
        <button 
          onClick={logoutAdmin}
          className="w-full flex items-center justify-center gap-3 px-4 py-4 text-red-400 bg-red-400/10 hover:bg-red-500 hover:text-white rounded-2xl font-black transition-all duration-300"
        >
          <FaSignOutAlt />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;