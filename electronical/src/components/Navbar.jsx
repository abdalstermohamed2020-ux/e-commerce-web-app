import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useStore from '../store/UseStore';
import { motion } from 'framer-motion';
import { 
    FaSun, FaMoon, FaShoppingBag, FaSearch, FaBars, 
    FaUserCircle
} from 'react-icons/fa';
import { HiMiniShoppingBag } from 'react-icons/hi2';

const Navbar = () => {
    const { 
        searchQuery, setSearchQuery, cart, darkMode, toggleDarkMode, toggleSideNav, user 
    } = useStore();
    const location = useLocation();

    const navLinks = [
        { name: 'الرئيسية', path: '/' },
        { name: 'إلكترونيات', path: '/electronics' },
        { name: 'ملابس رجالي', path: '/mens-clothing' },
        { name: 'ملابس حريمي', path: '/womens-clothing' },
        { name: 'إكسسوارات', path: '/jewelry' },
    ];

    return (
        <nav className="bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-xl sticky top-0 z-50 transition-all font-['Cairo'] border-b border-gray-100 dark:border-white/5" dir="rtl">
            <div className="container mx-auto px-4 md:px-6">
                
                {/* الجزء العلوي: اللوجو والأدوات */}
                <div className="flex items-center justify-between py-4 md:py-5 relative">
                    
                    {/* 1. السيرش (أصبح الآن أقصى اليمين) */}
                    <div className="flex-1 flex justify-start items-center gap-3">
                        {/* زر الموبايل يظهر هنا أيضاً في الشاشات الصغيرة */}
                        <button onClick={toggleSideNav} className="p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 md:hidden">
                            <FaBars size={18} className="dark:text-white" />
                        </button>

                        <div className="hidden lg:block relative group">
                            <input 
                                type="text"
                                placeholder="ابحث عن منتج..."
                                className="w-60 focus:w-80 px-5 py-2.5 pr-12 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-indigo-500 outline-none transition-all duration-300 dark:text-white text-right"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <FaSearch className="absolute right-4 top-3.5 text-gray-400" />
                        </div>
                    </div>

                    {/* 2. اللوجو (ثابت في المنتصف تماماً) */}
                    <div className="absolute left-1/2 -translate-x-1/2 text-center">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="relative p-2 md:p-3 rounded-xl md:rounded-[1.25rem] bg-indigo-600 shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-all duration-300">
                                <HiMiniShoppingBag className="text-xl md:text-2xl text-white" />
                            </div>
                            <div className="flex flex-col items-start leading-none text-right">
                                <span className="text-lg md:text-3xl font-black tracking-tighter text-gray-900 dark:text-white uppercase">
                                    shopy<span className="text-indigo-600">store</span>
                                </span>
                                <span className="text-[8px] md:text-[10px] font-bold text-gray-400 tracking-[0.2em] hidden sm:block italic">PREMIUM QUALITY</span>
                            </div>
                        </Link>
                    </div>

                    {/* 3. الأدوات (مود - سلة - مستخدم) - أقصى اليسار */}
                    <div className="flex-1 flex items-center justify-end gap-2 md:gap-4">
                        
                        {/* تغيير الثيم */}
                        <button onClick={toggleDarkMode} className="p-2.5 md:p-3 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 active:scale-90 transition-all">
                            {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
                        </button>

                        {/* السلة */}
                        <Link to="/cart" className="relative p-2.5 md:p-3 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 active:scale-90 transition-all">
                            <FaShoppingBag size={18} />
                            {cart.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border-2 border-white dark:border-gray-900">
                                    {cart.length}
                                </span>
                            )}
                        </Link>

                        {/* أيقونة المستخدم */}
                        <div className="flex items-center border-r border-gray-100 dark:border-white/10 pr-2 md:pr-4">
                            {user ? (
                                <Link to="/profile" className="group flex items-center gap-2 p-1.5 md:px-3 md:py-2 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-transparent hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all">
                                    <div className="w-8 h-8 md:w-9 md:h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-md shadow-indigo-500/20 group-hover:rotate-12 transition-transform">
                                        {user.name ? user.name.charAt(0).toUpperCase() : <FaUserCircle />}
                                    </div>
                                    <div className="hidden md:flex flex-col items-start leading-none">
                                        <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase">الحساب</span>
                                        <span className="text-sm font-black text-indigo-700 dark:text-indigo-400">
                                            {user.name.split(' ')[0]}
                                        </span>
                                    </div>
                                </Link>
                            ) : (
                                <Link to="/login" className="flex items-center gap-2 p-2 md:px-4 md:py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20">
                                    <FaUserCircle size={20} />
                                    <span className="hidden md:block text-sm">دخول</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* روابط التنقل (الأسفل) */}
                <div className="hidden md:flex items-center justify-center pb-4">
                    <div className="bg-gray-50/50 dark:bg-white/5 px-2 py-2 rounded-[2rem] flex items-center gap-1 border border-gray-100 dark:border-white/5 shadow-inner">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link 
                                    key={link.path}
                                    to={link.path}
                                    className={`relative px-6 py-2 rounded-full text-sm font-black transition-all duration-300 ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400 hover:text-indigo-600'}`}
                                >
                                    {isActive && (
                                        <motion.div 
                                            layoutId="navtab"
                                            className="absolute inset-0 bg-indigo-600 rounded-full -z-10 shadow-lg shadow-indigo-500/40"
                                            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                                        />
                                    )}
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;