import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaMapMarkerAlt, FaPhoneAlt, FaUser, FaEdit, FaExclamationTriangle } from 'react-icons/fa';
import useStore from '../store/UseStore';

const PaymentOption = ({ id, active, icon, label, onClick, color }) => (
  <button
    type="button"
    onClick={() => onClick(id)}
    className={`w-full flex items-center gap-4 p-4 rounded-3xl border transition-all ${
      active 
        ? `border-${color}-500 bg-${color}-500/10 ring-2 ring-${color}-500/20` 
        : 'border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800'
    }`}
  >
    <span className="text-2xl">{icon}</span>
    <span className="font-bold dark:text-white">{label}</span>
  </button>
);

const Checkout = () => {
  const { cart, clearCart, fetchUserOrdersFromDB, discount, resetDiscount, user } = useStore();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [vodafoneNumber, setVodafoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  // --- إصلاح الحسابات (منع الأرقام الكبيرة والسالب) ---
  const itemsTotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) || 0) * (item.quantity || 1), 0);
  const discountAmount = discount ? (itemsTotal * discount) / 100 : 0; // القسمة على 100 مهمة جداً
  const finalTotal = (itemsTotal - discountAmount).toFixed(2);

  const isProfileComplete = user?.name && user?.phone && user?.address && user?.father_name;

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast.error('السلة فارغة!');
      return;
    }

    if (!isProfileComplete) {
      toast.error('يرجى إكمال بيانات الشحن في حسابك أولاً');
      return;
    }

    if (paymentMethod === 'vodafone' && !vodafoneNumber.trim()) {
      toast.error('أدخل رقم فودافون كاش');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading('جاري معالجة طلبك...');

    const orderPayload = {
      user_id: user.id,
      total_price: finalTotal,
      payment_method: paymentMethod,
      wallet_number: paymentMethod === 'vodafone' ? vodafoneNumber : null,
      cart: cart.map(item => ({
          id: item.id,
          price: item.price,
          quantity: item.quantity,
          title: item.title || item.name
      })),
      customer_name: `${user.name} ${user.father_name}`,
      customer_phone: user.phone,
      shipping_address: user.address,
    };

    try {
      const response = await axios.post('[http://electronic-api.atwebpages.com](http://electronic-api.atwebpages.com)/place_order.php', orderPayload);
      
      if (response.data.status === 'success') {
        if (user?.id) await fetchUserOrdersFromDB(user.id);
        toast.success('تم تسجيل طلبك بنجاح! 🚀', { id: loadingToast });
        clearCart();
        resetDiscount();
        navigate('/success');
      } else {
        toast.error(response.data.message || 'حدث خطأ', { id: loadingToast });
      }
    } catch (error) {
      toast.error('خطأ في الاتصال بالسيرفر', { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b1120] text-right p-4 md:p-8 font-['Cairo']" dir="rtl">
      <div className="container mx-auto grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <h1 className="text-3xl font-black dark:text-white flex items-center gap-3">
            إتمام الطلب <span className="text-sm font-normal text-gray-500">({cart.length} منتجات)</span>
          </h1>

          <div className="bg-white dark:bg-[#111827] rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                <FaMapMarkerAlt className="text-indigo-600" /> عنوان التوصيل
              </h2>
              <Link to="/profile" className="text-indigo-600 flex items-center gap-1 font-bold text-sm hover:underline">
                <FaEdit /> تعديل
              </Link>
            </div>

            {isProfileComplete ? (
              <div className="grid gap-4 md:grid-cols-2 bg-gray-50 dark:bg-gray-900/50 p-6 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 uppercase">المستلم</p>
                  <p className="font-bold dark:text-white flex items-center gap-2">
                    <FaUser className="text-gray-400 text-xs" /> {user.name} {user.father_name}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 uppercase">رقم التواصل</p>
                  <p className="font-bold dark:text-white flex items-center gap-2">
                    <FaPhoneAlt className="text-gray-400 text-xs" /> {user.phone}
                  </p>
                </div>
                <div className="md:col-span-2 space-y-2 pt-2 border-t border-gray-200 dark:border-gray-800">
                  <p className="text-xs text-gray-500 uppercase">العنوان بالتفصيل</p>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{user.address}</p>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 p-6 rounded-3xl text-center">
                <FaExclamationTriangle className="mx-auto text-red-500 text-3xl mb-3" />
                <p className="text-red-700 dark:text-red-400 font-bold mb-4">بيانات الشحن غير مكتملة في حسابك</p>
                <Link to="/profile" className="inline-block bg-red-500 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-red-500/20">
                  إكمال البروفايل الآن
                </Link>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-[#111827] rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-bold mb-6 dark:text-white">طريقة الدفع</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <PaymentOption id="cash" active={paymentMethod === 'cash'} icon="💵" label="الدفع عند الاستلام" onClick={setPaymentMethod} color="green" />
              <PaymentOption id="vodafone" active={paymentMethod === 'vodafone'} icon="📲" label="فودافون كاش" onClick={setPaymentMethod} color="red" />
            </div>

            {paymentMethod === 'vodafone' && (
              <div className="mt-6 p-6 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-100 dark:border-red-900/20 animate-in slide-in-from-top-2">
                <label className="block text-sm font-bold mb-2 dark:text-red-400">رقم محفظة فودافون كاش</label>
                <input value={vodafoneNumber} onChange={(e) => setVodafoneNumber(e.target.value)} type="tel" placeholder="010XXXXXXXX" className="w-full rounded-2xl border-2 border-red-200 p-4 bg-white dark:bg-gray-900 dark:text-white outline-none focus:border-red-500 transition-all" />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-[#111827] rounded-[2rem] p-8 shadow-xl border border-gray-200 dark:border-gray-800 h-fit sticky top-6">
            <h2 className="text-2xl font-black mb-6 dark:text-white border-b pb-4 dark:border-gray-800">ملخص الطلب</h2>
            <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4 mb-6 custom-scrollbar">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-sm dark:text-white line-clamp-1">{item.title || item.name}</h3>
                    <p className="text-xs text-gray-500">الكمية: {item.quantity || 1}</p>
                  </div>
                  <span className="font-bold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    LE {((parseFloat(item.price) || 0) * (item.quantity || 1)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-4 border-t dark:border-gray-800">
              <div className="flex justify-between text-gray-500 dark:text-gray-400">
                <span>الإجمالي الفرعي</span>
                <span>LE {itemsTotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-500 font-bold bg-green-50 dark:bg-green-900/20 p-2 rounded-xl">
                  <span>خصم الكوبون ({discount}%)</span>
                  <span>- LE {discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between pt-4 mt-4 border-t-2 border-dashed dark:border-gray-700">
                <span className="font-black text-xl dark:text-white">الإجمالي النهائي</span>
                <span className="font-black text-2xl text-indigo-600 dark:text-indigo-400">LE {finalTotal}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading || !isProfileComplete}
              className={`w-full mt-8 rounded-3xl py-5 text-white font-black text-lg transition-all shadow-xl
                ${loading || !isProfileComplete ? 'bg-gray-300 dark:bg-gray-800 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'}`}
            >
              {loading ? 'جاري التنفيذ...' : 'تأكيد الطلب والدفع'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;