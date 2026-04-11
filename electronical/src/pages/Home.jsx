import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useStore from '../store/UseStore';
import { motion } from 'framer-motion';
import axios from 'axios';
import PromoSlider from '../components/PromoSlider';
import { FaFire, FaShoppingBag, FaStar, FaShoppingCart, FaUserCircle } from 'react-icons/fa'; // تأكد من استيراد كل الأيقونات
import { toast } from 'react-hot-toast';

const Home = () => {
    // سحب البيانات والوظائف من الـ Store
    const { products, searchQuery, addToCart } = useStore();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // --- التعديل الجذري والآمن (حل مشكلة products.filter is not a function) ---
    // هذا التعديل يتأكد أولاً أن 'products' هي مصفوفة Array صالحة قبل محاولة استخدام .filter
    // كما أنه يضمن البحث عن الاسم بشكل آمن باستخدام p.name أو p.title
    const filteredProducts = Array.isArray(products) ? products.filter((p) => {
        // خطة بديلة Fallback: قراءة الاسم من name أو title مهما كان مسماه في الداتا بيز
        const productTitle = p.name || p.title || ""; 
        if (!searchQuery) return true; // لو مفيش بحث، اعرض كل المنتجات
        return productTitle.toLowerCase().includes(searchQuery.toLowerCase());
    }) : []; // لو 'products' مش Array، رجع مصفوفة فاضية عشان الموقع ميكرشش

    // دالة اختصار للانتقال للأدمن
    useEffect(() => {
        const handleShortcut = (e) => {
            if (e.altKey && e.key === 'l') navigate('/admin-login');
        };
        window.addEventListener('keydown', handleShortcut);
        return () => window.removeEventListener('keydown', handleShortcut);
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] pb-20 text-right font-['Cairo']" dir="rtl">
            <PromoSlider />
            
            <div className="container mx-auto px-4 md:px-8 mt-10">
                
                {/* قسم العروض */}
                {!searchQuery && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative mb-12 overflow-hidden rounded-[2rem] bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-800 p-8 md:p-12 text-white shadow-2xl shadow-indigo-500/20"
                    >
                        <div className="relative z-10 flex flex-col items-center text-center">
                            <h2 className="text-3xl md:text-5xl font-black mb-4 italic">
                                مهرجان العروض الميكس <span className="text-yellow-400">🔥</span>
                            </h2>
                            <Link to="/all-offers" className="bg-yellow-400 text-indigo-900 px-10 py-4 rounded-2xl font-black text-lg hover:scale-105 transition-all">
                                استمتع بالعروض ✨
                            </Link>
                        </div>
                    </motion.div>
                )}

                {/* عنوان المنتجات */}
                <div className="flex items-center justify-between mb-10 border-r-8 border-indigo-600 pr-4">
                    <h1 className="text-3xl md:text-4xl font-black dark:text-white italic">
                        {searchQuery ? `نتائج البحث عن: "${searchQuery}"` : "أحدث المنتجات"}
                    </h1>
                </div>

                {/* شبكة المنتجات */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -10 }}
                                className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-6 shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col group h-full relative"
                            >
                                <Link to={`/product/${product.id}`} className="flex flex-col h-full">
                                    <div className="relative h-52 mb-4 bg-gray-50 dark:bg-gray-900/50 rounded-[2rem] overflow-hidden">
                                        <img 
                                            src={product.image} 
                                            alt={product.name || product.title} 
                                            className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500" 
                                        />
                                        <div className="absolute top-3 right-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 text-xs font-bold text-yellow-500 shadow-sm">
                                            <FaStar /> {product.rating?.rate || 4.5}
                                        </div>
                                    </div>
                                    
                                    {/* --- حل مشكلة ظهور الاسم --- */}
                                    {/* نقرأ الاسم من name أو title عشان يظهر في "الرئيسية" و "الإلكترونيات" وباقي الصفحات */}
                                    <h3 className="text-md font-bold dark:text-white mb-4 line-clamp-2 h-12 text-right">
                                        {product.name || product.title} 
                                    </h3>
                                </Link>

                                <div className="flex items-center justify-between mt-auto pt-5 border-t border-gray-100 dark:border-gray-700">
                                    <div className="flex flex-col items-start">
                                        <span className="text-[10px] text-gray-400 font-bold uppercase mb-1">السعر</span>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">{product.price}</span>
                                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">LE</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            addToCart(product);
                                            toast.success("تمت الإضافة للسلة بنجاح! 🛒");
                                        }}
                                        className="bg-indigo-600 text-white p-4 rounded-2xl hover:bg-indigo-700 transition-all active:scale-90 shadow-lg shadow-indigo-500/20"
                                    >
                                        <FaShoppingCart size={18} />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <p className="text-center col-span-full dark:text-white py-10">لا توجد منتجات تطابق بحثك حالياً..</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;