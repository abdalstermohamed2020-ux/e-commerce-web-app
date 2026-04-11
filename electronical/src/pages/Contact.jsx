import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaWhatsapp, FaInstagram } from 'react-icons/fa';

const Contact = () => {
  const contactInfo = [
    { id: 1, icon: <FaPhoneAlt />, title: "اتصل بنا", detail: "+20 123 456 7890", color: "bg-blue-500" },
    { id: 2, icon: <FaEnvelope />, title: "البريد الإلكتروني", detail: "info@electronical.com", color: "bg-red-500" },
    { id: 3, icon: <FaMapMarkerAlt />, title: "المقر الرئيسي", detail: "القاهرة، مدينة نصر، شارع التسعين", color: "bg-green-500" },
  ];

  const socialLinks = [
    { name: "واتساب", icon: <FaWhatsapp />, link: "#", color: "hover:text-green-500" },
    { name: "فيسبوك", icon: <FaFacebook />, link: "#", color: "hover:text-blue-600" },
    { name: "انستجرام", icon: <FaInstagram />, link: "#", color: "hover:text-pink-500" },
  ];

  return (
    <div className="container mx-auto px-6 py-16 text-right">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black mb-4 dark:text-white">تواصل معنا</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-12 text-lg">يسعدنا دائماً تواصلكم معنا عبر أي من القنوات التالية:</p>

        {/* كروت التواصل */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {contactInfo.map((info) => (
            <div key={info.id} className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] shadow-xl border border-gray-100 dark:border-gray-700 hover:scale-105 transition-transform">
              <div className={`${info.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl mb-6 mx-auto md:mx-0 shadow-lg`}>
                {info.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">{info.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 font-medium">{info.detail}</p>
            </div>
          ))}
        </div>

        {/* السوشيال ميديا */}
        <div className="bg-indigo-600 rounded-[3rem] p-10 text-white text-center shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-6">تابعنا على السوشيال ميديا</h2>
            <div className="flex justify-center gap-10">
              {socialLinks.map((soc, i) => (
                <a key={i} href={soc.link} className="flex flex-col items-center gap-2 group">
                  <span className="text-4xl transition-transform group-hover:scale-125 group-hover:rotate-12 duration-300">
                    {soc.icon}
                  </span>
                  <span className="text-sm font-bold opacity-80">{soc.name}</span>
                </a>
              ))}
            </div>
          </div>
          {/* لمسة جمالية في الخلفية */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Contact;