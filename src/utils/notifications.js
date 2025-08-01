// Notification utilities for browser notifications and sounds

export class NotificationManager {
  constructor() {
    this.permission = 'default';
    this.sounds = {
      success: '/sounds/success.mp3',
      warning: '/sounds/warning.mp3',
      error: '/sounds/error.mp3',
      info: '/sounds/info.mp3'
    };
    this.init();
  }

  async init() {
    // Request notification permission
    if ('Notification' in window) {
      this.permission = await Notification.requestPermission();
    }
  }

  // Play notification sound
  playSound(type = 'info') {
    try {
      // Create audio using Web Audio API for better control
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Generate different tones for different notification types
      const frequencies = {
        success: [523.25, 659.25, 783.99], // C5, E5, G5 (major chord)
        warning: [440, 554.37], // A4, C#5 (warning tone)
        error: [220, 277.18], // A3, C#4 (lower warning)
        info: [523.25, 698.46] // C5, F5 (pleasant tone)
      };

      const freq = frequencies[type] || frequencies.info;
      
      freq.forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = 'sine';
        
        // Set volume and fade out
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        // Play with slight delay for chord effect
        oscillator.start(audioContext.currentTime + index * 0.1);
        oscillator.stop(audioContext.currentTime + 0.5 + index * 0.1);
      });
    } catch (error) {
      console.warn('Could not play notification sound:', error);
    }
  }

  // Show browser notification
  showBrowserNotification(title, message, type = 'info', options = {}) {
    if (this.permission !== 'granted') {
      return false;
    }

    const icons = {
      success: '✅',
      warning: '⚠️',
      error: '❌',
      info: 'ℹ️'
    };

    const notification = new Notification(title, {
      body: message,
      icon: `/icons/${type}.png`, // You can add actual icon files
      badge: '/icons/badge.png',
      tag: `inventory-${type}`,
      requireInteraction: type === 'error' || type === 'warning',
      silent: false,
      ...options
    });

    // Auto close after 5 seconds for non-critical notifications
    if (type === 'success' || type === 'info') {
      setTimeout(() => notification.close(), 5000);
    }

    return notification;
  }

  // Show complete notification (sound + browser notification + in-app + toast)
  notify(title, message, type = 'info', options = {}) {
    // Play sound
    if (options.playSound !== false) {
      this.playSound(type);
    }

    // Show browser notification
    if (options.showBrowser !== false) {
      this.showBrowserNotification(title, message, type, options);
    }

    // Show toast notification
    if (options.showToast !== false) {
      const event = new CustomEvent('show-toast', {
        detail: {
          title,
          message,
          type,
          duration: options.duration || 5000,
          ...options
        }
      });
      window.dispatchEvent(event);
    }

    return {
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      ...options
    };
  }

  // Specific notification methods
  success(title, message, options = {}) {
    return this.notify(title, message, 'success', options);
  }

  warning(title, message, options = {}) {
    return this.notify(title, message, 'warning', options);
  }

  error(title, message, options = {}) {
    return this.notify(title, message, 'error', options);
  }

  info(title, message, options = {}) {
    return this.notify(title, message, 'info', options);
  }
}

// Create singleton instance
export const notificationManager = new NotificationManager();

// Inventory-specific notification helpers
export const inventoryNotifications = {
  lowStock: (productName, currentQuantity, minQuantity) => {
    return notificationManager.warning(
      'تنبيه مخزون منخفض',
      `${productName} - الكمية الحالية: ${currentQuantity} (الحد الأدنى: ${minQuantity})`,
      {
        requireInteraction: true,
        actions: [
          { action: 'reorder', title: 'طلب تموين' },
          { action: 'dismiss', title: 'تجاهل' }
        ]
      }
    );
  },

  expiringProduct: (productName, daysUntilExpiry) => {
    return notificationManager.warning(
      'تنبيه انتهاء صلاحية',
      `${productName} - ينتهي خلال ${daysUntilExpiry} يوم`,
      {
        requireInteraction: true,
        actions: [
          { action: 'mark-sale', title: 'تخفيض للبيع' },
          { action: 'dismiss', title: 'تجاهل' }
        ]
      }
    );
  },

  productAdded: (productName) => {
    return notificationManager.success(
      'تم إضافة منتج جديد',
      `تم إضافة ${productName} بنجاح إلى المخزون`
    );
  },

  productUpdated: (productName) => {
    return notificationManager.info(
      'تم تحديث المنتج',
      `تم تحديث بيانات ${productName} بنجاح`
    );
  },

  productDeleted: (productName) => {
    return notificationManager.warning(
      'تم حذف المنتج',
      `تم حذف ${productName} من المخزون`,
      { playSound: false } // No sound for deletions
    );
  },

  stockUpdated: (productName, oldQuantity, newQuantity) => {
    const difference = newQuantity - oldQuantity;
    const action = difference > 0 ? 'إضافة' : 'سحب';
    
    return notificationManager.info(
      `${action} مخزون`,
      `${productName}: ${oldQuantity} → ${newQuantity} (${difference > 0 ? '+' : ''}${difference})`
    );
  },

  criticalStock: (productName, currentQuantity) => {
    return notificationManager.error(
      'تحذير: مخزون حرج',
      `${productName} - الكمية المتبقية: ${currentQuantity} فقط!`,
      {
        requireInteraction: true,
        playSound: true,
        actions: [
          { action: 'urgent-reorder', title: 'طلب عاجل' },
          { action: 'dismiss', title: 'تجاهل' }
        ]
      }
    );
  }
};

// Auto-check function for periodic notifications
export const checkInventoryAlerts = (products) => {
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
  const sevenDaysFromNow = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));

  products.forEach(product => {
    // Check for critical stock (0 quantity)
    if (product.quantity === 0) {
      inventoryNotifications.criticalStock(product.name, product.quantity);
    }
    // Check for low stock
    else if (product.quantity <= product.minQuantity) {
      inventoryNotifications.lowStock(product.name, product.quantity, product.minQuantity);
    }

    // Check for expiring products
    if (product.expiryDate) {
      const expiryDate = new Date(product.expiryDate);
      
      if (expiryDate <= sevenDaysFromNow && expiryDate > now) {
        const daysUntilExpiry = Math.ceil((expiryDate - now) / (24 * 60 * 60 * 1000));
        inventoryNotifications.expiringProduct(product.name, daysUntilExpiry);
      }
    }
  });
};

export default notificationManager;
