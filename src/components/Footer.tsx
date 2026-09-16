import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-low hidden md:block py-space-xl">
      <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin flex flex-col md:flex-row items-center justify-between gap-space-md text-center md:text-right">
        <div className="flex items-center gap-space-sm">
          <img alt="Flower Boutique Logo" className="h-6 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1U-9a53-m3gc6eNNYCedZUTEIkS6V1-1JuPa51b7sAPsYsTnAA59eskA10_3WVIzyiHIKgE3SmRInqPv63YicE-wyadHuzX9A6K4wjyb8KiJwxrD3ltkC-hwIdVcW4dbvW9ryx_DlrFePr_CkWqkHRxKjznT3b9yW5NqrCWVFrG9UuRvRT0QQ4sdXxOjDQMoEFAVELX98aLuB33MomHBZ8ssTRFPa4EfBSgdoqh_ff-ITzadwmFnRdC8x8"/>
          <span className="font-headline-md text-headline-md font-semibold text-primary">متجر الزهور</span>
          <span className="font-body-md text-body-md text-on-surface-variant me-space-sm">– ملاذ الأناقة النباتية والورود النادرة</span>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant">جميع الحقوق محفوظة © 2024 متجر الزهور للأعمال النباتية الراقية.</p>
      </div>
    </footer>
  );
}
