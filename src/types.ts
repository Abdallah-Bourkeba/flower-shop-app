export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image_url: string;
  rating: number;
  tag?: string | null;
  tagColor?: string | null;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface StoreSettings {
  deliveryFee: number;
  taxRate: number;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  assigned_city: string;
  assigned_district: string;
}

export interface Purchase {
  id: string;
  date: string;
  description: string;
  cost: number;
  category: string;
}

export interface OrderDetails {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  city: string;
  district: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
}
