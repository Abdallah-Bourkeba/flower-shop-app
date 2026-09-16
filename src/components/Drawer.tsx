import React from 'react';
import { Link } from 'react-router-dom';

export default function Drawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  return (
    <>
      <div className={`fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}></div>
      <aside className={`fixed top-0 right-0 h-full w-72 bg-surface-container-low shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col justify-between p-space-lg ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col gap-space-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-sm">
              <img alt="Flower Shop Logo" className="h-7 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1U-9a53-m3gc6eNNYCedZUTEIkS6V1-1JuPa51b7sAPsYsTnAA59eskA10_3WVIzyiHIKgE3SmRInqPv63YicE-wyadHuzX9A6K4wjyb8KiJwxrD3ltkC-hwIdVcW4dbvW9ryx_DlrFePr_CkWqkHRxKjznT3b9yW5NqrCWVFrG9UuRvRT0QQ4sdXxOjDQMoEFAVELX98aLuB33MomHBZ8ssTRFPa4EfBSgdoqh_ff-ITzadwmFnRdC8x8"/>
              <span className="font-headline-md text-headline-md font-semibold text-primary">متجر الزهور</span>
            </div>
            <button onClick={onClose} className="p-space-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <nav className="flex flex-col gap-space-sm mt-space-md">
            <Link to="/" onClick={onClose} className="px-space-md py-space-sm transition-colors flex items-center justify-between hover:bg-surface-container-high rounded-lg font-title-md text-on-surface-variant">الرئيسية<span className="material-symbols-outlined text-outline-variant text-[20px]">arrow_back_ios</span></Link>
            <Link to="/catalog" onClick={onClose} className="px-space-md py-space-sm transition-colors flex items-center justify-between hover:bg-surface-container-high rounded-lg font-title-md text-on-surface-variant">باقات الورد<span className="material-symbols-outlined text-outline-variant text-[20px]">arrow_back_ios</span></Link>
            <Link to="/cart" onClick={onClose} className="px-space-md py-space-sm transition-colors flex items-center justify-between hover:bg-surface-container-high rounded-lg font-title-md text-on-surface-variant">السلة<span className="material-symbols-outlined text-outline-variant text-[20px]">arrow_back_ios</span></Link>
          </nav>
        </div>
        <div className="p-space-md rounded-xl bg-surface-container-high/60 flex flex-col gap-space-xs mt-auto">
          <span className="font-label-sm text-label-sm text-secondary font-medium">خدمة العملاء الفاخرة</span>
          <a className="font-body-md text-body-md text-on-surface font-semibold dir-ltr text-right" href="tel:+966500000000">+966 50 000 0000</a>
        </div>
      </aside>
    </>
  );
}
