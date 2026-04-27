import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useStore from '../store/UseStore';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaLayerGroup, FaArrowRight, FaShoppingBasket } from 'react-icons/fa';

const BundlePage = () => {
  const { bundleId } = useParams();
  const { products, bundles, fetchBundles, addToCart } = useStore();

  // جلب البيانات من السيرفر عند تحميل الصفحة
  useEffect(() => {
    fetchBundles();
  }, [fetchBundles]);

  // البحث عن البكدج المطلوبة
  const currentBundle = bundles.find(b => b.id === bundleId || b.id === parseInt(bundleId)) || bundles[0];

  // تحويل IDs المنتجات لمصفوفة والبحث عن بياناتهم
  const itemIdsArray = currentBundle?.items_ids 
    ? currentBundle.items_ids.split(',').map(id => parseInt(id.trim())) 
    : [];
    
  const bundleItems = products.filter(p => itemIdsArray.includes(parseInt(p.id)));

  // دالة معالجة رابط الصورة (اللوجك الجديد)
  const getFullImagePath = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/300?text=No+Image';
    
    // 1. لو الرابط كامل بيبدأ بـ http (زي اللي عندك في الداتا بيز حالياً)
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // 2. لو الصورة عبارة عن كود Base64 (بتبدأ بـ data:)
    if (imagePath.startsWith('data:')) {
      return imagePath;
    }
    
    // 3. لو الصورة مجرد اسم ملف (بتقرأ من فولدر uploads)
    return `http://localhost:8080/electronical_backend/uploads/${imagePath}`;
  };

  const handleAddBundle = () => {
    if (bundleItems.length === 0) { 
      toast.error("المنتجات غير متوفرة حالياً"); 
      return; 
    }
    
    const discountPrice = (currentBundle.price / bundleItems.length).toFixed(2);
    
    bundleItems.forEach(item => {
      addToCart({ 
        ...item, 
        price: parseFloat(discountPrice), 
        bundleName: currentBundle.bundle_name 
      });
    });
    
    toast.success(`تمت إضافة "${currentBundle.bundle_name}" للسلة! 🔥`);
  };

  if (!currentBundle) return <div className="text-center py-40 font-black dark:text-white">جاري تحميل العرض...</div>;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] py-28 px-6 font-['Cairo'] text-right" dir="rtl">
      <div className="container mx-auto max-w-7xl">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-10 transition-colors group font-bold">
          <FaArrowRight className="group-hover:translate-x-1 transition-transform" /> <span>العودة للمتجر</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* الجانب الأيمن: تفاصيل العرض */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-5 space-y-8 sticky top-28">
            <div className="inline-flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-700 text-white shadow-xl">
              <FaLayerGroup className="text-3xl" /> 
              <h4 className="font-black italic tracking-widest text-sm uppercase">عرض توفير خاص</h4>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-[1000] dark:text-white leading-[1.2] tracking-tight">
                {currentBundle.bundle_name}
            </h1>
            
            <p className="text-xl text-gray-500 dark:text-gray-400 font-bold leading-relaxed">
                وفرنا لك أفضل المنتجات في باكدج واحدة بسعر لا يقاوم. احصل على {bundleItems.length} قطع بخصم حقيقي.
            </p>
            
            <div className="bg-gray-50 dark:bg-white/5 p-10 rounded-[3.5rem] border border-gray-100 dark:border-white/10 shadow-inner relative overflow-hidden">
               <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-3xl"></div>
               <span className="text-gray-400 line-through text-2xl font-bold block mb-1">LE {currentBundle.old_price}</span>
               <div className="flex items-center gap-4">
                 <span className="text-7xl md:text-8xl font-[1000] text-indigo-700 dark:text-indigo-400 tracking-tighter">
                    LE {currentBundle.price}
                 </span>
                 <div className="flex flex-col">
                    <span className="bg-green-500 text-white text-[10px] font-black px-3 py-1 rounded-lg shadow-lg rotate-3 mb-1 text-center">وفر LE {currentBundle.old_price - currentBundle.price}</span>
                    <span className="text-xs font-black text-gray-400 uppercase">سعر خاص</span>
                 </div>
               </div>
            </div>

            <button 
              onClick={handleAddBundle} 
              className="group relative w-full bg-indigo-600 text-white py-7 rounded-[2.5rem] font-[1000] text-2xl shadow-2xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-4"
            >
               <span>أضف الباكدج للسلة</span>
               <FaShoppingBasket />
            </button>
          </motion.div>

          {/* الجانب الأيسر: كروت المنتجات */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
            {bundleItems.map((item) => (
              <div key={item.id} className="bg-white dark:bg-white/5 p-8 rounded-[3.5rem] border border-gray-100 dark:border-white/10 flex flex-col items-center group relative hover:shadow-2xl transition-all duration-500">
                
                <div className="absolute top-6 right-6 z-10">
                    <div className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-full text-[10px] font-black border border-indigo-100 dark:border-indigo-800/50 backdrop-blur-sm">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                        مشمول في العرض
                    </div>
                </div>

                <div className="h-64 w-full flex items-center justify-center mb-6 bg-gray-50/50 dark:bg-white/5 rounded-[3rem] overflow-hidden group-hover:bg-indigo-50/50 dark:group-hover:bg-indigo-900/10 transition-colors">
                    <img 
                      src={getFullImagePath(item.image)} 
                      alt={item.title} 
                      className="h-48 object-contain group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300?text=Image+Not+Found';
                      }}
                    />
                </div>

                <h3 className="text-lg font-black dark:text-gray-100 text-center line-clamp-2 h-14 mb-2 px-2 leading-tight">
                    {item.title || item.name}
                </h3>
                <span className="text-indigo-600 dark:text-indigo-400 font-black text-sm">قطعة مميزة</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BundlePage;