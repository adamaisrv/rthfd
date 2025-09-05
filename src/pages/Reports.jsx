import React, { useState } from 'react';
import { FileText, Download, Calendar, BarChart3, PieChart, TrendingUp, Package, AlertTriangle } from 'lucide-react';
import { useStore } from '../store/useStore';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default function Reports() {
  const { products, getStats } = useStore();
  const [selectedReport, setSelectedReport] = useState(null);
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

  const generateInventoryReport = () => {
    const reportData = products.map(product => ({
      'اسم المنتج': product.name,
      'كود المنتج': product.code,
      'التصنيف': getCategoryName(product.category),
      'الكمية الحالية': product.quantity,
      'الحد الأدنى': product.minQuantity,
      'السعر': product.price,
      'القيمة الإجمالية': product.quantity * product.price,
      'موقع التخزين': product.location,
      'المورد': product.supplier,
      'تاريخ انتهاء الصلاحية': product.expiryDate,
      'الحالة': product.quantity <= product.minQuantity ? 'منخفض' : 'جيد'
    }));

    const worksheet = XLSX.utils.json_to_sheet(reportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'تقرير المخزون');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, `inventory-report-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const generateLowStockReport = () => {
    const lowStockProducts = products.filter(product => product.quantity <= product.minQuantity);
    const reportData = lowStockProducts.map(product => ({
      'اسم المنتج': product.name,
      'كود المنتج': product.code,
      'الكمية الحالية': product.quantity,
      'الحد الأدنى': product.minQuantity,
      'النقص': product.minQuantity - product.quantity,
      'التصنيف': getCategoryName(product.category),
      'المورد': product.supplier,
      'موقع التخزين': product.location
    }));

    const worksheet = XLSX.utils.json_to_sheet(reportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'المنتجات منخفضة المخزون');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, `low-stock-report-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const generateCategoryReport = () => {
    const categoryStats = {};
    products.forEach(product => {
      const category = getCategoryName(product.category);
      if (!categoryStats[category]) {
        categoryStats[category] = {
          count: 0,
          totalQuantity: 0,
          totalValue: 0
        };
      }
      categoryStats[category].count++;
      categoryStats[category].totalQuantity += product.quantity;
      categoryStats[category].totalValue += product.quantity * product.price;
    });

    const reportData = Object.entries(categoryStats).map(([category, data]) => ({
      'التصنيف': category,
      'عدد المنتجات': data.count,
      'إجمالي الكمية': data.totalQuantity,
      'القيمة الإجمالية': data.totalValue,
      'متوسط القيمة': Math.round(data.totalValue / data.count)
    }));

    const worksheet = XLSX.utils.json_to_sheet(reportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'تقرير التصنيفات');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, `category-report-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const reports = [
    {
      id: 'inventory',
      title: 'تقرير المخزون الحالي',
      description: 'عرض شامل لجميع المنتجات والكميات الحالية',
      icon: BarChart3,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'from-blue-50 to-indigo-50',
      action: generateInventoryReport
    },
    {
      id: 'lowstock',
      title: 'تقرير المنتجات منخفضة المخزون',
      description: 'قائمة بالمنتجات التي تحتاج إعادة تموين',
      icon: AlertTriangle,
      color: 'from-red-500 to-pink-600',
      bgColor: 'from-red-50 to-pink-50',
      action: generateLowStockReport
    },
    {
      id: 'category',
      title: 'تقرير التصنيفات',
      description: 'القيمة الإجمالية للمخزون حسب التصنيف',
      icon: PieChart,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'from-purple-50 to-pink-50',
      action: generateCategoryReport
    },
    {
      id: 'movement',
      title: 'تقرير الحركة',
      description: 'تفاصيل الإضافات والتحديثات (قريباً)',
      icon: TrendingUp,
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'from-emerald-50 to-teal-50',
      action: () => alert('هذا التقرير سيكون متاحاً قريباً')
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            التقارير والإحصائيات
          </h1>
          <p className="text-gray-600 text-lg">تحليل شامل لبيانات المخزون</p>
        </div>

        <button
          onClick={() => {
            generateInventoryReport();
            generateLowStockReport();
            generateCategoryReport();
          }}
          className="group bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl flex items-center gap-3 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-out font-medium"
        >
          <Download className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
          تصدير جميع التقارير
        </button>
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
            icon: TrendingUp,
            color: 'from-emerald-500 to-teal-600',
            bgColor: 'from-emerald-50 to-teal-50'
          },
          {
            title: 'قيمة المخزون',
            value: `${stats.totalValue.toLocaleString()} ر.س`,
            icon: BarChart3,
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
            className={`group relative bg-gradient-to-br ${stat.bgColor} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 ease-out p-6 border border-white/20 hover:transform hover:scale-105`}
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
              <div className={`bg-gradient-to-r ${stat.color} p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="h-8 w-8 text-white" />
              </div>
            </div>

            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        ))}
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report, index) => (
          <div
            key={report.id}
            className={`group relative bg-gradient-to-br ${report.bgColor} rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 ease-out p-6 border border-white/20 hover:transform hover:scale-105 cursor-pointer`}
            style={{
              animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
            }}
            onClick={report.action}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start flex-1">
                <div className={`bg-gradient-to-r ${report.color} p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300 mr-4`}>
                  <report.icon className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                    {report.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {report.description}
                  </p>
                  <button
                    className={`bg-gradient-to-r ${report.color} text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-medium`}
                    onClick={(e) => {
                      e.stopPropagation();
                      report.action();
                    }}
                  >
                    <Download className="h-4 w-4" />
                    تحميل التقرير
                  </button>
                </div>
              </div>
            </div>

            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        ))}
      </div>

      {/* Category Distribution */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200/50 bg-gradient-to-r from-purple-50 to-pink-50">
          <h2 className="text-xl font-bold text-gray-900">
            التوزيع حسب التصنيف
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {(() => {
              const categoryStats = {};
              products.forEach(product => {
                const category = getCategoryName(product.category);
                if (!categoryStats[category]) {
                  categoryStats[category] = {
                    count: 0,
                    totalValue: 0
                  };
                }
                categoryStats[category].count++;
                categoryStats[category].totalValue += product.quantity * product.price;
              });

              const totalValue = Object.values(categoryStats).reduce((sum, cat) => sum + cat.totalValue, 0);
              const colors = [
                'from-blue-500 to-indigo-600',
                'from-emerald-500 to-teal-600',
                'from-purple-500 to-pink-600',
                'from-red-500 to-orange-600',
                'from-yellow-500 to-amber-600',
                'from-cyan-500 to-blue-600'
              ];

              return Object.entries(categoryStats).map(([category, data], index) => {
                const percentage = totalValue > 0 ? (data.totalValue / totalValue * 100) : 0;
                const color = colors[index % colors.length];

                return (
                  <div key={category} className="group">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 font-medium">{category}</span>
                      <span className="text-gray-700 font-medium">{category}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">
                          {data.count} منتج - {data.totalValue.toLocaleString()} ر.س
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`bg-gradient-to-r ${color} h-3 rounded-full transition-all duration-1000 ease-out group-hover:shadow-lg`}
                        style={{
                          width: `${percentage}%`,
                          animation: `slideIn 1s ease-out ${index * 0.2}s both`
                        }}
                      ></div>
                    </div>
                  </div>
                );
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors duration-300">
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
