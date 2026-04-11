import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaFacebookF, FaInstagram, FaTwitter, FaWhatsapp, 
  FaCcVisa, FaCcMastercard, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, 
  FaLinkedin
} from 'react-icons/fa';
import { SiVodafone } from 'react-icons/si'; // أيقونة فودافون

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-950 pt-16 pb-8 border-t dark:border-gray-800" dir="rtl">
      <div className="container mx-auto px-4 md:px-10">
        
        {/* الجزء العلوي: الأقسام */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* العمود الأول: عن المتجر */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black text-indigo-600 dark:text-indigo-400">Shopify Store</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              وجهتك الأولى لأحدث الأجهزة والإكسسوارات في مصر. جودة مضمونة، توصيل سريع، وأفضل الأسعار.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-xl hover:bg-sky-600 hover:text-white transition-all"><FaFacebookF /></a>
              <a href="#" className="w-10 h-10 bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-xl hover:bg-pink-600 hover:text-white transition-all"><FaInstagram /></a>
              <a href="#" className="w-10 h-10 bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-xl hover:bg-green-600 hover:text-white transition-all"><FaWhatsapp /></a>
              <a href="#" className="w-10 h-10 bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-xl hover:bg-sky-400 hover:text-white transition-all"><FaLinkedin /></a>
            </div>
          </div>

          {/* العمود الثاني: روابط سريعة */}
          <div>
            <h3 className="font-bold dark:text-white mb-6 text-lg">روابط تهمك</h3>
            <ul className="space-y-4 text-gray-500 dark:text-gray-400 text-sm">
              <li><Link to="/" className="hover:text-indigo-600 transition-colors">الرئيسية</Link></li>
              <li><Link to="/cart" className="hover:text-indigo-600 transition-colors">سلة المشتريات</Link></li>
              <li><Link to="/about" className="hover:text-indigo-600 transition-colors">أراء العملاء </Link></li>
            </ul>
          </div>

          {/* العمود الثالث: تواصل معنا */}
          <div>
            <h3 className="font-bold dark:text-white mb-6 text-lg">تواصل معنا</h3>
            <ul className="space-y-4 text-gray-500 dark:text-gray-400 text-sm">
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-indigo-600" /> 01234567890
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-indigo-600" /> support@store.com
              </li>
              <li className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-indigo-600" /> القاهرة، مصر
              </li>
            </ul>
          </div>

          {/* العمود الرابع: وسائل الدفع */}
          <div>
            <h3 className="font-bold dark:text-white mb-6 text-lg">طرق الدفع المقبولة</h3>
            <p className="text-xs text-gray-400 mb-4 font-bold">نحن ندعم وسائل دفع آمنة وموثوقة</p>
            <div className="flex flex-wrap gap-3">
              <div className="bg-white border dark:border-gray-700 p-2 rounded-lg shadow-sm flex flex-col items-center justify-center w-14 h-14" title="فيزا">
                <FaCcVisa size={30} className="text-blue-800" />
              </div>
              <div className="bg-white border dark:border-gray-700 p-2 rounded-lg shadow-sm flex flex-col items-center justify-center w-14 h-14" title="ماستركارد">
                <FaCcMastercard size={30} className="text-red-600" />
              </div>
              <div className="bg-red-600 p-2 rounded-lg shadow-sm flex flex-col items-center justify-center w-14 h-14" title="فودافون كاش">
                <SiVodafone size={30} className="text-white" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 border dark:border-gray-700 p-2 rounded-lg shadow-sm flex flex-col items-center justify-center w-14 h-14" title="الدفع عند الاستلام">
                <span className="text-[10px] font-black leading-tight text-center">كاش <br/>💵</span>
              </div>
            </div>
          </div>

        </div>

        {/* الجزء السفلي: الحقوق */}
        <div className="pt-8 border-t dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>© {currentYear} جميع الحقوق محفوظة لـ <span className="text-indigo-600 font-bold">Shopify Store</span></p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-indigo-600">سياسة الخصوصية</a>
            <a href="#" className="hover:text-indigo-600">شروط الاستخدام</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;