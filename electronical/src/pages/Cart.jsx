import React, { useState, useEffect } from 'react';
import useStore from '../store/UseStore';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
    discount, appliedCoupon, user 
  } = useStore();
  
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const suggestions = products
    .filter(p => !cart.find(item => item.id === p.id))
    .slice(0, 4);

  // --- اللوجيك الحسابي المعدل ---
  const subtotal = cart.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);
  const discountPercent = appliedCoupon ? (discount || 0) : 0;
  const discountAmount = (subtotal * discountPercent) / 100;
  const finalTotal = Math.max(0, subtotal - discountAmount);
  // -----------------------------
  
  const handlePlaceOrder = async () => {
    if (!user || !user.id) {
        toast.error("عفواً! يجب تسجيل الدخول أولاً لإتمام طلبك");
        setTimeout(() => navigate('/login'), 1000);
        return;
    }
    navigate('/checkout');
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4 md:px-10 relative font-['Cairo']" dir="rtl">
      
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowConfirm(false)}
              className="absolute inset-0 bg-gray-900/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-800 p-10 rounded-[3rem] shadow-2xl max-w-md w-full text-center border border-white/20 z-10"
            >
              <div className="w-24 h-24 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <FaTrashAlt size={40} className="animate-pulse" />
              </div>
              <h3 className="text-3xl font-black dark:text-white mb-3">تفريغ السلة؟</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-10 font-bold">أنت على وشك حذف جميع المنتجات. هل تريد الاستمرار حقاً؟</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => { clearCart(); setShowConfirm(false); toast.success("تم تنظيف السلة ✨"); }} 
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-500 text-white py-5 rounded-2xl font-black hover:shadow-lg hover:shadow-red-500/30 transition-all active:scale-95"
                >
                  نعم، حذف
                </button>
                <button 
                  onClick={() => setShowConfirm(false)} 
                  className="flex-1 bg-gray-100 dark:bg-gray-700 dark:text-white py-5 rounded-2xl font-black transition-all"
                >
                  تراجع
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <h1 className="text-4xl font-black dark:text-white border-r-8 border-indigo-600 pr-4 italic uppercase tracking-tighter">سلة المشتريات</h1>
          <button onClick={() => setShowConfirm(true)} className="group flex items-center gap-2 bg-white dark:bg-gray-800 text-red-500 px-8 py-4 rounded-[2rem] font-black hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-100 dark:border-gray-700">
            <FaTrashAlt className="group-hover:rotate-12 transition-transform" /> تفريغ السلة
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="popLayout">
              {cart.map((item) => (
                <motion.div layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }} key={item.id} className="bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] shadow-sm flex flex-col md:flex-row items-center gap-6 border border-transparent hover:border-indigo-100 dark:hover:border-gray-700 transition-all group">
                  <div className="w-32 h-32 bg-gray-50 dark:bg-gray-900 rounded-3xl p-4 flex items-center justify-center relative overflow-hidden">
                    <img src={item.image} alt={item.title} className="max-h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="flex-grow text-center md:text-right">
                    <h3 className="font-black text-lg dark:text-white mb-2 line-clamp-1">{item.title}</h3>
                    <p className="text-indigo-600 dark:text-indigo-400 font-black text-2xl mb-4 italic">LE {item.price}</p>
                    <div className="flex items-center justify-center md:justify-start gap-4">
                      <div className="flex items-center bg-gray-50 dark:bg-gray-900 rounded-2xl p-2 border border-gray-100 dark:border-gray-700">
                        <button onClick={() => decreaseQuantity(item.id)} className="w-10 h-10 flex items-center justify-center text-indigo-600 hover:bg-white dark:hover:bg-gray-800 rounded-xl transition-all shadow-sm"><FaMinus size={12} /></button>
                        <span className="px-6 font-black text-xl dark:text-white">{item.quantity}</span>
                        <button onClick={() => addToCart(item)} className="w-10 h-10 flex items-center justify-center text-indigo-600 hover:bg-white dark:hover:bg-gray-800 rounded-xl transition-all shadow-sm"><FaPlus size={12} /></button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white p-4 rounded-2xl transition-all"><FaTrash size={18} /></button>
                    </div>
                  </div>
                  <div className="hidden md:block text-left min-w-[150px]">
                    <p className="text-xs text-gray-400 font-black mb-1 uppercase tracking-widest">Subtotal</p>
                    <p className="font-black text-3xl dark:text-white tracking-tighter text-indigo-600">
                      {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {suggestions.length > 0 && (
              <div className="mt-12 pt-8 border-t-2 border-dashed border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-black dark:text-white mb-8 flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-400 text-white rounded-full flex items-center justify-center shadow-lg animate-pulse"><FaLightbulb /></div>
                  قد يعجبك أيضاً
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {suggestions.map((product) => (
                    <div key={product.id} className="bg-white dark:bg-gray-800 p-5 rounded-[2.5rem] shadow-sm border border-transparent hover:border-indigo-500 transition-all group">
                      <div className="h-28 flex items-center justify-center mb-4">
                        <img src={product.image} alt={product.title} className="max-h-full object-contain group-hover:scale-110 transition-transform" />
                      </div>
                      <h4 className="text-xs font-black dark:text-gray-200 truncate mb-1 text-center">{product.title}</h4>
                      <p className="text-indigo-600 font-black text-sm mb-4 text-center">LE {product.price}</p>
                      <button onClick={() => { addToCart(product); toast.success("تمت الإضافة ✅"); }} className="w-full py-3 bg-indigo-50 dark:bg-gray-700 text-indigo-600 dark:text-white rounded-2xl text-[10px] font-black hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                        أضف الآن +
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-[3rem] shadow-2xl sticky top-28 border-b-[12px] border-indigo-600">
              <h3 className="text-3xl font-black dark:text-white mb-10 flex items-center justify-between">
                الفاتورة <span className="text-xs bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full uppercase tracking-widest font-black">Summary</span>
              </h3>
              
              <div className="mb-10">
                <label className="text-[10px] font-black text-gray-400 block mb-3 px-2 uppercase tracking-widest">Discount Coupon</label>
                <div className="flex gap-2 bg-gray-50 dark:bg-gray-900 p-3 rounded-2xl border border-gray-100 dark:border-gray-700 focus-within:ring-2 ring-indigo-500/20 transition-all">
                  <input 
                    type="text" 
                    value={couponInput} 
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())} 
                    placeholder="كود الخصم" 
                    className="bg-transparent flex-grow px-3 outline-none font-black text-indigo-600 placeholder:text-gray-300" 
                  />
                  <button onClick={handleApplyCoupon} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-black text-xs hover:bg-indigo-700 transition-all shadow-lg active:scale-95">تطبيق</button>
                </div>
                {appliedCoupon && (
                   <p className="text-[10px] text-green-500 font-black mt-2 px-2">تم تطبيق خصم بقيمة {discountPercent}% ✅</p>
                )}
              </div>

              <div className="space-y-6 mb-10">
                <div className="flex justify-between items-end dark:text-gray-300 border-b border-gray-100 dark:border-gray-700 pb-6">
                  <span className="font-black text-gray-400 uppercase text-xs">Total Amount</span>
                  <div className="flex flex-col items-end">
                    {/* السعر القديم يظهر فقط عند وجود كوبون */}
                    {appliedCoupon && (
                      <span className="text-lg font-bold text-gray-400 line-through decoration-red-500 decoration-2 tracking-tighter italic">
                        LE {subtotal.toFixed(2)}
                      </span>
                    )}
                    {/* السعر الجديد أو الأصلي */}
                    <span className="text-4xl font-black text-indigo-600 tracking-tighter italic">
                      LE {finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button 
                onClick={handlePlaceOrder} 
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white h-20 rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 hover:shadow-[0_20px_40px_rgba(79,70,229,0.3)] transition-all active:scale-95 shadow-xl relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <FaCreditCard className="group-hover:rotate-12 transition-transform" />
                <span>{isSubmitting ? "جاري المعالجة..." : "إتمام الشراء الآن"}</span>
              </button>
              
              <p className="text-[10px] text-center text-gray-400 font-bold mt-6">الدفع عند الاستلام متاح لجميع الطلبات</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;