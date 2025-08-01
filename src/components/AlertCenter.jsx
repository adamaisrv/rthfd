import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, Volume2, VolumeX, Settings, Play, RefreshCw } from 'lucide-react';
import { useStore } from '../store/useStore';
import { notificationManager } from '../utils/notifications';

export default function AlertCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoCheck, setAutoCheck] = useState(true);
  const [checkInterval, setCheckInterval] = useState(30); // minutes
  
  const { getStats, runAlertCheck } = useStore();
  const stats = getStats();

  // Auto-check alerts periodically
  useEffect(() => {
    if (!autoCheck) return;

    const interval = setInterval(() => {
      runAlertCheck();
    }, checkInterval * 60 * 1000); // Convert minutes to milliseconds

    return () => clearInterval(interval);
  }, [autoCheck, checkInterval, runAlertCheck]);

  // Manual alert check
  const handleManualCheck = () => {
    const alerts = runAlertCheck();
    
    if (alerts.length === 0) {
      notificationManager.success(
        'فحص التنبيهات',
        'جميع المنتجات في حالة جيدة ✅',
        { playSound: soundEnabled }
      );
    } else {
      notificationManager.info(
        'فحص التنبيهات',
        `تم العثور على ${alerts.length} تنبيه`,
        { playSound: soundEnabled }
      );
    }
  };

  // Test notification sounds
  const testSound = (type) => {
    notificationManager.notify(
      'اختبار الصوت',
      `اختبار صوت ${type}`,
      type,
      { showBrowser: false, playSound: soundEnabled }
    );
  };

  const alertLevels = [
    {
      level: 'critical',
      count: stats.lowStockProducts.filter(p => p.quantity === 0).length,
      title: 'مخزون منتهي',
      color: 'bg-red-500',
      textColor: 'text-red-700',
      bgColor: 'bg-red-50'
    },
    {
      level: 'warning',
      count: stats.lowStockProducts.filter(p => p.quantity > 0 && p.quantity <= p.minQuantity).length,
      title: 'مخزون منخفض',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-700',
      bgColor: 'bg-yellow-50'
    },
    {
      level: 'info',
      count: stats.lowStockProducts.filter(p => {
        if (!p.expiryDate) return false;
        const now = new Date();
        const expiryDate = new Date(p.expiryDate);
        const sevenDaysFromNow = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));
        return expiryDate <= sevenDaysFromNow && expiryDate > now;
      }).length,
      title: 'منتهي الصلاحية قريباً',
      color: 'bg-blue-500',
      textColor: 'text-blue-700',
      bgColor: 'bg-blue-50'
    }
  ];

  const totalAlerts = alertLevels.reduce((sum, level) => sum + level.count, 0);

  return (
    <div className="relative">
      {/* Alert Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/20"
      >
        <AlertTriangle className={`h-6 w-6 ${totalAlerts > 0 ? 'text-red-500 animate-pulse' : 'text-gray-600'}`} />
        {totalAlerts > 0 && (
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center animate-bounce">
            <span className="text-white text-xs font-bold">
              {totalAlerts > 9 ? '9+' : totalAlerts}
            </span>
          </div>
        )}
      </button>

      {/* Alert Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Panel */}
          <div className="absolute top-full left-0 mt-2 w-96 bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/20 z-[99999] alert-panel max-h-96 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-200/50 bg-gradient-to-r from-red-50 to-orange-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">مركز التنبيهات</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleManualCheck}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-300"
                    title="فحص يدوي"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-300"
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Alert Summary */}
            <div className="p-4 space-y-3">
              {alertLevels.map((level) => (
                <div
                  key={level.level}
                  className={`p-3 rounded-xl border transition-all duration-300 ${
                    level.count > 0 
                      ? `${level.bgColor} border-${level.level === 'critical' ? 'red' : level.level === 'warning' ? 'yellow' : 'blue'}-200` 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${level.count > 0 ? level.color : 'bg-gray-300'}`}></div>
                      <span className={`font-medium ${level.count > 0 ? level.textColor : 'text-gray-500'}`}>
                        {level.title}
                      </span>
                    </div>
                    <span className={`font-bold ${level.count > 0 ? level.textColor : 'text-gray-500'}`}>
                      {level.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Settings */}
            <div className="p-4 border-t border-gray-200/50 bg-gray-50/50">
              <div className="space-y-3">
                {/* Sound Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">تفعيل الأصوات</span>
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      soundEnabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </button>
                </div>

                {/* Auto Check Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">فحص تلقائي</span>
                  <button
                    onClick={() => setAutoCheck(!autoCheck)}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      autoCheck ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <Clock className="h-4 w-4" />
                  </button>
                </div>

                {/* Check Interval */}
                {autoCheck && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">فترة الفحص (دقيقة)</span>
                    <select
                      value={checkInterval}
                      onChange={(e) => setCheckInterval(Number(e.target.value))}
                      className="px-2 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={5}>5</option>
                      <option value={15}>15</option>
                      <option value={30}>30</option>
                      <option value={60}>60</option>
                    </select>
                  </div>
                )}

                {/* Test Sounds */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">اختبار الأصوات</span>
                  <div className="flex gap-1">
                    {['success', 'warning', 'error', 'info'].map((type) => (
                      <button
                        key={type}
                        onClick={() => testSound(type)}
                        className="p-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-all duration-300"
                        title={`اختبار ${type}`}
                      >
                        <Play className="h-3 w-3" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
