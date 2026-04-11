import React, { useState } from 'react';
import useStore from '../store/UseStore';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
    FaUser, FaEnvelope, FaPhone, FaEdit, FaSave, FaSignOutAlt, 
    FaBriefcase, FaUndo, FaWallet, FaUserCircle, FaCalendarAlt 
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, updateUser, logout } = useStore();
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('personal');
    const navigate = useNavigate(); // 1. تعريف الهوك هنا

    // الحالة الابتدائية للفورم
    const [formData, setFormData] = useState({
        id: user?.id || '',
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        gender: user?.gender || 'male',
        birthday: user?.birthday || ''
    });

    // 2. تعديل دالة تسجيل الخروج
    const handleLogout = () => {
        logout(); // مسح البيانات من الـ Store
        toast.success("تم تسجيل الخروج بنجاح");
        navigate('/login'); // التحويل لصفحة تسجيل الدخول فوراً
    };

    if (!user) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f172a]">
            <p className="text-xl font-bold dark:text-white font-['Cairo']">برجاء تسجيل الدخول أولاً...</p>
        </div>
    );

    const handleSave = async () => {
        try {
            const response = await axios.post('http://localhost:8080/electronical_backend/update_profile.php', formData);
            if (response.data.success) {
                updateUser(formData);
                setIsEditing(false);
                toast.success("تم تحديث بياناتك بنجاح ✅");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("خطأ في الاتصال بالسيرفر");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] text-gray-900 dark:text-white font-['Cairo'] py-10 px-4 transition-colors duration-300" dir="rtl">
            <div className="container mx-auto max-w-6xl flex flex-col md:flex-row gap-6">
                
                {/* القائمة اليمنى (المنيو) */}
                <div className="w-full md:w-80 bg-white dark:bg-[#1e293b] rounded-[2.5rem] p-8 flex flex-col items-center shadow-xl border border-gray-100 dark:border-white/5">
                    <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center text-4xl font-bold mb-4 shadow-lg shadow-indigo-500/30 text-white">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{user.name}</h2>
                    <p className="text-gray-400 text-sm mb-8">{user.email}</p>

                    <div className="w-full space-y-2 text-right">
                        <button 
                            onClick={() => setActiveTab('orders')}
                            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeTab === 'orders' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}
                        >
                            <span className="flex items-center gap-3"><FaBriefcase /> طلباتي</span>
                        </button>

                        <button 
                            onClick={() => setActiveTab('returns')}
                            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeTab === 'returns' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}
                        >
                            <span className="flex items-center gap-3"><FaUndo /> المرتجعات</span>
                        </button>

                        <button 
                            onClick={() => setActiveTab('personal')}
                            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${activeTab === 'personal' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}
                        >
                            <span className="flex items-center gap-3"><FaUserCircle /> البيانات الشخصية</span>
                        </button>
                        
                        {/* 3. استدعاء الدالة الجديدة هنا */}
                        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 p-4 mt-6 text-red-500 font-bold hover:bg-red-500/10 rounded-2xl transition-all">
                            <FaSignOutAlt /> تسجيل الخروج
                        </button>
                    </div>
                </div>

                {/* الجزء الأيسر (المحتوى) */}
                <div className="flex-1 bg-white dark:bg-[#1e293b] rounded-[2.5rem] p-10 shadow-xl border border-gray-100 dark:border-white/5 min-h-[550px]">
                    
                    {activeTab === 'personal' && (
                        <div className="animate-fade-in text-right">
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="text-3xl font-black text-gray-800 dark:text-white">البيانات الشخصية</h2>
                                {!isEditing ? (
                                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold hover:underline transition-all">
                                        <FaEdit /> تعديل
                                    </button>
                                ) : (
                                    <button onClick={handleSave} className="bg-green-600 text-white px-8 py-2 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-500/20">
                                        <FaSave /> حفظ
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-gray-50 dark:bg-[#0f172a]/50 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                                    <label className="block text-xs text-gray-400 mb-1 font-bold">الاسم الكامل</label>
                                    <input 
                                        disabled={!isEditing} 
                                        value={formData.name} 
                                        onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                        className="w-full bg-transparent outline-none font-bold text-lg text-indigo-600 dark:text-indigo-400 disabled:text-gray-400 transition-colors" 
                                    />
                                </div>

                                <div className="bg-gray-50 dark:bg-[#0f172a]/50 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                                    <label className="block text-xs text-gray-400 mb-1 font-bold">البريد الإلكتروني</label>
                                    <input 
                                        disabled={!isEditing} 
                                        value={formData.email} 
                                        onChange={(e) => setFormData({...formData, email: e.target.value})} 
                                        className="w-full bg-transparent outline-none font-bold text-lg text-indigo-600 dark:text-indigo-400 disabled:text-gray-400" 
                                    />
                                </div>

                                <div className="bg-gray-50 dark:bg-[#0f172a]/50 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                                    <label className="block text-xs text-gray-400 mb-1 font-bold">رقم الموبايل</label>
                                    <input 
                                        disabled={!isEditing} 
                                        value={formData.phone} 
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                                        className="w-full bg-transparent outline-none font-bold text-lg text-indigo-600 dark:text-indigo-400 disabled:text-gray-400" 
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="bg-gray-50 dark:bg-[#0f172a]/50 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                                        <label className="block text-xs text-gray-400 mb-1 font-bold">تاريخ الميلاد</label>
                                        <input 
                                            type="date" 
                                            disabled={!isEditing} 
                                            value={formData.birthday} 
                                            onChange={(e) => setFormData({...formData, birthday: e.target.value})} 
                                            className="w-full bg-transparent outline-none font-bold text-lg text-indigo-600 dark:text-indigo-400 disabled:text-gray-400 [color-scheme:light] dark:[color-scheme:dark]" 
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-400 pr-2 italic font-medium">
                                        * نستخدم تاريخ ميلادك لإرسال عروض خاصة وهدايا في يوم ميلادك السعيد. 🎁
                                    </p>
                                </div>

                                <div className="md:col-span-2 py-2 pr-2">
                                    <label className="block text-xs text-gray-400 mb-4 font-black tracking-widest uppercase">تحديد النوع</label>
                                    <div className="flex gap-12">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative flex items-center justify-center">
                                                <input 
                                                    type="radio" name="gender" value="male" 
                                                    disabled={!isEditing} 
                                                    checked={formData.gender === 'male'} 
                                                    onChange={(e) => setFormData({...formData, gender: e.target.value})} 
                                                    className="peer appearance-none w-6 h-6 border-2 border-gray-300 dark:border-gray-600 rounded-full checked:border-indigo-500 transition-all" 
                                                />
                                                <div className="absolute w-3 h-3 rounded-full bg-indigo-500 scale-0 peer-checked:scale-100 transition-transform"></div>
                                            </div>
                                            <span className={`${formData.gender === 'male' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'} font-bold transition-colors`}>ذكر</span>
                                        </label>

                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative flex items-center justify-center">
                                                <input 
                                                    type="radio" name="gender" value="female" 
                                                    disabled={!isEditing} 
                                                    checked={formData.gender === 'female'} 
                                                    onChange={(e) => setFormData({...formData, gender: e.target.value})} 
                                                    className="peer appearance-none w-6 h-6 border-2 border-gray-300 dark:border-gray-600 rounded-full checked:border-pink-500 transition-all" 
                                                />
                                                <div className="absolute w-3 h-3 rounded-full bg-pink-500 scale-0 peer-checked:scale-100 transition-transform"></div>
                                            </div>
                                            <span className={`${formData.gender === 'female' ? 'text-pink-600 dark:text-pink-400' : 'text-gray-400'} font-bold transition-colors`}>أنثى</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="text-center py-24 animate-fade-in">
                            <FaBriefcase className="mx-auto mb-6 text-gray-200 dark:text-gray-700" size={64} />
                            <h3 className="text-2xl font-black text-gray-400">لا توجد طلبات سابقة حتى الآن</h3>
                        </div>
                    )}
                    {activeTab === 'returns' && (
                        <div className="text-center py-24 animate-fade-in">
                            <FaUndo className="mx-auto mb-6 text-gray-200 dark:text-gray-700" size={64} />
                            <h3 className="text-2xl font-black text-gray-400">لا توجد مرتجعات مسجلة</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;