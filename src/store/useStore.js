import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { inventoryNotifications, checkInventoryAlerts } from '../utils/notifications';

// Default settings object
const defaultSettings = {
  currency: 'SAR',
  language: 'ar',
  notifications: {
    sound: true,
    browser: true,
    email: false,
    lowStock: true,
    expiry: true
  },
  colors: {
    primary: '#3B82F6',
    secondary: '#8B5CF6',
    accent: '#10B981',
    success: '#059669',
    warning: '#D97706',
    error: '#DC2626',
    info: '#0EA5E9'
  },
  display: {
    itemsPerPage: 10,
    showAnimations: true,
    compactMode: false
  },
  security: {
    autoLockTime: '30',
    rememberLogin: true,
    encryption: false
  },
  backup: {
    autoBackup: true,
    backupInterval: 'daily'
  }
};

// Initial sample data
const initialProducts = [
  { 
    id: 1, 
    name: 'لابتوب Dell', 
    code: 'LAP001', 
    category: 'electronics', 
    quantity: 15, 
    price: 2500, 
    expiryDate: '2025-12-31',
    location: 'رف A - مستوى 1',
    minQuantity: 5,
    supplier: 'شركة التقنية المتقدمة',
    description: 'لابتوب Dell Inspiron 15 - معالج Intel Core i5',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  { 
    id: 2, 
    name: 'ماوس لاسلكي', 
    code: 'MOU001', 
    category: 'electronics', 
    quantity: 50, 
    price: 75, 
    expiryDate: '2026-06-15',
    location: 'رف B - مستوى 2',
    minQuantity: 10,
    supplier: 'مؤسسة الإلكترونيات',
    description: 'ماوس لاسلكي بتقنية Bluetooth',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Notifications store
const useNotificationStore = create((set, get) => ({
  notifications: [],
  
  addNotification: (notification) => set((state) => ({
    notifications: [
      ...state.notifications,
      {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        read: false,
        ...notification
      }
    ]
  })),
  
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    )
  })),
  
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(notif => notif.id !== id)
  })),
  
  clearAllNotifications: () => set({ notifications: [] }),
  
  getUnreadCount: () => {
    const { notifications } = get();
    return notifications.filter(notif => !notif.read).length;
  }
}));

