import React, { useState, useEffect } from 'react';
import useStore from '../store/UseStore';
import { FaPlus, FaTrash, FaLayerGroup } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';

const ManageBundles = () => {
  const { products, bundles, fetchBundles, deleteBundle, addBundle } = useStore(); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBundle, setNewBundle] = useState({ name: '', price: '', selectedIds: [] });

  useEffect(() => { 
    fetchBundles(); 
  }, [fetchBundles]);

  // 🔥 دالة معالجة المسارات لضمان ظهور الصور في الداش بورد
  const getFullImagePath = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/150?text=No+Image';
    
    // لو المسار مخزن كامل بـ http (زي ما ظاهر في قاعدة بياناتك)
    if (imagePath.startsWith('http')) return imagePath; 
    
    // لو الصورة بنظام Base64
    if (imagePath.startsWith('data:')) return imagePath; 
    
    // لو اسم ملف فقط، نضيف مسار السيرفر
    return `[http://electronic-api.atwebpages.com](http://electronic-api.atwebpages.com)/uploads/${imagePath}`;
  };

  const toggleProductSelection = (id) => {
    setNewBundle(prev => ({
      ...prev,
      selectedIds: prev.selectedIds.includes(id) 
        ? prev.selectedIds.filter(i => i !== id) 
        : [...prev.selectedIds, id]
    }));
  };

  const handleSaveBundle = async () => {
    if (!newBundle.name || !newBundle.price || newBundle.selectedIds.length === 0) {
      return toast.error("كمل البيانات واختار منتجاتك يا هندسة!");
    }

    const oldPrice = products
      .filter(p => newBundle.selectedIds.includes(p.id))
      .reduce((acc, curr) => acc + Number(curr.price), 0);

    const res = await addBundle({
      bundle_name: newBundle.name,
      price: newBundle.price,
      old_price: oldPrice,
      items_ids: newBundle.selectedIds.join(',')
    });

    if (res.success) {
      toast.success("تم إطلاق البكدج بنجاح! 🚀");
      setIsModalOpen(false);
      setNewBundle({ name: '', price: '', selectedIds: [] });
    }
  };

  const handleDelete = (id, name) => {
    Swal.fire({
      title: 'هل أنت متأكد؟',
      text: `سيتم حذف عرض "${name}" نهائياً!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'إيوه، إمسح!',
      cancelButtonText: 'إلغاء',
      reverseButtons: true,
      background: '#fff',
      customClass: {
        popup: 'rounded-[2.5rem] font-["Cairo"]',
        title: 'font-black text-gray-800',
        confirmButton: 'rounded-2xl px-6 py-3',
        cancelButton: 'rounded-2xl px-6 py-3'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await deleteBundle(id);
        if (res.success) {
          Swal.fire({
            title: 'تم الحذف!',
            text: 'تم نسف العرض من قاعدة البيانات.',
            icon: 'success',
            confirmButtonColor: '#4f46e5',
            customClass: { popup: 'rounded-[2rem] font-["Cairo"]' }
          });
        }
      }
    });
  };

  return (
    <div className="p-8 font-['Cairo'] min-h-screen bg-gray-50 dark:bg-[#0f0f0f]" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-[1000] text-indigo-700 dark:text-indigo-400 flex items-center gap-3 italic">
            <FaLayerGroup /> إدارة البكدجات (Bundles)
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-bold mt-2">اصنع عروض ميكس لا تقاوم واجذب عملاءك 🔥</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-3xl font-black flex items-center gap-2 shadow-xl transition-all active:scale-95"
        >
          <FaPlus /> إنشاء بكدج جديدة
        </button>
      </div>

      {/* Bundles List */}
      <div className="grid grid-cols-1 gap-10">
        {bundles && bundles.length > 0 ? bundles.map(bundle => (
          <div key={bundle.id} className="bg-white dark:bg-gray-800 rounded-[3.5rem] shadow-2xl border border-gray-100 dark:border-white/5 flex flex-col md:flex-row overflow-hidden hover:scale-[1.01] transition-all duration-500">
            
            {/* الجزء الأيمن: تفاصيل العرض */}
            <div className="flex-1 p-10 flex flex-col justify-center text-right border-l border-gray-50 dark:border-white/5">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                    <span className="bg-green-100 text-green-600 text-xs px-4 py-1.5 rounded-full font-[1000] shadow-sm italic">
                      وفر LE {Math.max(0, Number(bundle.old_price) - Number(bundle.price))}
                    </span>
                    <span className="bg-indigo-50 text-indigo-600 text-xs px-4 py-1.5 rounded-full font-black">
                       بكدج حصرية ✨
                    </span>
                </div>
                <h3 className="text-3xl font-[1000] text-gray-800 dark:text-white mb-3 uppercase tracking-tight">{bundle.bundle_name}</h3>
                <p className="text-gray-500 dark:text-gray-400 font-bold leading-relaxed text-sm max-w-md">
                  هذا العرض يحتوي على ({bundle.items_ids?.split(',').length}) منتجات مميزة مختارة بعناية.
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-[2.5rem] inline-block border border-gray-100 dark:border-white/5 shadow-inner">
                    <span className="text-gray-400 line-through block font-bold text-sm mb-1">LE {bundle.old_price}</span>
                    <span className="text-4xl font-[1000] text-indigo-700 dark:text-indigo-400 tracking-tighter">LE {bundle.price}</span>
                </div>
                
                <button 
                  onClick={() => handleDelete(bundle.id, bundle.bundle_name)}
                  className="bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-500 hover:text-white p-6 rounded-[2rem] transition-all active:scale-90 shadow-sm"
                >
                  <FaTrash size={24} />
                </button>
              </div>
            </div>

            {/* الجزء الأيسر: عرض صور المنتجات */}
            <div className="flex-1 bg-gradient-to-br from-indigo-50/50 to-white dark:from-gray-800 dark:to-gray-900 p-10 flex items-center justify-center relative min-h-[380px]">
              <div className="grid grid-cols-2 gap-6 w-full max-w-sm relative z-10">
                {bundle.items_ids && bundle.items_ids.split(',').slice(0, 4).map((id, index) => {
                  const prod = products.find(p => p.id === id);
                  return (
                    <div 
                      key={index} 
                      className={`bg-white dark:bg-gray-700 rounded-[2.5rem] p-4 shadow-xl border border-white/50 dark:border-gray-600 transform transition-all hover:scale-110 hover:-rotate-3 duration-300 ${index % 2 !== 0 ? 'mt-10' : 'mb-10'}`}
                    >
                      {/* 🔥 تم تعديل مصدر الصورة هنا */}
                      <img 
                        src={getFullImagePath(prod?.image)} 
                        className="w-full h-28 object-contain" 
                        alt={prod?.title} 
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Error'; }}
                      />
                      <div className="mt-2 h-1 w-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-full mx-auto"></div>
                    </div>
                  );
                })}
              </div>
              <div className="absolute top-10 right-10 w-40 h-40 bg-indigo-200/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-200/20 rounded-full blur-3xl"></div>
            </div>

          </div>
        )) : (
            <div className="text-center py-24 bg-white dark:bg-gray-800 rounded-[4rem] border-4 border-dashed border-gray-100 dark:border-gray-700">
                <div className="text-8xl mb-6 opacity-20">📦</div>
                <p className="text-gray-400 font-black text-2xl italic">لا توجد بكدجات حالياً.. ابدأ بصنع السحر! ✨</p>
            </div>
        )}
      </div>

      {/* Modal إضافة بكدج */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3.5rem] p-10 relative shadow-2xl border border-white/10">
            <h2 className="text-4xl font-[1000] mb-8 text-center dark:text-white">تجهيز بكدج جديدة 🎁</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <input 
                type="text" 
                placeholder="اسم العرض" 
                className="w-full bg-gray-50 dark:bg-gray-800 p-5 rounded-[1.5rem] outline-none font-bold dark:text-white ring-2 ring-gray-100 dark:ring-white/5 focus:ring-indigo-500"
                value={newBundle.name}
                onChange={(e) => setNewBundle({...newBundle, name: e.target.value})}
              />
              <input 
                type="number" 
                placeholder="السعر النهائي" 
                className="w-full bg-gray-50 dark:bg-gray-800 p-5 rounded-[1.5rem] outline-none font-[1000] text-green-600 text-2xl ring-2 ring-gray-100 dark:ring-white/5 focus:ring-green-500"
                value={newBundle.price}
                onChange={(e) => setNewBundle({...newBundle, price: e.target.value})}
              />
            </div>

            <h3 className="font-black mb-4 text-indigo-600 dark:text-indigo-400">اختر منتجات البكدج:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-h-64 overflow-y-auto p-2 text-right">
              {products.map(p => (
                <div 
                  key={p.id}
                  onClick={() => toggleProductSelection(p.id)}
                  className={`relative p-4 rounded-[2rem] border-2 cursor-pointer transition-all ${
                    newBundle.selectedIds.includes(p.id) 
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' 
                      : 'border-gray-100 dark:border-white/5'
                  }`}
                >
                  {/* 🔥 استخدام الدالة هنا أيضاً لضمان ظهور الصور في المودال */}
                  <img src={getFullImagePath(p.image)} className="h-16 w-full object-contain mb-2" alt="" />
                  <p className="text-[10px] font-black text-center line-clamp-1 dark:text-gray-300">{p.title || p.name}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button onClick={handleSaveBundle} className="flex-[2] bg-indigo-600 text-white py-5 rounded-[2rem] font-[1000] text-xl shadow-xl hover:bg-indigo-700 transition-all">حفظ وإطلاق العرض 🚀</button>
              <button onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-100 dark:bg-white/5 text-gray-500 py-5 rounded-[2rem] font-black">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBundles;