import React, { useRef, useEffect, useState } from 'react';
import Quagga from 'quagga';
import { Camera, CameraOff, Search, CheckCircle, XCircle } from 'lucide-react';

export default function BarcodeScanner({ onScan, onClose }) {
  const scannerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedCodes, setScannedCodes] = useState([]);
  const [error, setError] = useState(null);
  const [manualCode, setManualCode] = useState('');

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    try {
      setError(null);
      setIsScanning(true);

      // Check if camera is available
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      if (videoDevices.length === 0) {
        throw new Error('لا توجد كاميرا متاحة');
      }

      Quagga.init({
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: scannerRef.current,
          constraints: {
            width: 640,
            height: 480,
            facingMode: "environment" // Use back camera if available
          }
        },
        locator: {
          patchSize: "medium",
          halfSample: true
        },
        numOfWorkers: 2,
        frequency: 10,
        decoder: {
          readers: [
            "code_128_reader",
            "ean_reader",
            "ean_8_reader",
            "code_39_reader",
            "code_39_vin_reader",
            "codabar_reader",
            "upc_reader",
            "upc_e_reader",
            "i2of5_reader"
          ]
        },
        locate: true
      }, (err) => {
        if (err) {
          console.error('Error initializing Quagga:', err);
          setError('خطأ في تشغيل الكاميرا: ' + err.message);
          setIsScanning(false);
          return;
        }
        
        Quagga.start();
        
        // Listen for successful scans
        Quagga.onDetected((result) => {
          const code = result.codeResult.code;
          
          // Avoid duplicate scans
          if (!scannedCodes.includes(code)) {
            setScannedCodes(prev => [...prev, code]);
            
            // Show success toast
            const event = new CustomEvent('show-toast', {
              detail: {
                title: 'تم مسح الباركود',
                message: `الكود: ${code}`,
                type: 'success'
              }
            });
            window.dispatchEvent(event);
            
            // Call the onScan callback
            if (onScan) {
              onScan(code);
            }
          }
        });
      });
    } catch (error) {
      console.error('Error starting scanner:', error);
      setError('خطأ في الوصول للكاميرا: ' + error.message);
      setIsScanning(false);
    }
  };

  const stopScanner = () => {
    if (isScanning) {
      Quagga.stop();
      setIsScanning(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (manualCode.trim()) {
      if (onScan) {
        onScan(manualCode.trim());
      }
      setManualCode('');
      
      // Show success toast
      const event = new CustomEvent('show-toast', {
        detail: {
          title: 'تم إدخال الكود',
          message: `الكود: ${manualCode.trim()}`,
          type: 'success'
        }
      });
      window.dispatchEvent(event);
    }
  };

  const clearScannedCodes = () => {
    setScannedCodes([]);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-sm">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-gradient-to-br from-slate-900/50 via-blue-900/30 to-purple-900/50" onClick={onClose} />
        
        <div className="relative bg-white/95 backdrop-blur-lg rounded-3xl max-w-4xl w-full p-8 shadow-2xl border border-white/20">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                <Camera className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  قارئ الباركود
                </h3>
                <p className="text-gray-600">
                  امسح الباركود باستخدام الكاميرا أو أدخل الكود يدوياً
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
            {/* Camera Scanner */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200/50">
                <h4 className="text-lg font-bold text-gray-900 mb-4">مسح بالكاميرا</h4>
                
                <div className="bg-black rounded-xl overflow-hidden relative" style={{ height: '300px' }}>
                  <div ref={scannerRef} className="w-full h-full" />
                  
                  {!isScanning && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
                      <div className="text-center text-white">
                        <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">اضغط لبدء المسح</p>
                      </div>
                    </div>
                  )}
                  
                  {error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-900/50">
                      <div className="text-center text-white p-4">
                        <XCircle className="h-16 w-16 mx-auto mb-4" />
                        <p className="text-lg font-medium">{error}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 mt-4">
                  {!isScanning ? (
                    <button
                      onClick={startScanner}
                      className="flex-1 flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      <Camera className="h-5 w-5" />
                      بدء المسح
                    </button>
                  ) : (
                    <button
                      onClick={stopScanner}
                      className="flex-1 flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      <CameraOff className="h-5 w-5" />
                      إيقاف المسح
                    </button>
                  )}
                </div>
              </div>

              {/* Manual Input */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50">
                <h4 className="text-lg font-bold text-gray-900 mb-4">إدخال يدوي</h4>
                
                <form onSubmit={handleManualSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">كود الباركود</label>
                    <input
                      type="text"
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value)}
                      placeholder="أدخل كود الباركود..."
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-lg font-mono"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={!manualCode.trim()}
                    className="w-full flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <Search className="h-5 w-5" />
                    بحث عن المنتج
                  </button>
                </form>
              </div>
            </div>

            {/* Scanned Codes History */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200/50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-gray-900">الأكواد الممسوحة</h4>
                  {scannedCodes.length > 0 && (
                    <button
                      onClick={clearScannedCodes}
                      className="text-sm text-red-600 hover:text-red-800 font-medium"
                    >
                      مسح الكل
                    </button>
                  )}
                </div>
                
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {scannedCodes.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">لم يتم مسح أي أكواد بعد</p>
                      <p className="text-gray-400 text-sm">ستظهر الأكواد الممسوحة هنا</p>
                    </div>
                  ) : (
                    scannedCodes.map((code, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="font-mono font-bold text-gray-900">{code}</p>
                            <p className="text-xs text-gray-500">
                              {new Date().toLocaleTimeString('ar-SA')}
                            </p>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => onScan && onScan(code)}
                          className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                        >
                          استخدام
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200/50">
                <h4 className="text-lg font-bold text-gray-900 mb-4">تعليمات الاستخدام</h4>
                
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 font-bold text-xs">1</span>
                    </div>
                    <p>اضغط على "بدء المسح" لتشغيل الكاميرا</p>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 font-bold text-xs">2</span>
                    </div>
                    <p>وجه الكاميرا نحو الباركود بحيث يكون واضحاً في الإطار</p>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 font-bold text-xs">3</span>
                    </div>
                    <p>سيتم مسح الباركود تلقائياً عند التعرف عليه</p>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 font-bold text-xs">4</span>
                    </div>
                    <p>يمكنك أيضاً إدخال الكود يدوياً في الحقل المخصص</p>
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
