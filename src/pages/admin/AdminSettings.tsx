import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function AdminSettings() {
  const [deliveryFee, setDeliveryFee] = useState('20');
  const [taxRate, setTaxRate] = useState('15');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data, error } = await supabase
          .from('store_settings')
          .select('*')
          .in('setting_key', ['delivery_fee', 'tax_rate']);

        if (!error && data) {
          const df = data.find(s => s.setting_key === 'delivery_fee');
          const tr = data.find(s => s.setting_key === 'tax_rate');
          if (df) setDeliveryFee(df.setting_value);
          if (tr) setTaxRate(tr.setting_value);
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const updates = [
        { setting_key: 'delivery_fee', setting_value: deliveryFee.toString() },
        { setting_key: 'tax_rate', setting_value: taxRate.toString() }
      ];

      const { error } = await supabase
        .from('store_settings')
        .upsert(updates, { onConflict: 'setting_key' });

      if (error) throw error;
      
      setMessage('تم حفظ الإعدادات بنجاح');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setMessage(`خطأ في الحفظ: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>جاري التحميل...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-headline-lg text-headline-lg text-on-surface mb-8">إعدادات المتجر</h1>
      
      <form onSubmit={handleSave} className="bg-surface p-space-lg rounded-2xl shadow-sm border border-outline-variant space-y-6">
        
        {message && (
          <div className={`p-4 rounded-lg font-label-md ${message.includes('خطأ') ? 'bg-error-container text-on-error-container' : 'bg-primary-container text-on-primary-container'}`}>
            {message}
          </div>
        )}

        <div>
          <label className="block font-label-lg text-on-surface mb-2">سعر التوصيل (ر.س)</label>
          <div className="relative">
            <input 
              type="number" 
              min="0"
              step="0.01"
              value={deliveryFee}
              onChange={e => setDeliveryFee(e.target.value)}
              className="w-full bg-surface-container px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ps-11"
              required
            />
            <span className="material-symbols-outlined absolute start-3 top-1/2 -translate-y-1/2 text-on-surface-variant">local_shipping</span>
          </div>
        </div>

        <div>
          <label className="block font-label-lg text-on-surface mb-2">نسبة الضريبة (%)</label>
          <div className="relative">
            <input 
              type="number" 
              min="0"
              step="0.01"
              value={taxRate}
              onChange={e => setTaxRate(e.target.value)}
              className="w-full bg-surface-container px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ps-11"
              required
            />
            <span className="material-symbols-outlined absolute start-3 top-1/2 -translate-y-1/2 text-on-surface-variant">receipt_long</span>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={saving}
          className="w-full py-3 bg-primary text-on-primary font-label-lg rounded-xl hover:bg-primary-container transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
          {!saving && <span className="material-symbols-outlined text-[20px]">save</span>}
        </button>

      </form>
    </div>
  );
}
