import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const PromoSlider = () => {
  const initialIndex = parseInt(localStorage.getItem('promoSliderIndex')) || 0;

  const ads = [
    { id: 1, path: "electronics-pack", title: "تكنولوجيا المستقبل ⚡", desc: "أقوى أجهزة الجيمنج واللابتوب بأسعار لا تقبل المنافسة", bg: "from-gray-950 via-gray-900 to-indigo-950", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop" },
    { id: 2, path: "winter-pack", title: "ستايل الشياكة 🧥", desc: "أطقم كاجوال وكلاسيك تناسب ذوقك الرفيع من براندات عالمية", bg: "from-[#1a1a1a] via-[#262626] to-[#0a0a0a]", image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop" },
    { id: 3, path: "beauty-corner", title: "لمسات الفخامة ✨", desc: "ساعات وإكسسوارات ذهبية تضيف لمسة سحرية لإطلالتك", bg: "from-[#1c1917] via-[#292524] to-black", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800&auto=format&fit=crop" },
    { id: 4, path: "friday-offers", title: "عروض الجمعة 🛍️", desc: "أكبر فرصة توفير في السنة على مجموعة متنوعة من المنتجات", bg: "from-gray-900 via-purple-950 to-black", image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=800&auto=format&fit=crop" }
  ];

  return (
    <div className="w-full py-24 px-4 md:px-12 font-['Cairo']" dir="rtl">
      <Swiper
        initialSlide={initialIndex}
        onSlideChange={(swiper) => localStorage.setItem('promoSliderIndex', swiper.realIndex)}
        loop={true}
        autoplay={{ delay: 4500, disableOnInteraction: false }}
        pagination={{ clickable: true, dynamicBullets: true }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        // دعم الموبيل في الـ height والـ Rounding
        className="rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl h-[450px] md:h-[500px] border border-white/5"
      >
        {ads.map((ad) => (
          <SwiperSlide key={ad.id}>
            <div className={`bg-gradient-to-br ${ad.bg} w-full h-full relative group`}>
              <div className="container mx-auto h-full flex items-center justify-between px-10 md:px-24 text-white z-10 relative">
                <div className="flex-1 space-y-7 text-right">
                  <h2 className="text-4xl md:text-7xl font-black leading-tight">{ad.title}</h2>
                  <p className="text-gray-300 text-lg md:text-2xl max-w-lg font-medium">{ad.desc}</p>
                  <div className="pt-6">
                    <Link to={`/bundles/${ad.path}`} className="inline-flex items-center gap-4 bg-white text-black px-12 py-4.5 rounded-2xl font-black text-xl hover:bg-yellow-500 transition-all group">
                      اكتشف الآن <span className="group-hover:translate-x-[-8px] transition-transform">←</span>
                    </Link>
                  </div>
                </div>
                {/* يختفي في الموبيل عشان التصميم ميتكسرش */}
                <div className="flex-1 hidden md:flex justify-end relative h-full items-center">
                  <img src={ad.image} className="h-[350px] w-[480px] object-cover rounded-[2.5rem] shadow-2xl transform -rotate-2 group-hover:rotate-0 transition-all duration-700" alt={ad.title} />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PromoSlider;