import React, { useState } from 'react';
import useStore from '../store/UseStore';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaCcVisa, FaMoneyBillWave, FaMobileAlt, FaLock, FaCalendarAlt, FaUser } from 'react-icons/fa';
import { SiVodafone } from 'react-icons/si';

const Checkout = () => {
  const { cart, clearCart, addOrder, discount, resetDiscount } = useStore(); 
  const navigate = useNavigate();
  
  const [submitted, setSubmitted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [vodafoneNumber, setVodafoneNumber] = useState('');

  // --- 1. حساب المبالغ بدقة وحماية من الـ NaN ---
  const subtotal = cart.reduce((acc, item) => {
    return acc + (Number(item.price) * (Number(item.quantity) || 1));
  }, 0);

  const discountAmount = subtotal * (Number(discount) || 0);
  const finalTotal = (subtotal - discountAmount).toFixed(2); 

  // --- 2. معالجة إرسال الطلب ---
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    const formData = new FormData(e.target);

    addOrder({
      id: Date.now(),
      customerName: formData.get('fullName'),
      email: formData.get('email'),
      address: formData.get('address'),
      phone: formData.get('phone'),
      paymentMethod: paymentMethod,
      walletNumber: paymentMethod === 'vodafone' ? vodafoneNumber : 'N/A', 
      totalAmount: Number(finalTotal), 
      status: 'pending',
      items: cart,
      date: new Date().toLocaleDateString('ar-EG'),
    });

    setTimeout(() => {
      clearCart();
      resetDiscount();
      navigate('/success');
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center" dir="rtl">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-4xl md:text-6xl font-black text-indigo-600 italic font-['Cairo']">
          جاري معالجة طلبك بنجاح... 🚀
        </motion.div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-20 font-['Cairo']" dir="rtl">
        <h2 className="text-2xl font-bold dark:text-white">السلة فاضية! 😅</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-indigo-600 underline font-bold">ارجع للمحل</button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-5xl font-['Cairo']" dir="rtl">
      <h1 className="text-3xl md:text-4xl font-[1000] mb-8 text-center dark:text-white italic">إتمام عملية الشراء</h1>
      
      <button onClick={() => navigate('/cart')} className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-all mb-8 group font-bold">
        <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm group-hover:shadow-md">
          <FaArrowRight className="text-sm" /> 
        </div>
        <span>العودة للسلة</span>
      </button>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          
          {/* بيانات الشحن */}
          <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-white/5">
            <h2 className="text-xl font-black mb-6 flex items-center gap-2 dark:text-white">
               <span className="bg-indigo-600 text-white w-8 h-8 flex items-center justify-center rounded-lg text-sm">01</span>
               بيانات الشحن
            </h2>
            <div className="space-y-4">
              <input name="fullName" required type="text" placeholder="الاسم الكامل" className="w-full p-4 bg-gray-50 dark:bg-gray-900/50 border border-transparent focus:border-indigo-500 rounded-2xl outline-none dark:text-white transition-all font-bold" />
              <input name="email" required type="email" placeholder="البريد الإلكتروني" className="w-full p-4 bg-gray-50 dark:bg-gray-900/50 border border-transparent focus:border-indigo-500 rounded-2xl outline-none dark:text-white transition-all font-bold" />
              <input name="address" required type="text" placeholder="العنوان بالتفصيل" className="w-full p-4 bg-gray-50 dark:bg-gray-900/50 border border-transparent focus:border-indigo-500 rounded-2xl outline-none dark:text-white transition-all font-bold" />
              <div className="grid grid-cols-2 gap-4">
                <input name="city" required type="text" placeholder="المدينة" className="w-full p-4 bg-gray-50 dark:bg-gray-900/50 border border-transparent focus:border-indigo-500 rounded-2xl outline-none dark:text-white transition-all font-bold" />
                <input name="phone" required type="text" placeholder="رقم الهاتف" className="w-full p-4 bg-gray-50 dark:bg-gray-900/50 border border-transparent focus:border-indigo-500 rounded-2xl outline-none dark:text-white transition-all font-bold" />
              </div>
            </div>
          </div>

          {/* طرق الدفع */}
          <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-white/5">
            <h2 className="text-xl font-black mb-6 flex items-center gap-2 dark:text-white">
               <span className="bg-indigo-600 text-white w-8 h-8 flex items-center justify-center rounded-lg text-sm">02</span>
               اختر طريقة الدفع
            </h2>
            <div className="grid grid-cols-3 gap-3 mb-6">
              <PaymentOption id="card" active={paymentMethod} icon={<FaCcVisa size={22}/>} label="بطاقة بنكية" onClick={setPaymentMethod} color="indigo" />
              <PaymentOption id="vodafone" active={paymentMethod} icon={<SiVodafone size={22}/>} label="فودافون" onClick={setPaymentMethod} color="red" />
              <PaymentOption id="cash" active={paymentMethod} icon={<FaMoneyBillWave size={22}/>} label="كاش" onClick={setPaymentMethod} color="green" />
            </div>

            <AnimatePresence mode="wait">
              {/* فورم الفيزا */}
              {paymentMethod === 'card' && (
                <motion.div key="card" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="p-5 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-[2rem] border border-indigo-100 dark:border-indigo-900/30 space-y-4">
                    <div className="relative">
                      <input required type="text" placeholder="اسم صاحب البطاقة" className="w-full p-4 pr-12 bg-white dark:bg-gray-900 border-none rounded-xl outline-none dark:text-white font-bold text-sm" />
                      <FaUser className="absolute right-4 top-4 text-gray-400" />
                    </div>
                    <div className="relative">
                      <input required type="text" placeholder="رقم البطاقة (16 رقم)" className="w-full p-4 pr-12 bg-white dark:bg-gray-900 border-none rounded-xl outline-none dark:text-white font-bold text-sm" />
                      <FaCcVisa className="absolute right-4 top-4 text-gray-400" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <input required type="text" placeholder="MM/YY" className="w-full p-4 pr-12 bg-white dark:bg-gray-900 border-none rounded-xl outline-none dark:text-white font-bold text-sm" />
                        <FaCalendarAlt className="absolute right-4 top-4 text-gray-400" />
                      </div>
                      <div className="relative">
                        <input required type="password" placeholder="CVV" className="w-full p-4 pr-12 bg-white dark:bg-gray-900 border-none rounded-xl outline-none dark:text-white font-bold text-sm" />
                        <FaLock className="absolute right-4 top-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* فورم فودافون */}
              {paymentMethod === 'vodafone' && (
                <motion.div key="vodafone" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="p-5 bg-red-50 dark:bg-red-900/10 rounded-[2rem] border border-red-100 dark:border-red-900/30">
                    <p className="text-xs text-red-600 dark:text-red-400 font-bold mb-3 flex items-center gap-2">
                      <FaMobileAlt /> حول لـ: <span className="underline font-black text-sm">201032964194+</span>
                    </p>
                    <input required type="text" value={vodafoneNumber} onChange={(e) => setVodafoneNumber(e.target.value)} placeholder="رقم المحفظة المحول منها" className="w-full p-4 bg-white dark:bg-gray-900 rounded-xl outline-none border border-red-200 dark:text-white font-bold text-sm" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-[1000] text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 active:scale-95">
            تأكيد الطلب (LE {finalTotal})
          </button>
        </form>

        {/* ملخص الطلب */}
        <div className="lg:col-span-5 h-fit lg:sticky lg:top-24">
          <div className="bg-gray-100/50 dark:bg-gray-800/50 p-6 md:p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl font-black mb-6 dark:text-white border-b dark:border-gray-700 pb-4">ملخص السلة</h2>
            <div className="max-h-[300px] overflow-y-auto mb-6 space-y-3 pr-1">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-50 dark:border-white/5">
                  <div className="flex flex-col">
                    <span className="truncate w-32 font-bold dark:text-gray-200 text-sm">{item.title}</span>
                    <span className="text-[10px] text-indigo-500 font-black">الكمية: {item.quantity}</span>
                  </div>
                  <span className="font-black text-indigo-600 text-sm">LE {(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 border-t dark:border-gray-700 pt-5">
              <div className="flex justify-between text-gray-500 font-bold text-sm">
                <span>المجموع:</span>
                <span>LE {subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 font-black text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded-xl">
                  <span>الخصم المطبق:</span>
                  <span>- LE {discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-2xl font-[1000] pt-4 border-t-2 border-dashed dark:border-gray-700 mt-2">
                <span className="dark:text-white">الإجمالي:</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-black">LE {finalTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PaymentOption = ({ id, active, icon, label, onClick, color }) => {
  const isActive = active === id;
  const colors = {
    indigo: isActive ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 shadow-md scale-105' : 'border-gray-100 dark:border-white/5 text-gray-400',
    red: isActive ? 'border-red-600 bg-red-50 dark:bg-red-600/20 text-red-600 shadow-md scale-105' : 'border-gray-100 dark:border-white/5 text-gray-400',
    green: isActive ? 'border-green-600 bg-green-50 dark:bg-green-600/20 text-green-600 shadow-md scale-105' : 'border-gray-100 dark:border-white/5 text-gray-400',
  };

  return (
    <div onClick={() => onClick(id)} className={`cursor-pointer p-3 md:p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${colors[color]}`}>
      <div className="transition-transform group-hover:scale-110">{icon}</div>
      <span className="text-[9px] md:text-[11px] font-black text-center">{label}</span>
    </div>
  );
};

export default Checkout;