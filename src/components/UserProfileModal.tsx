import React, { useEffect, useState } from 'react';

export default function UserProfileModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(localStorage.getItem('customerName') || '');
      setEmail(localStorage.getItem('customerEmail') || '');
      setPhone(localStorage.getItem('customerPhone') || '');
      setIsEditing(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem('customerName', name);
    localStorage.setItem('customerEmail', email);
    localStorage.setItem('customerPhone', phone);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-surface rounded-2xl p-6 w-full max-w-sm shadow-2xl relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 end-4 text-on-surface-variant hover:text-on-surface transition-colors">
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-2xl font-bold mb-3">
            {name && !isEditing ? name.charAt(0) : <span className="material-symbols-outlined text-[32px]">person</span>}
          </div>
          {!isEditing && <h2 className="font-title-lg text-title-lg text-on-surface">{name || 'زائر كريم'}</h2>}
        </div>
        
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block font-label-md mb-1 text-on-surface">الاسم</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-surface-container px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="الاسم الكامل" />
            </div>
            <div>
              <label className="block font-label-md mb-1 text-on-surface">الإيميل</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-surface-container px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-left" dir="ltr" placeholder="example@email.com" />
            </div>
            <div>
              <label className="block font-label-md mb-1 text-on-surface">رقم الهاتف</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-surface-container px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-left" dir="ltr" placeholder="05xxxxxxxx" />
            </div>
            <div className="pt-2 flex gap-2">
              <button onClick={handleSave} className="flex-1 py-2 bg-primary text-on-primary rounded-lg font-label-lg hover:bg-primary-container transition-colors">حفظ</button>
              <button onClick={() => setIsEditing(false)} className="flex-1 py-2 bg-surface-container-high text-on-surface rounded-lg font-label-lg hover:bg-surface-container-highest transition-colors">إلغاء</button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-surface-container p-3 rounded-lg flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary">mail</span>
              <span className="font-body-md text-on-surface w-full text-right" dir="ltr">{email || 'غير مسجل'}</span>
            </div>
            <div className="bg-surface-container p-3 rounded-lg flex items-center gap-3">
              <span className="material-symbols-outlined text-secondary">phone</span>
              <span className="font-body-md text-on-surface w-full text-right" dir="ltr">{phone || 'غير مسجل'}</span>
            </div>
            <button onClick={() => setIsEditing(true)} className="w-full mt-4 py-2 bg-secondary-container text-on-secondary-container rounded-lg font-label-lg hover:bg-secondary hover:text-on-secondary transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px]">edit</span>
              تعديل البيانات
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
