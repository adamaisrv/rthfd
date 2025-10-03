import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, RotateCcw, Bell, Palette, Monitor, Shield, Database } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Settings() {
  const { settings, updateSettings, resetSettings } = useStore();
  const [localSettings, setLocalSettings] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (category, key, value) => {
    let newSettings;
    
    if (key === null) {
      // Top-level property (like currency, language)
      newSettings = {
        ...localSettings,
        [category]: value
      };
    } else {
      // Nested property (like notifications.sound, security.autoLockTime)
      newSettings = {
        ...localSettings,
        [category]: {
          ...localSettings[category],
          [key]: value
        }
      };
    }
    
    setLocalSettings(newSettings);
    setHasChanges(true);
  };

  const handleSave = () => {
    updateSettings(localSettings);
    setHasChanges(false);
    
    // Show success message
    const event = new CustomEvent('show-toast', {
      detail: {
        title: 'تم الحفظ',
        message: 'تم حفظ الإعدادات بنجاح',
        type: 'success'
      }
    });
    window.dispatchEvent(event);
  };

  const handleReset = () => {
    if (window.confirm('هل أنت متأكد من إعادة تعيين جميع الإعدادات؟')) {
      resetSettings();
      setLocalSettings(settings);
      setHasChanges(false);
      
      // Show success message
      const event = new CustomEvent('show-toast', {
        detail: {
          title: 'تم إعادة التعيين',
          message: 'تم إعادة تعيين الإعدادات إلى القيم الافتراضية',
          type: 'info'
        }
      });
      window.dispatchEvent(event);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            الإعدادات
          </h1>
          <p className="text-gray-600 text-lg">تخصيص التطبيق حسب احتياجاتك</p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleReset}
            className="group bg-gradient-to-r from-gray-500 to-slate-600 text-white px-6 py-3 rounded-xl flex items-center gap-3 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-out font-medium"
          >
            <RotateCcw className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
            إعادة تعيين
          </button>

          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="group bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl flex items-center gap-3 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-out font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Save className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
            حفظ التغييرات
          </button>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* General Settings */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <SettingsIcon className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">الإعدادات العامة</h2>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">العملة</label>
              <select
                value={localSettings.currency}
                onChange={(e) => handleSettingChange('currency', null, e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
              >
                <option value="SAR">ريال سعودي (ر.س)</option>
                <option value="USD">دولار أمريكي ($)</option>
                <option value="EUR">يورو (€)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">اللغة</label>
              <select
                value={localSettings.language}
                onChange={(e) => handleSettingChange('language', null, e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
              >
                <option value="ar">العربية</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Bell className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">إعدادات الإشعارات</h2>
            </div>
          </div>
          <div className="p-6 space-y-6">
            {Object.entries(localSettings.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  {key === 'sound' && 'تفعيل الأصوات'}
                  {key === 'browser' && 'إشعارات المتصفح'}
                  {key === 'email' && 'إشعارات البريد الإلكتروني'}
                  {key === 'lowStock' && 'تنبيهات المخزون المنخفض'}
                  {key === 'expiry' && 'تنبيهات انتهاء الصلاحية'}
                </label>
                <button
                  onClick={() => handleSettingChange('notifications', key, !value)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Display Settings */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Monitor className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">إعدادات العرض</h2>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">عدد العناصر في كل صفحة</label>
              <select
                value={localSettings.display.itemsPerPage}
                onChange={(e) => handleSettingChange('display', 'itemsPerPage', parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">تفعيل الحركات والتأثيرات</label>
              <button
                onClick={() => handleSettingChange('display', 'showAnimations', !localSettings.display.showAnimations)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.display.showAnimations ? 'bg-purple-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.display.showAnimations ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">الوضع المضغوط</label>
              <button
                onClick={() => handleSettingChange('display', 'compactMode', !localSettings.display.compactMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.display.compactMode ? 'bg-purple-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.display.compactMode ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">إعدادات الأمان</h2>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">وقت القفل التلقائي (دقيقة)</label>
              <select
                value={localSettings.security.autoLockTime}
                onChange={(e) => handleSettingChange('security', 'autoLockTime', e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all duration-300"
              >
                <option value="15">15 دقيقة</option>
                <option value="30">30 دقيقة</option>
                <option value="60">ساعة واحدة</option>
                <option value="never">عدم القفل</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">تذكر تسجيل الدخول</label>
              <button
                onClick={() => handleSettingChange('security', 'rememberLogin', !localSettings.security.rememberLogin)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.security.rememberLogin ? 'bg-red-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.security.rememberLogin ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">تشفير البيانات المحلية</label>
              <button
                onClick={() => handleSettingChange('security', 'encryption', !localSettings.security.encryption)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.security.encryption ? 'bg-red-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.security.encryption ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Backup Settings */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Database className="h-4 w-4 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">إعدادات النسخ الاحتياطي</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">النسخ الاحتياطي التلقائي</label>
              <button
                onClick={() => handleSettingChange('backup', 'autoBackup', !localSettings.backup.autoBackup)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.backup.autoBackup ? 'bg-indigo-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.backup.autoBackup ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">فترة النسخ الاحتياطي</label>
              <select
                value={localSettings.backup.backupInterval}
                onChange={(e) => handleSettingChange('backup', 'backupInterval', e.target.value)}
                disabled={!localSettings.backup.autoBackup}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="daily">يومياً</option>
                <option value="weekly">أسبوعياً</option>
                <option value="monthly">شهرياً</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}