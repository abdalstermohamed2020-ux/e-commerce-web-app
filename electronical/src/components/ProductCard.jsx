import React from 'react';
import { Link } from 'react-router-dom';
import useStore from '../store/UseStore';
import { motion } from 'framer-motion';
import { FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useStore();

  // --- التعديل هنا لتركيب رابط الصورة الصحيح ---
const fullImagePath = `http://electronic-api.atwebpages.com/uploads/product_1776980066.jpeg`;

  const handleAdd = (e) => {
    e.preventDefault();
    addToCart(product);
    
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white dark:bg-gray-800 shadow-2xl rounded-3xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 border-r-4 border-indigo-600 p-4`} dir="rtl">
        <div className="flex-shrink-0">
          {/* تم تعديل src هنا */}
          <img className="h-12 w-12 rounded-lg object-contain bg-gray-100" src={fullImagePath} alt={product.name} />
        </div>
        <div className="mr-4 flex-1">
          <p className="text-sm font-black text-gray-900 dark:text-white">
            خيار ممتاز! 🔥
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            أضفنا {product.name ? product.name.slice(0, 20) : "المنتج"}... لسلتك بنجاح.
          </p>
        </div>
        <button
          onClick={() => toast.dismiss(t.id)}
          className="mr-4 text-indigo-600 font-bold text-xs hover:text-indigo-500 transition-colors"
        >
          إغلاق
        </button>
      </div>
    ), { duration: 3000 });
  };

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="group bg-white dark:bg-gray-800 rounded-[2rem] p-5 shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-indigo-100 dark:hover:border-gray-700 flex flex-col"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="h-48 mb-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 flex items-center justify-center">
          {/* تم تعديل src هنا أيضاً */}
          <img src={fullImagePath} alt={product.name} className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500" />
        </div>
        
      <h2 className="font-bold text-sm dark:text-white line-clamp-2 h-10 mb-2 text-right">
      {product.name || product.title} 
      </h2>
      </Link>
      
      <div className="flex justify-between items-center mt-auto pt-4">
        <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">${product.price}</span>
        <button 
          onClick={handleAdd}
          className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-yellow-400 hover:text-indigo-900 transition-all active:scale-90 shadow-lg shadow-indigo-100 dark:shadow-none"
        >
          <FaShoppingCart size={18} />
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;