/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileNav from './components/MobileNav';
import Home from './pages/Home';
import CartPage from './pages/CartPage';
import CatalogPage from './pages/CatalogPage';
import Drawer from './components/Drawer';
import UserProfileModal from './components/UserProfileModal';

export default function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <BrowserRouter>
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          <Header 
            onOpenDrawer={() => setIsDrawerOpen(true)} 
            onOpenProfile={() => setIsProfileOpen(true)} 
          />
          <main className="flex-1 w-full pt-16 pb-20 md:pb-12 bg-surface">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/cart" element={<CartPage />} />
            </Routes>
          </main>
          <Footer />
          <MobileNav />
          <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
          <UserProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}
