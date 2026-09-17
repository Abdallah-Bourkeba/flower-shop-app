import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabaseClient';

const mockProducts: Product[] = [
  { id: '1', name: 'باقة جوري حمراء كلاسيكية', price: 150, originalPrice: 180, rating: 4.8, category: 'local', image_url: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=600&auto=format&fit=crop', tag: 'الأكثر مبيعاً', tagColor: 'bg-primary-container text-on-primary-container' },
  { id: '2', name: 'تنسيقة أوركيد ملكية', price: 320, rating: 4.9, category: 'european', image_url: 'https://images.unsplash.com/photo-1528659104085-70335e219760?q=80&w=600&auto=format&fit=crop', tag: 'جديد', tagColor: 'bg-secondary-container text-on-secondary-container' },
  { id: '3', name: 'باقة لافندر هولندي', price: 120, rating: 4.6, category: 'european', image_url: 'https://images.unsplash.com/photo-1457089328109-e5d9ca49bd0f?q=80&w=600&auto=format&fit=crop' },
  { id: '4', name: 'تنسيقة الأقحوان الصيني', price: 90, originalPrice: 110, rating: 4.5, category: 'chinese', image_url: 'https://images.unsplash.com/photo-1596724395641-69aa19eeb2db?q=80&w=600&auto=format&fit=crop', tag: 'عرض خاص', tagColor: 'bg-error-container text-on-error-container' },
  { id: '5', name: 'باقة الكوبية الزرقاء', price: 210, rating: 4.7, category: 'special', image_url: 'https://images.unsplash.com/photo-1533618451717-b77edc460d3d?q=80&w=600&auto=format&fit=crop' },
  { id: '6', name: 'تنسيقة توليب الطائف', price: 180, originalPrice: 200, rating: 4.8, category: 'local', image_url: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?q=80&w=600&auto=format&fit=crop' },
  { id: '7', name: 'باقة الفاوانيا الصيفية', price: 250, rating: 4.9, category: 'special', image_url: 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?q=80&w=600&auto=format&fit=crop', tag: 'موسمي', tagColor: 'bg-tertiary-container text-on-tertiary-container' },
  { id: '8', name: 'تنسيقة زهور الكرز', price: 280, rating: 4.7, category: 'chinese', image_url: 'https://images.unsplash.com/photo-1522228115018-d838bcce5c3a?q=80&w=600&auto=format&fit=crop' },
];

export default function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { addToCart } = useCart();
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (error) {
          console.warn("Could not fetch products from Supabase, using mock data.");
          setProducts(mockProducts);
        } else if (data && data.length > 0) {
          const mappedProducts = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            originalPrice: item.original_price,
            rating: item.rating,
            category: item.category,
            image_url: item.image_url,
            tag: item.tag,
            tagColor: item.tag_color
          }));
          setProducts(mappedProducts);
        } else {
          setProducts(mockProducts);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts(mockProducts);
      }
    }
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesFilter = filter === 'all' || p.category === filter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setToastMessage(`تمت إضافة "${product.name}" إلى السلة`);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-margin-mobile md:px-margin pt-space-xl pb-28 scroll-mt-20" id="products-catalog">
      <div className="flex flex-col items-center text-center mb-space-lg">
        <div className="inline-flex items-center justify-center p-2 rounded-full bg-secondary-container text-on-secondary-container mb-space-xs">
          <span className="material-symbols-outlined text-[22px]">yard</span>
        </div>
        <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
          تشكيلة الزهور المميزة
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md mt-1">
          مختارة بعناية لأجمل اللحظات، تنسيقات مستوحاة من هدوء الطبيعة وجمالها الأخّاذ.
        </p>
      </div>

      <div className="w-full max-w-md mx-auto mb-8 relative">
        <input
          type="text"
          placeholder="ابحث عن باقة..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/50 backdrop-blur-sm border border-outline-variant px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-primary ps-11 transition-all"
        />
        <span className="material-symbols-outlined absolute start-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
      </div>

      <div className="w-full overflow-x-auto py-space-sm mb-space-xl">
        <div className="flex items-center justify-start sm:justify-center gap-space-sm min-w-max mx-auto px-space-xs">
          {['all', 'local', 'chinese', 'european', 'special'].map(cat => {
            const labels: any = { all: 'الكل', local: 'محلي', chinese: 'صيني', european: 'أوروبي', special: 'باقات خاصة' };
            const isActive = filter === cat;
            return (
              <button 
                key={cat}
                className={`px-space-lg py-2 rounded-full font-label-lg text-label-lg shadow-sm transition-all duration-200 ${isActive ? 'bg-secondary text-on-secondary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'}`}
                onClick={() => setFilter(cat)}
                type="button"
              >
                {labels[cat]}
              </button>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-space-sm sm:gap-space-md lg:gap-space-lg">
        {filteredProducts.map(product => (
          <article key={product.id} className="group flex flex-col bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-container">
              <img className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" src={product.image_url} alt={product.name}/>
              
              {product.tag && (
                <span className={`absolute top-space-xs start-space-xs font-label-sm text-label-sm px-2.5 py-0.5 rounded-full shadow-md ${product.tagColor}`}>
                  {product.tag}
                </span>
              )}
              
              <button 
                className="absolute top-space-xs end-space-xs w-9 h-9 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-sm hover:scale-110 transition-transform active:scale-95"
                onClick={() => toggleFavorite(product.id)}
              >
                <span className={`material-symbols-outlined text-[20px] transition-colors ${favorites.has(product.id) ? 'text-error' : 'text-on-surface-variant'}`} style={favorites.has(product.id) ? {fontVariationSettings: "'FILL' 1"} : {}}>favorite</span>
              </button>
            </div>
            
            <div className="p-space-sm sm:p-space-md flex flex-col flex-1 justify-between gap-space-xs">
              <div>
                <h3 className="font-title-md text-title-md text-on-surface line-clamp-1 mt-0.5 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
              </div>
              <div className="flex items-baseline justify-between pt-space-xs mb-2">
                <div className="flex items-baseline gap-1">
                  <span className="font-headline-md text-headline-md font-bold text-on-surface">{product.price}</span>
                  {product.originalPrice && (
                    <span className="font-label-sm text-label-sm text-on-surface-variant line-through text-outline mx-1">{product.originalPrice}</span>
                  )}
                  <span className="font-label-sm text-label-sm text-on-surface-variant">ر.س</span>
                </div>
                <div className="flex items-center gap-0.5 text-tertiary">
                  <span className="material-symbols-outlined text-[16px]" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                  <span className="font-label-sm text-label-sm">{product.rating}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => handleAddToCart(product)}
              className="w-full mt-auto py-3 bg-primary text-on-primary font-label-lg flex items-center justify-center gap-2 transition-all duration-150 hover:bg-primary-container active:scale-95 rounded-b-xl"
            >
              <span className="material-symbols-outlined text-[20px]">
                {toastMessage && toastMessage.includes(product.name) ? 'check' : 'add_shopping_cart'}
              </span>
              {toastMessage && toastMessage.includes(product.name) ? 'تمت الإضافة' : 'أضف للسلة'}
            </button>
          </article>
        ))}
      </div>

      <div className="mt-space-xl p-space-lg sm:p-space-xl rounded-2xl bg-surface-container-low shadow-sm flex flex-col md:flex-row items-center justify-between gap-space-lg">
        <div className="flex items-start gap-space-md text-right">
          <div className="p-3 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[28px]">history_edu</span>
          </div>
          <div>
            <h4 className="font-headline-md text-headline-md text-on-surface font-semibold">
              بطاقة إهداء بخط اليد مع كل طلب
            </h4>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-xl">
              نعتني بأدق التفاصيل؛ نكتب كلماتكم على ورق قطني فاخر مختوم بالشمع الأحمر لتبقى ذكراكم خالدة في وجدان من تحبون.
            </p>
          </div>
        </div>
        <a className="shrink-0 inline-flex items-center gap-space-xs font-label-lg text-label-lg px-space-lg py-3 rounded-full bg-secondary-container text-on-secondary-container hover:bg-secondary hover:text-on-secondary transition-all" href="#">
          <span>تخصيص بطاقة هدية</span>
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        </a>
      </div>

      <div className={`fixed bottom-20 md:bottom-8 start-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-space-md py-space-sm rounded-full shadow-2xl flex items-center gap-space-sm transition-all duration-300 z-50 ${toastMessage ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none translate-y-4'}`}>
        <span className="material-symbols-outlined text-secondary-fixed text-[20px]">check_circle</span>
        <span className="font-label-md text-label-md font-medium">{toastMessage}</span>
      </div>
    </section>
  );
}
