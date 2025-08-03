import React, { useState } from 'react';
import { Package, Clipboard, TrendingUp, TrendingDown, RefreshCw, Edit3, Save, X } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Inventory() {
  const { products, getStats, updateStock } = useStore();
  const [editingStock, setEditingStock] = useState({});
  const [inventoryMode, setInventoryMode] = useState(false);
  const stats = getStats();

  const handleStockEdit = (productId, newQuantity) => {
    setEditingStock(prev => ({
      ...prev,
      [productId]: newQuantity
    }));
  };

  const saveStockChange = (product) => {
    const newQuantity = parseInt(editingStock[product.id]);
    if (!isNaN(newQuantity) && newQuantity !== product.quantity) {
      updateStock(product.id, newQuantity, 'تعديل جرد');
    }
    setEditingStock(prev => {
      const updated = { ...prev };
      delete updated[product.id];
      return updated;
    });
  };

  const cancelStockEdit = (productId) => {
    setEditingStock(prev => {
      const updated = { ...prev };
      delete updated[productId];
      return updated;
    });
  };

  const getCategoryName = (category) => {
    const categories = {
      'electronics': 'إلكترونيات',
      'clothing': 'ملابس',
      'food': 'مواد غذائية',
      'books': 'كتب',
      'tools': 'أدوات',
      'other': 'أخرى'
    };
    return categories[category] || category;
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
            إدارة المخزون والجرد
          </h1>
          <p className="text-gray-600 text-lg">مراقبة وإدارة مستويات المخزون</p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setInventoryMode(!inventoryMode)}
            className={`group px-6 py-3 rounded-xl flex items-center gap-3 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-out font-medium ${
              inventoryMode
                ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white'
                : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
            }`}
          >
            {inventoryMode ? (
              <>
                <X className="h-5 w-5" />
                إنهاء الجرد
              </>
            ) : (
              <>
                <Clipboard className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                بدء جرد جديد
              </>
            )}
          </button>

          <button className="group bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl flex items-center gap-3 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-out font-medium">
            <RefreshCw className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
            تحديث البيانات
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'إجمالي الأصناف',
            value: stats.totalProducts.toString(),
            icon: Package,
            color: 'from-blue-500 to-indigo-600',
            bgColor: 'from-blue-50 to-indigo-50'
          },
          {
            title: 'إجمالي الكمية',
            value: stats.totalQuantity.toString(),
            icon: TrendingUp,
            color: 'from-emerald-500 to-teal-600',
            bgColor: 'from-emerald-50 to-teal-50'
          },
          {
            title: 'قيمة المخزون',
            value: `${stats.totalValue.toLocaleString()} ر.س`,
            icon: TrendingUp,
            color: 'from-purple-500 to-pink-600',
            bgColor: 'from-purple-50 to-pink-50'
          },
          {
            title: 'منتجات منخفضة',
            value: stats.lowStockCount.toString(),
            icon: TrendingDown,
            color: 'from-red-500 to-orange-600',
            bgColor: 'from-red-50 to-orange-50'
          }
        ].map((stat, index) => (
          <div
            key={index}
            className={`group relative bg-gradient-to-br ${stat.bgColor} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 ease-out p-6 border border-white/20 hover:transform hover:scale-105`}
            style={{
              animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className={`bg-gradient-to-r ${stat.color} p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="h-8 w-8 text-white" />
              </div>
            </div>

            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        ))}
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200/50 bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              تفاصيل المخزون
            </h2>
            {inventoryMode && (
              <div className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                <Clipboard className="h-4 w-4" />
                وضع الجرد نشط
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200/50">
            <thead className="bg-gradient-to-r from-slate-50 to-blue-50">
            <thead className="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 dark:text-gray-300">المنتج</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 dark:text-gray-300">الكمية الحالية</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 dark:text-gray-300">الحد الأدنى</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 dark:text-gray-300">القيمة الإجمالية</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 dark:text-gray-300">الموقع</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 dark:text-gray-300">الحالة</th>
                {inventoryMode && (
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 dark:text-gray-300">إجراءات</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
              {products.map((product) => {
                const isLowStock = product.quantity <= product.minQuantity;
                const totalValue = product.quantity * product.price;
                const isEditing = editingStock.hasOwnProperty(product.id);

                return (
                  <tr
                    key={product.id}
                    className={`group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300 ${
                      isLowStock ? 'bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400' : 'hover:shadow-lg'
                    }`}
                  >
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-sm">{product.name.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900 dark:text-white">{product.name}</div>
                          <div className="text-xs text-gray-500">{product.code}</div>
                          <div className="text-xs text-gray-500">{getCategoryName(product.category)}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editingStock[product.id] || product.quantity}
                          onChange={(e) => handleStockEdit(product.id, e.target.value)}
                          className="w-20 px-2 py-1 border-2 border-blue-300 rounded-lg text-center font-bold focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          autoFocus
                        />
                      ) : (
                        <span className={`px-3 py-2 rounded-xl text-sm font-bold shadow-lg ${
                          isLowStock
                            ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse'
                            : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                        }`}>
                          {product.quantity}
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">
                        {product.minQuantity}
                      </span>
                    </td>

                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {totalValue.toLocaleString()} ر.س
                      </span>
                    </td>

                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="text-sm text-gray-600 bg-purple-100 px-2 py-1 rounded-lg">
                        {product.location}
                      </span>
                    </td>

                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.quantity === 0
                          ? 'bg-red-100 text-red-800'
                          : isLowStock
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                      }`}>
                        {product.quantity === 0 ? 'منتهي' : isLowStock ? 'منخفض' : 'جيد'}
                      </span>
                    </td>

                    {inventoryMode && (
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex gap-2">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => saveStockChange(product)}
                                className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transform hover:scale-110 transition-all duration-300"
                                title="حفظ"
                              >
                                <Save className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => cancelStockEdit(product.id)}
                                className="p-2 bg-gradient-to-r from-gray-500 to-slate-600 text-white rounded-xl hover:shadow-lg transform hover:scale-110 transition-all duration-300"
                                title="إلغاء"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleStockEdit(product.id, product.quantity)}
                              className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transform hover:scale-110 transition-all duration-300"
                              title="تعديل الكمية"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
