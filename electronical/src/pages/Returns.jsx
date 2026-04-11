import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, RefreshCcw, AlertCircle } from 'lucide-react';

const Returns = () => {
    const [returns, setReturns] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchReturns = async () => {
            if (user?.id) {
                try {
                    const res = await axios.get(`http://localhost:8080/electronical_backend/get_user_orders.php?user_id=${user.id}`);
                    const onlyReturns = res.data.filter(order => order.status === 'مرتجع');
                    setReturns(onlyReturns);
                } catch (err) {
                    console.error("خطأ في جلب المرتجعات:", err);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchReturns();
    }, [user?.id]);

    if (!user) return (
        <div className="flex flex-col items-center justify-center min-h-screen text-white bg-[#0f172a]">
            <AlertCircle size={48} className="text-red-500 mb-4" />
            <p className="text-xl">يرجى تسجيل الدخول لعرض المرتجعات 🔒</p>
        </div>
    );

    return (
        <div className="p-6 md:p-10 text-white min-h-screen bg-[#0f172a]" dir="rtl">
            <div className="flex items-center gap-3 mb-8">
                <RefreshCcw className="text-red-400" size={32} />
                <h1 className="text-3xl font-bold">طلبات المرتجعات</h1>
            </div>

            {loading ? (
                <p className="text-center text-gray-400">جاري التحميل...</p>
            ) : returns.length > 0 ? (
                <div className="grid gap-6">
                    {returns.map(order => (
                        <div key={order.id} className="p-6 bg-slate-800/50 rounded-2xl border border-red-500/20 flex flex-col md:flex-row justify-between items-center transition-all hover:border-red-500/40">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-red-500/10 rounded-lg text-red-400"><Package size={24} /></div>
                                <div>
                                    <h3 className="text-lg font-bold">طلب رقم #{order.id}</h3>
                                    <p className="text-sm text-gray-400">تاريخ الطلب: {order.created_at}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-black text-red-400 mb-1">{order.total_price} LE</div>
                                <span className="px-4 py-1 bg-red-500/20 text-red-300 rounded-full text-xs font-bold">{order.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center p-20 bg-slate-800/30 rounded-3xl border border-dashed border-white/10">
                    <Package size={64} className="mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-400 text-lg">لا توجد أي عمليات إرجاع حالياً يا هندسة.</p>
                </div>
            )}
        </div>
    );
};
export default Returns;