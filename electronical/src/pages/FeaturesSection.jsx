import React from 'react';
import { motion } from 'framer-motion';
import { FaTruck, FaShieldAlt, FaHeadset, FaUndo } from 'react-icons/fa';

const features = [
  { id: 1, title: 'شحن سريع', desc: 'توصيل لباب بيتك في 48 ساعة', icon: <FaTruck />, color: 'bg-blue-500' },
  { id: 2, title: 'ضمان معتمد', desc: 'ضمان عام كامل على كافة المنتجات', icon: <FaShieldAlt />, color: 'bg-green-500' },
  { id: 3, title: 'دعم فني 24/7', desc: 'فريقنا معاك في كل خطوة', icon: <FaHeadset />, color: 'bg-purple-500' },
  { id: 4, title: 'استرجاع مرن', desc: 'تقدر ترجع المنتج خلال 14 يوم', icon: <FaUndo />, color: 'bg-orange-500' },
];

const FeaturesSection = () => {
  return (
    <div className="container mx-auto px-6 mb-24 mt-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((item) => (
          <motion.div 
            key={item.id}
            whileHover={{ y: -10 }}
            className="p-8 rounded-3xl bg-[#0f172a] border border-white/5 flex flex-col items-center text-center group transition-all"
          >
            <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center text-3xl text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
              {item.icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;