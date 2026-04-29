import React, { useEffect } from 'react';
import useStore from '../store/UseStore';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaBolt, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const Electronics = () => {
  const { products, addToCart, fetchProductsFromDB } = useStore();

  useEffect(() => {
    fetchProductsFromDB(); // إعادة جلب في كل مرة تدخل الصفحة
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  const filtered = Array.isArray(products)
    ? products.filter((p) => {
        if (!p.category) return false;
        const cat = p.category.toString().toLowerCase().trim();
        return (
          cat === 'electronics' ||
          cat === 'الكترونيات' ||
          cat === 'إلكترونيات' ||
          cat === 'الكترون'
        );
      })
    : [];

  return (
    /* التعديل هنا: bg-white للوضع العادي و dark:bg-[#0b1120] للوضع اللي في الصورة */
    <div className="min-h-screen bg-white dark:bg-[#0b1120] pb-20 pt-10 px-6 font-['Cairo'] text-right transition-colors duration-300" dir="rtl">
      <div className="container mx-auto">
        {/* لون العنوان: text-gray-800 في العادي و dark:text-white في الغامق */}
        <h1 className="text-3xl font-black text-gray-800 dark:text-white mb-10 border-r-8 border-indigo-600 pr-4 flex items-center gap-3 italic">
          قسم الإلكترونيات <FaBolt className="text-yellow-400" />
        </h1>

        {filtered.length === 0 ? (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-600/50 p-6 rounded-2xl mb-10 text-center">
            <FaExclamationTriangle className="text-yellow-500 text-3xl mx-auto mb-3" />
            <h2 className="text-yellow-600 dark:text-yellow-500 font-bold text-lg">لا توجد منتجات متوفرة</h2>
            <p className="text-gray-500 dark:text-gray-300">لم نجد أي منتجات في قسم الإلكترونيات حالياً.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filtered.map((product) => (
              <div
                key={product.id}
                /* الكارت: bg-gray-50 في العادي و bg-[#1e293b] (أو #111827) في الدارك مود */
                className="group bg-gray-50 dark:bg-[#1e293b] border border-gray-100 dark:border-white/5 rounded-[2.5rem] p-5 shadow-xl flex flex-col transform hover:-translate-y-2 transition-all duration-300"
              >
                <Link to={`/product/${product.id}`}>
                  {/* حاوية الصورة: بيضاء دائماً أو اغمق قليلاً في الدارك حسب التصميم */}
                  <div className="overflow-hidden rounded-3xl mb-4 bg-white dark:bg-gray-800 p-6 h-56 flex items-center justify-center">
                    <img
                      src={product.image}
                      className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
                      alt={product.name || product.title}
                    />
                  </div>
                  {/* اسم المنتج: text-gray-700 في العادي و dark:text-gray-100 في الغامق */}
                  <h2 className="text-gray-700 dark:text-gray-100 font-bold text-sm line-clamp-2 h-10 mb-3">
                    {product.name || product.title}
                  </h2>
                </Link>
                <div className="mt-auto flex justify-between items-center px-2 pt-4 border-t border-gray-200 dark:border-white/5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{product.price}</span>
                    <span className="text-xs font-bold text-gray-400 uppercase">LE</span>
                  </div>
                  <button
                    onClick={() => {
                      addToCart(product);
                      toast.success('تمت الإضافة! 🛒');
                    }}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white p-3.5 rounded-xl transition-all shadow-lg shadow-indigo-100 dark:shadow-none"
                  >
                    <FaShoppingCart className="text-lg" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Electronics;