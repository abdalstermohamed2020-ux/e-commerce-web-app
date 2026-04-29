import React, { useEffect } from 'react';
import useStore from '../store/UseStore';
import { motion } from 'framer-motion';
import { FaTag, FaCartPlus } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const OffersPage = () => {
  // أضفنا addToCart هنا عشان نستخدمها في الإضافة الفورية
  const { bundles, products, fetchBundles, addToCart } = useStore();

  useEffect(() => {
    fetchBundles();
  }, [fetchBundles]);

  // دالة معالجة رابط الصورة
  const getFullImagePath = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/300?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('data:')) return imagePath;
    return `http://localhost:8080/electronical_backend/uploads/${imagePath}`;
  };

  // 🔥 الدالة الجديدة للإضافة الفورية للسلة
  const handleQuickAdd = (bundle) => {
    // 1. استخراج المنتجات الخاصة بالباقة
    const itemIds = bundle.items_ids ? bundle.items_ids.split(',').map(id => parseInt(id.trim())) : [];
    const bundleItems = products.filter(p => itemIds.includes(parseInt(p.id)));

    if (bundleItems.length === 0) {
      toast.error("عذراً، منتجات هذا العرض غير متوفرة حالياً");
      return;
    }

    // 2. حساب سعر القطعة الواحدة داخل العرض (توزيع السعر الإجمالي)
    const discountPrice = (bundle.price / bundleItems.length).toFixed(2);

    // 3. إضافة كل منتج للسلة
    bundleItems.forEach(item => {
      addToCart({
        ...item,
        price: parseFloat(discountPrice),
        bundleName: bundle.bundle_name // عشان تظهر في السلة إنها تبع عرض معين
      });
    });

    toast.success(`تم إضافة "${bundle.bundle_name}" للسلة بنجاح! 🛒`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] py-24 px-6 font-['Cairo']" dir="rtl">
      <div className="container mx-auto max-w-7xl">
        
        {/* الهيدر */}
        <div className="text-center mb-16 space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-6 py-2 rounded-full text-sm font-black mb-4"
          >
            عروض حصرية لفترة محدودة 🔥
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-[1000] dark:text-white">باقات التوفير الذكية</h1>
        </div>

        {/* شبكة العروض */}
        <div className="grid grid-cols-1 gap-12">
          {bundles.map((bundle, index) => {
            const itemIds = bundle.items_ids ? bundle.items_ids.split(',').map(id => parseInt(id.trim())) : [];
            const bundleProducts = products.filter(p => itemIds.includes(parseInt(p.id)));

            return (
              <motion.div
                key={bundle.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-white/5 rounded-[3rem] border border-gray-100 dark:border-white/10 overflow-hidden shadow-2xl shadow-gray-200/50 dark:shadow-none"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  
                  {/* قسم الصور */}
                  <div className="bg-slate-900 p-12 flex items-center justify-center relative overflow-hidden group">
                    <div className="grid grid-cols-2 gap-4 relative z-10 w-full">
                      {bundleProducts.slice(0, 3).map((prod, idx) => (
                        <div 
                          key={prod.id} 
                          className={`bg-white rounded-3xl p-4 shadow-2xl transform transition-transform duration-500 group-hover:scale-105 ${idx === 2 ? 'col-span-2 mx-auto w-1/2' : ''}`}
                        >
                          <img 
                            src={getFullImagePath(prod.image)} 
                            alt={prod.title || prod.name}
                            className="h-32 w-full object-contain"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-transparent"></div>
                  </div>

                  {/* قسم التفاصيل */}
                  <div className="p-12 flex flex-col justify-center space-y-6 text-right">
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black">
                      <FaTag />
                      <span>خصم LE {bundle.old_price - bundle.price}</span>
                    </div>

                    <h2 className="text-4xl font-[1000] dark:text-white leading-tight">
                      {bundle.bundle_name}
                    </h2>

                    <div className="flex items-end gap-4 pt-4">
                      <div className="flex flex-col">
                         <span className="text-gray-400 line-through text-xl font-bold">LE {bundle.old_price}</span>
                         <span className="text-5xl font-[1000] text-indigo-600 dark:text-indigo-400">LE {bundle.price}</span>
                      </div>
                    </div>

                    {/* أزرار التحكم الجديدة */}
                    <div className="pt-8 flex flex-col sm:flex-row gap-4">
                      {/* الزرار الأساسي: إضافة فورية */}
                      <button 
                        onClick={() => handleQuickAdd(bundle)}
                        className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white text-center py-5 rounded-2xl font-black text-xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3"
                      >
                        إضافة العرض للسلة
                        <FaCartPlus />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {bundles.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-white/5 rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-white/10">
            <p className="text-gray-500 dark:text-gray-400 font-bold text-xl">لا توجد عروض متاحة حالياً..</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OffersPage;