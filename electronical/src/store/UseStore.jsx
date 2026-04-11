import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const useStore = create(
  persist(
    (set, get) => ({
      // --- الحالة (State) ---
      user: null, 
      products: [],
      cart: [],
      orders: [], // كل الطلبات (للأدمين)
      returns: [], 
      searchQuery: '',
      darkMode: false,
      selectedCategory: 'all',
      discount: 0,
      appliedCoupon: null,
      isSideNavOpen: false,
      isAdminAuthenticated: false,

      // --- وظائف المستخدم ---
      setUser: (userData) => set({ user: userData }),
      
      // تحديث بيانات المستخدم (الاسم، الموبايل، إلخ)
      updateUser: (updatedData) => set((state) => ({
        user: state.user ? { ...state.user, ...updatedData } : null
      })),

      logout: () => {
        set({ user: null, cart: [], orders: [], returns: [] });
        localStorage.removeItem('shopify-storage'); // تنظيف التخزين عند الخروج
      },

      // --- وظيفة جلب المنتجات ---
      fetchProductsFromDB: async () => {
        try {
          const response = await axios.get('http://localhost:8080/electronical_backend/get_products.php');
          set({ products: response.data });
        } catch (error) {
          console.error("خطأ في جلب المنتجات:", error);
        }
      },

      // --- وظائف التحكم في الواجهة (UI) ---
      toggleSideNav: () => set((state) => ({ isSideNavOpen: !state.isSideNavOpen })),
      closeSideNav: () => set({ isSideNavOpen: false }),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),

      // --- وظائف الأدمين ---
      loginAdmin: (username, password) => {
        if (username === 'admin' && password === 'admin123') {
          set({ isAdminAuthenticated: true });
          return { success: true, message: 'أهلاً بك يا مدير!' };
        }
        return { success: false, message: 'بيانات غير صحيحة' };
      },
      logoutAdmin: () => set({ isAdminAuthenticated: false }),

      // --- وظائف السلة ---
      addToCart: (product) => set((state) => {
        const existingItem = state.cart.find((item) => item.id === product.id);
        if (existingItem) {
          return {
            cart: state.cart.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ),
          };
        }
        return { cart: [...state.cart, { ...product, quantity: 1 }] };
      }),

      decreaseQuantity: (id) => set((state) => ({
        cart: state.cart.map((item) =>
          item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
        ),
      })),

      removeFromCart: (id) => set((state) => ({
        cart: state.cart.filter((i) => i.id !== id)
      })),

      clearCart: () => set({ cart: [], discount: 0, appliedCoupon: null }),

      // --- وظائف الطلبات (المرتبطة باليوزر) ---
      addOrder: (order) => set((state) => ({ 
        orders: [{ 
          ...order, 
          userId: state.user?.id, // ربط الطلب باليوزر اللي عامل دخول
          status: 'pending', 
          date: new Date().toLocaleDateString('ar-EG') 
        }, ...state.orders] 
      })),

      // وظيفة لجلب طلبات اليوزر الحالي فقط (لصفحة البروفايل)
      getUserOrders: () => {
        const state = get();
        return state.orders.filter(o => o.userId === state.user?.id);
      },

      updateOrderStatus: (orderId, newStatus) => set((state) => {
        const orderToUpdate = state.orders.find(o => o.id === orderId);
        if (!orderToUpdate) return state;

        if (newStatus === 'returned') {
          return {
            orders: state.orders.filter(o => o.id !== orderId),
            returns: [{ ...orderToUpdate, status: 'returned', returnDate: new Date().toLocaleDateString('ar-EG') }, ...state.returns]
          };
        }

        return {
          orders: state.orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
        };
      }),

      // --- وظائف المنتجات ---
      setProducts: (data) => set({ products: data }),
      removeProduct: (id) => set((state) => ({ 
        products: state.products.filter(p => p.id !== id) 
      })),

      // --- وظائف الكوبونات ---
      applyCoupon: (couponCode) => {
        const codes = { 'SAVE10': 0.10, 'MIS20': 0.20 };
        if (codes[couponCode]) {
          set({ discount: codes[couponCode], appliedCoupon: couponCode });
          return { success: true, message: `تم تطبيق خصم ${codes[couponCode]*100}% ✨` };
        }
        return { success: false, message: 'كوبون غير صحيح' };
      },
      resetDiscount: () => set({ discount: 0, appliedCoupon: null }),
    }),
    {
      name: 'shopify-storage', 
    }
  )
);

export default useStore;