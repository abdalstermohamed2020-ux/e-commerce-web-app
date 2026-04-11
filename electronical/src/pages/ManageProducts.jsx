import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FaImage, FaTrash, FaPlus, FaSpinner, FaExclamationCircle, FaSync } from 'react-icons/fa';
import axios from 'axios';

const ManageProducts = () => {
  // --- States ---
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorDetails, setErrorDetails] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ 
    title: '', 
    price: '', 
    image: '', 
    category: '',
    description: '' 
  });

  // عنوان السيرفر الموحد (بورت 8080 بناءً على إعدادات جهازك)
  const API_BASE_URL = "http://localhost:8080/electronical_backend";

  // --- 1. جلب البيانات ---
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setErrorDetails("");
      const res = await axios.get(`${API_BASE_URL}/get_products.php`, {
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      console.log("البيانات المستلمة:", res.data);
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Fetch Error:", error);
      const msg = error.response ? `خطأ من السيرفر: ${error.response.status}` : "فشل الاتصال بـ 8080";
      setErrorDetails(msg);
      toast.error("حدث خطأ أثناء جلب البيانات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- 2. إضافة منتج جديد ---
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.image) return toast.error("يرجى اختيار صورة للمنتج!");

    const loadingToast = toast.loading("جاري حفظ المنتج...");

    try {
      await axios.post(`${API_BASE_URL}/admin_products.php`, {
        name: newProduct.title,
        price: parseFloat(newProduct.price),
        category: newProduct.category,
        image: newProduct.image,
        description: newProduct.description || "لا يوجد وصف"
      });

      toast.success("تم الحفظ بنجاح! ✅", { id: loadingToast });
      setNewProduct({ title: '', price: '', image: '', category: '', description: '' });
      setShowAddModal(false);
      fetchProducts(); 
    } catch (error) {
      console.error("Add Error:", error);
      toast.error("فشل الحفظ.. تأكد من مسار admin_products.php", { id: loadingToast });
    }
  };

  // --- 3. حذف منتج ---
  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف المنتج نهائياً؟")) {
      try {
        await axios.delete(`${API_BASE_URL}/admin_products.php?id=${id}`);
        toast.success("تم الحذف بنجاح! 🗑️");
        fetchProducts();
      } catch (error) {
        console.error("Delete Error:", error);
        toast.error("حدث خطأ أثناء محاولة الحذف");
      }
    }
  };

  // معالجة الصورة
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewProduct({ ...newProduct, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-8 text-right min-h-screen bg-gray-50 dark:bg-[#0f172a]" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black dark:text-white flex items-center gap-3">
            إدارة المخزن
          </h2>
          <p className="text-gray-500 mt-2">تحكم في منتجات الهاردوير الخاصة بك</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 transition-all active:scale-95"
        >
          <FaPlus /> إضافة منتج جديد
        </button>
      </div>

      {/* Error Diagnose */}
      {errorDetails && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-5 rounded-[2rem] mb-8 flex items-center justify-between font-bold">
          <div className="flex items-center gap-3">
            <FaExclamationCircle className="text-xl" />
            <span>{errorDetails} (تأكد من تشغيل Apache على بورت 8080)</span>
          </div>
          <button onClick={fetchProducts} className="bg-red-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm hover:bg-red-600">
            <FaSync /> إعادة محاولة
          </button>
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white dark:bg-[#1e293b] rounded-[2.5rem] overflow-hidden shadow-2xl border dark:border-gray-700/50">
        <div className="p-6 border-b dark:border-gray-700/50 flex justify-between items-center">
          <h3 className="text-xl font-bold dark:text-white">المنتجات الحالية ({products.length})</h3>
          <button onClick={fetchProducts} className="text-indigo-500 hover:rotate-180 transition-transform duration-500">
             <FaSync />
          </button>
        </div>

        {loading ? (
          <div className="p-32 text-center text-indigo-500">
            <FaSpinner className="animate-spin mx-auto text-5xl mb-4" />
            <p className="font-bold text-lg">جاري الاتصال بقاعدة البيانات...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead className="bg-gray-50 dark:bg-[#161e2d] text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="p-6 font-bold">المنتج</th>
                  <th className="p-6 font-bold text-center">القسم</th>
                  <th className="p-6 font-bold text-center">السعر</th>
                  <th className="p-6 font-bold text-center">الإجراء</th>
                </tr>
              </thead>
              <tbody className="dark:text-white divide-y dark:divide-gray-700/50">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="p-6 flex items-center gap-5">
                      <div className="relative">
                        <img src={p.image} className="w-16 h-16 rounded-2xl object-cover bg-gray-100 dark:bg-gray-800" alt={p.name} />
                        <div className="absolute inset-0 rounded-2xl shadow-inner pointer-events-none border border-black/5"></div>
                      </div>
                      <div>
                        <p className="font-bold text-lg leading-tight">{p.name || p.title}</p>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-1 max-w-[200px]">{p.description}</p>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                       <span className="bg-indigo-500/10 text-indigo-500 px-4 py-1 rounded-full text-sm font-bold">
                         {p.category}
                       </span>
                    </td>
                    <td className="p-6 font-black text-indigo-600 dark:text-indigo-400 text-center text-xl">
                      LE {p.price}
                    </td>
                    <td className="p-6 text-center">
                      <button 
                        onClick={() => handleDelete(p.id)} 
                        className="text-red-500 hover:bg-red-500 hover:text-white p-4 rounded-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {!loading && products.length === 0 && (
          <div className="p-24 text-center">
            <div className="bg-gray-100 dark:bg-gray-800 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
               <FaExclamationCircle className="text-4xl text-gray-400" />
            </div>
            <p className="text-gray-400 font-bold text-xl italic">المخزن لا يحتوي على بيانات حالياً</p>
          </div>
        )}
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ y: 50, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              exit={{ y: 50, opacity: 0 }} 
              className="bg-white dark:bg-[#1e293b] rounded-[3rem] w-full max-w-xl p-10 shadow-2xl border dark:border-white/10"
            >
              <h2 className="text-3xl font-black mb-8 dark:text-white">📦 إضافة منتج جديد</h2>
              <form onSubmit={handleAddProduct} className="space-y-5">
                <div className="space-y-2">
                  <label className="dark:text-gray-400 font-bold mr-2">اسم المنتج</label>
                  <input 
                    type="text" placeholder="مثلاً: Logitech G502" required 
                    className="w-full p-5 rounded-2xl bg-gray-100 dark:bg-[#0f172a] dark:text-white outline-none focus:ring-2 ring-indigo-500 transition-all text-right" 
                    value={newProduct.title} onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })} 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="dark:text-gray-400 font-bold mr-2">السعر (LE)</label>
                    <input type="number" placeholder="0.00" required className="w-full p-5 rounded-2xl bg-gray-100 dark:bg-[#0f172a] dark:text-white outline-none" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="dark:text-gray-400 font-bold mr-2">الفئة</label>
                    <input type="text" placeholder="ماوس، كيبورد..." required className="w-full p-5 rounded-2xl bg-gray-100 dark:bg-[#0f172a] dark:text-white outline-none" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="dark:text-gray-400 font-bold mr-2">وصف المنتج</label>
                  <textarea placeholder="اكتب تفاصيل المنتج هنا..." className="w-full p-5 rounded-2xl bg-gray-100 dark:bg-[#0f172a] dark:text-white h-24 outline-none resize-none" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
                </div>
                
                <div className="border-2 border-dashed border-gray-300 dark:border-white/10 rounded-3xl p-8 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                  {!newProduct.image ? (
                    <label className="cursor-pointer block">
                      <FaImage className="mx-auto text-5xl text-gray-400 mb-4" />
                      <span className="text-gray-500 font-bold block">اضغط لرفع صورة المنتج</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                  ) : (
                    <div className="relative group inline-block">
                      <img src={newProduct.image} className="h-40 mx-auto rounded-2xl border-4 border-indigo-500 shadow-lg shadow-indigo-500/20" alt="Preview" />
                      <button onClick={() => setNewProduct({...newProduct, image: ''})} className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                         <FaTrash size={12} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 mt-8">
                  <button type="submit" className="flex-[2] bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 active:scale-95 transition-all">حفظ وتأكيد</button>
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-100 dark:bg-white/5 dark:text-white py-5 rounded-2xl font-bold hover:bg-gray-200 transition-all">إلغاء</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageProducts;