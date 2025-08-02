import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Warehouse,
  FileText,
  Settings,
  X
} from 'lucide-react';
import { useStore } from '../store/useStore';

const navigation = [
  { name: 'لوحة التحكم', href: '/', icon: LayoutDashboard },
  { name: 'المنتجات', href: '/products', icon: Package },
  { name: 'الجرد', href: '/inventory', icon: Warehouse },
  { name: 'التقارير', href: '/reports', icon: FileText },
  { name: 'الإعدادات', href: '/settings', icon: Settings }
];

export default function Sidebar({ open, setOpen }) {
  const location = useLocation();
  const { setSidebarOpen } = useStore();

  return (
    <>
      <div className={`fixed inset-0 z-40 lg:hidden ${open ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setOpen(false)} />
      </div>

      <div className={`fixed top-0 right-0 z-40 w-64 h-full bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 shadow-2xl transform transition-all duration-500 ease-in-out lg:translate-x-0 lg:static lg:inset-0 sidebar ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between h-20 px-6 border-b border-slate-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">م</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">إدارة المخزون</h1>
              <p className="text-xs text-gray-500 dark:text-slate-400">نظام متقدم</p>
            </div>
          </div>
          <button
            className="lg:hidden text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white transition-colors"
            onClick={() => setOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="mt-8 px-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => {
                  setOpen(false);
                  setSidebarOpen(false);
                }}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ease-out ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 transform scale-105'
                    : 'text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700/50 hover:transform hover:scale-105'
                }`}
              >
                <Icon className={`ml-3 h-5 w-5 transition-all duration-300 ${
                  isActive ? 'text-white' : 'text-gray-500 dark:text-slate-400 group-hover:text-gray-900 dark:group-hover:text-white'
                }`} />
                <span className="font-medium">{item.name}</span>
                {isActive && (
                  <div className="mr-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-slate-700/50">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-100 dark:bg-slate-800/50">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">أ</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">المدير</p>
              <p className="text-xs text-gray-500 dark:text-slate-400">متصل الآن</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}