// Main store with persistence
const useStore = create(
  persist(
    (set, get) => ({
      // Products state
      products: initialProducts,

      // Settings state
      settings: {
        currency: 'SAR',
        language: 'ar',
        theme: 'light',
        notifications: {
          sound: true,
          browser: true,
          email: false,
          lowStock: true,
          expiry: true
        },
        colors: {
          primary: '#3B82F6',
          secondary: '#8B5CF6',
          accent: '#10B981',
          success: '#059669',
          warning: '#D97706',
          error: '#DC2626',
          info: '#0EA5E9'
        },
        display: {
          itemsPerPage: 10,
          showAnimations: true,
          compactMode: false
        },
        security: {
          autoLockTime: '30',
          rememberLogin: true,
          encryption: false
        },
        backup: {
          autoBackup: true,
          backupInterval: 'daily'
        }
      },
      
      // UI state
      sidebarOpen: false,
      theme: 'light',
      language: 'ar',
      
      // Search and filters
      searchTerm: '',
      categoryFilter: '',
      sortBy: 'name',
      sortOrder: 'asc',
      
      // Modal states
      productModalOpen: false,
      editingProduct: null,
      
      // Statistics (computed)
      getStats: () => {
        const { products } = get();
        const totalProducts = products.length;
        const totalQuantity = products.reduce((sum, product) => sum + parseInt(product.quantity), 0);
        const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
        const lowStockProducts = products.filter(product => product.quantity <= product.minQuantity);
        
        return {
          totalProducts,
          totalQuantity,
          totalValue,
          lowStockCount: lowStockProducts.length,
          lowStockProducts
        };
      },
      
      // Product actions
      addProduct: (productData) => {
        const newProduct = {
          id: Date.now(),
          ...productData,
          quantity: parseInt(productData.quantity),
          price: parseFloat(productData.price),
          minQuantity: parseInt(productData.minQuantity),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        set((state) => ({
          products: [...state.products, newProduct]
        }));
        
        // Add notification with sound and browser notification
        const notification = inventoryNotifications.productAdded(newProduct.name);
        useNotificationStore.getState().addNotification(notification);
        
        return newProduct;
      },
      
      updateProduct: (id, productData) => {
        const updatedProduct = {
          ...productData,
          id,
          quantity: parseInt(productData.quantity),
          price: parseFloat(productData.price),
          minQuantity: parseInt(productData.minQuantity),
          updatedAt: new Date().toISOString()
        };
        
        set((state) => ({
          products: state.products.map(product => 
            product.id === id ? updatedProduct : product
          )
        }));
        
        // Add notification with sound and browser notification
        const notification = inventoryNotifications.productUpdated(updatedProduct.name);
        useNotificationStore.getState().addNotification(notification);
        
        return updatedProduct;
      },
      
      deleteProduct: (id) => {
        const product = get().products.find(p => p.id === id);
        
        set((state) => ({
          products: state.products.filter(product => product.id !== id)
        }));
        
        // Add notification with sound and browser notification
        const notification = inventoryNotifications.productDeleted(product?.name);
        useNotificationStore.getState().addNotification(notification);
      },
      
      // Search and filter actions
      setSearchTerm: (term) => set({ searchTerm: term }),
      setCategoryFilter: (category) => set({ categoryFilter: category }),
      setSortBy: (field) => set({ sortBy: field }),
      setSortOrder: (order) => set({ sortOrder: order }),
      
      // Get filtered products
      getFilteredProducts: () => {
        const { products, searchTerm, categoryFilter, sortBy, sortOrder } = get();
        
        let filtered = products.filter(product => {
          const matchesSearch = !searchTerm || 
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.code.toLowerCase().includes(searchTerm.toLowerCase());
          
          const matchesCategory = !categoryFilter || product.category === categoryFilter;
          
          return matchesSearch && matchesCategory;
        });
        
        // Sort products
        filtered.sort((a, b) => {
          let aValue = a[sortBy];
          let bValue = b[sortBy];
          
          if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
          }
          
          if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });
        
        return filtered;
      },
      
      // Modal actions
      openProductModal: (product = null) => set({ 
        productModalOpen: true, 
        editingProduct: product 
      }),
      
      closeProductModal: () => set({ 
        productModalOpen: false, 
        editingProduct: null 
      }),
      
      // UI actions
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      
      // Inventory actions
      updateStock: (id, newQuantity, reason = '') => {
        const product = get().products.find(p => p.id === id);
        if (!product) return;
        
        const oldQuantity = product.quantity;
        const difference = newQuantity - oldQuantity;
        
        set((state) => ({
          products: state.products.map(p => 
            p.id === id ? { ...p, quantity: newQuantity, updatedAt: new Date().toISOString() } : p
          )
        }));
        
        // Add notification with sound and browser notification
        const notification = inventoryNotifications.stockUpdated(product.name, oldQuantity, newQuantity);
        useNotificationStore.getState().addNotification(notification);
      },
      
      // Check for low stock and expiring products with advanced notifications
      checkAlerts: () => {
        const { products } = get();
        checkInventoryAlerts(products);
      },

      // Manual alert check with notification storage
      runAlertCheck: () => {
        const { products } = get();
        const alerts = [];

        products.forEach(product => {
          // Critical stock (0 quantity)
          if (product.quantity === 0) {
            const notification = inventoryNotifications.criticalStock(product.name, product.quantity);
            alerts.push(notification);
            useNotificationStore.getState().addNotification(notification);
          }
          // Low stock
          else if (product.quantity <= product.minQuantity) {
            const notification = inventoryNotifications.lowStock(product.name, product.quantity, product.minQuantity);
            alerts.push(notification);
            useNotificationStore.getState().addNotification(notification);
          }

          // Expiring products
          if (product.expiryDate) {
            const now = new Date();
            const expiryDate = new Date(product.expiryDate);
            const sevenDaysFromNow = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));

            if (expiryDate <= sevenDaysFromNow && expiryDate > now) {
              const daysUntilExpiry = Math.ceil((expiryDate - now) / (24 * 60 * 60 * 1000));
              const notification = inventoryNotifications.expiringProduct(product.name, daysUntilExpiry);
              alerts.push(notification);
              useNotificationStore.getState().addNotification(notification);
            }
          }
        });

        return alerts;
      },

      // Settings actions
      updateSettings: (newSettings) => {
        console.log('Updating settings:', newSettings); // Debug log
        set({ settings: newSettings });
        
        // Force theme application
        if (newSettings.theme) {
          setTimeout(() => {
            const event = new CustomEvent('settings-updated', { detail: newSettings });
            window.dispatchEvent(event);
          }, 50);
        }
      },

      resetSettings: () => {
        const defaultSettings = {
          currency: 'SAR',
          language: 'ar',
          theme: 'light',
          notifications: {
            sound: true,
            browser: true,
            email: false,
            lowStock: true,
            expiry: true
          },
          colors: {
            primary: '#3B82F6',
            secondary: '#8B5CF6',
            accent: '#10B981',
            success: '#059669',
            warning: '#D97706',
            error: '#DC2626',
            info: '#0EA5E9'
          },
          display: {
            itemsPerPage: 10,
            showAnimations: true,
            compactMode: false
          },
          security: {
            autoLockTime: '30',
            rememberLogin: true,
            encryption: false
          },
          backup: {
            autoBackup: true,
            backupInterval: 'daily'
          }
        };
        set({ settings: defaultSettings });
      },

      updateColorScheme: (colors) => {
        set(state => ({
          settings: {
            ...state.settings,
            colors: { ...state.settings.colors, ...colors }
          }
        }));
      }
    }),
    {
      name: 'inventory-store',
      storage: createJSONStorage(() => localStorage),
      merge: (persistedState, currentState) => {
        // Deep merge function to ensure all default properties are present
        const deepMerge = (target, source) => {
          const result = { ...target };
          for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
              result[key] = deepMerge(target[key] || {}, source[key]);
            } else {
              result[key] = source[key];
            }
          }
          return result;
        };
        
        return {
          ...currentState,
          ...persistedState,
          settings: deepMerge(defaultSettings, persistedState?.settings || {})
        };
      },
      partialize: (state) => ({
        products: state.products,
        settings: state.settings,
        language: state.language
      })
    }
  )
);

export { useStore, useNotificationStore };
