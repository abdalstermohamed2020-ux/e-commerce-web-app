import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
    FaGoogle, FaEnvelope, FaLock, FaPhone, 
    FaMapMarkerAlt, FaCity, FaUserPlus, FaSignInAlt, FaUser 
} from 'react-icons/fa';
import useStore from '../store/UseStore'; 

const Login = () => {
    // استدعاء setUser من الستور جوه الكومبوننت
    const { setUser } = useStore(); 
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        city: '',
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
                    // --- التعديل الجوهري هنا ---
                    // بنخزن بيانات اليوزر اللي راجعة من الـ PHP في الستور
                    // تأكد إن السيرفر بيبعت response.data.user
                    setUser(response.data.user); 
                    
                    toast.success(response.data.message || "أهلاً بك مجدداً! ✨");
                    navigate('/'); // التحويل للرئيسية
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
        <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-screen font-['Cairo']" dir="rtl">
            <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-3xl border dark:border-gray-700 transition-all duration-500">
                
                {/* الأيقونة العلوية */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white text-4xl shadow-xl shadow-indigo-500/30 animate-pulse">
                        {isLogin ? <FaSignInAlt /> : <FaUserPlus />}
                    </div>
                    <h2 className="text-4xl font-bold dark:text-white mt-4">
                        {isLogin ? 'أهلاً بك مجدداً' : 'إنشاء حساب جديد'}
                    </h2>
                    <div className="h-1.5 w-16 bg-indigo-600 mt-2 rounded-full"></div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {!isLogin && (
                        <div className="md:col-span-2 relative group">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">الاسم بالكامل</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                                    <FaUser />
                                </span>
                                <input 
                                    type="text" name="name" onChange={handleChange} required
                                    className="w-full pr-12 pl-4 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-transparent focus:border-indigo-600 dark:text-white rounded-2xl outline-none transition-all shadow-sm" 
                                    placeholder="أدخل اسمك" 
                                />
                            </div>
                        </div>
                    )}

                    <div className={isLogin ? "md:col-span-2 relative group" : "relative group"}>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">البريد الإلكتروني</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                                <FaEnvelope />
                            </span>
                            <input 
                                type="email" name="email" onChange={handleChange} required
                                className="w-full pr-12 pl-4 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-transparent focus:border-indigo-600 dark:text-white rounded-2xl outline-none transition-all shadow-sm" 
                                placeholder="example@mail.com" 
                            />
                        </div>
                    </div>

                    {!isLogin && (
                        <div className="relative group">
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">رقم الموبايل</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                                    <FaPhone />
                                </span>
                                <input 
                                    type="tel" name="phone" onChange={handleChange}
                                    className="w-full pr-12 pl-4 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-transparent focus:border-indigo-600 dark:text-white rounded-2xl outline-none transition-all shadow-sm" 
                                    placeholder="01xxxxxxxxx" 
                                />
                            </div>
                        </div>
                    )}

                    <div className={isLogin ? "md:col-span-2 relative group" : "relative group"}>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">كلمة المرور</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                                <FaLock />
                            </span>
                            <input 
                                type="password" name="password" onChange={handleChange} required
                                className="w-full pr-12 pl-4 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-transparent focus:border-indigo-600 dark:text-white rounded-2xl outline-none transition-all shadow-sm" 
                                placeholder="********" 
                            />
                        </div>
                    </div>

                    <button type="submit" className="md:col-span-2 w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-xl hover:bg-indigo-700 shadow-xl transition-all active:scale-95">
                        {isLogin ? 'تسجيل الدخول' : 'إنشاء الحساب الآن'}
                    </button>
                </form>

                <div className="text-center mt-10">
                    <button onClick={() => setIsLogin(!isLogin)} className="text-gray-500 dark:text-gray-400 font-medium">
                        {isLogin ? 'ليس لديك حساب؟ ' : 'لديك حساب بالفعل؟ '}
                        <span className="text-indigo-600 dark:text-indigo-400 font-black hover:underline underline-offset-8">
                            {isLogin ? 'سجل حساب جديد الآن' : 'سجل دخولك هنا'}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;