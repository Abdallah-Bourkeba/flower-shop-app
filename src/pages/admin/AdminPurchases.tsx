import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Purchase } from '../../types';

export default function AdminPurchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPurchase, setCurrentPurchase] = useState<Partial<Purchase>>({});

  useEffect(() => {
    fetchPurchases();
  }, []);

  async function fetchPurchases() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('purchases').select('*').order('date', { ascending: false });
      if (error && error.code === '42P01') {
        // Table doesn't exist yet, handle gracefully or let empty array
        setPurchases([]);
      } else if (!error && data) {
        setPurchases(data as Purchase[]);
      } else if (error) {
         throw error;
      }
    } catch (err: any) {
      console.error(err);
    }
    setLoading(false);
  }

  const handleEdit = (purchase: Purchase) => {
    setCurrentPurchase(purchase);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentPurchase({ 
      date: new Date().toISOString().split('T')[0], 
      description: '', 
      cost_ex_tax: 0,
      tax_amount: 0,
      cost: 0, 
      category: 'raw_flowers' 
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه المصروفات؟')) return;
    const { error } = await supabase.from('purchases').delete().eq('id', id);
    if (!error) fetchPurchases();
    else alert(error.message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentPurchase.id) {
        const { error } = await supabase.from('purchases').update(currentPurchase).eq('id', currentPurchase.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('purchases').insert(currentPurchase);
        if (error) throw error;
      }
      setIsEditing(false);
      fetchPurchases();
    } catch (error: any) {
      alert(`Save Error: ${error.message}`);
    }
  };

  if (loading && !isEditing) return <div>جاري التحميل...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-space-xl">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">إدارة المشتريات والمصروفات</h1>
        {!isEditing && (
          <button 
            onClick={handleAddNew}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-xl font-label-lg hover:bg-primary-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            إضافة مصروفات
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-surface p-space-lg rounded-2xl shadow-sm border border-outline-variant">
          <h2 className="font-title-lg mb-6">{currentPurchase.id ? 'تعديل المصروفات' : 'إضافة مصروفات جديدة'}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-label-md mb-2">التاريخ</label>
                <input required type="date" value={currentPurchase.date || ''} onChange={e => setCurrentPurchase({...currentPurchase, date: e.target.value})} className="w-full bg-surface-container px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block font-label-md mb-2">الفئة</label>
                <select value={currentPurchase.category || 'raw_flowers'} onChange={e => setCurrentPurchase({...currentPurchase, category: e.target.value})} className="w-full bg-surface-container px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="raw_flowers">زهور خام</option>
                  <option value="packaging">تغليف ومستلزمات</option>
                  <option value="utilities">فواتير ومنافع</option>
                  <option value="other">أخرى</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block font-label-md mb-2">الوصف</label>
                <input required type="text" value={currentPurchase.description || ''} onChange={e => setCurrentPurchase({...currentPurchase, description: e.target.value})} className="w-full bg-surface-container px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block font-label-md mb-2">التكلفة بدون ضريبة (ر.س)</label>
                <input 
                  required 
                  type="number" 
                  step="0.01" 
                  value={currentPurchase.cost_ex_tax || ''} 
                  onChange={e => {
                    const exTax = Number(e.target.value);
                    const tax = currentPurchase.tax_amount || 0;
                    setCurrentPurchase({...currentPurchase, cost_ex_tax: exTax, cost: exTax + tax});
                  }} 
                  className="w-full bg-surface-container px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" 
                />
              </div>
              <div>
                <label className="block font-label-md mb-2">قيمة الضريبة (ر.س)</label>
                <input 
                  required 
                  type="number" 
                  step="0.01" 
                  value={currentPurchase.tax_amount || ''} 
                  onChange={e => {
                    const tax = Number(e.target.value);
                    const exTax = currentPurchase.cost_ex_tax || 0;
                    setCurrentPurchase({...currentPurchase, tax_amount: tax, cost: exTax + tax});
                  }} 
                  className="w-full bg-surface-container px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-label-md mb-2">التكلفة الإجمالية (ر.س) - محسوبة تلقائياً</label>
                <input required type="number" step="0.01" value={currentPurchase.cost || 0} readOnly className="w-full bg-surface-container-high text-on-surface-variant px-4 py-2 rounded-lg cursor-not-allowed" />
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t border-outline-variant">
              <button type="submit" className="px-6 py-2 bg-primary text-on-primary rounded-xl font-label-lg hover:bg-primary-container transition-colors">
                حفظ
              </button>
              <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 bg-surface-container-high text-on-surface rounded-xl font-label-lg hover:bg-surface-container-highest transition-colors">
                إلغاء
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-surface-container-lowest border-b border-outline-variant text-on-surface-variant font-label-lg">
                <tr>
                  <th className="p-4 font-medium">التاريخ</th>
                  <th className="p-4 font-medium">الوصف</th>
                  <th className="p-4 font-medium">الفئة</th>
                  <th className="p-4 font-medium">بدون ضريبة</th>
                  <th className="p-4 font-medium">الضريبة</th>
                  <th className="p-4 font-medium">الإجمالي</th>
                  <th className="p-4 font-medium text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {purchases.map(purchase => (
                  <tr key={purchase.id} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="p-4 text-on-surface-variant">{purchase.date}</td>
                    <td className="p-4 font-title-md text-on-surface">{purchase.description}</td>
                    <td className="p-4 text-on-surface-variant">
                      {purchase.category === 'raw_flowers' ? 'زهور خام' : 
                       purchase.category === 'packaging' ? 'تغليف' : 
                       purchase.category === 'utilities' ? 'فواتير' : 'أخرى'}
                    </td>
                    <td className="p-4 text-on-surface-variant">{purchase.cost_ex_tax || 0}</td>
                    <td className="p-4 text-on-surface-variant">{purchase.tax_amount || 0}</td>
                    <td className="p-4 font-bold text-error">{purchase.cost} ر.س</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleEdit(purchase)} className="p-2 text-secondary hover:bg-secondary-container rounded-lg transition-colors">
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button onClick={() => handleDelete(purchase.id)} className="p-2 text-error hover:bg-error-container rounded-lg transition-colors">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {purchases.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-on-surface-variant">لا توجد سجلات مشتريات.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
