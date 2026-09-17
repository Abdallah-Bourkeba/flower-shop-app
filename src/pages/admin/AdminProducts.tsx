import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Product } from '../../types';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (!error && data) setProducts(data as Product[]);
    setLoading(false);
  }

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentProduct({ name: '', price: 0, category: 'local', image_url: '' });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) fetchProducts();
    else alert(error.message);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadingImage(true);
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
      setCurrentProduct(prev => ({ ...prev, image_url: data.publicUrl }));
    } catch (error: any) {
      alert(`Upload Error: ${error.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct.name || !currentProduct.price || !currentProduct.image_url) {
      alert('يرجى ملء الحقول الأساسية (الاسم، السعر، الصورة)');
      return;
    }

    try {
      if (currentProduct.id) {
        const { error } = await supabase.from('products').update(currentProduct).eq('id', currentProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert(currentProduct);
        if (error) throw error;
      }
      setIsEditing(false);
      fetchProducts();
    } catch (error: any) {
      alert(`Save Error: ${error.message}`);
    }
  };

  if (loading && !isEditing) return <div>جاري التحميل...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-space-xl">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">إدارة المنتجات</h1>
        {!isEditing && (
          <button 
            onClick={handleAddNew}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-xl font-label-lg hover:bg-primary-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            إضافة منتج
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-surface p-space-lg rounded-2xl shadow-sm border border-outline-variant">
          <h2 className="font-title-lg mb-6">{currentProduct.id ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-label-md mb-2">اسم المنتج</label>
                <input required type="text" value={currentProduct.name || ''} onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})} className="w-full bg-surface-container px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block font-label-md mb-2">التصنيف</label>
                <select value={currentProduct.category || 'local'} onChange={e => setCurrentProduct({...currentProduct, category: e.target.value})} className="w-full bg-surface-container px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="local">محلي</option>
                  <option value="chinese">صيني</option>
                  <option value="european">أوروبي</option>
                  <option value="special">باقات خاصة</option>
                </select>
              </div>
              <div>
                <label className="block font-label-md mb-2">السعر (ر.س)</label>
                <input required type="number" step="0.01" value={currentProduct.price || ''} onChange={e => setCurrentProduct({...currentProduct, price: Number(e.target.value)})} className="w-full bg-surface-container px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div>
                <label className="block font-label-md mb-2">السعر الأصلي (قبل الخصم) - اختياري</label>
                <input type="number" step="0.01" value={currentProduct.originalPrice || ''} onChange={e => setCurrentProduct({...currentProduct, originalPrice: Number(e.target.value)})} className="w-full bg-surface-container px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              
              <div className="md:col-span-2">
                <label className="block font-label-md mb-2">الصورة</label>
                <div className="flex items-center gap-4">
                  {currentProduct.image_url && (
                    <img src={currentProduct.image_url} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-outline-variant" />
                  )}
                  <input type="hidden" value={currentProduct.image_url || ''} required />
                  <input 
                    type="file" 
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                  />
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="px-4 py-2 bg-secondary-container text-on-secondary-container rounded-lg font-label-md hover:bg-secondary hover:text-on-secondary transition-colors"
                  >
                    {uploadingImage ? 'جاري الرفع...' : 'رفع صورة'}
                  </button>
                </div>
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
                  <th className="p-4 font-medium">المنتج</th>
                  <th className="p-4 font-medium">التصنيف</th>
                  <th className="p-4 font-medium">السعر</th>
                  <th className="p-4 font-medium text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {products.map(product => (
                  <tr key={product.id} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="p-4 flex items-center gap-4">
                      <img src={product.image_url} alt={product.name} className="w-12 h-12 rounded-lg object-cover bg-surface-container" />
                      <span className="font-title-md text-on-surface">{product.name}</span>
                    </td>
                    <td className="p-4 text-on-surface-variant">{product.category}</td>
                    <td className="p-4 font-bold text-on-surface">{product.price} ر.س</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleEdit(product)} className="p-2 text-secondary hover:bg-secondary-container rounded-lg transition-colors">
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="p-2 text-error hover:bg-error-container rounded-lg transition-colors">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-on-surface-variant">لا توجد منتجات.</td>
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
