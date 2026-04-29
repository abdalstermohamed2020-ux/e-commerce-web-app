import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  FaSignOutAlt, FaStar, FaHistory, FaBoxOpen, 
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaUserFriends
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/UseStore';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, updateProfileOnServer, logout } = useStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    father_name: user?.father_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    birthday: user?.birthday || '', 
    gender: user?.gender || 'male'
  });

useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        father_name: user.father_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        birthday: user.birthday || '',
        gender: user.gender || 'male'
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchOrders = async () => {
    if (!user?.id) return;
    setLoadingOrders(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/electronical_backend/get_user_orders.php?user_id=${user.id}`
      );
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Fetch Orders Error:', error);
      toast.error('فشل في جلب قائمة الطلبات');
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, user?.id]);
  
  const handleUpdate = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('جاري حفظ التعديلات...');
    try {
      const result = await updateProfileOnServer({ ...formData });
      if (result.success) {
        toast.success(result.message || 'تم التحديث بنجاح ✨', { id: loadingToast });
        setIsEditing(false);
      } else {
        toast.error(result.message || 'حدث خطأ', { id: loadingToast });
      }
    } catch (error) {
      toast.error('خطأ في الاتصال', { id: loadingToast });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0b1120] p-6" dir="rtl">
        <div className="bg-white dark:bg-[#111827] rounded-[2.5rem] p-10 shadow-2xl text-center border dark:border-gray-800">
          <h2 className="text-2xl font-black mb-6 dark:text-white">يجب تسجيل الدخول أولاً</h2>
          <button onClick={() => navigate('/login')} className="bg-indigo-600 text-white px-10 py-3 rounded-2xl font-black hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
            تسجيل الدخول
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b1120] p-4 md:p-10 font-['Cairo'] text-right" dir="rtl">
      <div className="container mx-auto grid gap-8 lg:grid-cols-[1fr_2.5fr]">
        <aside className="space-y-6">
          <div className="bg-white dark:bg-[#111827] rounded-[2.5rem] p-8 shadow-xl border border-gray-100 dark:border-gray-800">
            <div className="flex flex-col items-center text-center mb-8">
               <div className="relative">
                  <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white font-black shadow-xl shadow-indigo-500/20 text-3xl mb-4">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white dark:border-[#111827] rounded-full"></div>
               </div>
               <h2 className="text-xl font-[1000] dark:text-white mt-2">{user.name}</h2>
               <p className="text-sm text-gray-500 font-bold mb-4">{user.email}</p>
               <div className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-800">
                  {user.role || 'User'}
               </div>
            </div>

            <nav className="space-y-3">
              <button onClick={() => setActiveTab('personal')} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-black transition-all ${activeTab === 'personal' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/30' : 'bg-gray-50 dark:bg-gray-800 text-gray-500 hover:bg-gray-100'}`}>
                <FaStar /> البيانات الشخصية
              </button>
              <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-black transition-all ${activeTab === 'orders' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/30' : 'bg-gray-50 dark:bg-gray-800 text-gray-500 hover:bg-gray-100'}`}>
                <FaHistory /> الطلبات السابقة
              </button>
              <div className="h-px bg-gray-100 dark:bg-gray-800 my-4"></div>
              <button onClick={handleLogout} className="w-full flex items-center gap-4 p-4 rounded-2xl font-black text-red-500 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 transition-all">
                <FaSignOutAlt /> تسجيل الخروج
              </button>
            </nav>
          </div>
        </aside>

        <main>
          {activeTab === 'personal' ? (
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-[#111827] rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-gray-100 dark:border-gray-800">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div>
                  <h1 className="text-3xl font-[1000] dark:text-white italic">إعدادات الحساب</h1>
                  <div className="h-1.5 w-12 bg-indigo-600 mt-2 rounded-full"></div>
                </div>
                <button 
                  onClick={() => setIsEditing(!isEditing)} 
                  className={`px-8 py-3 rounded-2xl font-black transition-all shadow-md ${isEditing ? 'bg-red-500 text-white' : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'}`}
                >
                  {isEditing ? 'إلغاء التعديل' : 'تعديل البيانات'}
                </button>
              </div>

              <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 group">
                  <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mr-2">الاسم بالكامل</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                      <FaUser />
                    </span>
                    <input type="text" value={formData.name} disabled={!isEditing} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full pr-12 pl-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-indigo-600 dark:text-white rounded-2xl outline-none transition-all shadow-sm disabled:opacity-60" />
                  </div>
                </div>
                <div className="space-y-2 group">
                  <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mr-2">اسم الأب</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                      <FaUserFriends />
                    </span>
                    <input type="text" value={formData.father_name} disabled={!isEditing} onChange={(e) => setFormData({...formData, father_name: e.target.value})} placeholder="غير مسجل" className="w-full pr-12 pl-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-indigo-600 dark:text-white rounded-2xl outline-none transition-all shadow-sm disabled:opacity-60" />
                  </div>
                </div>
                <div className="space-y-2 group">
                  <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mr-2">البريد الإلكتروني</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                      <FaEnvelope />
                    </span>
                    <input type="email" value={formData.email} disabled={!isEditing} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full pr-12 pl-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-indigo-600 dark:text-white rounded-2xl outline-none transition-all shadow-sm disabled:opacity-60" />
                  </div>
                </div>
                <div className="space-y-2 group">
                  <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mr-2">رقم الهاتف</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                      <FaPhone />
                    </span>
                    <input type="tel" value={formData.phone} disabled={!isEditing} onChange={(e) => setFormData({...formData, phone: e.target.value})} placeholder="غير مسجل" className="w-full pr-12 pl-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-indigo-600 dark:text-white rounded-2xl outline-none transition-all shadow-sm disabled:opacity-60" />
                  </div>
                </div>
                <div className="space-y-2 group">
                  <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mr-2">تاريخ الميلاد</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                      <FaCalendarAlt />
                    </span>
                    <input type="date" value={formData.birthday} disabled={!isEditing} onChange={(e) => setFormData({...formData, birthday: e.target.value})} className="w-full pr-12 pl-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-indigo-600 dark:text-white rounded-2xl outline-none transition-all shadow-sm disabled:opacity-60" />
                  </div>
                </div>
                <div className="space-y-2 group">
                  <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mr-2">العنوان بالتفصيل</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                      <FaMapMarkerAlt />
                    </span>
                    <input type="text" value={formData.address} disabled={!isEditing} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full pr-12 pl-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-indigo-600 dark:text-white rounded-2xl outline-none transition-all shadow-sm disabled:opacity-60" placeholder="المدينة، الشارع، رقم المنزل" />
                  </div>
                </div>
                {isEditing && (
                  <motion.button initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} type="submit" className="md:col-span-2 w-full bg-indigo-600 text-white py-5 rounded-2xl font-[1000] text-xl shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95 mt-4" >
                    حفظ التعديلات الجديدة ✨
                  </motion.button>
                )}
              </form>
            </motion.section>
          ) : (
            <motion.section initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-[#111827] rounded-[2.5rem] p-8 shadow-xl border border-gray-100 dark:border-gray-800 min-h-[600px]">
               <div className="flex justify-between items-center mb-8 pb-4 border-b dark:border-gray-800">
                <h1 className="text-3xl font-[1000] dark:text-white italic">طلباتي</h1>
                <div className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-6 py-2 rounded-full font-black text-sm">
                  {orders.length} طلب
                </div>
              </div>

              {loadingOrders ? (
                <div className="flex flex-col items-center justify-center py-32 gap-4">
                  <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-500 font-black animate-pulse">جاري جلب تفاصيل طلباتك...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-32 space-y-4">
                  <FaBoxOpen size={80} className="mx-auto text-gray-100 dark:text-gray-800" />
                  <p className="text-gray-500 font-black text-xl">لا توجد طلبات سابقة</p>
                  <button onClick={() => navigate('/')} className="text-indigo-600 font-black underline underline-offset-4">ابدأ رحلة التسوق</button>
                </div>
              ) : (
                <div className="space-y-8">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-gray-50 dark:bg-gray-800/40 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
                      <div className="p-6 md:p-8 flex flex-wrap justify-between items-center gap-6">
                        <div className="space-y-2">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ORDER #{order.id}</p>
                          
                          {/* اللوجيك المعدل لعرض السعر */}
                          <div className="flex flex-col items-start">
                            {parseFloat(order.subtotal) > parseFloat(order.total_price) && (
                              <span className="text-sm font-bold text-gray-400 line-through decoration-red-500 decoration-2 italic">
                                LE {parseFloat(order.subtotal).toLocaleString()}
                              </span>
                            )}
                            <h3 className="text-3xl font-black dark:text-white italic">
                              {parseFloat(order.total_price).toLocaleString()} <span className="text-sm font-medium">LE</span>
                            </h3>
                          </div>

                          <span className={`text-xs font-black px-4 py-1.5 rounded-full inline-block ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                            {order.status === 'pending' ? 'قيد المعالجة' : 'تم التوصيل'}
                          </span>
                        </div>
                        <div className="text-left border-l dark:border-gray-700 pl-6">
                          <p className="text-xs text-gray-400 font-black mb-1">تاريخ الطلب</p>
                          <p className="font-black dark:text-white text-sm">{order.created_at}</p>
                        </div>
                      </div>
                      <div className="bg-white/50 dark:bg-black/20 p-6 border-t dark:border-gray-800">
                        <div className="grid gap-3">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-2xl border dark:border-gray-700 shadow-sm">
                              <div className="flex gap-4 items-center">
                                <div className="bg-indigo-600 text-white w-8 h-8 flex items-center justify-center rounded-xl text-xs font-black">
                                  {item.quantity}x
                                </div>
                                <span className="font-black text-sm dark:text-white">{item.product_name}</span>
                              </div>
                              <span className="font-black text-indigo-600">{item.price} LE</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.section>
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile;