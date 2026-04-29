import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const normalizeArray = (value) => (Array.isArray(value) ? value : []);

const getProductsFromResponse = (data) => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.products)) return data.products;
  if (data && Array.isArray(data.data)) return data.data;
  return [];
};

const useStore = create(
  persist(
    (set, get) => ({
      // --- الحالة (State) ---
      user: null,
      products: [],
      bundles: [],
      cart: [],
      orders: [],
      returns: [],
      searchQuery: '',
      darkMode: false,
      selectedCategory: 'all',
      discount: 0,
      appliedCoupon: null,
      isSideNavOpen: false,
      isAdminAuthenticated: false,

      // --- الوظائف الجديدة للمرتجعات ---
      setReturns: (data) => set({ returns: normalizeArray(data) }),

      clearReturnsFromDB: async () => {
        try {
          const response = await axios.delete('[http://electronic-api.atwebpages.com](http://electronic-api.atwebpages.com)/delete_order.php');
          if (response.data.status === 'success') {
            set({ returns: [] });
            return { success: true, message: response.data.message };
          }
          return { success: false, message: response.data.message };
        } catch (error) {
          console.error("Clear Returns Error:", error);
          return { success: false, message: "خطأ في الاتصال بالسيرفر" };
        }
      },

      addProduct: async (productData) => {
        try {
          const response = await axios.post('[http://electronic-api.atwebpages.com](http://electronic-api.atwebpages.com)/admin_products.php', productData);
          if (response.data.status === 'success') {
            return { success: true, message: response.data.message };
          } else {
            return { success: false, message: response.data.message || "فشل إضافة المنتج" };
          }
        } catch (error) {
          console.error("Add Product Error:", error);
          return { success: false, message: "خطأ في الاتصال بالسيرفر" };
        }
      },

      // --- وظائف الباندلز (Bundles) ---
      fetchBundles: async () => {
        try {
          const response = await axios.get('[http://electronic-api.atwebpages.com](http://electronic-api.atwebpages.com)/admin_bundles.php');
          set({ bundles: Array.isArray(response.data) ? response.data : [] });
        } catch (error) {
          console.error("Fetch Bundles Error:", error);
          set({ bundles: [] });
        }
      },

      addBundle: async (bundleData) => {
        try {
          const response = await axios.post('[http://electronic-api.atwebpages.com](http://electronic-api.atwebpages.com)/admin_bundles.php', bundleData);
          if (response.data.status === 'success') {
            get().fetchBundles();
            return { success: true, message: response.data.message };
          }
          return { success: false, message: response.data.message };
        } catch (error) {
          console.error("Add Bundle Error:", error);
          return { success: false, message: "خطأ في الاتصال بالسيرفر" };
        }
      },

      deleteBundle: async (bundleId) => {
        try {
          const response = await axios.post(`[http://electronic-api.atwebpages.com](http://electronic-api.atwebpages.com)/admin_bundles.php`, {
            action: 'delete',
            id: bundleId
          });
          if (response.data.status === 'success') {
            set((state) => ({
              bundles: state.bundles.filter(b => String(b.id) !== String(bundleId))
            }));
            return { success: true };
          } else {
            return { success: false, message: response.data.message };
          }
        } catch (error) {
          console.error("Network Error:", error);
          return { success: false, message: "مشكلة في الاتصال بالسيرفر" };
        }
      },

      updateProduct: async (productData) => {
        try {
          const response = await axios.put('[http://electronic-api.atwebpages.com](http://electronic-api.atwebpages.com)/admin_products.php', productData);
          if (response.data.status === 'success') {
            return { success: true, message: response.data.message };
          }
          return { success: false, message: response.data.message };
        } catch (error) {
          return { success: false, message: "خطأ في الاتصال بالسيرفر" };
        }
      },

      // --- وظيفة الكوبونات ---
      applyCoupon: (code) => {
        const coupons = { 'SAVE10': 10, 'MIS20': 20, 'OFFER50': 50, 'SHOPY15': 15 };
        const discountValue = coupons[code.toUpperCase()];
        if (discountValue !== undefined) {
          set({ discount: discountValue, appliedCoupon: code.toUpperCase() });
          return { success: true, message: `تم تطبيق خصم ${discountValue}% بنجاح!` };
        } else {
          set({ discount: 0, appliedCoupon: null });
          return { success: false, message: 'كود الخصم غير صحيح' };
        }
      },


placeOrder: async (orderDetails) => {
  const currentUser = get().user;
  const currentCart = get().cart;
  const currentDiscount = get().discount || 0; 

  if (!currentUser || !currentUser.id) return { success: false, message: "يجب تسجيل الدخول" };
  if (currentCart.length === 0) return { success: false, message: "السلة فارغة" };

  // حساب المجموع الأصلي
  const subtotal = currentCart.reduce((acc, item) => {
    return acc + (parseFloat(item.price || 0) * parseInt(item.quantity || 1));
  }, 0);

  // الحسبة الصحيحة للخصم (قسمة على 100)
  const discountAmount = (subtotal * currentDiscount) / 100;
  const finalTotal = subtotal - discountAmount;

  try {
    const response = await axios.post('[http://electronic-api.atwebpages.com](http://electronic-api.atwebpages.com)/place_order.php', {
      ...orderDetails,
      user_id: currentUser.id,
      total_price: finalTotal.toFixed(2), 
      items: currentCart.map(item => ({
        id: item.id,
        price: item.price,
        quantity: item.quantity,
        title: item.title // تأكد من إرسال العنوان لحساب المجموع في البروفايل لاحقاً
      }))
    });

    if (response.data.status === 'success') {
      set({ cart: [], discount: 0, appliedCoupon: null });
      get().fetchUserOrdersFromDB(currentUser.id);
      return { success: true, message: "تم الطلب بنجاح" };
    }
    return { success: false, message: response.data.message };
  } catch (error) {
    return { success: false, message: "خطأ في الاتصال بالسيرفر" };
  }
},

      // --- وظائف الأدمن ---
      loginAdmin: (username, password) => {
        if (username === 'admin' && password === 'admin123') {
          set({ isAdminAuthenticated: true });
          return { success: true, message: 'تم تسجيل دخول الأدمن بنجاح' };
        } else {
          return { success: false, message: 'بيانات الدخول غير صحيحة' };
        }
      },

      logoutAdmin: () => set({ isAdminAuthenticated: false }),

      fetchAllOrdersFromDB: async () => {
        try {
          const response = await axios.get('[http://electronic-api.atwebpages.com](http://electronic-api.atwebpages.com)/get_all_orders.php');
          set({ orders: Array.isArray(response.data) ? response.data : [] });
        } catch (error) {
          console.error("Fetch All Orders Error:", error);
          set({ orders: [] });
        }
      },

// تأكد من وجود/تعديل هذه الدالة في الـ Store
updateOrderStatus: async (orderId, newStatus) => {
  try {
    const response = await axios.post('[http://electronic-api.atwebpages.com](http://electronic-api.atwebpages.com)/update_order_status.php', {
      order_id: orderId,
      status: newStatus // هنا لما نبعت 'delivered' هيروح للمبيعات
    });
    
    if (response.data.status === 'success') {
      set((state) => ({
        orders: state.orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
      }));
      return { success: true };
    }
  } catch (error) {
    console.error("Update Status Error:", error);
    return { success: false };
  }
},

      deleteOrder: async (orderId) => {
        try {
          const orderToReturn = get().orders.find(o => o.id === orderId);
          const response = await axios.post('[http://electronic-api.atwebpages.com](http://electronic-api.atwebpages.com)/delete_order.php', {
            order_id: orderId
          });
          if (response.data.status === 'success') {
            set((state) => ({
              orders: state.orders.filter(o => o.id !== orderId),
              returns: orderToReturn 
                ? [...state.returns, { ...orderToReturn, return_date: new Date().toLocaleString() }] 
                : state.returns
            }));
          }
        } catch (error) {
          console.error("Delete Order Error:", error);
        }
      },

      // --- وظائف المستخدم والبروفايل ---
      setUser: (userData) => set({ user: userData }),
      addFatherName: (name) => set((state) => ({ user: { ...state.user, father_name: name } })),
      addBirthday: (date) => set((state) => ({ user: { ...state.user, birthday: date } })),

      updateProfileOnServer: async (updatedData) => {
        try {
          const currentUser = get().user;
          if (!currentUser) return { success: false, message: "لم يتم العثور على مستخدم" };
          const response = await axios.post('[http://electronic-api.atwebpages.com](http://electronic-api.atwebpages.com)/update_profile.php', {
            id: currentUser.id,
            ...updatedData 
          });
          if (response.data.success) {
            set((state) => ({
              user: state.user ? { ...state.user, ...updatedData } : null
            }));
            return { success: true, message: response.data.message };
          }
          return { success: false, message: response.data.message };
        } catch (error) {
          return { success: false, message: "خطأ في الاتصال بالسيرفر" };
        }
      },

      logout: () => {
        set({ user: null, cart: [], orders: [], returns: [], discount: 0, appliedCoupon: null });
        localStorage.removeItem('shopify-storage');
      },

      // --- جلب البيانات ---
      fetchProductsFromDB: async () => {
        try {
          const response = await axios.get('[http://electronic-api.atwebpages.com](http://electronic-api.atwebpages.com)/get_products.php');
          set({ products: getProductsFromResponse(response.data) });
        } catch (error) {
          set({ products: [] });
        }
      },

      fetchUserOrdersFromDB: async (userId) => {
        try {
          const response = await axios.get(`[http://electronic-api.atwebpages.com](http://electronic-api.atwebpages.com)/get_user_orders.php?user_id=${userId}`);
          set({ orders: Array.isArray(response.data) ? response.data : [] });
        } catch (error) {
          console.error("Fetch User Orders Error:", error);
        }
      },

      clearCart: () => set({ cart: [], discount: 0, appliedCoupon: null }),

      // --- وظائف السلة الأساسية ---
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

      // --- واجهة المستخدم ---
      toggleSideNav: () => set((state) => ({ isSideNavOpen: !state.isSideNavOpen })),
      closeSideNav: () => set({ isSideNavOpen: false }),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      resetDiscount: () => set({ discount: 0, appliedCoupon: null }),
    }),
    {
      name: 'shopify-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.products = normalizeArray(state.products);
          state.bundles = normalizeArray(state.bundles);
          state.cart = normalizeArray(state.cart);
          state.orders = normalizeArray(state.orders);
          state.returns = normalizeArray(state.returns);
          if (state.user) {
            state.user.father_name = state.user.father_name || '';
            state.user.birthday = state.user.birthday || '';
          }
        }
      },
    }
  )
);

export default useStore;