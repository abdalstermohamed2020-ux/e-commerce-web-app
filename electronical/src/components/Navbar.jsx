import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useStore from '../store/UseStore';
import { motion } from 'framer-motion';
import { FaSun, FaMoon, FaShoppingBag, FaSearch, FaBars, FaUserCircle} from 'react-icons/fa';
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
        // تم التأكد من عدم وجود mb (margin-bottom) وتقليل الـ backdrop blur لراحة العين
        <nav className="bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md sticky top-0 z-50 transition-all font-['Cairo'] border-b border-gray-100 dark:border-white/5" dir="rtl">
            <div className="container mx-auto px-4 md:px-6">
                
                {/* الجزء العلوي: تم تقليل الـ py من 4 لـ 2 في الموبايل ومن 5 لـ 3 في الديسكتوب */}
                <div className="flex items-center justify-between py-2 md:py-3 relative">
                    
                    {/* 1. القائمة والسيرش */}
                    <div className="flex-1 flex justify-start items-center gap-2">
                        <button onClick={toggleSideNav} className="p-2 rounded-xl bg-gray-50 dark:bg-white/5 md:hidden active:scale-90 transition-all">
                            <FaBars size={18} className="dark:text-white" />
                        </button>

                        <div className="hidden lg:block relative group">
                            <input 
                                type="text"
                                placeholder="ابحث عن منتج..."
                                className="w-50 focus:w-70 px-4 py-2 pr-10 rounded-xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-indigo-500 outline-none transition-all duration-300 dark:text-white text-right text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <FaSearch className="absolute right-3 top-2.5 text-gray-400 size-3.5" />
                        </div>
                    </div>

                    {/* 2. اللوجو (موسط) */}
                    <div className="absolute left-1/2 -translate-x-1/2 text-center z-10">
                        <Link to="/" className="flex items-center gap-1.5 group">
                            <div className="relative p-1.5 md:p-2 rounded-lg bg-indigo-600 shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-all duration-300">
                                <HiMiniShoppingBag className="text-base md:text-xl text-white" />
                            </div>
                            <div className="flex flex-col items-start leading-none text-right">
                                <span className="text-sm md:text-2xl font-[1000] tracking-tighter text-gray-900 dark:text-white uppercase">
                                    shopy<span className="text-indigo-600">store</span>
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* 3. الأدوات (أقصى اليسار) */}
                    <div className="flex-1 flex items-center justify-end gap-1.5 md:gap-3">
                        <button onClick={toggleDarkMode} className="p-2 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 active:scale-90 transition-all">
                            {darkMode ? <FaSun size={16} /> : <FaMoon size={16} />}
                        </button>

                        <Link to="/cart" className="relative p-2 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 active:scale-90 transition-all">
                            <FaShoppingBag size={16} />
                            {cart.length > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold border border-white dark:border-gray-900">
                                    {cart.length}
                                </span>
                            )}
                        </Link>

                        <div className="flex items-center border-r border-gray-100 dark:border-white/10 pr-1.5">
                            {user ? (
                                <Link to="/profile" className="group flex items-center gap-2 p-1 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 transition-all">
                                    <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-black shadow-md shadow-indigo-500/20">
                                        {user.name ? user.name.charAt(0).toUpperCase() : <FaUserCircle size={16} />}
                                    </div>
                                </Link>
                            ) : (
                                <Link to="/login" className="p-2 rounded-xl bg-indigo-600 text-white active:scale-95 transition-all shadow-md shadow-indigo-500/20">
                                    <FaUserCircle size={16} />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* روابط التنقل (الأسفل) - تم تقليل الـ pb من 4 لـ 2 */}
                <div className="hidden md:flex items-center justify-center pb-2">
                    <div className="bg-gray-50/50 dark:bg-white/5 px-1.5 py-1 rounded-full flex items-center gap-0.5 border border-gray-100 dark:border-white/5">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link 
                                    key={link.path}
                                    to={link.path}
                                    className={`relative px-5 py-1.5 rounded-full text-xs font-black transition-all duration-300 ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400 hover:text-indigo-600'}`}
                                >
                                    {isActive && (
                                        <motion.div 
                                            layoutId="navtab"
                                            className="absolute inset-0 bg-indigo-600 rounded-full -z-10"
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