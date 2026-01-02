import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function ProductModal({ isOpen, onClose, onSubmit, product }) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: '',
    quantity: '',
    price: '',
    expiryDate: '',
    location: '',
    minQuantity: '',
    supplier: '',
    description: ''
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        name: '',
        code: '',
        category: '',
        quantity: '',
        price: '',
        expiryDate: '',
        location: '',
        minQuantity: '',
        supplier: '',
        description: ''
      });
    }
  }, [product]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900/50 via-blue-900/30 to-purple-900/50" onClick={onClose} />

        <div className="relative bg-white/95 backdrop-blur-lg rounded-3xl max-w-4xl w-full p-8 max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {product ? 'ت' : '+'}
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {product ? 'تعديل منتج' : 'إضافة منتج جديد'}
                </h3>
                <p className="text-gray-600">
                  {product ? 'تحديث بيانات المنتج' : 'إدخال بيانات منتج جديد للمخزون'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all duration-300 hover:scale-110"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200/50">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mr-2"></div>
                المعلومات الأساسية
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">اسم المنتج *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-lg"
                    placeholder="أدخل اسم المنتج"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">كود المنتج *</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-lg font-mono"
                    placeholder="مثال: PRD001"
                  />
                </div>
              </div>
            </div>

            {/* Category and Description */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200/50">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg mr-2"></div>
                التصنيف والوصف
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">التصنيف *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 text-lg"
                  >
                    <option value="">اختر التصنيف</option>
                    <option value="electronics">📱 إلكترونيات</option>
                    <option value="clothing">👕 ملابس</option>
                    <option value="food">🍎 مواد غذائية</option>
                    <option value="books">📚 كتب</option>
                    <option value="tools">🔧 أدوات</option>
                    <option value="other">📦 أخرى</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">وصف المنتج</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    placeholder="وصف مختصر للمنتج..."
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Inventory Information */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200/50">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <div className="w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg mr-2"></div>
                معلومات المخزون
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">الكمية الحالية *</label>
                  <input
                    type="number"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all duration-300 text-lg text-center font-bold"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">الحد الأدنى للكمية *</label>
                  <input
                    type="number"
                    required
                    value={formData.minQuantity}
                    onChange={(e) => setFormData({...formData, minQuantity: e.target.value})}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all duration-300 text-lg text-center font-bold"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200/50">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg mr-2"></div>
                المعلومات المالية والتواريخ
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">السعر (ر.س) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-lg text-center font-bold"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">تاريخ انتهاء الصلاحية</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-lg"
                  />
                </div>
              </div>
            </div>

            {/* Location and Supplier */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-200/50">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg mr-2"></div>
                الموقع والمورد
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">موقع التخزين</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="مثال: رف A - مستوى 2"
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">المورد</label>
                  <input
                    type="text"
                    value={formData.supplier}
                    onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                    placeholder="اسم المورد"
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 text-lg"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-3 text-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-300 hover:scale-105 border-2 border-gray-200"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-8 py-3 text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <span className="flex items-center gap-2">
                  {product ? '✏️ تحديث المنتج' : '➕ إضافة المنتج'}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}