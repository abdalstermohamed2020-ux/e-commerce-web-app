import React from 'react';
import AdminSidebar from '../components/AdminSidebar'; // استدعاء السايد بار
import { Outlet } from 'react-router-dom'; // دي عشان تعرض الصفحات الفرعية جوه الأدمن

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100" dir="rtl">
      {/* 1. السايد بار ثابت هنا على اليمين */}
      <AdminSidebar />

      {/* 2. المحتوى اللي بيتغير جنبه */}
      <main className="flex-grow p-8">
        {/* هنا هيظهر محتوى "الإحصائيات" أو "المنتجات" أو "الأوردرات" */}
        <Outlet /> 
      </main>
    </div>
  );
};

export default AdminLayout;