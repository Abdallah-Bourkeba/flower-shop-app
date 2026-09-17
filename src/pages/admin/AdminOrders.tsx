import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Order } from '../../types';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (!error && data) setOrders(data as Order[]);
    setLoading(false);
  }

  const handleCancelOrder = async (order: Order) => {
    if (!window.confirm('هل أنت متأكد من إلغاء هذا الطلب وإصدار فاتورة عكسية؟')) return;
    
    try {
      // 1. Update Order Status
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: 'canceled' })
        .eq('id', order.id);

      if (updateError) throw updateError;

      // 2. Insert into Refunds table
      const refundData = {
        order_id: order.id,
        amount_ex_tax: order.subtotal,
        tax_amount: order.tax,
        total_amount: order.total
      };

      const { error: refundError } = await supabase
        .from('refunds')
        .insert(refundData);

      if (refundError) throw refundError;

      alert('تم إلغاء الطلب وإصدار فاتورة المرتجعات بنجاح');
      fetchOrders();
    } catch (err: any) {
      console.error(err);
      alert(`خطأ: ${err.message}`);
    }
  };

  if (loading) return <div>جاري التحميل...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-space-xl">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">إدارة الطلبات والمرتجعات</h1>
      </div>

      <div className="bg-surface rounded-2xl shadow-sm border border-outline-variant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-surface-container-lowest border-b border-outline-variant text-on-surface-variant font-label-lg">
              <tr>
                <th className="p-4 font-medium">العميل</th>
                <th className="p-4 font-medium">التاريخ</th>
                <th className="p-4 font-medium">بدون ضريبة</th>
                <th className="p-4 font-medium">الضريبة</th>
                <th className="p-4 font-medium">الإجمالي</th>
                <th className="p-4 font-medium">الحالة</th>
                <th className="p-4 font-medium text-center">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-surface-container-lowest transition-colors">
                  <td className="p-4">
                    <div className="font-title-md text-on-surface">{order.customer_name}</div>
                    <div className="text-body-sm text-on-surface-variant" dir="ltr">{order.customer_phone}</div>
                  </td>
                  <td className="p-4 text-on-surface-variant" dir="ltr">
                    {new Date(order.created_at).toLocaleDateString('ar-SA')}
                  </td>
                  <td className="p-4 text-on-surface-variant">{order.subtotal}</td>
                  <td className="p-4 text-on-surface-variant">{order.tax}</td>
                  <td className="p-4 font-bold text-on-surface">{order.total} ر.س</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${order.status === 'canceled' ? 'bg-error-container text-on-error-container' : 'bg-primary-container text-on-primary-container'}`}>
                      {order.status === 'canceled' ? 'ملغي / مرتجع' : 'مكتمل'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      {order.status !== 'canceled' && (
                        <button 
                          onClick={() => handleCancelOrder(order)} 
                          className="px-3 py-1 bg-error text-on-error rounded-lg font-label-md hover:bg-error-container hover:text-on-error-container transition-colors"
                        >
                          إلغاء وفاتورة عكسية
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-on-surface-variant">لا توجد طلبات مسجلة.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
