import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLoginModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'Admin123') {
      sessionStorage.setItem('isAdminLoggedin', 'true');
      setError('');
      onClose();
      navigate('/admin');
    } else {
      setError('بيانات الدخول غير صحيحة');
    }
  };

  return (
    <div className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose} dir="rtl">
      <div className="bg-surface rounded-2xl p-6 w-full max-w-sm shadow-2xl relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 start-4 text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container">
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-3xl font-bold mb-3">
            <span className="material-symbols-outlined text-[32px]">admin_panel_settings</span>
          </div>
          <h2 className="font-title-lg text-title-lg text-on-surface">تسجيل دخول الإدارة</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-error-container text-on-error-container rounded-lg text-sm text-center">
              {error}
            </div>
          )}
          <div>
            <label className="block font-label-md mb-1 text-on-surface">اسم المستخدم</label>
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              className="w-full bg-surface-container px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-left" 
              dir="ltr" 
              placeholder="admin" 
              required
            />
          </div>
          <div>
            <label className="block font-label-md mb-1 text-on-surface">كلمة المرور</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full bg-surface-container px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-left" 
              dir="ltr" 
              placeholder="••••••••" 
              required
            />
          </div>
          <div className="pt-2">
            <button type="submit" className="w-full py-2 bg-primary text-on-primary rounded-lg font-label-lg hover:bg-primary-container transition-colors">دخول</button>
          </div>
        </form>
      </div>
    </div>
  );
}
