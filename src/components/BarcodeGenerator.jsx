import React, { useRef, useEffect, useState } from 'react';
import JsBarcode from 'jsbarcode';
import { Download, Printer, Copy, RefreshCw } from 'lucide-react';

export default function BarcodeGenerator({ productCode, productName, onClose }) {
  const canvasRef = useRef(null);
  const [barcodeFormat, setBarcodeFormat] = useState('CODE128');
  const [barcodeSize, setBarcodeSize] = useState('medium');
  const [includeText, setIncludeText] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [validationError, setValidationError] = useState(null);

  const sizeOptions = {
    small: { width: 1, height: 50, fontSize: 12 },
    medium: { width: 2, height: 80, fontSize: 16 },
    large: { width: 3, height: 120, fontSize: 20 }
  };

  const formatOptions = [
    { value: 'CODE128', label: 'CODE128 (الأكثر شيوعاً)' },
    { value: 'CODE39', label: 'CODE39' },
    { value: 'EAN13', label: 'EAN13 (13 رقم)' },
    { value: 'EAN8', label: 'EAN8 (8 أرقام)' },
    { value: 'UPC', label: 'UPC' },
    { value: 'ITF14', label: 'ITF14' }
  ];

  // Validation function for barcode formats
  const validateBarcodeInput = (code, format) => {
    if (!code) return 'كود المنتج مطلوب';
    
    switch (format) {
      case 'EAN13':
        if (!/^\d{12,13}$/.test(code)) {
          return 'EAN13 يتطلب 12-13 رقم فقط';
        }
        break;
      case 'EAN8':
        if (!/^\d{7,8}$/.test(code)) {
          return 'EAN8 يتطلب 7-8 أرقام فقط';
        }
        break;
      case 'UPC':
        if (!/^\d{11,12}$/.test(code)) {
          return 'UPC يتطلب 11-12 رقم فقط';
        }
        break;
      case 'ITF14':
        if (!/^\d{13,14}$/.test(code)) {
          return 'ITF14 يتطلب 13-14 رقم فقط';
        }
        break;
      case 'CODE39':
        if (!/^[A-Z0-9\-. $/+%]+$/.test(code)) {
          return 'CODE39 يدعم الأحرف الكبيرة والأرقام والرموز المحددة فقط';
        }
        break;
      case 'CODE128':
        // CODE128 supports most characters, very flexible
        if (code.length === 0) {
          return 'كود المنتج لا يمكن أن يكون فارغاً';
        }
        break;
      default:
        return null;
    }
    return null;
  };

  // Generate barcode
  useEffect(() => {
    if (canvasRef.current && productCode) {
      // Validate input first
      const error = validateBarcodeInput(productCode, barcodeFormat);
      setValidationError(error);
      
      if (error) {
        // Show error message on canvas
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('خطأ في التحقق من الكود', canvasRef.current.width / 2, canvasRef.current.height / 2 - 10);
        ctx.font = '14px Arial';
        ctx.fillText(error, canvasRef.current.width / 2, canvasRef.current.height / 2 + 15);
        return;
      }
      
      try {
        const size = sizeOptions[barcodeSize];
        
        JsBarcode(canvasRef.current, productCode, {
          format: barcodeFormat,
          width: size.width,
          height: size.height,
          displayValue: includeText,
          fontSize: size.fontSize,
          background: backgroundColor,
          lineColor: foregroundColor,
          margin: 10,
          textAlign: 'center',
          textPosition: 'bottom',
          font: 'Arial',
          fontOptions: 'bold'
        });
      } catch (error) {
        console.error('Error generating barcode:', error);
        // Show error message on canvas
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.fillStyle = '#ef4444';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('خطأ في توليد الباركود', canvasRef.current.width / 2, canvasRef.current.height / 2);
        ctx.fillText('تحقق من الكود والتنسيق', canvasRef.current.width / 2, canvasRef.current.height / 2 + 20);
      }
    }
  }, [productCode, barcodeFormat, barcodeSize, includeText, backgroundColor, foregroundColor]);

  // Download barcode as image
  const downloadBarcode = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `barcode-${productCode}.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  // Print barcode
  const printBarcode = () => {
    if (canvasRef.current) {
      const printWindow = window.open('', '_blank');
      const imageData = canvasRef.current.toDataURL();
      
      printWindow.document.write(`
        <html>
          <head>
            <title>طباعة باركود - ${productName}</title>
            <style>
              body {
                margin: 0;
                padding: 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
                font-family: Arial, sans-serif;
              }
              .barcode-container {
                text-align: center;
                margin: 20px;
                padding: 20px;
                border: 2px solid #000;
                border-radius: 10px;
              }
              .product-info {
                margin-bottom: 15px;
                font-size: 14px;
                font-weight: bold;
              }
              .barcode-image {
                margin: 10px 0;
              }
              @media print {
                body { margin: 0; }
                .barcode-container { border: 1px solid #000; }
              }
            </style>
          </head>
          <body>
            <div class="barcode-container">
              <div class="product-info">
                <div>اسم المنتج: ${productName}</div>
                <div>كود المنتج: ${productCode}</div>
                <div>تاريخ الطباعة: ${new Date().toLocaleDateString('ar-SA')}</div>
              </div>
              <div class="barcode-image">
                <img src="${imageData}" alt="Barcode" />
              </div>
            </div>
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

  // Copy barcode to clipboard
  const copyBarcode = async () => {
    if (canvasRef.current) {
      try {
        const canvas = canvasRef.current;
        canvas.toBlob(async (blob) => {
          const item = new ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([item]);
          
          // Show success message
          const event = new CustomEvent('show-toast', {
            detail: {
              title: 'تم النسخ',
              message: 'تم نسخ الباركود إلى الحافظة',
              type: 'success'
            }
          });
          window.dispatchEvent(event);
        });
      } catch (error) {
        console.error('Error copying barcode:', error);
        
        // Show error message
        const event = new CustomEvent('show-toast', {
          detail: {
            title: 'خطأ في النسخ',
            message: 'لم يتم نسخ الباركود',
            type: 'error'
          }
        });
        window.dispatchEvent(event);
      }
    }
  };

  // Generate random code
  const generateRandomCode = () => {
    const randomCode = Math.random().toString().substr(2, 12);
    return randomCode;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900/50 via-blue-900/30 to-purple-900/50" onClick={onClose} />
        
        <div className="relative bg-white/95 backdrop-blur-lg rounded-3xl max-w-4xl w-full p-8 shadow-2xl border border-white/20">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">📊</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  مولد الباركود
                </h3>
                <p className="text-gray-600">
                  {productName} - {productCode}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all duration-300 hover:scale-110"
            >
              <span className="text-gray-600 text-xl">✕</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Barcode Preview */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200/50">
                <h4 className="text-lg font-bold text-gray-900 mb-4">معاينة الباركود</h4>
                <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-dashed border-gray-300 text-center">
                  <canvas
                    ref={canvasRef}
                    className="mx-auto max-w-full"
                    style={{ backgroundColor: backgroundColor }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={downloadBarcode}
                  disabled={validationError}
                  className={`flex flex-col items-center p-4 rounded-xl transition-all duration-300 ${
                    validationError 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg transform hover:scale-105'
                  }`}
                >
                  <Download className="h-6 w-6 mb-2" />
                  <span className="text-sm font-medium">تحميل</span>
                </button>
                
                <button
                  onClick={printBarcode}
                  disabled={validationError}
                  className={`flex flex-col items-center p-4 rounded-xl transition-all duration-300 ${
                    validationError 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg transform hover:scale-105'
                  }`}
                >
                  <Printer className="h-6 w-6 mb-2" />
                  <span className="text-sm font-medium">طباعة</span>
                </button>
                
                <button
                  onClick={copyBarcode}
                  disabled={validationError}
                  className={`flex flex-col items-center p-4 rounded-xl transition-all duration-300 ${
                    validationError 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:shadow-lg transform hover:scale-105'
                  }`}
                >
                  <Copy className="h-6 w-6 mb-2" />
                  <span className="text-sm font-medium">نسخ</span>
                </button>
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200/50">
                <h4 className="text-lg font-bold text-gray-900 mb-4">إعدادات الباركود</h4>
                
                <div className="space-y-4">
                  {/* Format */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">نوع الباركود</label>
                    <select
                      value={barcodeFormat}
                      onChange={(e) => setBarcodeFormat(e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all duration-300"
                    >
                      {formatOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Size */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">الحجم</label>
                    <select
                      value={barcodeSize}
                      onChange={(e) => setBarcodeSize(e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all duration-300"
                    >
                      <option value="small">صغير</option>
                      <option value="medium">متوسط</option>
                      <option value="large">كبير</option>
                    </select>
                  </div>

                  {/* Include Text */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-gray-700">إظهار النص</label>
                    <button
                      onClick={() => setIncludeText(!includeText)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        includeText ? 'bg-amber-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          includeText ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Colors */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">لون الخلفية</label>
                      <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-full h-12 rounded-xl border-2 border-gray-200 cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">لون الباركود</label>
                      <input
                        type="color"
                        value={foregroundColor}
                        onChange={(e) => setForegroundColor(e.target.value)}
                        className="w-full h-12 rounded-xl border-2 border-gray-200 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Validation Error Message */}
              {validationError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 text-lg">⚠️</span>
                    </div>
                    <div>
                      <h5 className="font-bold text-red-800 mb-1">خطأ في التحقق</h5>
                      <p className="text-red-700 text-sm">{validationError}</p>
                      <p className="text-red-600 text-xs mt-1">
                        يرجى تغيير نوع الباركود أو تعديل كود المنتج
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
