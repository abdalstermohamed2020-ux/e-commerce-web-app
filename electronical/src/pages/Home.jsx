import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useStore from '../store/UseStore';
import { motion } from 'framer-motion';
import { FaStar, FaShoppingCart, FaArrowLeft, FaTruck, FaShieldAlt, FaHeadset, FaUndo } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

// 1. قسم المميزات (Features)
const FeaturesSection = () => {
  const features = [
    { id: 1, title: 'شحن سريع', desc: 'توصيل مجاني للطلبات فوق 500 ج.م', icon: <FaTruck />, color: 'bg-blue-500/10 text-blue-500' },
    { id: 2, title: 'ضمان معتمد', desc: 'حماية كاملة لمنتجاتك لمدة عام', icon: <FaShieldAlt />, color: 'bg-green-500/10 text-green-500' },
    { id: 3, title: 'استرجاع مرن', desc: 'سياسة استرجاع خلال 14 يوم', icon: <FaUndo />, color: 'bg-orange-500/10 text-orange-500' },
    { id: 4, title: 'دعم فني', desc: 'نحن معك على مدار الساعة', icon: <FaHeadset />, color: 'bg-indigo-500/10 text-indigo-500' },
  ];

  return (
    <div className="container mx-auto px-6 md:px-12 mt-16 mb-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {features.map((feature) => (
          <motion.div 
            key={feature.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 text-center shadow-md"
          >
            <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4`}>
              {feature.icon}
            </div>
            <h3 className="text-lg font-black dark:text-white mb-2">{feature.title}</h3>
            <p className="text-gray-500 dark:text-gray-400 font-bold text-xs leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// 2. قسم الـ Hero (تعديل الزرار لليمين وتنسيق الصور)
const HeroSection = () => {
  const { products } = useStore();
  const getHeroImages = () => {
    if (!products || products.length === 0) return { img1: null, img2: null };
    const p1 = products.find(p => (p.name || '').includes('ساعة')) || products[0];
    const p2 = products.find(p => ['طقم', 'خمار', 'كاجوال'].some(k => (p.name || '').includes(k))) || products[1] || products[0];
    return { img1: p1?.image, img2: p2?.image };
  };
  const { img1, img2 } = getHeroImages();

  return (
    <div className="relative bg-white dark:bg-[#0a0a0a] overflow-hidden min-h-[80vh] flex items-start pt-10 md:pt-16 border-b border-gray-50 dark:border-white/5">
      <div className="container mx-auto px-4 sm:px-8 lg:px-12 flex flex-col lg:flex-row items-start justify-between gap-12 w-full">
        
        {/* نصوص الهيرو - محاذاة لليمين بالكامل */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }} 
          whileInView={{ opacity: 1, x: 0 }} 
          className="flex-[1.2] text-right space-y-6 z-30 w-full flex flex-col items-start"
        >
          <div className="inline-block bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-5 py-2 rounded-full font-black text-xs sm:text-sm uppercase tracking-wider">
            وصل حديثاً ✨ كوليكشن 2026
          </div>
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-[1000] text-gray-900 dark:text-white leading-[1.2] italic">
            تألقي <span className="text-indigo-600">بأناقة</span>.. <br /> 
            وتميزي باختيارك.
          </h1>
          
          <p className="text-gray-500 dark:text-gray-400 text-base sm:text-xl font-bold max-w-lg leading-relaxed italic">
            نجمع لكِ بين سحر الموضة ودقة التكنولوجيا في تشكيلة SHOPYSTORE الحصرية.
          </p>
          
          {/* الزرار الآن على اليمين تحت النص مباشرة */}
          <div className="pt-4 z-40">
            <Link to="/all-offers" className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-[2rem] font-black text-lg shadow-2xl transition-all inline-flex items-center gap-3 active:scale-95">
               اكتشف الكوليكشن <FaArrowLeft size={18} />
            </Link>
          </div>
        </motion.div>

        {/* صور الهيرو - تم سحبها للأسفل ولليسار قليلاً لعمل توازن */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          whileInView={{ opacity: 1, scale: 1 }} 
          className="flex-1 relative h-[350px] sm:h-[450px] w-full flex items-center justify-center mt-12 lg:mt-20 z-10"
        >
          <div className="absolute w-[250px] h-[250px] lg:w-[450px] lg:h-[450px] bg-indigo-500/10 rounded-full blur-[80px] animate-pulse"></div>
          
          <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute z-20 top-0 right-0 md:right-5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-3 sm:p-5 rounded-[2.5rem] shadow-2xl border border-white/20 w-36 sm:w-48 lg:w-56 overflow-hidden">
            <img src={img1} className="w-full h-auto object-contain" alt="product 1" />
          </motion.div>
          
          <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 6, repeat: Infinity, delay: 0.5 }} className="absolute z-10 bottom-0 left-0 md:left-5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-4 sm:p-6 rounded-[3rem] shadow-xl border border-white/10 w-40 sm:w-52 lg:w-64 overflow-hidden">
             <img src={img2} className="w-full h-auto object-contain" alt="product 2" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

// 3. الصفحة الرئيسية (Home)
const Home = () => {
  const { products, searchQuery, addToCart, fetchProductsFromDB } = useStore();

  useEffect(() => {
    fetchProductsFromDB(); 
  }, [fetchProductsFromDB]);

  const filteredProducts = products ? products.filter((p) => {
    const title = p.name || p.title || '';
    return title.toLowerCase().includes(searchQuery.toLowerCase());
  }) : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] pb-20 text-right font-['Cairo']" dir="rtl">
      
      {!searchQuery && <HeroSection />}
      
      <div className={`container mx-auto px-4 md:px-12 ${searchQuery ? 'mt-4' : 'mt-12'}`}>
        <div className="flex items-center justify-between mb-10 border-r-8 border-indigo-600 pr-5">
          <h1 className="text-3xl md:text-5xl font-[1000] dark:text-white italic tracking-tight">
            {searchQuery ? `نتائج البحث: "${searchQuery}"` : 'أحدث القطع المختارة'}
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
          {filteredProducts.map((product) => (
            <motion.div key={product.id} whileHover={{ y: -10 }} className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-5 shadow-lg border border-gray-100 dark:border-white/5 flex flex-col group h-full transition-all">
              <Link to={`/product/${product.id}`} className="flex flex-col h-full">
                <div className="relative h-60 mb-4 bg-gray-50 dark:bg-gray-900/50 rounded-[2rem] overflow-hidden">
                  <img src={product.image} className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-500" alt={product.name} />
                  <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1.5 text-xs font-black text-yellow-500">
                    <FaStar /> {product.rating?.rate || 4.5}
                  </div>
                </div>
                <h3 className="text-lg font-black dark:text-white mb-3 line-clamp-2 h-14 leading-tight">{product.name || product.title}</h3>
              </Link>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-white/5">
                <span className="text-2xl font-[1000] text-indigo-700 dark:text-indigo-400">{product.price} LE</span>
                <button 
                  onClick={() => { addToCart(product); toast.success('أُضيف لسلتك! 🛒'); }} 
                  className="bg-indigo-600 text-white p-4 rounded-[1.2rem] hover:bg-indigo-700 active:scale-90 transition-all shadow-lg"
                >
                  <FaShoppingCart size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {!searchQuery && <FeaturesSection />}
    </div>
  );
};

export default Home;