import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function AdminDashboard() {
  const [filter, setFilter] = useState<'month' | 'year'>('month');
  const [metrics, setMetrics] = useState({ revenue: 0, expenses: 0, profit: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      setLoading(true);
      try {
        const now = new Date();
        let startDate: string;

        if (filter === 'month') {
          startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        } else {
          startDate = new Date(now.getFullYear(), 0, 1).toISOString();
        }

        // Fetch Orders
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('total')
          .gte('created_at', startDate);

        if (ordersError) throw ordersError;

        // Fetch Purchases
        const { data: purchases, error: purchasesError } = await supabase
          .from('purchases')
          .select('cost')
          .gte('created_at', startDate);

        if (purchasesError && purchasesError.code !== '42P01') { 
          // Ignore if table doesnt exist yet
          throw purchasesError;
        }

        const totalRevenue = orders?.reduce((sum, order) => sum + (Number(order.total) || 0), 0) || 0;
        const totalExpenses = purchases?.reduce((sum, purchase) => sum + (Number(purchase.cost) || 0), 0) || 0;

        setMetrics({
          revenue: totalRevenue,
          expenses: totalExpenses,
          profit: totalRevenue - totalExpenses
        });
      } catch (err) {
        console.error('Error fetching dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, [filter]);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-space-xl gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">لوحة القيادة</h1>
          <p className="text-on-surface-variant mt-1">نظرة عامة على أداء المتجر</p>
        </div>
        
        <div className="flex bg-surface-container rounded-full p-1 shadow-sm">
          <button 
            onClick={() => setFilter('month')}
            className={`px-4 py-2 rounded-full font-label-md transition-colors ${filter === 'month' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            هذا الشهر
          </button>
          <button 
            onClick={() => setFilter('year')}
            className={`px-4 py-2 rounded-full font-label-md transition-colors ${filter === 'year' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            هذا العام
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-on-surface-variant">جاري تحميل البيانات...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
          
          <div className="bg-surface p-space-lg rounded-2xl shadow-sm border border-outline-variant">
            <div className="flex items-center gap-3 mb-4 text-primary">
              <div className="p-2 bg-primary-container text-on-primary-container rounded-lg">
                <span className="material-symbols-outlined">payments</span>
              </div>
              <h3 className="font-title-md text-title-md text-on-surface">إجمالي المبيعات</h3>
            </div>
            <div className="font-headline-lg text-headline-lg font-bold text-on-surface">
              {metrics.revenue.toFixed(2)} <span className="text-body-md text-on-surface-variant font-normal">ر.س</span>
            </div>
          </div>

          <div className="bg-surface p-space-lg rounded-2xl shadow-sm border border-outline-variant">
            <div className="flex items-center gap-3 mb-4 text-error">
              <div className="p-2 bg-error-container text-on-error-container rounded-lg">
                <span className="material-symbols-outlined">shopping_bag</span>
              </div>
              <h3 className="font-title-md text-title-md text-on-surface">إجمالي المصروفات</h3>
            </div>
            <div className="font-headline-lg text-headline-lg font-bold text-on-surface">
              {metrics.expenses.toFixed(2)} <span className="text-body-md text-on-surface-variant font-normal">ر.س</span>
            </div>
          </div>

          <div className="bg-surface p-space-lg rounded-2xl shadow-sm border border-outline-variant">
            <div className="flex items-center gap-3 mb-4 text-secondary">
              <div className="p-2 bg-secondary-container text-on-secondary-container rounded-lg">
                <span className="material-symbols-outlined">monitoring</span>
              </div>
              <h3 className="font-title-md text-title-md text-on-surface">صافي الأرباح</h3>
            </div>
            <div className="font-headline-lg text-headline-lg font-bold text-on-surface">
              {metrics.profit.toFixed(2)} <span className="text-body-md text-on-surface-variant font-normal">ر.س</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
