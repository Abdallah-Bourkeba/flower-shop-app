import React, { useEffect, useState } from 'react';

export default function UserProfileModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(localStorage.getItem('customerName') || '');
      setEmail(localStorage.getItem('customerEmail') || '');
      setPhone(localStorage.getItem('customerPhone') || '');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-surface rounded-2xl p-6 w-full max-w-sm shadow-2xl relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 end-4 text-on-surface-variant hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-2xl font-bold mb-3">
            {name ? name.charAt(0) : <span className="material-symbols-outlined text-[32px]">person</span>}
          </div>
          <h2 className="font-title-lg text-title-lg text-on-surface">{name || 'زائر كريم'}</h2>
        </div>
        
        <div className="space-y-4">
          <div className="bg-surface-container p-3 rounded-lg flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary">mail</span>
            <span className="font-body-md text-on-surface">{email || 'غير مسجل'}</span>
          </div>
          <div className="bg-surface-container p-3 rounded-lg flex items-center gap-3">
            <span className="material-symbols-outlined text-secondary">phone</span>
            <span className="font-body-md text-on-surface" dir="ltr">{phone || 'غير مسجل'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
