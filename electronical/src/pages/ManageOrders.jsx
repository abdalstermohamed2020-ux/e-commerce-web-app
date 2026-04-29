import React, { useEffect } from 'react';
import useStore from '../store/UseStore';
import { FaCheck, FaTrash, FaPhoneAlt, FaMoneyBillWave, FaBox } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';

const ManageOrders = () => {
  const { orders, fetchAllOrdersFromDB, updateOrderStatus, deleteOrder } = useStore();

  // جلب البيانات من السيرفر عند تحميل الصفحة
  useEffect(() => {
    fetchAllOrdersFromDB();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  // التأكد من أن orders مصفوفة قبل عمل الفلترة لتجنب خطأ undefined
  const activeOrders = Array.isArray(orders) ? orders.filter(o => o.status === 'pending') : [];

  // تأكد من أن دالة handleDeliver في ملف ManageOrders أصبحت هكذا:
const handleDeliver = async (orderId) => {
  const result = await updateOrderStatus(orderId, 'delivered');
  if (result.success) {
    toast.success("تم التوصيل بنجاح ونقل الطلب لسجل المبيعات! ✅");
    // إعادة جلب البيانات لضمان المزامنة
    fetchAllOrdersFromDB();
  } else {
    toast.error("فشل تحديث حالة الطلب");
  }
};
  const confirmReturn = (orderId) => {
    const isDark = document.documentElement.classList.contains('dark');
    
    Swal.fire({
      title: 'نقل للمرتجعات؟',
      text: "هل أنت متأكد من نقل هذا الطلب إلى قائمة المرتجعات؟",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444', 
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'نعم، انقل الآن',
      cancelButtonText: 'إلغاء',
      background: isDark ? '#1f2937' : '#fff',
      color: isDark ? '#fff' : '#000',
      borderRadius: '2rem',
      customClass: {
        popup: 'rounded-[2.5rem] shadow-2xl border-none font-["Cairo"]',
        confirmButton: 'rounded-2xl font-black px-6 py-3',
        cancelButton: 'rounded-2xl font-black px-6 py-3'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        deleteOrder(orderId);
        toast.success("تم النقل للمرتجعات بنجاح");
      }
    });
  };

  return (
    <div className="p-8 font-['Cairo']" dir="rtl">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black dark:text-slate-950 flex items-center gap-3">
          <FaBox className="text-gray-900" /> إدارة الطلبات النشطة
        </h2>
        <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-2xl font-black text-sm">
          {activeOrders.length} طلب قيد التنفيذ
        </span>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-sm">
              <th className="p-6 font-black">العميل والتواصل</th>
              <th className="p-6 font-black">المنتجات (الكمية × السعر)</th>
              <th className="p-6 font-black text-center">طريقة الدفع</th>
              <th className="p-6 font-black text-center">الإجمالي النهائي</th>
              <th className="p-6 font-black text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y dark:divide-gray-700">
            {activeOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all">
                <td className="p-6">
                  <div className="flex flex-col gap-1">
                    <span className="font-black dark:text-white text-lg">
                      {order.customer_name || "عميل مجهول"}
                    </span>
                    <span className="text-xs text-gray-400 font-bold tracking-widest">
                      {order.customer_phone || order.phone}
                    </span>
                  </div>
                </td>
                
                <td className="p-6">
                  <div className="flex flex-col gap-3">
                    {Array.isArray(order.items) && order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/40 p-2 rounded-2xl border border-gray-100 dark:border-gray-600 w-fit min-w-[200px]">
                        <div className="relative">
                          <img src={item.image} className="w-12 h-12 rounded-xl object-cover border dark:border-gray-500" alt="prod" />
                          <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black shadow-lg">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-black dark:text-gray-200">{item.title || item.name}</span>
                          <span className="text-[10px] text-indigo-600 font-bold">
                             LE {Number(item.price).toFixed(2)} للقطعة
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </td>

                <td className="p-6 text-center">
                  <div className="flex flex-col items-center gap-2">
                    {order.payment_method === 'vodafone' ? (
                      <>
                        <span className="bg-red-50 text-red-600 px-3 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 border border-red-100">
                          <FaMoneyBillWave /> فودافون كاش
                        </span>
                        {order.wallet_number && (
                          <div className="flex items-center gap-1 text-green-600 font-black text-[11px] bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md border border-green-100 dark:border-green-800">
                            <FaPhoneAlt size={9} />
                            <span className="tracking-tighter">{order.wallet_number}</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black border border-blue-100">
                        دفع عند الاستلام
                      </span>
                    )}
                  </div>
                </td>

                <td className="p-6 text-center">
                  <span className="font-black text-indigo-600 dark:text-indigo-400 text-xl">
                    LE {Number(order.total_price).toFixed(2)}
                  </span>
                </td>

                <td className="p-6">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => handleDeliver(order.id)}
                      className="p-3 bg-green-100 text-green-600 rounded-2xl hover:bg-green-600 hover:text-white transition-all active:scale-90"
                    >
                      <FaCheck size={14} />
                    </button>
                    <button 
                      onClick={() => confirmReturn(order.id)}
                      className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all active:scale-90"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {activeOrders.length === 0 && (
          <div className="p-20 text-center">
            <div className="text-6xl mb-4">☕</div>
            <p className="text-gray-400 font-black italic text-lg">مفيش أوردرات جديدة دلوقتي..</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOrders;