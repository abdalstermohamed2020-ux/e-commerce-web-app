import React, { useEffect } from 'react';
import useStore from '../store/UseStore';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaBolt, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const Electronics = () => {
  const { products, addToCart } = useStore();

  // --- 1. كاشف الأعطال (Console Log) ---
  useEffect(() => {
    if (products.length > 0) {
      console.log("الأقسام المتاحة في الداتا بيز حالياً هي:");
      products.forEach(p => console.log(`المنتج: ${p.name || p.title} -> القسم: "${p.category}"`));
    }
  }, [products]);

  // --- 2. الفلترة "الخارقة" (تتجاهل الهمزات، المسافات، وحالة الأحرف) ---
  const filtered = Array.isArray(products) ? products.filter(p => {
    if (!p.category) return false;
    
    const cat = p.category.toString().toLowerCase().trim();
    // فحص شامل لكل الاحتمالات
    return (
      cat === "electronics" || 
      cat === "الكترونيات" || 
      cat === "إلكترونيات" || 
      cat.includes("الكتروني") ||
      cat.includes("elect")
    );
  }) : [];

  return (
    <div className="min-h-screen bg-[#0f172a] pb-20 pt-10 px-6 font-['Cairo'] text-right" dir="rtl">
      <div className="container mx-auto">
        
        <h1 className="text-3xl font-black text-white mb-10 border-r-8 border-indigo-600 pr-4 flex items-center gap-3">
          قسم الإلكترونيات <FaBolt className="text-yellow-400" />
        </h1>
        
        {/* لو القسم فاضي، هيعرض لك هو شايف إيه بالظبط عشان نعرف العيب فين */}
        {filtered.length === 0 && products.length > 0 && (
          <div className="bg-yellow-900/20 border border-yellow-600/50 p-6 rounded-2xl mb-10 text-center">
            <FaExclamationTriangle className="text-yellow-500 text-3xl mx-auto mb-3" />
            <h2 className="text-yellow-500 font-bold text-lg">تنبيه المبرمج:</h2>
            <p className="text-gray-300">
              الـ React لقى {products.length} منتج في المتجر، بس ولا واحد منهم القسم بتاعه اسمه "الكترونيات".
              <br />
              تأكد من كتابة الكلمة في الـ <span className="text-white font-mono bg-black px-2">phpMyAdmin</span> بالظبط.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filtered.map(product => (
            <div key={product.id} className="group bg-[#1e293b] border border-white/5 rounded-[2.5rem] p-5 shadow-xl flex flex-col transform hover:-translate-y-2 transition-all">
              <Link to={`/product/${product.id}`}>
                <div className="overflow-hidden rounded-3xl mb-4 bg-white p-6 h-56 flex items-center justify-center shadow-inner">
                  <img src={product.image} className="max-h-full object-contain group-hover:scale-110 transition-duration-500" alt={product.name || product.title} />
                </div>
                <h2 className="text-gray-100 font-bold text-sm line-clamp-2 h-10 mb-3 text-right">
                  {product.name || product.title}
                </h2>
              </Link>
              
              <div className="mt-auto flex justify-between items-center px-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-indigo-400">{product.price}</span>
                  <span className="text-xs font-bold text-gray-500 uppercase">LE</span>
                </div>
                <button 
                  onClick={() => { addToCart(product); toast.success("تمت الإضافة! 🛒"); }} 
                  className="bg-indigo-600 hover:bg-indigo-500 text-white p-3.5 rounded-xl transition-all active:scale-90"
                >
                  <FaShoppingCart className="text-lg" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Electronics;