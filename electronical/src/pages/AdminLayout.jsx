import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50" dir="rtl">
      {/* القائمة الجانبية ثابتة هنا */}
      <AdminSidebar /> 
      
      {/* المحتوى المتغير هنا */}
      <main className="flex-grow p-8">
        <Outlet /> 
      </main>
    </div>
  );
};

export default AdminLayout;