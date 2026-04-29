import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, Clock, CheckCircle, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user || !user.id) {
            toast.error("يرجى تسجيل الدخول أولاً لعرض طلباتك");
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                // ملاحظة: الرابط لا يزال يشير لـ localhost، سنقوم بتغييره عند رفع الباك إيند
                const res = await axios.get(`[http://electronic-api.atwebpages.com](http://electronic-api.atwebpages.com)/get_user_orders.php?user_id=${user.id}`);
                setOrders(res.data);
            } catch (err) {
                console.error("خطأ في الاتصال بالسيرفر:", err);
                toast.error("حدث خطأ أثناء جلب الطلبات");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders(); 
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/20';
            case 'تم التوصيل': return 'bg-green-500/20 text-green-500 border-green-500/20';
            case 'مرتجع': return 'bg-red-500/20 text-red-500 border-red-500/20';
            default: return 'bg-blue-500/20 text-blue-500 border-blue-500/20';
        }
    };

    if (!user) return null;

    return (
        <div className="p-6 md:p-12 text-white min-h-screen bg-[#0f172a]" dir="rtl">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-500">
                            <Package size={32} />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight">طلباتي</h1>
                    </div>
                    <div className="text-gray-400 text-sm bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                        إجمالي الطلبات: {orders.length}
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center p-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500"></div>
                    </div>
                ) : orders.length > 0 ? (
                    <div className="grid gap-5">
                        {orders.map((order) => (
                            <div key={order.id} className="group bg-slate-800/40 backdrop-blur-md rounded-2xl border border-white/5 p-6 hover:bg-slate-800/60 transition-all duration-300">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div className="flex items-center gap-6">
                                        <div>
                                            <p className="text-gray-500 text-xs mb-1 uppercase tracking-widest">رقم الطلب</p>
                                            <p className="font-mono text-lg font-bold text-white">#{order.id}</p>
                                        </div>
                                        <div className="h-10 w-[1px] bg-white/10 hidden md:block"></div>
                                        <div>
                                            <p className="text-gray-500 text-xs mb-1">تاريخ الطلب</p>
                                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                                <Clock size={14} />
                                                <span>{new Date(order.created_at).toLocaleDateString('ar-EG')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                                        <div className="text-left md:text-right">
                                            <p className="text-gray-500 text-xs mb-1">المبلغ الإجمالي</p>
                                            <div className="flex flex-col items-start md:items-end">
                                                {/* لو فيه خصم (السعر الأصلي أكبر من النهائي) اظهر السعر مشطوب */}
                                                {parseFloat(order.subtotal) > parseFloat(order.total_price) && (
                                                    <span className="text-sm font-bold text-gray-500 line-through decoration-red-500 decoration-2 italic">
                                                        LE {parseFloat(order.subtotal).toLocaleString()}
                                                    </span>
                                                )}
                                                <p className="text-2xl font-black text-indigo-400 italic">
                                                    LE {parseFloat(order.total_price).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className={`px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 ${getStatusStyle(order.status)}`}>
                                            {order.status === 'تم التوصيل' ? <CheckCircle size={14} /> : <Clock size={14} />}
                                            {order.status}
                                        </div>
                                        <ChevronLeft className="text-gray-600 group-hover:text-white transition-colors hidden md:block" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                        <Package size={64} className="mx-auto text-gray-600 mb-4 opacity-20" />
                        <h3 className="text-xl font-bold text-gray-400 mb-2">لا توجد طلبات بعد</h3>
                        <p className="text-gray-500 mb-8">ابدأ التسوق الآن لتظهر طلباتك هنا</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;