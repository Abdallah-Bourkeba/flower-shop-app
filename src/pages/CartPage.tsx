import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, subtotal, tax, deliveryFee, total } = useCart();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    city: '',
    district: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load from local storage
    const savedName = localStorage.getItem('customerName') || '';
    const savedPhone = localStorage.getItem('customerPhone') || '';
    const savedEmail = localStorage.getItem('customerEmail') || '';
    setFormData(prev => ({ ...prev, customerName: savedName, customerPhone: savedPhone, customerEmail: savedEmail }));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsSubmitting(true);
    setError('');

    try {
      // Save to local storage for future autofill
      localStorage.setItem('customerName', formData.customerName);
      localStorage.setItem('customerPhone', formData.customerPhone);
      localStorage.setItem('customerEmail', formData.customerEmail);

      const orderPayload = {
        ...formData,
        items: cart,
        subtotal,
        tax,
        deliveryFee,
        total
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderPayload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit order');
      }

      setOrderSuccess(true);
      clearCart();

      const waMessage = `مرحباً، أود تأكيد طلبي:\n\n` +
        `*الاسم:* ${formData.customerName}\n` +
        `*المدينة:* ${formData.city}\n` +
        `*الحي:* ${formData.district}\n\n` +
        `*المنتجات:*\n` +
        cart.map(item => `- ${item.name} (x${item.quantity})`).join('\n') + `\n\n` +
        `*الإجمالي:* ${total.toFixed(2)} ر.س\n`;
      
      const encodedMessage = encodeURIComponent(waMessage);
      window.open(`https://wa.me/201555003818?text=${encodedMessage}`, '_blank');
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin pt-12 text-center">
        <div className="bg-secondary-container text-on-secondary-container p-8 rounded-2xl">
          <span className="material-symbols-outlined text-[64px] mb-4">check_circle</span>
          <h2 className="font-headline-lg text-headline-lg mb-2">تم استلام طلبك بنجاح!</h2>
          <p className="font-body-lg text-body-lg mb-6">شكراً لتسوقك معنا، سنقوم بتجهيز باقتك بكل عناية وحب.</p>
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-on-secondary rounded-full font-label-lg transition-colors hover:bg-secondary-fixed-variant">
            <span className="material-symbols-outlined">arrow_back</span>
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin pt-12 pb-24">
      <h1 className="font-headline-lg text-headline-lg text-on-surface mb-8">سلة المشتريات</h1>
      
      {cart.length === 0 ? (
        <div className="text-center py-16 bg-surface-container-lowest rounded-2xl shadow-sm">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-4">shopping_cart</span>
          <h2 className="font-title-lg text-title-lg text-on-surface mb-4">السلة فارغة</h2>
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-full font-label-lg transition-colors hover:bg-primary-container">
            تصفح الباقات
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
          
          <div className="lg:col-span-2 space-y-space-md">
            {cart.map(item => (
              <div key={item.id} className="flex gap-4 p-4 bg-surface-container-lowest rounded-xl shadow-sm items-center">
                <img src={item.image_url} alt={item.name} className="w-24 h-24 object-cover rounded-lg bg-surface-container" />
                <div className="flex-1 flex flex-col justify-between h-full">
                  <div className="flex justify-between items-start">
                    <h3 className="font-title-md text-title-md text-on-surface">{item.name}</h3>
                    <button onClick={() => removeFromCart(item.id)} className="text-error hover:bg-error-container p-1 rounded-md transition-colors" title="حذف">
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-3 bg-surface-container rounded-full px-2 py-1">
                      <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-surface-container-high">-</button>
                      <span className="font-label-lg">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-surface-container-high">+</button>
                    </div>
                    <div className="font-headline-md text-headline-md font-bold text-on-surface">
                      {(item.price * item.quantity).toFixed(2)} <span className="font-label-sm text-on-surface-variant">ر.س</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-surface-container-lowest p-space-lg rounded-2xl shadow-sm h-fit">
            <h2 className="font-title-lg text-title-lg text-on-surface mb-6 border-b border-outline-variant pb-4">ملخص الطلب</h2>
            
            <div className="space-y-4 font-body-lg text-body-lg text-on-surface-variant mb-6">
              <div className="flex justify-between">
                <span>الإجمالي بدون الضريبة</span>
                <span className="font-semibold text-on-surface">{subtotal.toFixed(2)} ر.س</span>
              </div>
              <div className="flex justify-between">
                <span>ضريبة 15%</span>
                <span className="font-semibold text-on-surface">{tax.toFixed(2)} ر.س</span>
              </div>
              <div className="flex justify-between">
                <span>ثمن التوصيل</span>
                <span className="font-semibold text-on-surface">{deliveryFee.toFixed(2)} ر.س</span>
              </div>
              <div className="flex justify-between border-t border-outline-variant pt-4 mt-4 font-headline-md font-bold text-on-surface">
                <span>الإجمالي</span>
                <span>{total.toFixed(2)} ر.س</span>
              </div>
            </div>

            <form onSubmit={handleOrderSubmit} className="space-y-4">
              {error && <div className="bg-error-container text-on-error-container p-3 rounded-lg text-sm">{error}</div>}
              
              <div>
                <label className="block font-label-md mb-1">اسم العميل</label>
                <input required type="text" name="customerName" value={formData.customerName} onChange={handleInputChange} className="w-full bg-surface-container px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="الاسم الكامل" />
              </div>
              <div>
                <label className="block font-label-md mb-1">رقم التليفون</label>
                <input required type="tel" name="customerPhone" value={formData.customerPhone} onChange={handleInputChange} className="w-full bg-surface-container px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="05xxxxxxxx" dir="ltr" />
              </div>
              <div>
                <label className="block font-label-md mb-1">الإيميل</label>
                <input required type="email" name="customerEmail" value={formData.customerEmail} onChange={handleInputChange} className="w-full bg-surface-container px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="example@email.com" dir="ltr" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-md mb-1">المدينة</label>
                  <input required type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full bg-surface-container px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="الرياض" />
                </div>
                <div>
                  <label className="block font-label-md mb-1">الحي</label>
                  <input required type="text" name="district" value={formData.district} onChange={handleInputChange} className="w-full bg-surface-container px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" placeholder="الملقا" />
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-4 mt-6 bg-primary text-on-primary rounded-xl font-title-md hover:bg-primary-container transition-colors disabled:opacity-70"
              >
                {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
                {!isSubmitting && <span className="material-symbols-outlined">send</span>}
              </button>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
