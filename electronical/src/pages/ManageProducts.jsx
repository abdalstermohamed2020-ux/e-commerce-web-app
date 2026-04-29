import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FaImage, FaTrash, FaPlus, FaSpinner, FaSync, FaExclamationTriangle, FaEdit } from 'react-icons/fa';
import axios from 'axios';
import useStore from '../store/UseStore';

const ManageProducts = () => {
  // --- States ---
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // --- States للمودال الجديد ---
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);

  const [newProduct, setNewProduct] = useState({ 
    title: '', 
    price: '', 
    image: '', 
    category: '',
    description: '' 
  });

  const { addProduct, updateProduct } = useStore();
  const API_BASE_URL = "[http://electronic-api.atwebpages.com](http://electronic-api.atwebpages.com)";

  // --- 1. جلب البيانات ---
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/get_products.php`, {
        headers: { 'Cache-Control': 'no-cache' }
      });
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      toast.error("حدث خطأ أثناء جلب البيانات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --- 2. فتح مودال الإضافة ---
  const openAddModal = () => {
    setIsEditing(false);
    setNewProduct({ title: '', price: '', image: '', category: '', description: '' });
    setShowAddModal(true);
  };

  // --- 3. فتح مودال التعديل ---
  const openEditModal = (product) => {
    setIsEditing(true);
    setCurrentId(product.id);
    setNewProduct({
      title: product.name || product.title,
      price: product.price,
      category: product.category,
      image: product.image,
      description: product.description || ''
    });
    setShowAddModal(true);
  };

  // --- 4. حفظ المنتج (إضافة أو تعديل) ---
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.image) return toast.error("يرجى اختيار صورة!");

    const loadingToast = toast.loading(isEditing ? "جاري التعديل..." : "جاري حفظ المنتج...");

    const productPayload = {
      id: currentId,
      name: newProduct.title,
      price: parseFloat(newProduct.price),
      category: newProduct.category,
      image: newProduct.image,
      description: newProduct.description || "لا يوجد وصف"
    };

    try {
      const result = isEditing 
        ? await updateProduct(productPayload) 
        : await addProduct(productPayload);

      if (result.success) {
        toast.success(result.message, { id: loadingToast });
        setShowAddModal(false);
        fetchProducts();
      } else {
        toast.error(result.message, { id: loadingToast });
      }
    } catch (error) {
      toast.error("حدث خطأ في النظام", { id: loadingToast });
    }
  };

  // --- 5. الحذف ---
  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/admin_products.php?id=${productIdToDelete}`);
      toast.success("تم حذف المنتج بنجاح!");
      setShowConfirmModal(false);
      fetchProducts();
    } catch (error) {
      toast.error("حدث خطأ أثناء الحذف");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewProduct({ ...newProduct, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-8 text-right min-h-screen bg-gray-50 dark:bg-[#0f172a] font-['Cairo']" dir="rtl">
      
      {/* مودال تأكيد الحذف */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowConfirmModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-[#1e293b] p-10 rounded-[3rem] shadow-2xl z-10 max-w-sm w-full text-center border border-white/10">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6"><FaExclamationTriangle size={40} /></div>
              <h3 className="text-2xl font-black dark:text-white mb-2">هل أنت متأكد؟</h3>
              <p className="text-gray-500 mb-8 font-bold text-sm">سيتم حذف المنتج نهائياً.</p>
              <div className="flex gap-4">
                <button onClick={confirmDelete} className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-black hover:bg-red-700 transition-all">نعم، احذف</button>
                <button onClick={() => setShowConfirmModal(false)} className="flex-1 bg-gray-100 dark:bg-gray-700 dark:text-white py-4 rounded-2xl font-black">تراجع</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* الهيدر */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black dark:text-white flex items-center gap-3">إدارة المخزن</h2>
          <p className="text-gray-500 mt-2 font-bold">أضف، عدل أو احذف منتجاتك</p>
        </div>
        <button onClick={openAddModal} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-xl transition-all"><FaPlus /> إضافة منتج جديد</button>
      </div>

      {/* الجدول */}
      <div className="bg-white dark:bg-[#1e293b] rounded-[2.5rem] overflow-hidden shadow-2xl border dark:border-gray-700/50">
        <div className="p-6 border-b dark:border-gray-700/50 flex justify-between items-center">
          <h3 className="text-xl font-bold dark:text-white">المنتجات الحالية ({products.length})</h3>
          <button onClick={fetchProducts} className="text-indigo-500 hover:rotate-180 transition-transform duration-500"><FaSync /></button>
        </div>

        {loading ? (
          <div className="p-32 text-center text-indigo-500"><FaSpinner className="animate-spin mx-auto text-5xl mb-4" /><p className="font-bold text-lg">جاري جلب البيانات...</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead className="bg-gray-50 dark:bg-[#161e2d] text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="p-6 font-bold">المنتج</th>
                  <th className="p-6 font-bold text-center">القسم</th>
                  <th className="p-6 font-bold text-center">السعر</th>
                  <th className="p-6 font-bold text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="dark:text-white divide-y dark:divide-gray-700/50">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="p-6 flex items-center gap-5">
                      <img src={p.image} className="w-16 h-16 rounded-2xl object-cover bg-gray-100 dark:bg-gray-800 shadow-sm" alt="" />
                      <div><p className="font-bold text-lg leading-tight">{p.name || p.title}</p></div>
                    </td>
                    <td className="p-6 text-center"><span className="bg-indigo-500/10 text-indigo-500 px-4 py-1 rounded-full text-sm font-black">{p.category}</span></td>
                    <td className="p-6 font-black text-indigo-600 dark:text-indigo-400 text-center text-xl italic">LE {parseFloat(p.price).toFixed(2)}</td>
                    <td className="p-6 text-center flex justify-center gap-3">
                      {/* زر التعديل */}
                      <button onClick={() => openEditModal(p)} className="text-blue-500 hover:bg-blue-500 hover:text-white p-3 rounded-xl transition-all shadow-sm"><FaEdit /></button>
                      {/* زر الحذف */}
                      <button onClick={() => { setProductIdToDelete(p.id); setShowConfirmModal(true); }} className="text-red-500 hover:bg-red-500 hover:text-white p-3 rounded-xl transition-all shadow-sm"><FaTrash /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* مودال الإضافة والتعديل */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-white dark:bg-[#1e293b] rounded-[3rem] w-full max-w-xl p-10 shadow-2xl border dark:border-white/10">
              <h2 className="text-3xl font-black mb-8 dark:text-white">{isEditing ? "📝 تعديل المنتج" : "📦 إضافة منتج جديد"}</h2>
              <form onSubmit={handleSaveProduct} className="space-y-5">
                <input type="text" placeholder="اسم المنتج" required className="w-full p-5 rounded-2xl bg-gray-100 dark:bg-[#0f172a] dark:text-white outline-none focus:ring-2 ring-indigo-500" value={newProduct.title} onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })} />
                <div className="grid grid-cols-2 gap-5">
                  <input type="number" placeholder="السعر" required className="w-full p-5 rounded-2xl bg-gray-100 dark:bg-[#0f172a] dark:text-white outline-none" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
<select 
  required 
  className="w-full p-5 rounded-2xl bg-gray-100 dark:bg-[#0f172a] dark:text-white outline-none focus:ring-2 ring-indigo-500 appearance-none" 
  value={newProduct.category} 
  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
>
  <option value="" disabled>اختر القسم</option>
  <option value="electronics">إلكترونيات (electronics)</option>
  <option value="womens-clothing">ملابس حريمي (womens-clothing)</option>
  <option value="mens-clothing">ملابس رجالي (mens-clothing)</option>
  <option value="jewelery">إكسسوارات (jewelery)</option>
</select>                </div>
                <textarea placeholder="الوصف" className="w-full p-5 rounded-2xl bg-gray-100 dark:bg-[#0f172a] dark:text-white h-24 outline-none resize-none" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
                <div className="border-2 border-dashed border-gray-300 dark:border-white/10 rounded-3xl p-6 text-center cursor-pointer">
                  {!newProduct.image ? (
                    <label className="cursor-pointer block"><FaImage className="mx-auto text-4xl text-gray-400 mb-2" /><span className="text-gray-500 font-bold block">رفع الصورة</span><input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} /></label>
                  ) : (
                    <div className="relative inline-block"><img src={newProduct.image} className="h-32 rounded-xl shadow-lg" alt="" /><button type="button" onClick={() => setNewProduct({ ...newProduct, image: '' })} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full text-xs">X</button></div>
                  )}
                </div>
                <div className="flex gap-4 mt-8">
                  <button type="submit" className="flex-[2] bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20">{isEditing ? "تحديث الآن" : "حفظ وتأكيد"}</button>
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-100 dark:bg-white/5 dark:text-white py-5 rounded-2xl font-bold">إلغاء</button>
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