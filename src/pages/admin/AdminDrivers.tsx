import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Driver } from '../../types';

export default function AdminDrivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDriver, setCurrentDriver] = useState<Partial<Driver>>({});

  useEffect(() => {
    fetchDrivers();
  }, []);

  async function fetchDrivers() {
    setLoading(true);
    const { data, error } = await supabase.from('drivers').select('*').order('created_at', { ascending: false });
    if (!error && data) setDrivers(data as Driver[]);
    setLoading(false);
  }

  const handleEdit = (driver: Driver) => {
    setCurrentDriver(driver);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentDriver({ name: '', phone: '', assigned_city: '', assigned_district: '' });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المندوب؟')) return;
    const { error } = await supabase.from('drivers').delete().eq('id', id);
    if (!error) fetchDrivers();
    else alert(error.message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentDriver.id) {
        const { error } = await supabase.from('drivers').update(currentDriver).eq('id', currentDriver.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('drivers').insert(currentDriver);
        if (error) throw error;
      }
      setIsEditing(false);
      fetchDrivers();
    } catch (error: any) {
      alert(`Save Error: ${error.message}`);
    }
  };

  if (loading && !isEditing) return <div>جاري التحميل...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-space-xl">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">إدارة المناديب</h1>
        {!isEditing && (
          <button 
            onClick={handleAddNew}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-xl font-label-lg hover:bg-primary-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            إضافة مندوب
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-surface p-space-lg rounded-2xl shadow-sm border border-outline-variant">
          <h2 className="font-title-lg mb-6">{currentDriver.id ? 'تعديل المندوب' : 'إضافة مندوب جديد'}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-label-md mb-2">اسم المندوب</label>
                <input required type="text" value={currentDriver.name || ''} onChange={e => setCurrentDriver({...currentDriver, name: e.target.value})} className="w-full bg-surface-container px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block font-label-md mb-2">رقم الهاتف</label>
                <input required type="text" value={currentDriver.phone || ''} onChange={e => setCurrentDriver({...currentDriver, phone: e.target.value})} className="w-full bg-surface-container px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" dir="ltr" />
              </div>
              <div>
                <label className="block font-label-md mb-2">المدينة المكلف بها</label>
                <input required type="text" value={currentDriver.assigned_city || ''} onChange={e => setCurrentDriver({...currentDriver, assigned_city: e.target.value})} className="w-full bg-surface-container px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block font-label-md mb-2">الحي المكلف به</label>
                <input required type="text" value={currentDriver.assigned_district || ''} onChange={e => setCurrentDriver({...currentDriver, assigned_district: e.target.value})} className="w-full bg-surface-container px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
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
                  <th className="p-4 font-medium">الاسم</th>
                  <th className="p-4 font-medium">رقم الهاتف</th>
                  <th className="p-4 font-medium">المدينة</th>
                  <th className="p-4 font-medium">الحي</th>
                  <th className="p-4 font-medium text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {drivers.map(driver => (
                  <tr key={driver.id} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="p-4 font-title-md text-on-surface">{driver.name}</td>
                    <td className="p-4 text-on-surface-variant" dir="ltr">{driver.phone}</td>
                    <td className="p-4 text-on-surface-variant">{driver.assigned_city}</td>
                    <td className="p-4 text-on-surface-variant">{driver.assigned_district}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleEdit(driver)} className="p-2 text-secondary hover:bg-secondary-container rounded-lg transition-colors">
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button onClick={() => handleDelete(driver.id)} className="p-2 text-error hover:bg-error-container rounded-lg transition-colors">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {drivers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-on-surface-variant">لا يوجد مناديب مسجلين.</td>
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
