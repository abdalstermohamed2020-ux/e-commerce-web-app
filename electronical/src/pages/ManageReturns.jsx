import React from 'react';
import useStore from '../store/UseStore';
import { FaUndo, FaUser, FaCalendarAlt, FaPhoneAlt, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2'; // استيراد SweetAlert
import { toast } from 'react-hot-toast';

const ManageReturns = () => {
  // استخدام اللوجيك الجديد من الـ Store مباشرة
  const returnsList = useStore((state) => state.returns) || [];
  const clearReturnsFromDB = useStore((state) => state.clearReturnsFromDB);

  const handleClearAll = async () => {
    // تنبيه احترافي بدلاً من alert المتصفح
    Swal.fire({
      title: 'هل أنت متأكد؟',
      text: "سيتم مسح سجل المرتجعات بالكامل نهائياً من قاعدة البيانات!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626', // لون أحمر متناسق مع التصميم
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'نعم، قم بالتصفية!',
      cancelButtonText: 'إلغاء',
      background: '#ffffff',
      borderRadius: '2rem',
      customClass: {
        popup: 'rounded-[2rem] font-["Cairo"]',
        confirmButton: 'rounded-xl px-6 py-3',
        cancelButton: 'rounded-xl px-6 py-3'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const loading = toast.loading("جاري تصفية السجل...");
        
        // مناداة الدالة اللي ضفناها في useStore.js
        const res = await clearReturnsFromDB();
        
        if (res.success) {
          toast.success("تم تنظيف السجل بنجاح 🧹", { id: loading });
          Swal.fire({
            title: 'تم التصفير!',
            text: 'سجل المرتجعات أصبح فارغاً الآن.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            borderRadius: '2rem'
          });
        } else {
          toast.error(res.message || "فشل المسح", { id: loading });
        }
      }
    });
  };

  return (
    <div className="p-8 font-['Cairo']" dir="rtl">
      {/* الرأس - Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h2 className="text-4xl font-black text-red-600 flex items-center gap-3">
            <FaUndo className="animate-pulse" /> سجل المرتجعات
          </h2>
          <p className="text-gray-500 font-bold mt-2">متابعة الطلبات المسترجعة وإحصائيات المبالغ المردودة</p>
        </div>

        <div className="flex items-center gap-4">
          {/* زرار التصفية الاحترافي */}
          {returnsList.length > 0 && (
            <button 
              onClick={handleClearAll}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-2xl font-black flex items-center gap-2 transition-all shadow-lg shadow-red-500/20 active:scale-95"
            >
              <FaTrash size={18} />
              تصفية السجل
            </button>
          )}

          <div className="bg-red-50 dark:bg-red-900/20 p-5 rounded-[2rem] border border-red-100 dark:border-red-800 text-center min-w-[200px]">
            <span className="block text-xs text-red-500 font-black mb-1 uppercase tracking-tighter">إجمالي المرتجعات</span>
            <span className="text-3xl font-black text-red-700 dark:text-red-400">
              LE {returnsList.reduce((acc, curr) => acc + (Number(curr.total_price) || 0), 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* عرض المحتوى */}
      <div className="grid grid-cols-1 gap-6">
        {returnsList.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-gray-800 rounded-[3.5rem] shadow-sm border-2 border-dashed border-gray-100 dark:border-gray-700">
            <div className="text-6xl mb-4 opacity-20">📦</div>
            <p className="text-gray-400 font-black text-xl italic">لا توجد عمليات مرتجعة حالياً</p>
          </div>
        ) : (
          returnsList.map((r) => (
            <div 
              key={r.id} 
              className="group bg-white dark:bg-gray-800 p-6 rounded-[3rem] border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-xl hover:border-red-200 transition-all duration-300"
            >
              <div className="flex items-center gap-6 w-full md:w-1/3">
                <div className="relative">
                  <div className="w-24 h-24 bg-gray-50 dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-700 p-3 flex items-center justify-center">
                    <img 
                      src={r.items?.[0]?.image || 'https://via.placeholder.com/150'} 
                      alt="product" 
                      className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg border-2 border-white dark:border-gray-800">
                    RETURNED
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black dark:text-white flex items-center gap-2">
                    <FaUser className="text-gray-400 text-sm" /> {r.customer_name || "عميل مجهول"}
                  </h3>
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                    {r.items?.[0]?.title || "طلب مجمع"}
                  </p>
                  <div className="flex items-center gap-2 text-gray-400 text-[11px] font-bold">
                    <FaCalendarAlt size={10} />
                    <span>{r.created_at || "تاريخ غير متوفر"}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 w-full md:w-1/3 text-center">
                {(r.customer_phone || r.wallet_number) && (
                  <div className="bg-red-50 dark:bg-red-900/10 px-6 py-3 rounded-2xl border border-red-100 dark:border-red-900/20">
                    <span className="text-[10px] text-red-400 block font-black mb-1">رقم التواصل/الاسترداد</span>
                    <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-black">
                      <FaPhoneAlt size={12} />
                      <span className="tracking-widest">{r.customer_phone || r.wallet_number}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-left w-full md:w-1/3 flex flex-col items-end">
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-400 font-black mb-1 italic">قيمة المبلغ المردود</span>
                  <span className="text-3xl font-black text-red-600">
                    LE {(Number(r.total_price) || 0).toFixed(2)}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 px-3 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Closed Ticket</span>
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