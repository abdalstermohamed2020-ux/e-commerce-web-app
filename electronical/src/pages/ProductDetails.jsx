import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useStore from '../store/UseStore'; 
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaShoppingCart } from 'react-icons/fa';

const ProductDetails = () => {
    const { id } = useParams(); 
    const { products, addToCart } = useStore();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        if (products.length > 0) {
            const foundProduct = products.find(p => String(p.id) === String(id));
            setProduct(foundProduct);
        }
    }, [id, products]);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
                <h2 className="text-2xl text-white font-bold animate-pulse">جاري تحميل تفاصيل المنتج... 🔄</h2>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6 md:py-20 dark:text-white text-right" dir="rtl">
            {/* تقسيم الشاشة: عمود واحد للموبايل وعمودين للديسكتوب */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
                
                {/* 1. قسم صورة المنتج */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-white/5 p-4 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl border border-gray-50 dark:border-white/5"
                >
                    <img 
                        src={product.image} 
                        alt={product.title} 
                        className="w-full h-64 md:h-96 object-contain hover:scale-105 transition-transform duration-500" 
                    />
                </motion.div>

                {/* 2. قسم تفاصيل المنتج */}
                <div className="flex flex-col justify-center space-y-4 md:space-y-6">
                    <div>
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold text-xs md:text-sm uppercase tracking-widest bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">
                            {product.category}
                        </span>
                        <h1 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white mt-3 leading-tight">
                            {product.title}
                        </h1>
                    </div>

                    <p className="text-gray-500 dark:text-gray-400 text-sm md:text-lg leading-relaxed font-medium">
                        {product.description}
                    </p>

                    <div className="text-2xl md:text-3xl font-black text-indigo-600 dark:text-indigo-400">
                        {product.price} <span className="text-sm">LE</span>
                    </div>

                    {/* زر الإضافة للسلة - أصبح عرض كامل في الموبايل */}
                    <button 
                        onClick={() => {
                            addToCart(product);
                            toast.success("أتممت الإضافة للسلة! 🛒");
                        }}
                        className="w-full md:w-max bg-indigo-600 hover:bg-indigo-700 text-white px-8 md:px-12 py-4 md:py-5 rounded-xl md:rounded-2xl font-bold text-lg md:text-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                        <span>إضافة إلى السلة</span>
                        <FaShoppingCart size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;