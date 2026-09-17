import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

export default function AdminLayout() {
  const location = useLocation();

  const navItems = [
    { name: 'لوحة القيادة', path: '/admin', icon: 'dashboard' },
    { name: 'المنتجات', path: '/admin/products', icon: 'local_florist' },
    { name: 'المشتريات', path: '/admin/purchases', icon: 'receipt_long' },
    { name: 'المناديب', path: '/admin/drivers', icon: 'local_shipping' },
    { name: 'الإعدادات', path: '/admin/settings', icon: 'settings' },
  ];

  return (
    <div className="min-h-screen bg-surface-container-lowest flex flex-col md:flex-row" dir="rtl">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-surface shadow-sm md:h-screen md:sticky top-0 z-10 flex flex-col">
        <div className="p-space-md border-b border-outline-variant flex items-center justify-between md:justify-center">
          <Link to="/" className="font-headline-md font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-[28px]">yard</span>
            <span>لوحة التحكم</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-space-sm flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors whitespace-nowrap md:whitespace-normal shrink-0 md:shrink-none ${
                  isActive 
                    ? 'bg-secondary-container text-on-secondary-container font-semibold' 
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined" style={isActive ? {fontVariationSettings: "'FILL' 1"} : {}}>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-space-md border-t border-outline-variant hidden md:block">
          <Link to="/" className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[20px]">storefront</span>
            <span className="font-label-lg">العودة للمتجر</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-space-md md:p-space-xl overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
