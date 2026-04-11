import React from 'react';
import useStore from '../store/UseStore'; 
import { useNavigate } from 'react-router-dom';
import { FaRocket, FaUsers, FaShieldAlt, FaStar, FaQuoteRight } from 'react-icons/fa';

const About = () => {
  const { products } = useStore();
  const navigate = useNavigate();

  // بيانات الإحصائيات (Stats)
  const stats = [
    { id: 1, label: "عميل سعيد", value: "+10,000", icon: <FaUsers className="text-blue-500" /> },
    { id: 2, label: "منتج أصلي", value: "+5,000", icon: <FaShieldAlt className="text-green-500" /> },
    { id: 3, label: "توصيل سريع", value: "24h", icon: <FaRocket className="text-orange-500" /> },
  ];

  // بيانات العملاء والتعليقات
  const customerNames = ["أحمد علي", "سارة حسن", "محمود كريم", "ليلى يوسف", "ياسين محمد", "نورا خالد", "حمزة رضوان", "مريم إبراهيم", "عمر فاروق", "هناء سيد"];
  const comments = [
    "الجودة ممتازة جداً والتوصيل سريع", "أفضل متجر إلكترونيات تعاملت معه", "المنتج أصلي والتغليف محترم", 
    "خدمة ما بعد البيع متعاونة جداً", "سعر منافس جداً مقارنة بالسوق", "الشاشة ألوانها خرافية كما في الوصف",
    "الكيبورد مريح جداً في الكتابة", "أنصح الجميع بالتعامل معهم", "تجربة شراء سلسة وسهلة", "شكراً لكم على هذه الأمانة"
  ];

  // ربط الـ 10 آراء بمنتجات الـ API
  const testimonials = products.slice(0, 10).map((product, index) => ({
    id: product.id,
    name: customerNames[index] || `عميل ${index + 1}`,
    comment: comments[index] || "منتج رائع واستخدامه سهل جداً!",
    productImage: product.image,
    productName: product.title,
    avatar: `https://i.pravatar.cc/150?u=${index}`
  }));

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 text-right font-sans pb-20">
      
      {/* 1. Hero Section (التنسيق الأول) */}
      <section className="relative py-24 bg-indigo-600 dark:bg-indigo-900 text-white overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-5xl font-black mb-6">عن <span className="text-yellow-400">Shopify Store</span></h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90 leading-relaxed">
            وجهتك الأولى للحصول على أحدث التقنيات العالمية بأعلى جودة وأفضل خدمة ما بعد البيع.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="btn-liquid mt-8 px-10 py-3 bg-white text-indigo-600 font-bold rounded-xl shadow-lg hover:scale-105 transition-transform"
          >
            تصفح منتجاتنا
          </button>
        </div>
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </section>

      {/* 2. Stats Section (الأرقام) */}
      <section className="py-12 -mt-12 relative z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat) => (
              <div key={stat.id} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col items-center transform hover:-translate-y-2 transition-all">
                <div className="text-4xl mb-4">{stat.icon}</div>
                <h3 className="text-3xl font-bold dark:text-white mb-2">{stat.value}</h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Testimonials Section (الـ 10 آراء بالمنتجات) */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold dark:text-white">ثقة <span className="text-indigo-600">عملائنا</span></h2>
          <p className="text-gray-500 mt-2">آراء حقيقية من أشخاص جربوا منتجاتنا</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {testimonials.map((item) => (
            <div 
              key={item.id} 
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 flex flex-col lg:flex-row items-center gap-6 hover:shadow-2xl transition-all group shadow-sm"
            >
              {/* صورة المنتج من الـ API */}
              <div className="w-36 h-36 flex-shrink-0 bg-white rounded-3xl p-3 shadow-inner relative flex items-center justify-center">
                <img 
                  src={item.productImage} 
                  alt={item.productName} 
                  className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute -bottom-2 bg-lime-600 text-white text-[9px] px-2 py-1 rounded-full font-bold shadow-md">
                  تم الشراء
                </div>
              </div>

              {/* محتوى الرأي */}
              <div className="flex-grow">
                <div className="flex items-center mb-4">
                  <img src={item.avatar} alt="" className="w-12 h-12 rounded-full ml-3 border-2 border-indigo-500 p-0.5" />
                  <div className="text-right">
                    <h4 className="font-bold dark:text-white text-base">{item.name}</h4>
                    <p className="text-indigo-500 text-[11px] font-medium truncate w-48">{item.productName}</p>
                  </div>
                  <div className="mr-auto text-yellow-400 flex text-xs gap-0.5">
                    {[...Array(5)].map((_, i) => <FaStar key={i} />)}
                  </div>
                </div>
                
                <div className="relative">
                  <FaQuoteRight className="absolute -right-3 -top-3 text-indigo-100 dark:text-gray-700 text-4xl opacity-50" />
                  <p className="text-gray-600 dark:text-gray-300 text-sm italic leading-relaxed pr-5 relative z-10">
                    {item.comment}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;