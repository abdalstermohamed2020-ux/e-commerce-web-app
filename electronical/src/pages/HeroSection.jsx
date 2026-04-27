import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="relative bg-white dark:bg-[#0a0a0a] overflow-hidden min-h-[70vh] flex items-center">
      <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-12">
        
        {/* النص اليمين: العنوان والدعوة لاتخاذ إجراء */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-right space-y-6"
        >
          <h1 className="text-5xl md:text-7xl font-[1000] text-gray-900 dark:text-white leading-[1.2] italic">
            عالم من <span className="text-indigo-600">الفخامة</span> <br /> 
            بين يديك.
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl font-bold max-w-xl">
            في SHOPYSTORE، نختار لك أفضل المنتجات العالمية بجودة استثنائية وأسعار لا تقبل المنافسة. ابدأ رحلة التسوق الفريدة الآن.
          </p>
          <div className="flex gap-4 pt-4">
            <Link 
              to="/all-offers" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-5 rounded-3xl font-black text-xl shadow-2xl shadow-indigo-500/40 transition-all hover:scale-105 active:scale-95"
            >
              استكشف العروض 🔥
            </Link>
          </div>
        </motion.div>

        {/* النص الشمال: عرض المنتجات بشكل فني */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="flex-1 relative h-[500px] w-full flex items-center justify-center"
        >
          {/* دائرة خلفية جمالية */}
          <div className="absolute w-[300px] h-[300px] md:w-[450px] md:h-[450px] bg-indigo-100 dark:bg-indigo-900/20 rounded-full blur-3xl"></div>
          
          {/* منتج 1: ساعة (مثال) */}
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute z-20 top-10 right-10 md:right-20 bg-white dark:bg-gray-800 p-4 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-white/5 w-48"
          >
            <img src="https://path-to-your-watch-image.png" alt="Premium Watch" className="w-full h-auto object-contain" />
          </motion.div>

          {/* منتج 2: سماعة أو شنطة */}
          <motion.div 
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute z-10 bottom-10 left-10 md:left-20 bg-indigo-50 dark:bg-indigo-900/30 p-6 rounded-[3rem] shadow-xl w-56"
          >
            <img src="https://path-to-your-electronics-image.png" alt="Electronics" className="w-full h-auto object-contain" />
          </motion.div>

          {/* عنصر عائم صغير للزينة */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-dashed border-indigo-300 dark:border-indigo-700 w-64 h-64 rounded-full opacity-30"
          ></motion.div>
        </motion.div>

      </div>
    </div>
  );
};

export default HeroSection;