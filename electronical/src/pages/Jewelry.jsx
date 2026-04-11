import React from 'react';
import useStore from '../store/UseStore';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

const Jewelry = () => {
  const { products, addToCart } = useStore();
  // فلترة فئة المجوهرات من الـ Store
  const filtered = products.filter(p => p.category === "jewelery");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 pt-10 px-6 font-['Cairo'] text-right" dir="rtl">
      <div className="container mx-auto">
        <h1 className="text-3xl font-black text-gray-800 dark:text-white mb-10 border-r-8 border-yellow-500 pr-4">
            قسم المجوهرات والماس 💎
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-right">
          {filtered.map(product => (
            <div key={product.id} className="group bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-[2.5rem] p-5 shadow-sm hover:shadow-2xl transition-all transform hover:-translate-y-2 flex flex-col">
              <Link to={`/product/${product.id}`}>
                <div className="overflow-hidden rounded-3xl mb-4 bg-white p-6 h-56 flex items-center justify-center relative shadow-inner">
                  <img src={product.image} className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500" alt={product.title} />
                </div>
                <h2 className="text-gray-800 dark:text-gray-100 font-bold text-sm line-clamp-2 h-10 mb-3">{product.title}</h2>
              </Link>
              
              {/* السعر والزرار في سطر واحد بدون أي تغيير في الـ Style العام */}
              <div className="mt-auto flex justify-between items-center px-2">
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">${product.price}</span>
                
                {/* الزرار بشكل أيقونة السلة الموحد */}
                <button 
                  onClick={() => addToCart(product)} 
                  className="bg-indigo-600 hover:bg-indigo-500 text-white p-3.5 rounded-xl transition-all active:scale-90 shadow-lg shadow-indigo-600/20"
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

export default Jewelry;