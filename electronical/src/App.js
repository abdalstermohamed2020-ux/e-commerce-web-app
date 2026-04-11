import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import useStore from './store/UseStore';
import { Toaster } from 'react-hot-toast';

// استيراد المكونات (Components)
import Navbar from './components/Navbar';
import SideNavbar from './components/SideNavbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';    
import ProtectedRoute from './components/ProtectedRoute';   

// استيراد الصفحات (Pages)
import Home from './pages/Home';
import Cart from './pages/Cart';
import Login from './pages/Login';
import ProductDetails from './pages/ProductDetails';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';
import Electronics from './pages/Electronics';
import Jewelry from './pages/Jewelry';
import About from './pages/About';
import CategoryPage from './pages/CategoryPage';
import BundlePage from './pages/BundlePage';      
import OffersPage from './pages/OffersPage'; 
import Success from './pages/Success';
import AdminLayout from './pages/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import ManageProducts from './pages/ManageProducts';
import ManageOrders from './pages/ManageOrders';
import AdminLogin from './pages/AdminLogin';  
import ManageReturns from './pages/ManageReturns';
import ManageSales from './pages/ManageSales';
import Profile from './pages/Profile';
import MyOrders from './pages/MyOrders';
import Returns from './pages/Returns';

// مكون إضافي للفصل بين الموقع العام ولوحة التحكم
const MainLayout = ({ children }) => (
  <>
    <Navbar />
    <SideNavbar />
    <main className="flex-grow">{children}</main>
    <Footer />
  </>
);

function App() {
  const { darkMode } = useStore();
const fetchProductsFromDB = useStore((state) => state.fetchProductsFromDB);

  useEffect(() => {
    fetchProductsFromDB(); // نداء للـ API بتاع الـ PHP
  }, [fetchProductsFromDB]);
  
  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <Toaster position="top-center" reverseOrder={false} />
      
      <Router>
        <ScrollToTop /> 

        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 flex flex-col">
          
          <Routes>
            {/* 1. مسارات الموقع العام */}
            <Route path="/" element={<MainLayout><Home /></MainLayout>} />
            <Route path="/cart" element={<MainLayout><Cart /></MainLayout>} />
            <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
            <Route path="/product/:id" element={<MainLayout><ProductDetails /></MainLayout>} />
            <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
            <Route path="/checkout" element={<MainLayout><Checkout /></MainLayout>} />
            <Route path="/electronics" element={<MainLayout><Electronics /></MainLayout>} />
            <Route path="/jewelry" element={<MainLayout><Jewelry /></MainLayout>} />
            <Route path="/about" element={<MainLayout><About /></MainLayout>} />
            <Route path="/bundles/:bundleId" element={<MainLayout><BundlePage /></MainLayout>} />
            <Route path="/mens-clothing" element={<MainLayout><CategoryPage category="men's clothing" title="ملابس رجالي" /></MainLayout>} />
            <Route path="/womens-clothing" element={<MainLayout><CategoryPage category="women's clothing" title="ملابس حريمي" /></MainLayout>} />
            <Route path="/all-offers" element={<MainLayout><OffersPage /></MainLayout>} />
            <Route path="/success" element={<MainLayout><Success /></MainLayout>} />
            <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
            <Route path="/my-orders" element={<MainLayout><MyOrders /></MainLayout>} />
            <Route path="/returns" element={<MainLayout><Returns /></MainLayout>} />

            {/* صفحة دخول الأدمين (بره الحماية وبره الـ MainLayout) */}
          <Route path="/admin-login" element={<AdminLogin />} />
            
            {/* 2. مسارات لوحة التحكم (المحمة بالـ ProtectedRoute) */}
            <Route 
  path="/secret-portal-mis" 
  element={
    <ProtectedRoute>
      {/* هنا بنحط المكون الرئيسي للوحة التحكم */}
      <AdminDashboard /> 
    </ProtectedRoute>
  }
>
  {/* المسارات الفرعية (تظهر داخل الـ Dashboard لو استخدمت Outlet) */}
  <Route path="products" element={<ManageProducts />} />
  <Route path="orders" element={<ManageOrders />} />
  <Route path="returns" element={<ManageReturns />} />
  <Route path="sales" element={<ManageSales />} />
</Route>
            {/* صفحة 404 (اختياري) */}
<Route path="*" element={<div className="text-center py-20 dark:text-white font-bold text-4xl italic">
  404 - الصفحة غير موجودة يا هندسة 😅</div>} />
  </Routes>

        </div>
      </Router>
    </div>
  );
}

export default App;