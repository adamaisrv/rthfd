import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Palette, 
  DollarSign, 
  Globe, 
  Bell, 
  Shield, 
  Database, 
  Download,
  Upload,
  RefreshCw,
  Save,
  RotateCcw,
  Monitor,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Smartphone,
  Mail,
  Lock,
  User,
  Calendar,
  Clock,
  MapPin,
  Languages
} from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Settings() {
  const { settings, updateSettings, resetSettings } = useStore();
  const [activeTab, setActiveTab] = useState('general');
  const [tempSettings, setTempSettings] = useState(settings);
  const [showColorPicker, setShowColorPicker] = useState(null);

  const currencies = [
    { code: 'SAR', symbol: 'ر.س', name: 'ريال سعودي' },
    { code: 'USD', symbol: '$', name: 'دولار أمريكي' },
    { code: 'EUR', symbol: '€', name: 'يورو' },
    { code: 'GBP', symbol: '£', name: 'جنيه إسترليني' },
    { code: 'AED', symbol: 'د.إ', name: 'درهم إماراتي' },
    { code: 'KWD', symbol: 'د.ك', name: 'دينار كويتي' },
    { code: 'QAR', symbol: 'ر.ق', name: 'ريال قطري' },
    { code: 'BHD', symbol: 'د.ب', name: 'دينار بحريني' }
  ];

  const languages = [
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ];

  const themes = [
    { id: 'light', name: 'فاتح', icon: Sun },
    { id: 'dark', name: 'داكن', icon: Moon },
    { id: 'auto', name: 'تلقائي', icon: Monitor }
  ];

  const colorSchemes = {
    primary: { name: 'اللون الأساسي', default: '#3B82F6' },
    secondary: { name: 'اللون الثانوي', default: '#8B5CF6' },
    accent: { name: 'لون التمييز', default: '#10B981' },
    success: { name: 'لون النجاح', default: '#059669' },
    warning: { name: 'لون التحذير', default: '#D97706' },
    error: { name: 'لون الخطأ', default: '#DC2626' },
    info: { name: 'لون المعلومات', default: '#0EA5E9' }
  };

  const handleSettingChange = (key, value) => {
    setTempSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleColorChange = (colorKey, color) => {
    setTempSettings(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorKey]: color
      }
    }));
  };

  const saveSettings = () => {
    updateSettings(tempSettings);
    
    // Apply colors to CSS variables
    Object.entries(tempSettings.colors).forEach(([key, color]) => {
      document.documentElement.style.setProperty(`--color-${key}`, color);
    });

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

  const resetToDefaults = () => {
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
      backup: {
        autoBackup: true,
        backupInterval: 'daily'
      }
    };
    
    setTempSettings(defaultSettings);
    resetSettings();
    
    // Reset CSS variables
    Object.entries(defaultSettings.colors).forEach(([key, color]) => {
      document.documentElement.style.setProperty(`--color-${key}`, color);
    });
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(tempSettings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invex-settings-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importSettings = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target.result);
        setTempSettings(importedSettings);
        
        const event = new CustomEvent('show-toast', {
          detail: {
            title: 'تم الاستيراد',
            message: 'تم استيراد الإعدادات بنجاح',
            type: 'success'
          }
        });
        window.dispatchEvent(event);
      } catch (error) {
        const event = new CustomEvent('show-toast', {
          detail: {
            title: 'خطأ',
            message: 'فشل في استيراد الإعدادات',
            type: 'error'
          }
        });
        window.dispatchEvent(event);
      }
    };
    reader.readAsText(file);
  };

  const tabs = [
    { id: 'general', name: 'عام', icon: SettingsIcon },
    { id: 'appearance', name: 'المظهر', icon: Palette },
    { id: 'notifications', name: 'التنبيهات', icon: Bell },
    { id: 'security', name: 'الأمان', icon: Shield },
    { id: 'backup', name: 'النسخ الاحتياطي', icon: Database }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            الإعدادات
          </h1>
          <p className="text-gray-600 text-lg">تخصيص التطبيق حسب احتياجاتك</p>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={resetToDefaults}
            className="group bg-gradient-to-r from-gray-500 to-slate-600 text-white px-6 py-3 rounded-xl flex items-center gap-3 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-out font-medium"
          >
            <RotateCcw className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
            إعادة تعيين
          </button>
          
          <button
            onClick={saveSettings}
            className="group bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl flex items-center gap-3 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-out font-medium"
          >
            <Save className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
            حفظ الإعدادات
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-2">
            <div className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  {tab.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8">
            
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Globe className="h-6 w-6 text-indigo-600" />
                    الإعدادات العامة
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Currency */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        <DollarSign className="h-4 w-4 inline mr-2" />
                        العملة
                      </label>
                      <select
                        value={tempSettings.currency}
                        onChange={(e) => handleSettingChange('currency', e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 text-gray-900"
                      >
                        {currencies.map(currency => (
                          <option key={currency.code} value={currency.code}>
                            {currency.symbol} - {currency.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Language */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3">
                        <Languages className="h-4 w-4 inline mr-2" />
                        اللغة
                      </label>
                      <select
                        value={tempSettings.language}
                        onChange={(e) => handleSettingChange('language', e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 text-gray-900"
                      >
                        {languages.map(lang => (
                          <option key={lang.code} value={lang.code}>
                            {lang.flag} {lang.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Display Settings */}
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Monitor className="h-5 w-5 text-indigo-600" />
                    إعدادات العرض
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <label className="font-medium text-gray-900">عدد العناصر في الصفحة</label>
                        <p className="text-sm text-gray-600">عدد المنتجات المعروضة في كل صفحة</p>
                      </div>
                      <select
                        value={tempSettings.display?.itemsPerPage || 10}
                        onChange={(e) => handleSettingChange('display', {
                          ...tempSettings.display,
                          itemsPerPage: parseInt(e.target.value)
                        })}
                        className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <label className="font-medium text-gray-900">الأنيميشن والتأثيرات</label>
                        <p className="text-sm text-gray-600">تفعيل الحركات والتأثيرات البصرية</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={tempSettings.display?.showAnimations ?? true}
                          onChange={(e) => handleSettingChange('display', {
                            ...tempSettings.display,
                            showAnimations: e.target.checked
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <label className="font-medium text-gray-900">الوضع المضغوط</label>
                        <p className="text-sm text-gray-600">عرض أكثر كثافة للمعلومات</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={tempSettings.display?.compactMode ?? false}
                          onChange={(e) => handleSettingChange('display', {
                            ...tempSettings.display,
                            compactMode: e.target.checked
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <Palette className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    المظهر والألوان
                  </h3>

                  {/* Theme Selection */}

                  {/* Color Customization */}
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">تخصيص الألوان</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(colorSchemes).map(([key, config]) => (
                        <div key={key} className="p-4 bg-gray-50 dark:bg-slate-700 rounded-xl">
                          <div className="flex items-center justify-between">
                            <label className="font-medium text-gray-900 dark:text-white">{config.name}</label>
                            <div className="flex items-center gap-3">
                              <div
                                className="w-8 h-8 rounded-lg border-2 border-gray-300 cursor-pointer"
                                style={{ backgroundColor: tempSettings.colors?.[key] || config.default }}
                                onClick={() => setShowColorPicker(showColorPicker === key ? null : key)}
                              />
                              <input
                                type="color"
                                value={tempSettings.colors?.[key] || config.default}
                                onChange={(e) => handleColorChange(key, e.target.value)}
                                className="w-8 h-8 rounded border-0 cursor-pointer"
                              />
                            </div>
                          </div>
                          <input
                            type="text"
                            value={tempSettings.colors?.[key] || config.default}
                            onChange={(e) => handleColorChange(key, e.target.value)}
                            className="w-full mt-2 px-3 py-2 text-sm bg-white dark:bg-slate-600 border border-gray-300 dark:border-slate-500 rounded-lg text-gray-900 dark:text-white"
                            placeholder="#000000"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <Bell className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                    إعدادات التنبيهات
                  </h3>

                  <div className="space-y-6">
                    {/* Sound Notifications */}
                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
                          {tempSettings.notifications?.sound ? <Volume2 className="h-6 w-6 text-white" /> : <VolumeX className="h-6 w-6 text-white" />}
                        </div>
                        <div>
                          <label className="font-bold text-gray-900 dark:text-white">التنبيهات الصوتية</label>
                          <p className="text-sm text-gray-600 dark:text-gray-400">تشغيل الأصوات عند ظهور التنبيهات</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={tempSettings.notifications?.sound ?? true}
                          onChange={(e) => handleSettingChange('notifications', {
                            ...tempSettings.notifications,
                            sound: e.target.checked
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                      </label>
                    </div>

                    {/* Browser Notifications */}
                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                          <Smartphone className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <label className="font-bold text-gray-900 dark:text-white">إشعارات المتصفح</label>
                          <p className="text-sm text-gray-600 dark:text-gray-400">إظهار الإشعارات في نظام التشغيل</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={tempSettings.notifications?.browser ?? true}
                          onChange={(e) => handleSettingChange('notifications', {
                            ...tempSettings.notifications,
                            browser: e.target.checked
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    {/* Email Notifications */}
                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                          <Mail className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <label className="font-bold text-gray-900 dark:text-white">إشعارات البريد الإلكتروني</label>
                          <p className="text-sm text-gray-600 dark:text-gray-400">إرسال التنبيهات عبر البريد الإلكتروني</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={tempSettings.notifications?.email ?? false}
                          onChange={(e) => handleSettingChange('notifications', {
                            ...tempSettings.notifications,
                            email: e.target.checked
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>

                    {/* Low Stock Alerts */}
                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl border border-red-200 dark:border-red-800">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                          <Bell className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <label className="font-bold text-gray-900 dark:text-white">تنبيهات المخزون المنخفض</label>
                          <p className="text-sm text-gray-600 dark:text-gray-400">تنبيه عند انخفاض كمية المنتجات</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={tempSettings.notifications?.lowStock ?? true}
                          onChange={(e) => handleSettingChange('notifications', {
                            ...tempSettings.notifications,
                            lowStock: e.target.checked
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                      </label>
                    </div>

                    {/* Expiry Alerts */}
                    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                          <Calendar className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <label className="font-bold text-gray-900 dark:text-white">تنبيهات انتهاء الصلاحية</label>
                          <p className="text-sm text-gray-600 dark:text-gray-400">تنبيه عند اقتراب انتهاء صلاحية المنتجات</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={tempSettings.notifications?.expiry ?? true}
                          onChange={(e) => handleSettingChange('notifications', {
                            ...tempSettings.notifications,
                            expiry: e.target.checked
                          })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                    الأمان والخصوصية
                  </h3>

                  <div className="space-y-6">
                    {/* Auto Lock */}
                    <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                          <Lock className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white">القفل التلقائي</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">قفل التطبيق تلقائياً بعد فترة عدم النشاط</p>
                        </div>
                      </div>
                      <select
                        value={tempSettings.security?.autoLockTime || '30'}
                        onChange={(e) => handleSettingChange('security', {
                          ...tempSettings.security,
                          autoLockTime: e.target.value
                        })}
                        className="w-full px-4 py-3 bg-white dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 rounded-xl focus:border-green-500 dark:focus:border-green-400 focus:ring-4 focus:ring-green-100 dark:focus:ring-green-900 transition-all duration-300 text-gray-900 dark:text-white"
                      >
                        <option value="0">معطل</option>
                        <option value="5">5 دقائق</option>
                        <option value="15">15 دقيقة</option>
                        <option value="30">30 دقيقة</option>
                        <option value="60">ساعة واحدة</option>
                      </select>
                    </div>

                    {/* Session Management */}
                    <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">إدارة الجلسات</h4>
                          <p className="text-sm text-gray-600">تذكر تسجيل الدخول والجلسات النشطة</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">تذكر تسجيل الدخول</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={tempSettings.security?.rememberLogin ?? true}
                            onChange={(e) => handleSettingChange('security', {
                              ...tempSettings.security,
                              rememberLogin: e.target.checked
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>

                    {/* Data Encryption */}
                    <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                          <Shield className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">تشفير البيانات</h4>
                          <p className="text-sm text-gray-600">تشفير البيانات المحفوظة محلياً</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">تفعيل التشفير</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={tempSettings.security?.encryption ?? false}
                            onChange={(e) => handleSettingChange('security', {
                              ...tempSettings.security,
                              encryption: e.target.checked
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Backup Settings */}
            {activeTab === 'backup' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    النسخ الاحتياطي والاستعادة
                  </h3>

                  <div className="space-y-6">
                    {/* Auto Backup */}
                    <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                          <RefreshCw className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">النسخ الاحتياطي التلقائي</h4>
                          <p className="text-sm text-gray-600">إنشاء نسخ احتياطية تلقائياً</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">تفعيل النسخ التلقائي</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={tempSettings.backup?.autoBackup ?? true}
                              onChange={(e) => handleSettingChange('backup', {
                                ...tempSettings.backup,
                                autoBackup: e.target.checked
                              })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">تكرار النسخ الاحتياطي</label>
                          <select
                            value={tempSettings.backup?.backupInterval || 'daily'}
                            onChange={(e) => handleSettingChange('backup', {
                              ...tempSettings.backup,
                              backupInterval: e.target.value
                            })}
                            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                          >
                            <option value="hourly">كل ساعة</option>
                            <option value="daily">يومياً</option>
                            <option value="weekly">أسبوعياً</option>
                            <option value="monthly">شهرياً</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Import/Export Settings */}
                    <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                          <Download className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">استيراد وتصدير الإعدادات</h4>
                          <p className="text-sm text-gray-600">نسخ احتياطي واستعادة إعدادات التطبيق</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <button
                          onClick={exportSettings}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-medium"
                        >
                          <Download className="h-4 w-4" />
                          تصدير الإعدادات
                        </button>
                        <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-medium cursor-pointer">
                          <Upload className="h-4 w-4" />
                          استيراد الإعدادات
                          <input
                            type="file"
                            accept=".json"
                            onChange={importSettings}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
