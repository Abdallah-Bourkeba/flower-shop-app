import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function AdminDashboard() {
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  
  const [metrics, setMetrics] = useState({
    salesExTax: 0,
    salesTax: 0,
    salesTotal: 0,
    purchasesExTax: 0,
    purchasesTax: 0,
    purchasesTotal: 0
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, [startDate, endDate]);

  async function fetchMetrics() {
    setLoading(true);
    try {
      const start = `${startDate}T00:00:00.000Z`;
      const end = `${endDate}T23:59:59.999Z`;

      // 1. Fetch Orders (Completed only)
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('subtotal, tax, total, status')
        .gte('created_at', start)
        .lte('created_at', end)
        .neq('status', 'canceled');

      if (ordersError) throw ordersError;

      // 2. Fetch Refunds
      const { data: refunds, error: refundsError } = await supabase
        .from('refunds')
        .select('amount_ex_tax, tax_amount, total_amount')
        .gte('created_at', start)
        .lte('created_at', end);

      if (refundsError && refundsError.code !== '42P01') {
        throw refundsError; // Ignore if refunds table doesn't exist yet
      }

      // 3. Fetch Purchases
      const { data: purchases, error: purchasesError } = await supabase
        .from('purchases')
        .select('cost_ex_tax, tax_amount, cost')
        .gte('created_at', start)
        .lte('created_at', end);

      if (purchasesError && purchasesError.code !== '42P01') { 
        throw purchasesError;
      }

      // Calculate Order Totals
      const rawSalesExTax = orders?.reduce((sum, order) => sum + (Number(order.subtotal) || 0), 0) || 0;
      const rawSalesTax = orders?.reduce((sum, order) => sum + (Number(order.tax) || 0), 0) || 0;
      const rawSalesTotal = orders?.reduce((sum, order) => sum + (Number(order.total) || 0), 0) || 0;

      // Calculate Refund Totals
      const refundsExTax = refunds?.reduce((sum, r) => sum + (Number(r.amount_ex_tax) || 0), 0) || 0;
      const refundsTax = refunds?.reduce((sum, r) => sum + (Number(r.tax_amount) || 0), 0) || 0;
      const refundsTotal = refunds?.reduce((sum, r) => sum + (Number(r.total_amount) || 0), 0) || 0;

      // Calculate Purchase Totals
      const purchasesExTax = purchases?.reduce((sum, p) => sum + (Number(p.cost_ex_tax) || 0), 0) || 0;
      const purchasesTax = purchases?.reduce((sum, p) => sum + (Number(p.tax_amount) || 0), 0) || 0;
      const purchasesTotal = purchases?.reduce((sum, p) => sum + (Number(p.cost) || 0), 0) || 0;

      setMetrics({
        salesExTax: rawSalesExTax - refundsExTax,
        salesTax: rawSalesTax - refundsTax,
        salesTotal: rawSalesTotal - refundsTotal,
        purchasesExTax: purchasesExTax,
        purchasesTax: purchasesTax,
        purchasesTotal: purchasesTotal
      });
    } catch (err) {
      console.error('Error fetching dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  }

  const profitTotal = metrics.salesTotal - metrics.purchasesTotal;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-space-xl gap-6">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">التقارير المالية المتقدمة</h1>
          <p className="text-on-surface-variant mt-1">نظرة شاملة على المبيعات، الضرائب، والمصروفات</p>
        </div>
        
        <div className="flex flex-col sm:flex-row bg-surface p-2 rounded-2xl shadow-sm border border-outline-variant gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-on-surface-variant whitespace-nowrap">من:</label>
            <input 
              type="date" 
              value={startDate} 
              onChange={e => setStartDate(e.target.value)}
              className="bg-surface-container px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-on-surface-variant whitespace-nowrap">إلى:</label>
            <input 
              type="date" 
              value={endDate} 
              onChange={e => setEndDate(e.target.value)}
              className="bg-surface-container px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-on-surface-variant font-label-lg">جاري حساب البيانات المالية...</div>
      ) : (
        <div className="space-y-space-xl">
          
          {/* Sales Section */}
          <section>
            <h2 className="font-title-lg text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">payments</span>
              المبيعات (مخصوم منها المرتجعات)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
              <div className="bg-surface p-space-lg rounded-2xl shadow-sm border border-outline-variant">
                <p className="font-label-lg text-on-surface-variant mb-2">المبيعات بدون ضريبة</p>
                <div className="font-headline-lg font-bold text-on-surface">
                  {metrics.salesExTax.toFixed(2)} <span className="text-body-md font-normal text-on-surface-variant">ر.س</span>
                </div>
              </div>
              <div className="bg-surface p-space-lg rounded-2xl shadow-sm border border-outline-variant">
                <p className="font-label-lg text-on-surface-variant mb-2">قيمة الضريبة المحصلة</p>
                <div className="font-headline-lg font-bold text-primary">
                  {metrics.salesTax.toFixed(2)} <span className="text-body-md font-normal text-on-surface-variant">ر.س</span>
                </div>
              </div>
              <div className="bg-primary-container p-space-lg rounded-2xl shadow-sm">
                <p className="font-label-lg text-on-primary-container mb-2">المبيعات الإجمالية (شامل الضريبة)</p>
                <div className="font-headline-lg font-bold text-on-primary-container">
                  {metrics.salesTotal.toFixed(2)} <span className="text-body-md font-normal opacity-80">ر.س</span>
                </div>
              </div>
            </div>
          </section>

          {/* Purchases Section */}
          <section>
            <h2 className="font-title-lg text-on-surface mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-error">shopping_bag</span>
              المشتريات والمصروفات
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
              <div className="bg-surface p-space-lg rounded-2xl shadow-sm border border-outline-variant">
                <p className="font-label-lg text-on-surface-variant mb-2">المصروفات بدون ضريبة</p>
                <div className="font-headline-lg font-bold text-on-surface">
                  {metrics.purchasesExTax.toFixed(2)} <span className="text-body-md font-normal text-on-surface-variant">ر.س</span>
                </div>
              </div>
              <div className="bg-surface p-space-lg rounded-2xl shadow-sm border border-outline-variant">
                <p className="font-label-lg text-on-surface-variant mb-2">ضريبة المشتريات المدفوعة</p>
                <div className="font-headline-lg font-bold text-error">
                  {metrics.purchasesTax.toFixed(2)} <span className="text-body-md font-normal text-on-surface-variant">ر.س</span>
                </div>
              </div>
              <div className="bg-error-container p-space-lg rounded-2xl shadow-sm">
                <p className="font-label-lg text-on-error-container mb-2">إجمالي المصروفات (شامل الضريبة)</p>
                <div className="font-headline-lg font-bold text-on-error-container">
                  {metrics.purchasesTotal.toFixed(2)} <span className="text-body-md font-normal opacity-80">ر.س</span>
                </div>
              </div>
            </div>
          </section>

          {/* Net Profit */}
          <section>
            <div className="bg-secondary-container p-space-xl rounded-3xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-secondary text-3xl">monitoring</span>
                </div>
                <div>
                  <h2 className="font-headline-md font-bold text-on-secondary-container">صافي الأرباح (الإجمالي)</h2>
                  <p className="text-on-secondary-container opacity-80">إجمالي المبيعات مطروحاً منها إجمالي المشتريات والمرتجعات</p>
                </div>
              </div>
              <div className="text-center md:text-end">
                <div className="font-display-sm font-bold text-on-secondary-container">
                  {profitTotal.toFixed(2)} <span className="text-headline-sm font-normal opacity-80">ر.س</span>
                </div>
              </div>
            </div>
          </section>

        </div>
      )}
    </div>
  );
}
