import React from 'react';
import useStore from '../store/UseStore'; 
import { useNavigate } from 'react-router-dom';
import { FaRocket, FaUsers, FaShieldAlt, FaStar, FaQuoteRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

const About = () => {
  const { products } = useStore();
  const navigate = useNavigate();

  // بيانات الإحصائيات
  const stats = [
    { id: 1, label: "عميل سعيد", value: "+10,000", icon: <FaUsers className="text-blue-500" /> },
    { id: 2, label: "منتج أصلي", value: "+5,000", icon: <FaShieldAlt className="text-green-500" /> },
    { id: 3, label: "توصيل سريع", value: "24h", icon: <FaRocket className="text-orange-500" /> },
  ];

  const customerNames = ["أحمد علي", "سارة حسن", "محمود كريم", "ليلى يوسف", "ياسين محمد", "نورا خالد", "حمزة رضوان", "مريم إبراهيم", "عمر فاروق", "هناء سيد"];
  const comments = [
    "الجودة ممتازة جداً والتوصيل سريع", "أفضل متجر إلكترونيات تعاملت معه", "المنتج أصلي والتغليف محترم", 
    "خدمة ما بعد البيع متعاونة جداً", "سعر منافس جداً مقارنة بالسوق", "الشاشة ألوانها خرافية كما في الوصف",
    "الكيبورد مريح جداً في الكتابة", "أنصح الجميع بالتعامل معهم", "تجربة شراء سلسة وسهلة", "شكراً لكم على هذه الأمانة"
  ];

  const testimonials = products.slice(0, 10).map((product, index) => ({
    id: product.id,
    name: customerNames[index] || `عميل ${index + 1}`,
    comment: comments[index] || "منتج رائع واستخدامه سهل جداً!",
    productImage: product.image,
    productName: product.title,
    avatar: `https://i.pravatar.cc/150?u=${index}`
  }));

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 text-right font-['Cairo'] pb-20" dir="rtl">
      
      {/* 1. Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-indigo-700 via-indigo-600 to-purple-700 text-white overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-6xl font-black mb-6 tracking-tighter"
          >
            عن <span className="text-yellow-400">Shopify Store</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl max-w-2xl mx-auto opacity-90 leading-relaxed font-bold"
          >
            نحن لسنا مجرد متجر، نحن شريكك التقني الموثوق لتوفير أحدث الابتكارات بأفضل الأسعار.
          </motion.p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="mt-10 px-12 py-4 bg-white text-indigo-600 font-black rounded-2xl shadow-2xl hover:bg-yellow-400 hover:text-indigo-900 transition-all uppercase tracking-wider"
          >
            ابدأ التسوق الآن
          </motion.button>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[120px] -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] -ml-32 -mb-32"></div>
      </section>

      {/* 2. Stats Section */}
      <section className="py-12 -mt-16 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat) => (
              <motion.div 
                whileHover={{ y: -10 }}
                key={stat.id} 
                className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-700 flex flex-col items-center"
              >
                <div className="text-5xl mb-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-2xl">{stat.icon}</div>
                <h3 className="text-4xl font-black dark:text-white mb-2 tracking-tighter">{stat.value}</h3>
                <p className="text-gray-500 dark:text-gray-400 font-black italic uppercase text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Testimonials Section */}
      <section className="py-24 container mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-black dark:text-white mb-4">قصص <span className="text-indigo-600 italic">النجاح</span></h2>
          <div className="w-24 h-2 bg-yellow-400 mx-auto rounded-full"></div>
          <p className="text-gray-500 mt-6 font-bold text-lg">نعتز بآراء أكثر من 10,000 عميل حول العالم</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-7xl mx-auto">
          {testimonials.map((item, index) => (
            <motion.div 
              initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              key={item.id} 
              className="bg-white dark:bg-gray-800 p-8 rounded-[3rem] border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center gap-8 hover:shadow-3xl transition-all group shadow-xl relative overflow-hidden"
            >
              {/* صورة المنتج */}
              <div className="w-40 h-40 flex-shrink-0 bg-white rounded-[2rem] p-4 shadow-inner relative flex items-center justify-center border border-gray-50">
                <img 
                  src={item.productImage} 
                  alt={item.productName} 
                  className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-700 mix-blend-multiply"
                />
                <div className="absolute -top-3 -right-3 bg-indigo-600 text-white text-[10px] px-3 py-1.5 rounded-full font-black shadow-lg">
                  موصى به
                </div>
              </div>

              {/* محتوى الرأي */}
              <div className="flex-grow">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <img src={item.avatar} alt="" className="w-14 h-14 rounded-2xl ml-4 border-2 border-indigo-500 shadow-md" />
                    <div className="text-right">
                      <h4 className="font-black dark:text-white text-lg">{item.name}</h4>
                      <p className="text-indigo-500 text-xs font-bold truncate max-w-[150px] italic">{item.productName}</p>
                    </div>
                  </div>
                  <div className="flex text-yellow-400 gap-1 bg-yellow-50 dark:bg-gray-700 px-3 py-1.5 rounded-xl">
                    {[...Array(5)].map((_, i) => <FaStar key={i} size={12} />)}
                  </div>
                </div>
                
                <div className="relative">
                  <FaQuoteRight className="absolute -right-4 -top-6 text-indigo-500/10 dark:text-white/5 text-6xl" />
                  <p className="text-gray-600 dark:text-gray-300 text-md font-bold leading-relaxed pr-4 relative z-10 italic">
                    "{item.comment}"
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;