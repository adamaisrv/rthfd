import React, { useState } from 'react';
import { Package, Plus, Minus, Edit, Search, Filter, BarChart3, AlertTriangle } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Inventory() {
  const { products, updateStock, getStats } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [stockUpdateModal, setStockUpdateModal] = useState(null);
  const [newQuantity, setNewQuantity] = useState('');
  const [updateReason, setUpdateReason] = useState('');

  const stats = getStats();

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

  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleStockUpdate = () => {
    if (stockUpdateModal && newQuantity !== '') {
      updateStock(stockUpdateModal.id, parseInt(newQuantity), updateReason);
      setStockUpdateModal(null);
      setNewQuantity('');
      setUpdateReason('');
    }
  };

  const openStockModal = (product) => {
    setStockUpdateModal(product);
    setNewQuantity(product.quantity.toString());
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            إدارة المخزون والجرد
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">مراقبة وإدارة مستويات المخزون</p>
        </div>

        <div className="flex gap-4">
          <button className="group bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl flex items-center gap-3 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-out font-medium">
            <BarChart3 className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
            تقرير الجرد
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'إجمالي المنتجات',
            value: stats.totalProducts.toString(),
            icon: Package,
            color: 'from-blue-500 to-indigo-600',
            bgColor: 'from-blue-50 to-indigo-50'
          },
          {
            title: 'إجمالي الكمية',
            value: stats.totalQuantity.toString(),
            icon: BarChart3,
            color: 'from-emerald-500 to-teal-600',
            bgColor: 'from-emerald-50 to-teal-50'
          },
          {
            title: 'قيمة المخزون',
            value: `${stats.totalValue.toLocaleString()} ر.س`,
            icon: Package,
            color: 'from-purple-500 to-pink-600',
            bgColor: 'from-purple-50 to-pink-50'
          },
          {
            title: 'منتجات منخفضة',
            value: stats.lowStockCount.toString(),
            icon: AlertTriangle,
            color: 'from-red-500 to-orange-600',
            bgColor: 'from-red-50 to-orange-50'
          }
        ].map((stat, index) => (
          <div
            key={index}
            className={`group relative bg-gradient-to-br ${stat.bgColor} dark:from-slate-800 dark:to-slate-700 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 ease-out p-6 border border-white/20 dark:border-slate-600 hover:transform hover:scale-105`}
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
          </div>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="البحث عن منتج بالاسم أو الكود..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-12 pl-6 py-4 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-600 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all duration-300 ease-out shadow-lg text-lg placeholder-gray-400 text-gray-900 dark:text-white"
          />
        </div>

        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-6 py-4 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-600 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all duration-300 text-gray-900 dark:text-white"
          >
            <option value="">جميع التصنيفات</option>
            <option value="electronics">إلكترونيات</option>
            <option value="clothing">ملابس</option>
            <option value="food">مواد غذائية</option>
            <option value="books">كتب</option>
            <option value="tools">أدوات</option>
            <option value="other">أخرى</option>
          </select>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-600">
            <thead className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-700 dark:to-slate-600">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 dark:text-gray-300">المنتج</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 dark:text-gray-300">التصنيف</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 dark:text-gray-300">الكمية الحالية</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 dark:text-gray-300">الحد الأدنى</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 dark:text-gray-300">الحالة</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 dark:text-gray-300">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-600">
              {filteredProducts.map((product) => {
                const isLowStock = product.quantity <= product.minQuantity;
                const isCritical = product.quantity === 0;

                return (
                  <tr
                    key={product.id}
                    className={`group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-slate-700/50 dark:hover:to-slate-600/50 transition-all duration-300 ${
                      isCritical ? 'bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-l-4 border-red-400' : 
                      isLowStock ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-l-4 border-yellow-400' : ''
                    }`}
                  >
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-sm">{product.name.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900 dark:text-white">{product.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{product.code}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full font-medium">
                        {getCategoryName(product.category)}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`px-3 py-2 rounded-xl text-sm font-bold shadow-lg ${
                        isCritical
                          ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse'
                          : isLowStock
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                          : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                      }`}>
                        {product.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded-lg">
                        {product.minQuantity}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                        isCritical
                          ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                          : isLowStock
                          ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                          : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      }`}>
                        {isCritical ? 'نفد المخزون' : isLowStock ? 'منخفض' : 'جيد'}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openStockModal(product)}
                          className="p-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:shadow-lg transform hover:scale-110 transition-all duration-300"
                          title="تحديث المخزون"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Update Modal */}
      {stockUpdateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gradient-to-br from-slate-900/50 via-blue-900/30 to-purple-900/50" onClick={() => setStockUpdateModal(null)} />
            
            <div className="relative bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-8 shadow-2xl border border-white/20 dark:border-slate-700/20">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  تحديث المخزون
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {stockUpdateModal.name}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">الكمية الجديدة</label>
                  <input
                    type="number"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all duration-300 text-lg text-center font-bold text-gray-900 dark:text-white"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">سبب التحديث</label>
                  <input
                    type="text"
                    value={updateReason}
                    onChange={(e) => setUpdateReason(e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all duration-300 text-gray-900 dark:text-white"
                    placeholder="مثال: إضافة مخزون جديد"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setStockUpdateModal(null)}
                  className="flex-1 px-6 py-3 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-xl transition-all duration-300 font-medium"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleStockUpdate}
                  className="flex-1 px-6 py-3 text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-medium"
                >
                  تحديث
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}