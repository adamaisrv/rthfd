import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

const Toast = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 100);

    // Auto remove after duration
    const timer = setTimeout(() => {
      handleRemove();
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(toast.id);
    }, 300);
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getColors = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div
      className={`transform transition-all duration-300 ease-out ${
        isVisible && !isRemoving
          ? 'translate-x-0 opacity-100 scale-100'
          : 'translate-x-full opacity-0 scale-95'
      }`}
    >
      <div className={`max-w-sm w-full ${getColors()} border rounded-xl shadow-lg p-4 mb-3`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          <div className="mr-3 flex-1">
            <h4 className="text-sm font-semibold">{toast.title}</h4>
            {toast.message && (
              <p className="text-sm mt-1 opacity-90">{toast.message}</p>
            )}
          </div>
          <button
            onClick={handleRemove}
            className="flex-shrink-0 mr-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="mt-3 w-full bg-white/30 rounded-full h-1">
          <div
            className={`h-1 rounded-full transition-all duration-${toast.duration || 5000} ease-linear ${
              toast.type === 'success' ? 'bg-green-500' :
              toast.type === 'warning' ? 'bg-yellow-500' :
              toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
            }`}
            style={{
              width: isVisible ? '0%' : '100%',
              transition: `width ${toast.duration || 5000}ms linear`
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  // Listen for custom toast events
  useEffect(() => {
    const handleToast = (event) => {
      const toast = {
        id: Date.now() + Math.random(),
        ...event.detail
      };
      setToasts(prev => [...prev, toast]);
    };

    window.addEventListener('show-toast', handleToast);
    return () => window.removeEventListener('show-toast', handleToast);
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <div className="fixed top-4 left-4 z-[9999] space-y-2">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          toast={toast}
          onRemove={removeToast}
        />
      ))}
    </div>
  );
}

// Helper function to show toasts
export const showToast = (title, message, type = 'info', options = {}) => {
  const event = new CustomEvent('show-toast', {
    detail: {
      title,
      message,
      type,
      duration: 5000,
      ...options
    }
  });
  window.dispatchEvent(event);
};
