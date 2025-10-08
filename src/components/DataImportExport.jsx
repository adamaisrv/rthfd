import React, { useState, useRef } from 'react';
import { Upload, Download, FileText, FileSpreadsheet, Eye, Check, X, AlertTriangle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { useStore } from '../store/useStore';

export default function DataImportExport({ onClose }) {
  const [activeTab, setActiveTab] = useState('export');
  const [importData, setImportData] = useState([]);
  const [importPreview, setImportPreview] = useState(false);
  const [importErrors, setImportErrors] = useState([]);
  const [exportFormat, setExportFormat] = useState('excel');
  const [importFormat, setImportFormat] = useState('excel');
  const fileInputRef = useRef(null);

  const { products, addProduct, getStats } = useStore();
  const stats = getStats();

  // Export functions
  const exportToExcel = () => {
    const exportData = products.map(product => ({
      'اسم المنتج': product.name,
      'كود المنتج': product.code,
      'التصنيف': getCategoryName(product.category),
      'الكمية الحالية': product.quantity,
      'الحد الأدنى': product.minQuantity,
      'السعر': product.price,
      'موقع التخزين': product.location,
      'المورد': product.supplier,
      'تاريخ انتهاء الصلاحية': product.expiryDate,
      'الوصف': product.description,
      'تاريخ الإنشاء': new Date(product.createdAt).toLocaleDateString('ar-SA'),
      'تاريخ التحديث': new Date(product.updatedAt).toLocaleDateString('ar-SA')
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'المنتجات');

    // Add summary sheet
    const summaryData = [
      { 'الإحصائية': 'إجمالي المنتجات', 'القيمة': stats.totalProducts },
      { 'الإحصائية': 'إجمالي الكمية', 'القيمة': stats.totalQuantity },
      { 'الإحصائية': 'قيمة المخزون', 'القيمة': `${stats.totalValue.toLocaleString()} دج` },
      { 'الإحصائية': 'منتجات منخفضة المخزون', 'القيمة': stats.lowStockCount }
    ];
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'الإحصائيات');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, `inventory-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const exportToCSV = () => {
    const exportData = products.map(product => ({
      'اسم المنتج': product.name,
      'كود المنتج': product.code,
      'التصنيف': getCategoryName(product.category),
      'الكمية الحالية': product.quantity,
      'الحد الأدنى': product.minQuantity,
      'السعر': product.price,
      'موقع التخزين': product.location,
      'المورد': product.supplier,
      'تاريخ انتهاء الصلاحية': product.expiryDate,
      'الوصف': product.description
    }));

    const csv = Papa.unparse(exportData, {
      header: true,
      encoding: 'utf-8'
    });

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `inventory-${new Date().toISOString().split('T')[0]}.csv`);
  };

  // Import functions
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let data = [];
        
        if (importFormat === 'excel') {
          const workbook = XLSX.read(e.target.result, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          data = XLSX.utils.sheet_to_json(worksheet);
        } else {
          const result = Papa.parse(e.target.result, {
            header: true,
            skipEmptyLines: true
          });
          data = result.data;
        }

        validateAndSetImportData(data);
      } catch (error) {
        console.error('Error reading file:', error);
        setImportErrors(['خطأ في قراءة الملف. تأكد من صحة التنسيق.']);
      }
    };

    if (importFormat === 'excel') {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsText(file, 'UTF-8');
    }
  };

  const validateAndSetImportData = (data) => {
    const errors = [];
    const validData = [];

    data.forEach((row, index) => {
      const rowErrors = [];
      
      // Required fields validation
      if (!row['اسم المنتج'] && !row.name) {
        rowErrors.push('اسم المنتج مطلوب');
      }
      if (!row['كود المنتج'] && !row.code) {
        rowErrors.push('كود المنتج مطلوب');
      }
      if (!row['الكمية الحالية'] && !row.quantity) {
        rowErrors.push('الكمية مطلوبة');
      }
      if (!row['السعر'] && !row.price) {
        rowErrors.push('السعر مطلوب');
      }

      if (rowErrors.length > 0) {
        errors.push(`الصف ${index + 1}: ${rowErrors.join(', ')}`);
      } else {
        // Normalize data
        const normalizedRow = {
          name: row['اسم المنتج'] || row.name,
          code: row['كود المنتج'] || row.code,
          category: getCategoryCode(row['التصنيف'] || row.category) || 'other',
          quantity: parseInt(row['الكمية الحالية'] || row.quantity) || 0,
          minQuantity: parseInt(row['الحد الأدنى'] || row.minQuantity) || 0,
          price: parseFloat(row['السعر'] || row.price) || 0,
          location: row['موقع التخزين'] || row.location || '',
          supplier: row['المورد'] || row.supplier || '',
          expiryDate: row['تاريخ انتهاء الصلاحية'] || row.expiryDate || '',
          description: row['الوصف'] || row.description || ''
        };
        validData.push(normalizedRow);
      }
    });

    setImportData(validData);
    setImportErrors(errors);
    setImportPreview(true);
  };

  const confirmImport = () => {
    let successCount = 0;
    let errorCount = 0;

    importData.forEach(product => {
      try {
        addProduct(product);
        successCount++;
      } catch (error) {
        errorCount++;
        console.error('Error adding product:', error);
      }
    });

    // Show success message
    const event = new CustomEvent('show-toast', {
      detail: {
        title: 'تم الاستيراد',
        message: `تم استيراد ${successCount} منتج بنجاح${errorCount > 0 ? ` (${errorCount} خطأ)` : ''}`,
        type: successCount > 0 ? 'success' : 'error'
      }
    });
    window.dispatchEvent(event);

    // Reset and close
    setImportData([]);
    setImportPreview(false);
    setImportErrors([]);
    onClose();
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

  const getCategoryCode = (categoryName) => {
    const categories = {
      'إلكترونيات': 'electronics',
      'ملابس': 'clothing',
      'مواد غذائية': 'food',
      'كتب': 'books',
      'أدوات': 'tools',
      'أخرى': 'other'
    };
    return categories[categoryName] || 'other';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900/50 via-blue-900/30 to-purple-900/50" onClick={onClose} />
        
        <div className="relative bg-white/95 backdrop-blur-lg rounded-3xl max-w-6xl w-full p-8 max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
                <FileSpreadsheet className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  استيراد وتصدير البيانات
                </h3>
                <p className="text-gray-600">
                  إدارة بيانات المخزون عبر ملفات Excel و CSV
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

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-2xl p-1 mb-8">
            <button
              onClick={() => setActiveTab('export')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'export'
                  ? 'bg-white text-emerald-600 shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Download className="h-5 w-5" />
              تصدير البيانات
            </button>
            <button
              onClick={() => setActiveTab('import')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'import'
                  ? 'bg-white text-emerald-600 shadow-lg'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Upload className="h-5 w-5" />
              استيراد البيانات
            </button>
          </div>

          {/* Export Tab */}
          {activeTab === 'export' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200/50">
                <h4 className="text-lg font-bold text-gray-900 mb-4">تصدير بيانات المخزون</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">تنسيق التصدير</label>
                      <select
                        value={exportFormat}
                        onChange={(e) => setExportFormat(e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300"
                      >
                        <option value="excel">Excel (.xlsx)</option>
                        <option value="csv">CSV (.csv)</option>
                      </select>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-gray-200">
                      <h5 className="font-semibold text-gray-900 mb-2">معلومات التصدير</h5>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>عدد المنتجات:</span>
                          <span className="font-medium">{stats.totalProducts}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>إجمالي الكمية:</span>
                          <span className="font-medium">{stats.totalQuantity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>قيمة المخزون:</span>
                          <span className="font-medium">{stats.totalValue.toLocaleString()} دج</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white rounded-xl p-4 border border-gray-200">
                      <h5 className="font-semibold text-gray-900 mb-2">الحقول المُصدرة</h5>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                        <div>• اسم المنتج</div>
                        <div>• كود المنتج</div>
                        <div>• التصنيف</div>
                        <div>• الكمية الحالية</div>
                        <div>• الحد الأدنى</div>
                        <div>• السعر</div>
                        <div>• موقع التخزين</div>
                        <div>• المورد</div>
                        <div>• تاريخ انتهاء الصلاحية</div>
                        <div>• الوصف</div>
                        <div>• تاريخ الإنشاء</div>
                        <div>• تاريخ التحديث</div>
                      </div>
                    </div>

                    <button
                      onClick={exportFormat === 'excel' ? exportToExcel : exportToCSV}
                      className="w-full flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-medium"
                    >
                      <Download className="h-5 w-5" />
                      تصدير {exportFormat === 'excel' ? 'Excel' : 'CSV'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Import Tab */}
          {activeTab === 'import' && (
            <div className="space-y-6">
              {!importPreview ? (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">استيراد بيانات المخزون</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">تنسيق الاستيراد</label>
                        <select
                          value={importFormat}
                          onChange={(e) => setImportFormat(e.target.value)}
                          className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                        >
                          <option value="excel">Excel (.xlsx)</option>
                          <option value="csv">CSV (.csv)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">اختيار الملف</label>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept={importFormat === 'excel' ? '.xlsx,.xls' : '.csv'}
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full flex items-center justify-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-300"
                        >
                          <Upload className="h-6 w-6 text-gray-400" />
                          <span className="text-gray-600">اختر ملف {importFormat === 'excel' ? 'Excel' : 'CSV'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-gray-200">
                      <h5 className="font-semibold text-gray-900 mb-2">الحقول المطلوبة</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span>اسم المنتج (مطلوب)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span>كود المنتج (مطلوب)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span>الكمية الحالية (مطلوب)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span>السعر (مطلوب)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <span>التصنيف (اختياري)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <span>الحد الأدنى (اختياري)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <span>موقع التخزين (اختياري)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <span>المورد (اختياري)</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <a
                          href="/sample-import.csv"
                          download="sample-import.csv"
                          className="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all duration-300 text-sm font-medium"
                        >
                          <Download className="h-4 w-4" />
                          تحميل ملف نموذجي
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Import Preview */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200/50">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-bold text-gray-900">معاينة البيانات المستوردة</h4>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setImportPreview(false)}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300"
                        >
                          إلغاء
                        </button>
                        <button
                          onClick={confirmImport}
                          disabled={importData.length === 0 || importErrors.length > 0}
                          className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          تأكيد الاستيراد
                        </button>
                      </div>
                    </div>

                    {/* Errors */}
                    {importErrors.length > 0 && (
                      <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                          <h5 className="font-semibold text-red-800">أخطاء في البيانات</h5>
                        </div>
                        <ul className="text-sm text-red-700 space-y-1">
                          {importErrors.map((error, index) => (
                            <li key={index}>• {error}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Preview Table */}
                    {importData.length > 0 && (
                      <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
                        <div className="overflow-x-auto max-h-64">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">اسم المنتج</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">الكود</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">التصنيف</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">الكمية</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">السعر</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {importData.slice(0, 10).map((product, index) => (
                                <tr key={index}>
                                  <td className="px-4 py-3 text-sm text-gray-900">{product.name}</td>
                                  <td className="px-4 py-3 text-sm text-gray-500">{product.code}</td>
                                  <td className="px-4 py-3 text-sm text-gray-500">{getCategoryName(product.category)}</td>
                                  <td className="px-4 py-3 text-sm text-gray-500">{product.quantity}</td>
                                  <td className="px-4 py-3 text-sm text-gray-500">{product.price} دج</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {importData.length > 10 && (
                          <div className="px-4 py-3 bg-gray-50 text-sm text-gray-500 text-center">
                            وعرض {importData.length - 10} منتج إضافي...
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}