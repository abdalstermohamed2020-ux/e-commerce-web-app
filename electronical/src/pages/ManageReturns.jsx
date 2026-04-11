import React from 'react';
import useStore from '../store/UseStore';
import { FaUndo, FaUser, FaCalendarAlt, FaPhoneAlt } from 'react-icons/fa';

const ManageReturns = () => {
  const { returns } = useStore();

  return (
    <div className="p-8" dir="rtl">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-red-100 p-3 rounded-2xl text-red-600">
          <FaUndo size={24} />
        </div>
        <h2 className="text-3xl font-black text-red-600">سجل المرتجعات</h2>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {returns.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-[3rem] shadow-sm border-2 border-dashed border-gray-200 dark:border-gray-700">
            <p className="text-gray-400 font-bold text-xl italic">لا توجد عمليات مرتجعة حتى الآن 📦</p>
          </div>
        ) : (
          returns.map((r) => (
            <div 
              key={r.id} 
              className="bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] border-r-8 border-red-500 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-md transition-all"
            >
              {/* --- قسم صورة المنتج واسم العميل --- */}
              <div className="flex items-center gap-5 w-full md:w-auto">
                <div className="relative">
                   {/* صورة المنتج المرتجع */}
                  <img 
                    src={r.items?.[0]?.image || r.productImage || 'https://via.placeholder.com/150'} 
                    alt="product" 
                    className="w-20 h-20 object-contain bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 p-2"
                  />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full font-black shadow-lg">
                    مرتجع
                  </span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black">
                    <FaUser size={12} />
                    <h3>{r.customerName}</h3>
                  </div>
                  {/* اسم المنتج المرتجع */}
                  <p className="text-sm font-bold dark:text-white line-clamp-1 w-48">
                    {r.items?.[0]?.title || "منتج غير معروف"}
                  </p>
                  <div className="flex items-center gap-2 text-gray-400 text-[11px] font-bold italic">
                    <FaCalendarAlt />
                    <span>بتاريخ: {r.returnDate || r.date}</span>
                  </div>
                </div>
              </div>

              {/* --- قسم رقم فودافون كاش (التركاية الإضافية) --- */}
              {r.senderNumber && r.senderNumber !== 'N/A' && (
                <div className="bg-red-50 dark:bg-red-900/10 p-3 px-5 rounded-2xl border border-red-100 dark:border-red-900/20 text-center">
                  <span className="text-[10px] text-red-400 block font-bold mb-1">رقم استرداد الأموال</span>
                  <div className="flex items-center gap-2 text-red-600 font-black">
                    <FaPhoneAlt size={12} />
                    <span>{r.senderNumber}</span>
                  </div>
                </div>
              )}

              {/* --- المبلغ النهائي --- */}
              <div className="text-left w-full md:w-auto flex flex-col items-end">
                <span className="text-2xl font-black text-red-600">
                  LE {(Number(r.totalAmount) || 0).toFixed(2)}
                </span>
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Processed</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageReturns;