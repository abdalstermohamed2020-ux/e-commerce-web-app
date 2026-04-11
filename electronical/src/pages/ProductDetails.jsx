import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useStore from '../store/UseStore'; // تأكد من المسار
import { toast } from 'react-hot-toast';

const ProductDetails = () => {
    const { id } = useParams(); // الـ ID اللي جاي من الرابط
    const { products, addToCart } = useStore();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        // البحث عن المنتج في الستور بناءً على الـ ID الجديد
        if (products.length > 0) {
            const foundProduct = products.find(p => String(p.id) === String(id));
            setProduct(foundProduct);
        }
    }, [id, products]);

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center dark:bg-gray-900">
                <h2 className="text-2xl text-white font-bold animate-pulse">جاري تحميل تفاصيل المنتج... 🔃</h2>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-20 dark:text-white text-right" dir="rtl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* صورة المنتج */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl">
                    <img src={product.image} alt={product.title} className="w-full h-96 object-contain" />
                </div>

                {/* تفاصيل المنتج */}
                <div className="flex flex-col justify-center">
                    <span className="text-indigo-600 font-bold mb-2">{product.category}</span>
                    <h1 className="text-4xl font-black mb-6">{product.title}</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 leading-relaxed">
                        {product.description}
                    </p>
                    <div className="text-3xl font-black text-indigo-600 mb-8">
                        {product.price} LE
                    </div>
                    <button 
                        onClick={() => {
                            addToCart(product);
                            toast.success("تمت الإضافة للسلة!");
                        }}
                        className="bg-indigo-600 text-white py-4 px-10 rounded-2xl font-bold text-xl hover:bg-indigo-700 transition-all"
                    >
                        إضافة إلى السلة 🛒
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;