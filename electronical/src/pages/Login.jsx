import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
    FaEnvelope, FaLock, FaPhone, 
    FaMapMarkerAlt, FaUserPlus, FaSignInAlt, FaUser, FaCalendarAlt,
    FaUserFriends 
} from 'react-icons/fa';
import useStore from '../store/UseStore'; 
import { motion } from 'framer-motion';

const Login = () => {
    const { setUser } = useStore(); 
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        name: '',
        father_name: '', 
        birthday: '',    
        email: '',
        phone: '',
        password: '',
        address: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isLogin 
            ? 'http://localhost:8080/electronical_backend/login.php' 
            : 'http://localhost:8080/electronical_backend/signup.php';

        try {
            const response = await axios.post(url, formData);
            
            if (response.data.success) {
                if (isLogin) {
                    setUser(response.data.user); 
                    toast.success(response.data.message || "أهلاً بك مجدداً! ✨");
                    navigate('/'); 
                } else {
                    toast.success("تم إنشاء الحساب بنجاح! سجل دخولك الآن");
                    setIsLogin(true);
                }
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("خطأ في الاتصال:", error);
            toast.error("تأكد من تشغيل السيرفر (XAMPP)");
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-screen font-['Cairo'] text-right" dir="rtl">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-[#111827] p-8 md:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-4xl border dark:border-gray-800 transition-all duration-500"
            >
                {/* الرأس */}
                <div className="flex flex-col items-center mb-12">
                    <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white text-3xl shadow-xl shadow-indigo-500/30 animate-bounce transition-all">
                        {isLogin ? <FaSignInAlt /> : <FaUserPlus />}
                    </div>
                    <h2 className="text-4xl font-[1000] dark:text-white mt-6 italic">
                        {isLogin ? 'أهلاً بك مجدداً' : 'انضم إلينا الآن'}
                    </h2>
                    <div className="h-1.5 w-16 bg-indigo-600 mt-2 rounded-full"></div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {!isLogin && (
                        <>
                            {/* الاسم بالكامل */}
                            <div className="md:col-span-1 space-y-2 group">
                                <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mr-2">الاسم بالكامل</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                                        <FaUser />
                                    </span>
                                    <input 
                                        type="text" name="name" onChange={handleChange} required
                                        className="w-full pr-14 pl-4 py-5 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-indigo-600 dark:text-white rounded-[1.5rem] outline-none transition-all shadow-sm" 
                                        placeholder="اسمك الأول" 
                                    />
                                </div>
                            </div>

                            {/* اسم الأب */}
                            <div className="md:col-span-1 space-y-2 group">
                                <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mr-2">اسم الأب</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                                        <FaUserFriends />
                                    </span>
                                    <input 
                                        type="text" name="father_name" onChange={handleChange} required
                                        className="w-full pr-14 pl-4 py-5 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-indigo-600 dark:text-white rounded-[1.5rem] outline-none transition-all shadow-sm" 
                                        placeholder="اسم الأب" 
                                    />
                                </div>
                            </div>

                            {/* تاريخ الميلاد */}
                            <div className="md:col-span-2 space-y-2 group">
                                <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mr-2">تاريخ الميلاد</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                                        <FaCalendarAlt />
                                    </span>
                                    <input 
                                        type="date" name="birthday" onChange={handleChange} required
                                        className="w-full pr-14 pl-4 py-5 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-indigo-600 dark:text-white rounded-[1.5rem] outline-none transition-all shadow-sm appearance-none text-right" 
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* البريد الإلكتروني */}
                    <div className="md:col-span-2 space-y-2 group">
                        <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mr-2">البريد الإلكتروني</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                                <FaEnvelope />
                            </span>
                            <input 
                                type="email" name="email" onChange={handleChange} required
                                className="w-full pr-14 pl-4 py-5 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-indigo-600 dark:text-white rounded-[1.5rem] outline-none transition-all shadow-sm" 
                                placeholder="example@mail.com" 
                            />
                        </div>
                    </div>

                    {!isLogin && (
                        <>
                            {/* الموبايل */}
                            <div className="md:col-span-1 space-y-2 group">
                                <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mr-2">رقم الموبايل</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                                        <FaPhone />
                                    </span>
                                    <input 
                                        type="tel" name="phone" onChange={handleChange} required
                                        className="w-full pr-14 pl-4 py-5 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-indigo-600 dark:text-white rounded-[1.5rem] outline-none transition-all shadow-sm" 
                                        placeholder="01xxxxxxxxx" 
                                    />
                                </div>
                            </div>

                            {/* العنوان */}
                            <div className="md:col-span-1 space-y-2 group">
                                <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mr-2">العنوان</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                                        <FaMapMarkerAlt />
                                    </span>
                                    <input 
                                        type="text" name="address" onChange={handleChange} required
                                        className="w-full pr-14 pl-4 py-5 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-indigo-600 dark:text-white rounded-[1.5rem] outline-none transition-all shadow-sm" 
                                        placeholder="المدينة، الحي" 
                                    />
                                </div>
                            </div>
                        </>
                    )}
                    
                    {/* كلمة المرور */}
                    <div className="md:col-span-2 space-y-2 group">
                        <label className="block text-sm font-black text-gray-700 dark:text-gray-300 mr-2">كلمة المرور</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                                <FaLock />
                            </span>
                            <input 
                                type="password" name="password" onChange={handleChange} required
                                className="w-full pr-14 pl-4 py-5 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-indigo-600 dark:text-white rounded-[1.5rem] outline-none transition-all shadow-sm" 
                                placeholder="********" 
                            />
                        </div>
                    </div>

                    <button type="submit" className="md:col-span-2 w-full bg-indigo-600 text-white py-5 rounded-[1.5rem] font-[1000] text-xl hover:bg-indigo-700 shadow-2xl shadow-indigo-500/20 transition-all active:scale-95 mt-4">
                        {isLogin ? 'تسجيل الدخول للمتجر' : 'تأكيد إنشاء الحساب'}
                    </button>
                </form>

                <div className="text-center mt-12 border-t dark:border-gray-800 pt-8">
                    <button onClick={() => setIsLogin(!isLogin)} className="text-gray-500 dark:text-gray-400 font-bold text-lg">
                        {isLogin ? 'لا تملك حساباً بعد؟ ' : 'لديك حساب بالفعل؟ '}
                        <span className="text-indigo-600 dark:text-indigo-400 font-[1000] hover:underline underline-offset-8">
                            {isLogin ? 'انشاء حساب' : 'سجل دخولك '}
                        </span>
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;