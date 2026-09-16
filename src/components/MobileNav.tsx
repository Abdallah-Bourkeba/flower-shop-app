import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function MobileNav() {
  const location = useLocation();
  const { cart } = useCart();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed md:hidden bottom-0 inset-x-0 w-full h-16 bg-surface/90 backdrop-blur-xl shadow-[0_-2px_12px_rgba(74,107,91,0.08)] z-50 flex items-center justify-around px-margin-mobile">
      <Link to="/" className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${isActive('/') ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'}`}>
        <span className="material-symbols-outlined text-[22px]">local_florist</span>
        <span className="font-label-sm text-label-sm">الرئيسية</span>
      </Link>
      
      <Link to="/catalog" className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${isActive('/catalog') ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'}`}>
        <span className="material-symbols-outlined text-[22px]">grid_view</span>
        <span className="font-label-sm text-label-sm">الأصناف</span>
      </Link>
      
      <Link to="/cart" className={`relative flex flex-col items-center justify-center gap-0.5 transition-colors ${isActive('/cart') ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-primary'}`}>
        <div className="relative flex items-center justify-center">
          <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
          {itemCount > 0 && (
            <span className="absolute -top-1 -end-2 bg-primary text-on-primary font-label-sm text-[10px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </div>
        <span className="font-label-sm text-label-sm">السلة</span>
      </Link>
    </nav>
  );
}
