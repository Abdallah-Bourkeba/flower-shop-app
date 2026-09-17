/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileNav from './components/MobileNav';
import Home from './pages/Home';
import CartPage from './pages/CartPage';
import CatalogPage from './pages/CatalogPage';
import Drawer from './components/Drawer';
import UserProfileModal from './components/UserProfileModal';

// Admin Components
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminDrivers from './pages/admin/AdminDrivers';
import AdminPurchases from './pages/admin/AdminPurchases';
import AdminOrders from './pages/admin/AdminOrders';
import AdminSettings from './pages/admin/AdminSettings';

function StoreLayout({ isDrawerOpen, setIsDrawerOpen, isProfileOpen, setIsProfileOpen }: any) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        onOpenDrawer={() => setIsDrawerOpen(true)} 
        onOpenProfile={() => setIsProfileOpen(true)} 
      />
      <main className="flex-1 w-full pt-16 pb-20 md:pb-12 bg-surface">
        <Outlet />
      </main>
      <Footer />
      <MobileNav />
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      <UserProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
}

function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAdmin = sessionStorage.getItem('isAdminLoggedin') === 'true';
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children ? <>{children}</> : <Outlet />;
}

export default function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          {/* Storefront Routes */}
          <Route element={<StoreLayout 
              isDrawerOpen={isDrawerOpen} 
              setIsDrawerOpen={setIsDrawerOpen} 
              isProfileOpen={isProfileOpen} 
              setIsProfileOpen={setIsProfileOpen} 
            />}
          >
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/cart" element={<CartPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="drivers" element={<AdminDrivers />} />
            <Route path="purchases" element={<AdminPurchases />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}
