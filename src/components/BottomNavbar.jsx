import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Warehouse,
  FileText,
  Settings
} from 'lucide-react';

const navigation = [
  { name: 'لوحة التحكم', href: '/', icon: LayoutDashboard, shortName: 'الرئيسية' },
  { name: 'المنتجات', href: '/products', icon: Package, shortName: 'المنتجات' },
  { name: 'الجرد', href: '/inventory', icon: Warehouse, shortName: 'الجرد' },
  { name: 'التقارير', href: '/reports', icon: FileText, shortName: 'التقارير' },
  { name: 'الإعدادات', href: '/settings', icon: Settings, shortName: 'الإعدادات' }
];

export default function BottomNavbar() {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-2xl">
      <div className="grid grid-cols-5 h-16">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center justify-center px-2 py-2 transition-all duration-300 ease-out relative group ${
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-blue-600'
              }`}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
              )}
              
              {/* Icon with background */}
              <div className={`relative p-2 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-50 to-purple-50 scale-110' 
                  : 'group-hover:bg-gray-50 group-hover:scale-105'
              }`}>
                <Icon className={`h-5 w-5 transition-all duration-300 ${
                  isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'
                }`} />
                
                {/* Glow effect for active item */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-lg"></div>
                )}
              </div>
              
              {/* Label */}
              <span className={`text-xs font-medium mt-1 transition-all duration-300 ${
                isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'
              }`}>
                {item.shortName}
              </span>
              
              {/* Ripple effect on tap */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-active:opacity-20 group-active:bg-blue-500 transition-opacity duration-150"></div>
            </Link>
          );
        })}
      </div>
      
      {/* Bottom safe area for mobile devices */}
      <div className="h-safe-area-inset-bottom bg-white/95"></div>
    </div>
  );
}