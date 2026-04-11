import React from 'react';
import { useParams, Link } from 'react-router-dom';
import useStore from '../store/UseStore';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaGem, FaTshirt, FaGamepad, FaShoppingBag, FaArrowRight } from 'react-icons/fa';

const BundlePage = () => {
  const { bundleId } = useParams();
  const { products, addToCart } = useStore();

  const bundlesData = {
    "electronics-pack": { title: "عالم الإلكترونيات", subTitle: "أحدث التقنيات بخصم حقيقي", description: "باكدج تجمع لك بين الأداء القوي والتكنولوجيا المتطورة.", price: 299, oldPrice: 400, itemsIds: [9, 10, 11, 12], icon: <FaGamepad className="text-4xl" />, color: "from-blue-600 to-indigo-900" },
    "winter-pack": { title: "أزياء الشتاء", subTitle: "أناقة ودفء في موسم واحد", description: "اخترنا لك أفضل القطع الشتوية التي تجمع بين المظهر العصري والجودة.", price: 99, oldPrice: 137, itemsIds: [15, 16, 17, 18], icon: <FaTshirt className="text-4xl" />, color: "from-orange-600 to-red-700" },
    "beauty-corner": { title: "ركن الجمال", subTitle: "مجوهرات وعطور تليق بكِ", description: "بريق خاص لكل مناسبة مع تشكيلة المجوهرات والروائح الفاخرة.", price: 699, oldPrice: 880, itemsIds: [5, 6, 7, 8], icon: <FaGem className="text-4xl" />, color: "from-purple-600 to-pink-600" },
    "friday-offers": { title: "عروض الجمعة", subTitle: "الخصومات الكبرى وصلت", description: "أكبر فرصة توفير في السنة على مجموعة متنوعة من أفضل المنتجات.", price: 60, oldPrice: 80, itemsIds: [19, 20, 3], icon: <FaShoppingBag className="text-4xl" />, color: "from-gray-800 to-black" }
  };

  const currentBundle = bundlesData[bundleId] || bundlesData["electronics-pack"];
  const bundleItems = products.filter(p => currentBundle.itemsIds.includes(p.id));

  const handleAddBundle = () => {
    if (bundleItems.length === 0) { toast.error("المنتجات غير متوفرة"); return; }
    const discountPrice = (currentBundle.price / bundleItems.length).toFixed(2);
    bundleItems.forEach(item => addToCart({ ...item, price: parseFloat(discountPrice), bundleName: currentBundle.title }));
    toast.success(`تمت إضافة "${currentBundle.title}" للسلة! 🔥`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] py-28 px-6 font-['Cairo'] text-right" dir="rtl">
      <div className="container mx-auto max-w-7xl">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-10 transition-colors group font-bold">
          <FaArrowRight className="group-hover:translate-x-1 transition-transform" /> <span>العودة للمتجر</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* الجانب الأيمن: تفاصيل العرض */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-5 space-y-8 sticky top-28">
            <div className={`inline-flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r ${currentBundle.color} text-white shadow-xl shadow-indigo-100 dark:shadow-none`}>
              {currentBundle.icon} <h4 className="font-black italic tracking-widest text-sm uppercase">Bundle Offer</h4>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black dark:text-white leading-[1.2] tracking-tight">{currentBundle.title}</h1>
            <p className="text-2xl text-indigo-600 dark:text-indigo-400 font-bold italic underline underline-offset-8 decoration-2">{currentBundle.subTitle}</p>
            
            {/* بوكس السعر الجديد */}
            <div className="bg-gray-50 dark:bg-white/5 p-10 rounded-[3rem] border border-gray-100 dark:border-white/10 shadow-inner relative overflow-hidden">
               <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-500/10 rounded-full blur-3xl"></div>
               <span className="text-gray-400 line-through text-2xl font-light block mb-1">${currentBundle.oldPrice}</span>
               <div className="flex items-center gap-3">
                 <span className="text-7xl md:text-8xl font-black dark:text-white tracking-tighter">${currentBundle.price}</span>
                 <span className="bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-lg shadow-lg rotate-3">خصم هائل</span>
               </div>
            </div>

            <button 
              onClick={handleAddBundle} 
              className="group relative w-full bg-gradient-to-r from-indigo-600 to-violet-700 text-white py-7 rounded-[2.5rem] font-black text-2xl shadow-2xl shadow-indigo-200 dark:shadow-none hover:shadow-indigo-400 transition-all active:scale-95 overflow-hidden"
            >
               <span className="relative z-10">تفعيل العرض وإضافة للسلة 🚀</span>
               <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </motion.div>

          {/* الجانب الأيسر: كروت المنتجات */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-8">
            {bundleItems.map((item) => (
              <div key={item.id} className="bg-white dark:bg-white/5 p-8 rounded-[3rem] border border-gray-100 dark:border-white/10 flex flex-col items-center group relative hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:hover:shadow-none hover:-translate-y-2 transition-all duration-500">
                {/* Badge التوفر الجديد */}
                <div className="absolute top-6 right-6 z-10">
                    <div className="flex items-center gap-1.5 bg-green-500/10 text-green-600 dark:text-green-400 px-4 py-2 rounded-full text-[10px] font-black border border-green-500/20 backdrop-blur-sm">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        مشمول في الباكدج
                    </div>
                </div>

                {/* الصورة وتأثيرها */}
                <div className="h-60 w-full flex items-center justify-center mb-6 bg-gray-50/50 dark:bg-black/20 rounded-[2rem] overflow-hidden">
                    <img src={item.image} alt={item.title} className="h-44 object-contain group-hover:scale-110 transition-transform duration-500 mix-blend-multiply dark:mix-blend-normal" />
                </div>

                <h3 className="text-base font-bold dark:text-gray-200 text-center line-clamp-2 h-12 mb-4 px-2 leading-relaxed tracking-wide">
                    {item.title}
                </h3>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BundlePage;