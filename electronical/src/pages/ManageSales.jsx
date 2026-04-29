import React, { useState } from 'react';
import useStore from '../store/UseStore';
import { 
  FaUserTag, 
  FaTrashAlt, 
  FaExclamationCircle, 
  FaChartLine,
  FaHistory,
  FaCreditCard,
  FaWallet
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

const ManageSales = () => {
  const { orders, deleteOrder } = useStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState(null);

  // فلترة الطلبات المكتملة فقط
  const allOrders = Array.isArray(orders) 
    ? orders.filter(order => order.status === 'delivered') 
    : [];

  const totalRevenue = allOrders.reduce((acc, order) => acc + (Number(order.total_price || 0)), 0);

  const askDelete = (id) => {
    setSelectedSaleId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteOrder(selectedSaleId);
      setShowConfirm(false);
      toast.success("تم حذف السجل بنجاح ✅");
    } catch (error) {
      toast.error("حدث خطأ أثناء الحذف");
    }
  };

  return (
    <div className="p-8 font-['Cairo'] text-right bg-gray-50 min-h-screen" dir="rtl">
      
      {/* مودال تأكيد الحذف */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowConfirm(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white p-10 rounded-[3rem] shadow-2xl z-10 max-w-sm w-full text-center">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaExclamationCircle size={40} />
              </div>
              <h3 className="text-2xl font-black mb-2">حذف السجل؟</h3>
              <p className="text-gray-500 mb-8 font-bold text-sm">سيتم حذف بيانات هذه العملية نهائياً.</p>
              <div className="flex gap-4">
                <button onClick={confirmDelete} className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-black">حذف</button>
                <button onClick={() => setShowConfirm(false)} className="flex-1 bg-gray-100 py-4 rounded-2xl font-black">إلغاء</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
        <div className="bg-green-100 border-2 border-green-200 p-8 rounded-[2.5rem] text-center shadow-lg min-w-[280px]">
          <span className="block text-green-700 text-xs font-black mb-1 uppercase">إجمالي الأرباح المحصلة</span>
          <span className="text-4xl font-black text-green-600 italic">LE {totalRevenue.toLocaleString()}</span>
        </div>
        
        <div className="text-center md:text-left">
          <h2 className="text-4xl font-black text-indigo-600 flex items-center gap-3 justify-center md:justify-end">
            سجل المبيعات <FaChartLine />
          </h2>
          <p className="text-gray-500 font-bold mt-2">متابعة العمليات الناجحة وطرق الدفع</p>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="bg-[#1e293b] rounded-[3.5rem] min-h-[500px] shadow-2xl border border-gray-700 relative overflow-hidden">
        {allOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full absolute inset-0 text-gray-400">
            <FaHistory size={60} className="opacity-20 mb-4" />
            <p className="text-2xl font-black italic">لا توجد مبيعات مكتملة حالياً..</p>
          </div>
        ) : (
          <div className="p-8 space-y-6">
            {allOrders.map((sale) => (
              <motion.div 
                layout 
                key={sale.id} 
                className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] flex flex-col lg:flex-row items-center justify-between gap-6 hover:bg-white/10 transition-all"
              >
                {/* 1. بيانات العميل */}
                <div className="flex items-center gap-4 w-full lg:w-1/4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow-lg">
                    <FaUserTag size={20} />
                  </div>
                  <div className="text-right">
                    <h4 className="text-white font-black text-sm">{sale.customer_name || sale.address?.fullName || "عميل مجهول"}</h4>
                    <span className="text-gray-400 text-[10px] block mt-1 tracking-tighter">{sale.created_at || "2026-04-27"}</span>
                  </div>
                </div>

                {/* 2. المنتجات (بجانبها الصورة) */}
                <div className="flex items-center gap-3 w-full lg:w-1/4 justify-center bg-black/20 p-3 rounded-2xl border border-white/5">
                  {sale.items?.slice(0, 1).map((item, i) => (
                    <React.Fragment key={i}>
                      <div className="relative">
                        <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-contain bg-white p-1" />
                        <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">1</span>
                      </div>
                      <div className="text-right max-w-[120px]">
                        <p className="text-white text-[10px] font-bold truncate leading-tight">{item.title}</p>
                        <p className="text-indigo-400 text-[9px] font-black mt-1">LE {item.price}</p>
                      </div>
                    </React.Fragment>
                  ))}
                </div>

                {/* 3. طريقة الدفع (نفس ستايل صورة إدارة الطلبات) */}
                <div className="w-full lg:w-1/4 flex justify-center">
                  <div className="bg-white text-[#1e293b] px-4 py-2 rounded-xl font-black text-[11px] flex items-center gap-2 shadow-sm">
                    {sale.payment_method === 'online' ? (
                      <><FaCreditCard className="text-blue-600" /> دفع إلكتروني</>
                    ) : (
                      <><FaWallet className="text-indigo-600" /> دفع عند الاستلام</>
                    )}
                  </div>
                </div>

                {/* 4. الإجمالي والإجراءات */}
                <div className="flex items-center justify-between lg:justify-end w-full lg:w-1/4 gap-6">
                  <div className="text-left">
                    <span className="text-green-400 font-black text-xl tracking-tighter">LE {Number(sale.total_price).toLocaleString()}</span>
                    <div className="flex items-center gap-1 justify-end mt-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      <span className="text-green-500 text-[9px] font-black uppercase">محصلة</span>
                    </div>
                  </div>
                  
                  <button onClick={() => askDelete(sale.id)} className="w-11 h-11 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                    <FaTrashAlt size={16} />
                  </button>
                </div>

              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageSales;