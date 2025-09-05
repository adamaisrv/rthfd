import React from 'react';
import { Package, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Dashboard() {
  const { getStats } = useStore();
  const storeStats = getStats();

  const stats = [
    {
      title: 'إجمالي المنتجات',
      value: storeStats.totalProducts.toString(),
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      title: 'منتجات منخفضة المخزون',
      value: storeStats.lowStockCount.toString(),
      icon: AlertTriangle,
      color: 'bg-red-500'
    },
    {
      title: 'قيمة المخزون',
      value: `${storeStats.totalValue.toLocaleString()} ر.س`,
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'إجمالي الكمية',
      value: storeStats.totalQuantity.toString(),
      icon: TrendingUp,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          لوحة التحكم الذكية
        </h1>
        <p className="text-gray-600 text-lg">نظرة شاملة على حالة المخزون والعمليات</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 ease-out p-6 border border-gray-200 hover:transform hover:scale-105"
            style={{
              animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="h-8 w-8 text-white" />
              </div>
            </div>

            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Glow Effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Low Stock Alert */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              تنبيهات المخزون
            </h2>
            <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
          </div>

          <div className="space-y-4">
            {storeStats.lowStockProducts.length > 0 ? (
              storeStats.lowStockProducts.map((product) => (
                <div key={product.id} className="relative p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200/50 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">الكمية: {product.quantity} | الحد الأدنى: {product.minQuantity}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full font-medium shadow-lg">
                      يحتاج تموين
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-pink-500/5 rounded-xl"></div>
                </div>
              ))
            ) : (
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">جميع المنتجات في حالة جيدة</p>
                    <p className="text-sm text-gray-600">لا توجد منتجات تحتاج إعادة تموين</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              آخر العمليات
            </h2>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">إضافة منتج جديد</p>
                  <p className="text-sm text-gray-600">ماوس لاسلكي - منذ ساعتين</p>
                </div>
                <div className="text-xs text-green-600 font-medium">جديد</div>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200/50 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">تحديث المخزون</p>
                  <p className="text-sm text-gray-600">لابتوب Dell - منذ 4 ساعات</p>
                </div>
                <div className="text-xs text-purple-600 font-medium">محدث</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
