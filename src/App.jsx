import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import NotificationCenter from './components/NotificationCenter';
import AlertCenter from './components/AlertCenter';
import ToastContainer from './components/ToastContainer';
import ThemeProvider from './components/ThemeProvider';
import ThemeToggle from './components/ThemeToggle';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Inventory from './pages/Inventory';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import { useStore } from './store/useStore';

function App() {
  const { sidebarOpen, setSidebarOpen, toggleSidebar } = useStore();

  return (
    <ThemeProvider>
      <Router>
        <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <ToastContainer />
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Navigation Bar */}
          <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm relative z-50" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleSidebar}
                  className="lg:hidden p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <div className="hidden lg:block">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    نظام إدارة المخزون المتقدم
                  </h1>
                  <p className="text-sm text-gray-500">إدارة ذكية ومتطورة للمخزون</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <ThemeToggle />
                <AlertCenter />
                <NotificationCenter />
                <div className="text-right">
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>مرحباً بك</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{new Date().toLocaleDateString('ar-SA')}</p>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-x-hidden overflow-y-auto p-6 relative z-10" style={{ backgroundColor: 'var(--bg-primary)' }}>
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
      </div>

        {/* Toast Notifications */}
        <ToastContainer />
      </Router>
    </ThemeProvider>
  );
}

export default App;