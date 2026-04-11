import React from 'react';
import { Link } from 'react-router-dom';
import useStore from '../store/UseStore';
import { motion, AnimatePresence } from 'framer-motion'; // استيراد موشن للحركة المرنة
import { 
  FaTimes, FaLaptop, FaGem, FaTshirt, 
  FaFemale, FaHome, FaInfoCircle, FaShoppingBag 
} from 'react-icons/fa';

const SideNavbar = () => {
  const { isSideNavOpen, toggleSideNav } = useStore();

  // مصفوفة الأقسام الذكية
  const menuItems = [
    { name: 'الرئيسية', path: '/', icon: <FaHome /> },
    { name: 'الإلكترونيات', path: '/electronics', icon: <FaLaptop /> },
    { name: 'المجوهرات', path: '/jewelry', icon: <FaGem /> },
    { name: 'ملابس رجالي', path: '/mens-clothing', icon: <FaTshirt /> },
    { name: 'ملابس حريمي', path: '/womens-clothing', icon: <FaFemale /> },
    { name: 'من نحن', path: '/about', icon: <FaInfoCircle /> },
  ];

  return (
    <AnimatePresence>
      {isSideNavOpen && (
        <>
          {/* 1. الخلفية المضببة (Overlay) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSideNav}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] cursor-pointer"
          />

          {/* 2. جسم القائمة مع حركة الـ Spring */}
          <motion.div 
            initial={{ x: '100%' }} // بيبدأ من اليمين بره الشاشة
            animate={{ x: 0 }} // يدخل مكانه
            exit={{ x: '100%' }} // يخرج لليمين تاني
            transition={{ type: 'spring', stiffness: 300, damping: 30 }} // حركة "سوستة" احترافية
            className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 z-[70] shadow-[-10px_0_30px_rgba(0,0,0,0.2)] flex flex-col text-right"
            dir="rtl"
          >
            {/* رأس القائمة */}
            <div className="p-6 bg-indigo-600 dark:bg-indigo-900 text-white flex justify-between items-center shadow-lg">
              <div className="flex items-center gap-2">
                <FaShoppingBag className="text-yellow-400" />
                <span className="font-black text-xl tracking-tight">قائمة التسوق</span>
              </div>
              <button 
                onClick={toggleSideNav}
                className="p-2 hover:bg-white/20 rounded-full transition-all active:scale-90"
              >
                <FaTimes size={22} />
              </button>
            </div>

            {/* الروابط والأقسام */}
            <nav className="flex-grow p-4 overflow-y-auto custom-scrollbar">
              <div className="space-y-2">
                {menuItems.map((item, index) => (
                  <Link 
                    key={index}
                    to={item.path}
                    onClick={toggleSideNav}
                    className="flex items-center gap-4 p-4 rounded-2xl text-gray-700 dark:text-gray-200 font-bold hover:bg-indigo-50 dark:hover:bg-gray-800 transition-all group border border-transparent hover:border-indigo-100 dark:hover:border-gray-700"
                  >
                    <span className="text-indigo-600 dark:text-indigo-400 text-xl group-hover:rotate-12 transition-transform">
                      {item.icon}
                    </span>
                    <span className="text-lg">{item.name}</span>
                  </Link>
                ))}
              </div>

              {/* فاصل جمالي */}
              <div className="my-6 border-t border-gray-100 dark:border-gray-800"></div>

              {/* بنر عروض داخل المنيو */}
              <div className="p-6 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl text-white shadow-xl relative overflow-hidden group">
                <div className="relative z-10">
                  <h4 className="font-black text-lg mb-1">عرض الجمعة!</h4>
                  <p className="text-xs opacity-90 mb-4">خصم يصل لـ 50% على الملابس</p>
                  <Link 
  to="/all-offers" // تغيير المسار ليفتح صفحة كل العروض
  onClick={toggleSideNav} // عشان يقفل السايد بار أول ما تضغط عليه
  className="inline-block bg-yellow-400 text-indigo-900 px-4 py-2 rounded-xl text-xs font-black hover:scale-105 transition-transform text-center"
>
  استمتع بأقوى العروض 🔥
</Link>
                </div>
                {/* شكل ديكوري في الخلفية */}
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              </div>
            </nav>

            {/* تذييل المنيو */}
            <div className="p-6 border-t dark:border-gray-800 text-center text-gray-400 text-xs">
              جميع الحقوق محفوظة © Shopify Store
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SideNavbar;