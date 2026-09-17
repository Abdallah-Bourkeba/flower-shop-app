import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, StoreSettings } from '../types';
import { supabase } from '../lib/supabaseClient';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  settings: StoreSettings;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [settings, setSettings] = useState<StoreSettings>({ deliveryFee: 20 });

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data, error } = await supabase
          .from('store_settings')
          .select('setting_value')
          .eq('setting_key', 'delivery_fee')
          .single();

        if (error) {
          console.warn("Could not fetch settings from Supabase, using defaults.");
        } else if (data && data.setting_value) {
          setSettings({ deliveryFee: parseInt(data.setting_value) || 20 });
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    }
    fetchSettings();
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.15;
  const deliveryFee = settings.deliveryFee;
  const total = subtotal + tax + deliveryFee;

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      subtotal,
      tax,
      deliveryFee,
      total,
      settings
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
