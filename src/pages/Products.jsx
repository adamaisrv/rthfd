import { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, AlertTriangle, QrCode, Camera, FileSpreadsheet, Truck } from 'lucide-react';
import ProductModal from '../components/ProductModal';
import BarcodeGenerator from '../components/BarcodeGenerator';
import BarcodeScanner from '../components/BarcodeScanner';
import DataImportExport from '../components/DataImportExport';
import DeliveryLabelGenerator from '../components/DeliveryLabelGenerator';
import { useStore } from '../store/useStore';

export default function Products() {
  // Zustand store hooks
  const {
    getFilteredProducts,
    searchTerm,
    setSearchTerm,
    productModalOpen,
    editingProduct,
    openProductModal,
    closeProductModal,
    addProduct,
    updateProduct,
    deleteProduct,
    getStats
  } = useStore();

  const filteredProducts = getFilteredProducts();
  const stats = getStats();
  const lowStockProducts = stats.lowStockProducts;

  // Barcode states
  const [barcodeGeneratorOpen, setBarcodeGeneratorOpen] = useState(false);
  const [barcodeScannerOpen, setBarcodeScannerOpen] = useState(false);
  const [selectedProductForBarcode, setSelectedProductForBarcode] = useState(null);
  
  // Delivery label state
  const [deliveryLabelOpen, setDeliveryLabelOpen] = useState(false);
  const [selectedProductForDelivery, setSelectedProductForDelivery] = useState(null);

  // Import/Export state
  const [importExportOpen, setImportExportOpen] = useState(false);

  // Handle form submission
  const handleSubmitProduct = (productData) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }
    closeProductModal();
  };

  // Handle product deletion with confirmation
  const handleDeleteProduct = (productId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      deleteProduct(productId);
    }
  };

  // Barcode functions
  const handleGenerateBarcode = (product) => {
    setSelectedProductForBarcode(product);
    setBarcodeGeneratorOpen(true);
  };

  const handleScanBarcode = () => {
    setBarcodeScannerOpen(true);
  };

  const handleBarcodeScanned = (code) => {
    // Search for product with this code
    const product = filteredProducts.find(p => p.code === code);

    if (product) {
      // Show success and open product for editing
      const event = new CustomEvent('show-toast', {
        detail: {
          title: 'تم العثور على المنتج',
          message: `${product.name} - ${product.code}`,
          type: 'success'
        }
      });
      window.dispatchEvent(event);

      openProductModal(product);
    } else {
      // Show not found message
      const event = new CustomEvent('show-toast', {
        detail: {
          title: 'المنتج غير موجود',
          message: `لم يتم العثور على منتج بالكود: ${code}`,
          type: 'warning'
        }
      });
      window.dispatchEvent(event);
    }

    setBarcodeScannerOpen(false);
  };

  // Delivery label functions
  const handleGenerateDeliveryLabel = (product) => {
    setSelectedProductForDelivery(product);
    setDeliveryLabelOpen(true);
  };

  // Check for alerts on component mount
  useEffect(() => {
    const { checkAlerts } = useStore.getState();
    checkAlerts();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            إدارة المنتجات
          </h1>
          {lowStockProducts.length > 0 && (
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200/50">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-white" />
              </div>
              <span className="text-red-700 font-medium">
                {lowStockProducts.length} منتج بحاجة لإعادة تموين
              </span>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setImportExportOpen(true)}
            className="group bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-xl flex items-center gap-3 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-out font-medium"
          >
            <FileSpreadsheet className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
            استيراد/تصدير
          </button>

          <button
            onClick={handleScanBarcode}
            className="group bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl flex items-center gap-3 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-out font-medium"
          >
            <Camera className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
            مسح باركود
          </button>

          <button
            onClick={() => openProductModal()}
            className="group bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl flex items-center gap-3 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-out font-medium"
          >
            <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
            إضافة منتج جديد
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="البحث عن منتج بالاسم أو الكود..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pr-12 pl-6 py-4 bg-white/80 backdrop-blur-lg border-2 border-gray-200/50 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 ease-out shadow-lg text-lg placeholder-gray-400"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl pointer-events-none"></div>
      </div>

      {/* Products Table */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200/50">
            <thead className="bg-gradient-to-r from-slate-50 to-blue-50">
              <tr>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">اسم المنتج</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">الكود</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">التصنيف</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">الكمية</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">الحد الأدنى</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">السعر</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">الموقع</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">الإجراءات</th>
              </tr>
            </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product) => {
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

              const isLowStock = product.quantity <= product.minQuantity;

              return (
                <tr
                  key={product.id}
                  className={`group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 transition-all duration-300 ${
                    isLowStock ? 'bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400' : 'hover:shadow-lg'
                  }`}
                >
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-sm">{product.name.charAt(0)}</span>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">{product.name}</div>
                        <div className="text-xs text-gray-500">{product.description?.substring(0, 30)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className="px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 text-xs rounded-full font-mono font-medium">
                      {product.code}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                      {getCategoryName(product.category)}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className={`px-3 py-2 rounded-xl text-sm font-bold shadow-lg ${
                      isLowStock
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse'
                        : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                    }`}>
                      {product.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-lg">
                      {product.minQuantity}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {product.price.toLocaleString()} ر.س
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className="text-sm text-gray-600 bg-purple-100 px-2 py-1 rounded-lg">
                      {product.location}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleGenerateBarcode(product)}
                        className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg transform hover:scale-110 transition-all duration-300"
                        title="توليد باركود"
                      >
                        <QrCode className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleGenerateDeliveryLabel(product)}
                        className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transform hover:scale-110 transition-all duration-300"
                        title="ملصق التوصيل"
                      >
                        <Truck className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => openProductModal(product)}
                        className="p-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:shadow-lg transform hover:scale-110 transition-all duration-300"
                        title="تعديل"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:shadow-lg transform hover:scale-110 transition-all duration-300"
                        title="حذف"
                      >
                        <Trash2 className="h-4 w-4" />
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

      <ProductModal
        isOpen={productModalOpen}
        onClose={closeProductModal}
        onSubmit={handleSubmitProduct}
        product={editingProduct}
      />

      {/* Barcode Generator Modal */}
      {barcodeGeneratorOpen && selectedProductForBarcode && (
        <BarcodeGenerator
          productCode={selectedProductForBarcode.code}
          productName={selectedProductForBarcode.name}
          onClose={() => {
            setBarcodeGeneratorOpen(false);
            setSelectedProductForBarcode(null);
          }}
        />
      )}

      {/* Barcode Scanner Modal */}
      {barcodeScannerOpen && (
        <BarcodeScanner
          onScan={handleBarcodeScanned}
          onClose={() => setBarcodeScannerOpen(false)}
        />
      )}

      {/* Import/Export Modal */}
      {importExportOpen && (
        <DataImportExport
          onClose={() => setImportExportOpen(false)}
        />
      )}

      {/* Delivery Label Generator Modal */}
      {deliveryLabelOpen && selectedProductForDelivery && (
        <DeliveryLabelGenerator
          product={selectedProductForDelivery}
          onClose={() => {
            setDeliveryLabelOpen(false);
            setSelectedProductForDelivery(null);
          }}
        />
      )}
    </div>
  );
}