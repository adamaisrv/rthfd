import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BottomNavbar from './components/BottomNavbar';
import NotificationCenter from './components/NotificationCenter';
import AlertCenter from './components/AlertCenter';
import ToastContainer from './components/ToastContainer';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Inventory from './pages/Inventory';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import { useStore } from './store/useStore';

function App() {
  const { toggleSidebar } = useStore();

  return (
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pb-20">
          <ToastContainer />
        <div className="flex flex-col min-h-screen">
          {/* Top Navigation Bar */}
          <header className="bg-white backdrop-blur-lg border-b border-gray-200 shadow-sm relative z-50">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">م</span>
                  </div>
                  <h1 className="text-xl font-bold text-gray-900">
                    نظام إدارة المخزون المتقدم
                  </h1>
                  <p className="text-sm text-gray-500">إدارة ذكية ومتطورة للمخزون</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <AlertCenter />
                <NotificationCenter />
                <div className="text-right bg-gradient-to-br from-gray-50 to-slate-50 px-4 py-2 rounded-2xl border border-gray-200/50 shadow-sm">
                  <p className="text-sm font-medium text-gray-900">مرحباً بك</p>
                  <p className="text-xs text-gray-500">{new Date().toLocaleDateString('ar-SA')}</p>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 relative z-10 bg-gray-50 pb-4">
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </div>
          </main>
        </div>
        
        {/* Bottom Navigation */}
        <BottomNavbar />
      </div>
      </Router>
  );
}

export default App;