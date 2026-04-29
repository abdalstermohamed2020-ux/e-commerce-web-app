import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import useStore from '../store/UseStore';
import { FaDollarSign, FaBoxOpen, FaShoppingCart, FaUndo } from 'react-icons/fa'; // أضفنا أيقونة البكدجات

const AdminDashboard = () => {
  const { products, orders, returns } = useStore();
  const location = useLocation();

  // --- الحسابات (Logic) --- سيبتهالك زي ما هي بالظبط
  const netSales = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);

  const returnsValue = returns.reduce((sum, ret) => sum + (Number(ret.totalAmount) || 0), 0);
  const pendingOrdersCount = orders.filter(o => o.status !== 'delivered').length;

  const stats = [
    { title: "صافي المبيعات", value: `LE ${netSales.toFixed(2)}`, icon: <FaDollarSign />, color: "bg-green-600" },
    { title: "عدد المنتجات", value: products.length, icon: <FaBoxOpen />, color: "bg-blue-500" },
    { title: "أوردرات قيد التنفيذ", value: pendingOrdersCount, icon: <FaShoppingCart />, color: "bg-purple-500" },
    { title: "قيمة المرتجعات", value: `LE ${returnsValue.toFixed(2)}`, icon: <FaUndo />, color: "bg-red-500" },
  ];

  return (
    <div className="font-['Cairo']" dir="rtl">
      {/* شيلنا السايد بار من هنا تماماً لأن AdminLayout هو اللي بيعرضه 
         وشيلنا الـ main والـ flex عشان ميحصلش تداخل في التصميم
      */}

      {/* المحتوى يظهر فقط في الصفحة الرئيسية للداشبورد */}
      {location.pathname === '/secret-portal-mis' || location.pathname === '/secret-portal-mis/' ? (
        <div className="animate-in fade-in duration-500">
          <h2 className="text-3xl font-black mb-8 dark:text-slate-900">نظرة عامة على الأداء 📈</h2>
          
          {/* مربعات الإحصائيات */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between transition-all hover:shadow-md">
                <div className="text-right">
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-bold">{stat.title}</p>
                  <h3 className="text-2xl font-black dark:text-white mt-1">{stat.value}</h3>
                </div>
                <div className={`${stat.color} text-white p-4 rounded-2xl text-2xl shadow-lg`}>
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>

          {/* بانر التحليل */}
          <div className="mt-12 bg-indigo-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl border-4 border-white/5">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">تحليل أداء المتجر (MIS) 🚀</h3>
              <p className="opacity-80 max-w-xl font-medium leading-relaxed">
                الحسابات الآن دقيقة وتلقائية. يمكنك متابعة الأرباح الصافية بعد استبعاد المرتجعات والأوردرات التي لم تُسلم بعد.
              </p>
            </div>
            <div className="absolute -bottom-10 -left-10 text-[15rem] text-indigo-800 opacity-30 transform -rotate-12 font-black select-none pointer-events-none">
              $
            </div>
          </div>
        </div>
      ) : (
        /* هنا بيتم عرض المحتوى الفرعي (مثل صفحة إدارة المنتجات) */
        <div className="animate-in slide-in-from-bottom-4 duration-500">
          <Outlet />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;