import React, { useState } from 'react';
import { Bell, X, Check, Trash2 } from 'lucide-react';
import { useNotificationStore } from '../store/useStore';

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    notifications, 
    markAsRead, 
    removeNotification, 
    clearAllNotifications,
    getUnreadCount 
  } = useNotificationStore();

  const unreadCount = getUnreadCount();

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success': return 'from-green-50 to-emerald-50 border-green-200';
      case 'warning': return 'from-yellow-50 to-amber-50 border-yellow-200';
      case 'error': return 'from-red-50 to-pink-50 border-red-200';
      case 'info': return 'from-blue-50 to-indigo-50 border-blue-200';
      default: return 'from-gray-50 to-slate-50 border-gray-200';
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20"
      >
        <Bell className="h-6 w-6 text-gray-600" />
        {unreadCount > 0 && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </div>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <div className="absolute top-full left-0 mt-2 w-96 bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/20 z-[99999] notification-panel max-h-96 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-200/50 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">الإشعارات</h3>
                <div className="flex items-center gap-2">
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-all duration-300"
                      title="مسح الكل"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">لا توجد إشعارات</p>
                  <p className="text-gray-400 text-sm">ستظهر الإشعارات هنا عند حدوثها</p>
                </div>
              ) : (
                <div className="p-2 space-y-2">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-xl border transition-all duration-300 hover:shadow-lg ${
                        notification.read 
                          ? 'bg-gray-50 border-gray-200' 
                          : `bg-gradient-to-r ${getNotificationColor(notification.type)}`
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="text-2xl">
                            {notification.icon || getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-sm">
                              {notification.title}
                            </h4>
                            <p className="text-gray-600 text-sm mt-1">
                              {notification.message}
                            </p>
                            <p className="text-gray-400 text-xs mt-2">
                              {new Date(notification.timestamp).toLocaleString('ar-SA')}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 mr-2">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 text-green-600 hover:bg-green-100 rounded-lg transition-all duration-300"
                              title="تحديد كمقروء"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            onClick={() => removeNotification(notification.id)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-300"
                            title="حذف"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
