import React from 'react';
import useStore from '../store/UseStore';
import { FaMoneyCheckAlt, FaCalendarCheck, FaUserTag, FaBox } from 'react-icons/fa';

const ManageSales = () => {
  const { orders } = useStore();

  // فلترة الأوردرات اللي اتسلمت فقط (المبيعات الحقيقية)
  const completedSales = orders.filter(order => order.status === 'delivered');

  // حساب إجمالي الأرباح الصافية
  const totalRevenue = completedSales.reduce((acc, order) => acc + (Number(order.totalAmount) || 0), 0);

  return (
    <div className="p-8" dir="rtl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-green-600">سجل المبيعات الصافية</h2>
          <p className="text-gray-500 font-bold mt-1">هنا تظهر فقط الأوردرات التي تم توصيلها للعملاء ✅</p>
        </div>
        <div className="bg-green-100 dark:bg-green-900/30 p-6 rounded-[2rem] text-center border border-green-200">
          <span className="block text-xs text-green-600 dark:text-green-400 font-black mb-1">إجمالي الدخل</span>
          <span className="text-3xl font-black text-green-700 dark:text-green-300">LE {totalRevenue.toFixed(2)}</span>
        </div>
      </div>

      {completedSales.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-[3rem] shadow-sm border-2 border-dashed border-gray-200">
          <p className="text-gray-400 font-bold text-xl">لم يتم إتمام أي مبيعات بعد.. في انتظار أول توصيل! 🚚</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {completedSales.map((sale) => (
            <div key={sale.id} className="bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-6 hover:border-green-500 transition-all group">
              
              {/* بيانات العميل والتاريخ */}
              <div className="flex items-center gap-4 w-full md:w-1/3">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-2xl text-green-600">
                  <FaUserTag size={20} />
                </div>
                <div>
                  <h3 className="font-black dark:text-white">{sale.customerName}</h3>
                  <div className="flex items-center gap-2 text-gray-400 text-xs mt-1">
                    <FaCalendarCheck />
                    <span>تم التوصيل في: {sale.date}</span>
                  </div>
                </div>
              </div>

              {/* المنتجات اللي اتباعت بالصور */}
              <div className="flex -space-x-4 space-x-reverse overflow-hidden w-full md:w-1/3 justify-center">
                {sale.items.map((item, index) => (
                  <img 
                    key={index}
                    src={item.image} 
                    title={item.title}
                    className="w-12 h-12 rounded-full border-4 border-white dark:border-gray-800 object-contain bg-white shadow-sm"
                    alt="product"
                  />
                ))}
                {sale.items.length > 3 && (
                  <div className="w-12 h-12 rounded-full border-4 border-white dark:border-gray-800 bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-500">
                    +{sale.items.length - 3}
                  </div>
                )}
              </div>

              {/* المبلغ وطريقة الدفع */}
              <div className="text-left w-full md:w-1/4">
                <span className="block text-2xl font-black text-indigo-600 dark:text-indigo-400">LE {sale.totalAmount.toFixed(2)}</span>
                <span className="text-[10px] bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full font-bold text-gray-500 dark:text-gray-300">
                  {sale.paymentMethod === 'vodafone' ? 'فودافون كاش' : 'دفع نقدي'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageSales;