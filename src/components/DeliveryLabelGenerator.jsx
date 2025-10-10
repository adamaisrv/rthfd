import React, { useState, useRef } from 'react';
import { X, Printer, Download, Package, Truck, MapPin, User, Phone, Calendar } from 'lucide-react';
import JsBarcode from 'jsbarcode';

export default function DeliveryLabelGenerator({ product, onClose }) {
  const labelRef = useRef(null);
  const barcodeRef = useRef(null);
  const { setSidebarOpen } = useStore();
  const [labelData, setLabelData] = useState({
    // Sender Info (Your Business)
    senderName: 'متجر الإلكترونيات المتقدم',
    senderAddress: 'الجزائر العاصمة، الجزائر',
    senderPhone: '+213 555 123 456',
    
    // Receiver Info
    receiverName: '',
    receiverPhone: '',
    receiverAddress: '',
    receiverWilaya: 'الجزائر',
    
    // Package Info
    packageWeight: '1',
    packageValue: product?.price || 0,
    deliveryType: 'عادي',
    paymentMethod: 'دفع عند الاستلام',
    
    // Order Info
    orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
    orderDate: new Date().toLocaleDateString('ar-DZ'),
    notes: ''
  });

  // Hide sidebar when modal opens and restore when closes
  React.useEffect(() => {
    setSidebarOpen(false);
    return () => {
      // Optionally restore sidebar state when modal closes
    };
  }, [setSidebarOpen]);

  const wilayas = [
    'أدرار', 'الشلف', 'الأغواط', 'أم البواقي', 'باتنة', 'بجاية', 'بسكرة', 'بشار',
    'البليدة', 'البويرة', 'تمنراست', 'تبسة', 'تلمسان', 'تيارت', 'تيزي وزو', 'الجزائر',
    'الجلفة', 'جيجل', 'سطيف', 'سعيدة', 'سكيكدة', 'سيدي بلعباس', 'عنابة', 'قالمة',
    'قسنطينة', 'المدية', 'مستغانم', 'المسيلة', 'معسكر', 'ورقلة', 'وهران', 'البيض',
    'إليزي', 'برج بوعريريج', 'بومرداس', 'الطارف', 'تندوف', 'تيسمسيلت', 'الوادي',
    'خنشلة', 'سوق أهراس', 'تيبازة', 'ميلة', 'عين الدفلى', 'النعامة', 'عين تموشنت',
    'غرداية', 'غليزان', 'تيميمون', 'برج باجي مختار', 'أولاد جلال', 'بني عباس',
    'عين صالح', 'عين قزام', 'تقرت', 'جانت', 'المغير', 'المنيعة'
  ];

  // Generate barcode for tracking
  React.useEffect(() => {
    if (barcodeRef.current && labelData.orderNumber) {
      try {
        JsBarcode(barcodeRef.current, labelData.orderNumber, {
          format: "CODE128",
          width: 2,
          height: 40,
          displayValue: true,
          fontSize: 12,
          margin: 5
        });
      } catch (error) {
        console.error('Error generating barcode:', error);
      }
    }
  }, [labelData.orderNumber]);

  const handleInputChange = (field, value) => {
    setLabelData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const printLabel = () => {
    if (labelRef.current) {
      const printWindow = window.open('', '_blank');
      const labelHTML = labelRef.current.outerHTML;
      
      printWindow.document.write(`
        <html>
          <head>
            <title>طباعة ملصق التوصيل - ${labelData.orderNumber}</title>
            <style>
              body {
                margin: 0;
                padding: 20px;
                font-family: 'Arial', sans-serif;
                direction: rtl;
              }
              .delivery-label {
                width: 100mm;
                height: 150mm;
                border: 2px solid #000;
                padding: 5mm;
                box-sizing: border-box;
                background: white;
              }
              @media print {
                body { margin: 0; padding: 0; }
                .delivery-label { 
                  width: 100mm; 
                  height: 150mm; 
                  border: 2px solid #000;
                  page-break-after: always;
                }
              }
            </style>
          </head>
          <body>
            ${labelHTML}
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              };
            </script>
          </body>
        </html>
      `);
      
      printWindow.document.close();
    }
  };

  const downloadLabel = () => {
    if (labelRef.current) {
      // Convert to canvas for download
      import('html2canvas').then(html2canvas => {
        html2canvas.default(labelRef.current, {
          scale: 2,
          backgroundColor: '#ffffff'
        }).then(canvas => {
          const link = document.createElement('a');
          link.download = `delivery-label-${labelData.orderNumber}.png`;
          link.href = canvas.toDataURL();
          link.click();
        });
      }).catch(() => {
        // Fallback: open print dialog
        printLabel();
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] overflow-y-auto backdrop-blur-sm">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900/50 via-blue-900/30 to-purple-900/50" onClick={onClose} />
        
        <div className="relative bg-white/95 backdrop-blur-lg rounded-3xl max-w-6xl w-full p-8 max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20 z-[100000]">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  مولد ملصق التوصيل
                </h3>
                <p className="text-gray-600">
                  إنشاء ملصق توصيل احترافي للمنتج: {product?.name}
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="space-y-6">
              {/* Sender Info */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  معلومات المرسل
                </h4>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="اسم المتجر"
                    value={labelData.senderName}
                    onChange={(e) => handleInputChange('senderName', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                  />
                  <input
                    type="text"
                    placeholder="عنوان المتجر"
                    value={labelData.senderAddress}
                    onChange={(e) => handleInputChange('senderAddress', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                  />
                  <input
                    type="tel"
                    placeholder="رقم الهاتف"
                    value={labelData.senderPhone}
                    onChange={(e) => handleInputChange('senderPhone', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Receiver Info */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200/50">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  معلومات المستلم
                </h4>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="اسم المستلم *"
                    value={labelData.receiverName}
                    onChange={(e) => handleInputChange('receiverName', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="رقم هاتف المستلم *"
                    value={labelData.receiverPhone}
                    onChange={(e) => handleInputChange('receiverPhone', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300"
                    required
                  />
                  <textarea
                    placeholder="عنوان المستلم الكامل *"
                    value={labelData.receiverAddress}
                    onChange={(e) => handleInputChange('receiverAddress', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 resize-none"
                    required
                  />
                  <select
                    value={labelData.receiverWilaya}
                    onChange={(e) => handleInputChange('receiverWilaya', e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300"
                  >
                    {wilayas.map(wilaya => (
                      <option key={wilaya} value={wilaya}>{wilaya}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Package Info */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200/50">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  معلومات الطرد
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="الوزن (كغ)"
                    value={labelData.packageWeight}
                    onChange={(e) => handleInputChange('packageWeight', e.target.value)}
                    className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300"
                  />
                  <input
                    type="number"
                    placeholder="القيمة (دج)"
                    value={labelData.packageValue}
                    onChange={(e) => handleInputChange('packageValue', e.target.value)}
                    className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300"
                  />
                  <select
                    value={labelData.deliveryType}
                    onChange={(e) => handleInputChange('deliveryType', e.target.value)}
                    className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300"
                  >
                    <option value="عادي">توصيل عادي</option>
                    <option value="سريع">توصيل سريع</option>
                    <option value="فوري">توصيل فوري</option>
                  </select>
                  <select
                    value={labelData.paymentMethod}
                    onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                    className="px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300"
                  >
                    <option value="دفع عند الاستلام">دفع عند الاستلام</option>
                    <option value="مدفوع مسبقاً">مدفوع مسبقاً</option>
                  </select>
                </div>
                <textarea
                  placeholder="ملاحظات إضافية"
                  value={labelData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={2}
                  className="w-full mt-4 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={printLabel}
                  disabled={!labelData.receiverName || !labelData.receiverPhone || !labelData.receiverAddress}
                  className="flex-1 flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <Printer className="h-5 w-5" />
                  طباعة الملصق
                </button>
                <button
                  onClick={downloadLabel}
                  disabled={!labelData.receiverName || !labelData.receiverPhone || !labelData.receiverAddress}
                  className="flex-1 flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <Download className="h-5 w-5" />
                  تحميل الملصق
                </button>
              </div>
            </div>

            {/* Label Preview */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200/50">
                <h4 className="text-lg font-bold text-gray-900 mb-4">معاينة الملصق</h4>
                
                {/* Delivery Label */}
                <div 
                  ref={labelRef}
                  className="delivery-label bg-white border-2 border-gray-800 p-4 mx-auto"
                  style={{ width: '100mm', minHeight: '150mm', fontSize: '12px', direction: 'rtl' }}
                >
                  {/* Header */}
                  <div className="text-center border-b-2 border-gray-800 pb-2 mb-3">
                    <div className="font-bold text-lg">ملصق التوصيل</div>
                    <div className="text-sm">DELIVERY LABEL</div>
                  </div>

                  {/* Order Info */}
                  <div className="mb-3 text-center">
                    <div className="font-bold">رقم الطلب: {labelData.orderNumber}</div>
                    <div className="text-sm">التاريخ: {labelData.orderDate}</div>
                    <canvas ref={barcodeRef} className="mx-auto mt-1"></canvas>
                  </div>

                  {/* From Section */}
                  <div className="mb-3 border border-gray-400 p-2">
                    <div className="font-bold text-sm mb-1">من / FROM:</div>
                    <div className="text-xs">
                      <div>{labelData.senderName}</div>
                      <div>{labelData.senderAddress}</div>
                      <div>{labelData.senderPhone}</div>
                    </div>
                  </div>

                  {/* To Section */}
                  <div className="mb-3 border-2 border-gray-800 p-2">
                    <div className="font-bold text-sm mb-1">إلى / TO:</div>
                    <div className="text-xs">
                      <div className="font-bold">{labelData.receiverName || 'اسم المستلم'}</div>
                      <div>{labelData.receiverPhone || 'رقم الهاتف'}</div>
                      <div>{labelData.receiverAddress || 'العنوان الكامل'}</div>
                      <div className="font-bold">{labelData.receiverWilaya}</div>
                    </div>
                  </div>

                  {/* Package Details */}
                  <div className="mb-3 border border-gray-400 p-2">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>الوزن: {labelData.packageWeight} كغ</div>
                      <div>القيمة: {labelData.packageValue} دج</div>
                      <div>النوع: {labelData.deliveryType}</div>
                      <div>{labelData.paymentMethod}</div>
                    </div>
                  </div>

                  {/* Product Info */}
                  {product && (
                    <div className="mb-3 border border-gray-400 p-2">
                      <div className="text-xs">
                        <div className="font-bold">المنتج: {product.name}</div>
                        <div>الكود: {product.code}</div>
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {labelData.notes && (
                    <div className="mb-3 border border-gray-400 p-2">
                      <div className="text-xs">
                        <div className="font-bold">ملاحظات:</div>
                        <div>{labelData.notes}</div>
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="text-center text-xs border-t border-gray-400 pt-2">
                    <div>شكراً لاختياركم متجرنا</div>
                    <div>Thank you for choosing our store</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}