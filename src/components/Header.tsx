import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import AdminLoginModal from './AdminLoginModal';

export default function Header({ onOpenDrawer, onOpenProfile }: { onOpenDrawer: () => void, onOpenProfile: () => void }) {
  const { cart } = useCart();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    onOpenProfile();
  };

  const handleAdminClick = () => {
    setIsDropdownOpen(false);
    setIsAdminModalOpen(true);
  };

  return (
    <>
      <header className="fixed top-0 inset-x-0 w-full z-40 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(74,107,91,0.06)]">
        <div className="h-16 max-w-7xl mx-auto px-margin-mobile md:px-margin flex items-center justify-between">
          
          <div className="flex items-center gap-space-sm">
            <button 
              aria-label="فتح القائمة" 
              className="p-space-xs rounded-lg text-on-surface hover:bg-surface-container-high transition-colors focus:outline-none md:hidden" 
              onClick={onOpenDrawer} 
              type="button"
            >
              <span className="material-symbols-outlined text-[26px]">menu</span>
            </button>
            
            <nav className="hidden md:flex items-center gap-space-lg me-space-md">
              <Link to="/" className="transition-colors px-space-sm py-space-xs bg-secondary-container text-on-secondary-container font-semibold rounded-lg">الرئيسية</Link>
              <Link to="/catalog" className="font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors px-space-sm py-space-xs">باقات الورد</Link>
              <a href="#" className="font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors px-space-sm py-space-xs">المناسبات</a>
              <a href="#" className="font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors px-space-sm py-space-xs">الهدايا</a>
              <a href="#" className="font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors px-space-sm py-space-xs">تواصل معنا</a>
            </nav>
          </div>

          <div className="flex items-center gap-space-sm">
            <img alt="Flower Shop Logo" className="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1U-9a53-m3gc6eNNYCedZUTEIkS6V1-1JuPa51b7sAPsYsTnAA59eskA10_3WVIzyiHIKgE3SmRInqPv63YicE-wyadHuzX9A6K4wjyb8KiJwxrD3ltkC-hwIdVcW4dbvW9ryx_DlrFePr_CkWqkHRxKjznT3b9yW5NqrCWVFrG9UuRvRT0QQ4sdXxOjDQMoEFAVELX98aLuB33MomHBZ8ssTRFPa4EfBSgdoqh_ff-ITzadwmFnRdC8x8"/>
            <Link to="/" className="font-headline-md text-headline-md font-semibold text-primary tracking-tight">متجر الزهور</Link>
          </div>

          <div className="flex items-center gap-space-sm">
            <a aria-label="اتصل بنا" className="hidden sm:flex p-space-xs rounded-full text-secondary hover:bg-surface-container-high transition-colors items-center justify-center" href="tel:+966500000000">
              <span className="material-symbols-outlined text-[22px]">call</span>
            </a>
            <Link aria-label="سلة المشتريات" to="/cart" className="relative p-space-xs rounded-full text-secondary hover:bg-surface-container-high transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">shopping_bag</span>
              {itemCount > 0 && (
                <span className="absolute top-0 start-0 transform -translate-x-1 -translate-y-0.5 bg-primary text-on-primary font-label-sm text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            
            <div className="relative ms-space-xs" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                className="w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-primary-container transition-colors"
              >
                <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full end-0 mt-2 w-48 bg-surface rounded-xl shadow-lg border border-outline-variant py-2 flex flex-col z-50">
                  <button 
                    onClick={handleProfileClick}
                    className="flex items-center gap-2 px-4 py-3 text-right hover:bg-surface-container text-on-surface font-label-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">account_circle</span>
                    حسابي
                  </button>
                  <div className="h-px bg-outline-variant my-1"></div>
                  <button 
                    onClick={handleAdminClick}
                    className="flex items-center gap-2 px-4 py-3 text-right hover:bg-surface-container text-on-surface font-label-lg transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                    لوحة التحكم
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      <AdminLoginModal isOpen={isAdminModalOpen} onClose={() => setIsAdminModalOpen(false)} />
    </>
  );
}
