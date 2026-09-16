import React from 'react';
import ProductCatalog from '../components/ProductCatalog';

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <ProductCatalog />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative w-full min-h-[92vh] flex items-center justify-center -mt-16 overflow-hidden">
      <div className="absolute inset-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDmjQzLvf9-3yHAf8wn4evaF5DpU1i5fQnv-aDzC-vgVXxA3noHF8Im_q6c00MITfqeoUW7HG9aXU2QK3-8Me4lwSN1pL5KOG1nJO_-vuPGgFS6L1DHj2fPILkM-IMyQhhY2Usu50O5cIjYsxtAu6mwYjDGiJiwUJV74O02mInyoNlsL69nGSuSUts91-vYIyhy29fbzACL5C1o47Kqqua5UWfSHq-g0-q3FFt2OIDS7sJs2JeQsrjV')" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-inverse-surface/85 via-inverse-surface/65 to-surface"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-4xl mx-auto px-margin-mobile md:px-margin pt-24 pb-16 flex flex-col items-center text-center">
        <div className="relative mb-space-md group">
          <div className="absolute -inset-2 bg-primary-container/30 rounded-full blur-xl transition-all duration-700 group-hover:bg-primary-container/50"></div>
          <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-surface-container-lowest/90 backdrop-blur-md p-1.5 shadow-2xl flex items-center justify-center ring-2 ring-primary-container/40">
            <img alt="شعار متجر الزهور" className="w-full h-full object-contain rounded-full transition-transform duration-500 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida/AEtjO1U-9a53-m3gc6eNNYCedZUTEIkS6V1-1JuPa51b7sAPsYsTnAA59eskA10_3WVIzyiHIKgE3SmRInqPv63YicE-wyadHuzX9A6K4wjyb8KiJwxrD3ltkC-hwIdVcW4dbvW9ryx_DlrFePr_CkWqkHRxKjznT3b9yW5NqrCWVFrG9UuRvRT0QQ4sdXxOjDQMoEFAVELX98aLuB33MomHBZ8ssTRFPa4EfBSgdoqh_ff-ITzadwmFnRdC8x8"/>
          </div>
        </div>

        <span className="inline-flex items-center gap-space-xs font-label-md text-label-md tracking-wider text-tertiary-fixed bg-surface-container-lowest/20 backdrop-blur-md px-space-md py-1 rounded-full mb-space-sm">
          <span className="material-symbols-outlined text-[15px]">spa</span>
          فن التنسيق النباتي والورود الفاخرة
        </span>

        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-surface-container-lowest mb-space-sm drop-shadow-md">
          متجر الزهور <span className="text-primary-fixed-dim font-serif italic text-[0.85em]">Flower Shop</span>
        </h1>

        <p className="font-title-md md:font-title-lg text-title-md md:text-title-lg text-surface-container-high/90 max-w-2xl mx-auto leading-relaxed mb-space-xl">
          أجمل باقات الزهور الطبيعية ولمسات الأناقة الراقية لكل مناسباتكم، تصاميم فريدة تعبّر عن مشاعركم برقي ودفء.
        </p>

        <div className="flex flex-row items-center justify-center gap-space-md w-full max-w-xs sm:max-w-md">
          <a className="flex-1 inline-flex items-center justify-center gap-space-xs h-12 px-space-lg rounded-full bg-primary text-on-primary font-label-lg text-label-lg shadow-xl shadow-primary/20 hover:bg-primary-container hover:shadow-2xl transition-all duration-300" href="#products-catalog">
            <span className="material-symbols-outlined text-[20px]">local_mall</span>
            <span>اطلب الآن</span>
          </a>
          
          <a className="flex-1 inline-flex items-center justify-center gap-space-xs h-12 px-space-lg rounded-full bg-surface-container-lowest/15 backdrop-blur-md text-surface-container-lowest font-label-lg text-label-lg shadow-lg hover:bg-surface-container-lowest/30 transition-all duration-300" href="#products-catalog">
            <span className="material-symbols-outlined text-[20px]">menu_book</span>
            <span>القائمة</span>
          </a>
        </div>

        <div className="mt-space-xl pt-space-lg flex items-center justify-center gap-space-lg text-surface-container-high/80 font-label-sm text-label-sm">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[17px] text-tertiary-fixed">verified</span>
            <span>ورود طبيعية ١٠٠٪</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-surface-container-high/40"></div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[17px] text-tertiary-fixed">bolt</span>
            <span>توصيل سريع في نفس اليوم</span>
          </div>
        </div>
      </div>
    </section>
  );
}
