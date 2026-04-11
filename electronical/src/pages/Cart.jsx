import React, { useState, useEffect } from 'react';
import useStore from '../store/UseStore';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { 
  FaTrash, FaPlus, FaMinus, FaShoppingBag, 
  FaArrowRight, FaCreditCard, FaTrashAlt, 
  FaExclamationTriangle, FaTicketAlt, FaCheck, FaLightbulb 
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const Cart = () => {
  const { 
    cart, clearCart, removeFromCart, addToCart, 
    decreaseQuantity, products, applyCoupon, 
    discount, appliedCoupon 
  } = useStore();
  
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // حماية الصفحة: لو مش مسجل يرجعه للوجن فوراً
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id) {
      toast.error("يرجى تسجيل الدخول أولاً لعرض السلة 🔒");
      navigate('/login');
    }
  }, [navigate]);

  const suggestions = products
    .filter(p => !cart.find(item => item.id === p.id))
    .slice(0, 4);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const currentDiscount = appliedCoupon ? (discount || 0) : 0;
  const discountAmount = subtotal * currentDiscount;
  const finalTotal = subtotal - discountAmount;

  const handlePlaceOrder = async (totalPrice) => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user || !user.id) {
      toast.error("يجب تسجيل الدخول لإتمام الطلب");
      navigate('/login');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await axios.post('http://localhost:8080/electronical_backend/place_order.php', {
        user_id: user.id,
        total_price: totalPrice
      });

      if (res.data.status === "success") {
        toast.success("تم تسجيل طلبك بنجاح! 🚀");
        clearCart(); 
        navigate('/my-orders');
      } else {
        toast.error(res.data.message || "حدث خطأ أثناء الطلب");
      }
    } catch (error) {
      toast.error("فشل الاتصال بالسيرفر");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplyCoupon = () => {
    if (!couponInput) return toast.error("برجاء إدخال الكود أولاً");
    const result = applyCoupon(couponInput);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center" dir="rtl">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-indigo-100 dark:bg-gray-800 p-10 rounded-full mb-6">
          <FaShoppingBag size={80} className="text-indigo-600 dark:text-indigo-400" />
        </motion.div>
        <h2 className="text-3xl font-black dark:text-white mb-4">سلة المشتريات فارغة!</h2>
        <Link to="/" className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2 transition-transform active:scale-95">
          <FaArrowRight /> ابدأ التسوق
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4 md:px-10 relative" dir="rtl">
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-2xl max-w-sm w-full text-center border border-gray-100 dark:border-gray-700">
              <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaExclamationTriangle size={40} />
              </div>
              <h3 className="text-2xl font-black dark:text-white mb-2">تفريغ السلة؟</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8">سيتم حذف كل المنتجات، هل أنت متأكد؟</p>
              <div className="flex gap-4">
                <button onClick={() => { clearCart(); setShowConfirm(false); toast.success("تم التنظيف ✨"); }} className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-bold hover:bg-red-700 shadow-lg transition-all">نعم</button>
                <button onClick={() => setShowConfirm(false)} className="flex-1 bg-gray-100 dark:bg-gray-700 dark:text-white py-4 rounded-2xl font-bold transition-all">إلغاء</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <h1 className="text-4xl font-black dark:text-white border-r-8 border-indigo-600 pr-4">سلة المشتريات</h1>
          <button onClick={() => setShowConfirm(true)} className="flex items-center gap-2 bg-red-50 text-red-600 px-6 py-3 rounded-2xl font-bold hover:bg-red-600 hover:text-white transition-all border border-red-100">
            <FaTrashAlt /> مسح السلة
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="popLayout">
              {cart.map((item) => (
                <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} key={item.id} className="bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] shadow-sm flex flex-col md:flex-row items-center gap-6 border border-transparent hover:border-indigo-100 dark:hover:border-gray-700 transition-all">
                  <div className="w-32 h-32 bg-gray-50 dark:bg-gray-700 rounded-3xl p-4 flex items-center justify-center">
                    <img src={item.image} alt={item.title} className="max-h-full object-contain" />
                  </div>
                  <div className="flex-grow text-center md:text-right">
                    <h3 className="font-bold dark:text-white mb-2 line-clamp-1">{item.title}</h3>
                    <p className="text-indigo-600 dark:text-indigo-400 font-black text-xl mb-4">LE {item.price}</p>
                    <div className="flex items-center justify-center md:justify-start gap-4">
                      <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
                        <button onClick={() => decreaseQuantity(item.id)} className="p-2 text-indigo-600 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-colors"><FaMinus size={12} /></button>
                        <span className="px-4 font-bold dark:text-white">{item.quantity}</span>
                        <button onClick={() => addToCart(item)} className="p-2 text-indigo-600 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-colors"><FaPlus size={12} /></button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:bg-red-50 p-3 rounded-xl transition-colors"><FaTrash size={18} /></button>
                    </div>
                  </div>
                  <div className="hidden md:block text-left min-w-[120px]">
                    <p className="text-xs text-gray-400 mb-1">الإجمالي</p>
                    <p className="font-black text-2xl dark:text-white">LE {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {suggestions.length > 0 && (
              <div className="mt-12 pt-8 border-t-2 border-dashed border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-black dark:text-white mb-6 flex items-center gap-2">
                  <FaLightbulb className="text-yellow-400" /> اقتراحات تهمك
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {suggestions.map((product) => (
                    <div key={product.id} className="bg-white dark:bg-gray-800 p-4 rounded-[2rem] shadow-sm border border-transparent hover:border-indigo-500 transition-all group">
                      <div className="h-24 flex items-center justify-center mb-3">
                        <img src={product.image} alt={product.title} className="max-h-full object-contain group-hover:scale-110 transition-transform" />
                      </div>
                      <h4 className="text-[10px] font-bold dark:text-gray-200 truncate mb-1 text-center">{product.title}</h4>
                      <p className="text-indigo-600 font-black text-xs mb-3 text-center">LE {product.price}</p>
                      <button onClick={() => { addToCart(product); toast.success("تمت الإضافة ✅"); }} className="w-full py-2 bg-indigo-50 dark:bg-gray-700 text-indigo-600 dark:text-white rounded-xl text-[10px] font-black hover:bg-indigo-600 hover:text-white transition-all">
                        أضف سريعاً +
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl sticky top-28 border-t-8 border-indigo-600">
              <h3 className="text-2xl font-black dark:text-white mb-8">ملخص الطلب</h3>
              
              <div className="mb-8">
                <label className="text-xs font-black text-gray-400 block mb-2 px-2">هل لديك كود خصم؟</label>
                <div className="flex gap-2 bg-gray-50 dark:bg-gray-900 p-2 rounded-2xl border border-gray-100 dark:border-gray-600 focus-within:border-indigo-500 transition-all">
                  <div className="flex items-center justify-center pr-2 text-gray-400"><FaTicketAlt /></div>
                  <input type="text" value={couponInput} onChange={(e) => setCouponInput(e.target.value.toUpperCase())} placeholder="ادخل الكود" className="bg-transparent flex-grow px-2 outline-none font-bold text-indigo-600 dark:text-indigo-400 placeholder:text-gray-300 text-sm w-full" />
                  <button onClick={handleApplyCoupon} className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-indigo-700 transition-all shadow-md active:scale-95">تطبيق</button>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between dark:text-gray-300 font-bold text-lg">
                  <span>المجموع الكلي</span>
                  <span className="text-3xl font-black text-indigo-600 italic">LE {finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={() => handlePlaceOrder(finalTotal)} 
                disabled={isSubmitting}
                className="w-full bg-indigo-600 text-white h-16 rounded-2xl font-black flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg"
              >
                {isSubmitting ? "جاري المعالجة..." : <><FaCreditCard /> إتمام الشراء</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Cart;