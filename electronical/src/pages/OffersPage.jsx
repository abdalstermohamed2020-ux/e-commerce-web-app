import React from 'react';
import useStore from '../store/UseStore'; 
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion'; 
import { FaPlus, FaCartPlus, FaHotjar } from 'react-icons/fa';

const OffersPage = () => {
  const { products, addToCart } = useStore();

  // --- الباكدجات بأسعار "لقطة" مقارنة بأسعار الهوم ---
  const mixBundles = [
    {
      id: "modern-man",
      title: "باكدج الرجل العصري 🕶️",
      desc: "تجميعة ذكية: شنطة لاب توب + تيشرت قطني + جاكيت كاجوال",
      price: 2100, 
      oldPrice: 3200, // مجموعهم منفردين أغلى بكتير
      itemsIds: [1, 2, 3], 
      color: "from-slate-700 to-slate-900"
    },
    {
      id: "tech-pro",
      title: "باكدج التكنولوجيا الذكية 💻",
      desc: "سيستم كامل: هارد SSD سريع + شاشة ألعاب + فلاشة تخزين",
      price: 3950, 
      oldPrice: 5500,
      itemsIds: [13, 14, 12], 
      color: "from-blue-900 to-cyan-700"
    },
    {
      id: "home-chef",
      title: "باكدج شيف المنزل 🍳",
      desc: "مطبخك كامل: أدوات مائدة فاخرة + طقم سكاكين احترافي",
      price: 2800, 
      oldPrice: 4200,
      itemsIds: [9, 10, 11],
      color: "from-orange-600 to-yellow-500"
    },
    {
      id: "fitness-pack",
      title: "باكدج اللياقة والنشاط 🏃‍♂️",
      desc: "ميكس رياضي: تيشيرت طارد للعرق + ساعة رياضية ذكية",
      price: 1850, 
      oldPrice: 2900,
      itemsIds: [17, 18, 19],
      color: "from-green-600 to-lime-500"
    }
  ];

  const handleAddBundleToCart = (bundle) => {
    const bundleItems = products.filter(p => bundle.itemsIds.includes(p.id));
    if (bundleItems.length === 0) {
      toast.error("عفواً، بعض منتجات العرض غير متوفرة حالياً");
      return;
    }

    const pricePerItem = (bundle.price / bundleItems.length).toFixed(2);
    
    bundleItems.forEach(item => {
      addToCart({ 
        ...item, 
        price: parseFloat(pricePerItem), 
        bundleName: bundle.title,
      });
    });

    // --- رسالة التأكيد الـ Premium الجديدة ---
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white dark:bg-gray-800 shadow-2xl rounded-[2rem] pointer-events-auto flex ring-1 ring-black ring-opacity-5 border-b-4 border-indigo-600`}
        dir="rtl"
      >
        <div className="flex-1 w-0 p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-3xl">🔥</div>
            <div className="ml-3 mr-4 flex-1">
              <p className="text-sm font-[1000] text-gray-900 dark:text-white font-['Cairo']">
                تم خطف العرض بنجاح!
              </p>
              <p className="mt-1 text-xs font-bold text-gray-500 dark:text-gray-400 leading-relaxed font-['Cairo']">
                {bundle.title} في سلتك الآن. وفرت {bundle.oldPrice - bundle.price} ج.م
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-r border-gray-100 dark:border-gray-700">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-l-[2rem] p-4 flex items-center justify-center text-sm font-[1000] text-indigo-600 hover:text-indigo-500 focus:outline-none font-['Cairo']"
          >
            إغلاق
          </button>
        </div>
      </div>
    ), { duration: 4000 });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] py-20 px-4 text-right font-['Cairo']" dir="rtl">
      <div className="container mx-auto max-w-6xl">
        
        {/* الهيدر المحسن */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 px-6 py-2 rounded-full mb-4 font-black border border-indigo-200"
          >
            <FaHotjar className="text-orange-500" /> <span>وفر أكتر من 30% مع الباكدجات</span>
          </motion.div>
          <h1 className="text-5xl font-[1000] dark:text-white mb-4 italic">مهرجان العروض الميكس 🚀</h1>
        </div>

        {/* عرض الباكدجات */}
        <div className="space-y-16">
          {mixBundles.map((bundle) => {
            const bundleProducts = products.filter(p => bundle.itemsIds.includes(p.id));
            const savings = bundle.oldPrice - bundle.price;

            return (
              <motion.div 
                key={bundle.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-gray-100 dark:border-white/5 transition-all hover:shadow-indigo-500/10"
              >
                {/* الجانب البصري للباكدج */}
                <div className={`lg:w-3/5 bg-gradient-to-br ${bundle.color} p-10 flex items-center justify-center gap-4 relative overflow-hidden`}>
                  {bundleProducts.map((item, index) => (
                    <React.Fragment key={item.id}>
                      <div className="bg-white p-3 rounded-[2rem] shadow-2xl w-24 h-24 md:w-36 md:h-36 flex items-center justify-center relative z-10 hover:scale-110 transition-transform">
                        <img src={item.image} alt={item.title} className="max-h-full object-contain" />
                        <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] px-2 py-1 rounded-full font-bold">قطعة {index+1}</span>
                      </div>
                      {index < bundleProducts.length - 1 && <FaPlus className="text-white/40 text-xl z-10" />}
                    </React.Fragment>
                  ))}
                  {/* تأثير جمالي في الخلفية */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                </div>

                {/* تفاصيل العرض والأسعار */}
                <div className="lg:w-2/5 p-10 md:p-12 flex flex-col justify-center">
                  <h2 className="text-3xl font-[1000] dark:text-white mb-3">{bundle.title}</h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-8 font-bold leading-relaxed">{bundle.desc}</p>
                  
                  <div className="mb-10 p-5 bg-gray-50 dark:bg-white/5 rounded-[2rem] border border-dashed border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400 line-through text-lg font-bold">LE {bundle.oldPrice}</span>
                      <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full font-black uppercase">وفر LE {savings}</span>
                    </div>
                    <div className="text-5xl font-[1000] text-indigo-600 dark:text-indigo-400">
                      LE {bundle.price}
                    </div>
                  </div>

                  <button 
                    onClick={() => handleAddBundleToCart(bundle)} 
                    className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-3"
                  >
                    أضف الباكدج للسلة <FaCartPlus />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OffersPage;