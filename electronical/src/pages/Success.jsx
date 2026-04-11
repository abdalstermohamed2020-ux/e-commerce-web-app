import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaBox, FaHome } from 'react-icons/fa';

const Success = () => {
  const navigate = useNavigate();
  
  // توليد رقم طلب عشوائي أو جلب رقم مميز (ممكن نعتمد على الوقت الحالي)
  const orderNumber = `ORD-${Math.floor(Math.random() * 1000000)}`;
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + 3); // توقع التوصيل خلال 3 أيام

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6" dir="rtl">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-[3rem] shadow-2xl p-10 text-center border border-gray-100 dark:border-gray-700"
      >
        {/* أيقونة النجاح المتحركة */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
          className="text-green-500 text-8xl mb-6 flex justify-center"
        >
          <FaCheckCircle />
        </motion.div>

        <h1 className="text-3xl font-black dark:text-white mb-2">تم استلام طلبك يا هندسة! 🚀</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 font-bold">شكراً لثقتك في متجرنا، فريقنا هيتواصل معاك قريب.</p>

        {/* كارت تفاصيل الطلب */}
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-[2rem] p-6 mb-8 border border-indigo-100 dark:border-indigo-800/50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-500 dark:text-indigo-300 font-bold text-sm italic">رقم الطلب الخاص بك:</span>
            <span className="bg-white dark:bg-gray-900 px-4 py-1 rounded-xl font-black text-indigo-600 shadow-sm border border-indigo-200">
              {orderNumber}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 dark:text-indigo-300 font-bold">موعد التوصيل المتوقع:</span>
            <span className="dark:text-white font-black">{estimatedDate.toLocaleDateString('ar-EG')}</span>
          </div>
        </div>

        {/* أزرار التحكم */}
        <div className="grid grid-cols-1 gap-4">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white py-4 rounded-2xl font-black hover:bg-indigo-700 transition-all shadow-lg group"
          >
            <FaHome className="group-hover:-translate-y-1 transition-transform" />
            العودة للرئيسية
          </button>
          
          <p className="text-[10px] text-gray-400 font-bold mt-4 italic">
            * سيتم إرسال تفاصيل الفاتورة على بريدك الإلكتروني قريباً.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Success;