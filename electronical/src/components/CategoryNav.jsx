import React from 'react';
import useStore from '../store/UseStore';
import ProductCard from '../components/ProductCard'; // تأكد إن كود كارت المنتج مفصول هنا

const CategoryPage = ({ category, title }) => {
  const { products } = useStore();

  // فلترة المنتجات بناءً على القسم القادم من الـ API
  const filteredProducts = products.filter(p => p.category === category);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 text-right" dir="rtl">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-black mb-8 dark:text-white border-r-8 border-indigo-600 pr-4 uppercase">
          قسم {title}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;