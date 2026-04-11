import React from 'react';
import useStore from '../store/UseStore'; // تأكد إن المسار صح حسب مشروعك
import ProductCard from '../components/ProductCard'; 

const CategoryPage = ({ category, title }) => {
  // سحب المنتجات من الـ Store
  const { products } = useStore();

  // الفلترة الآمنة (التعديل الأساسي هنا)
  const filteredProducts = products.filter((p) => {
    // نستخدم ?. للتأكد من وجود الـ category والـ title قبل تحويلهم لحروف صغيرة
    return p.category?.toLowerCase() === category?.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 text-right" dir="rtl">
      <div className="container mx-auto px-6">
        
        {/* عنوان القسم */}
        <h1 className="text-3xl font-black mb-8 dark:text-white border-r-8 border-indigo-600 pr-4">
          قسم {title}
        </h1>

        {/* عرض المنتجات */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts && filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              // استخدمنا product.id لأنه اللي جاي من الداتا بيز MySQL
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            // رسالة تظهر في حالة عدم وجود منتجات أو جاري التحميل
            <div className="col-span-full py-20 text-center">
               <p className="text-xl text-gray-500 dark:text-gray-400 font-bold">
                  لا توجد منتجات متاحة في قسم {title} حالياً.. جاري التحميل من السيرفر 🔃
               </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CategoryPage;