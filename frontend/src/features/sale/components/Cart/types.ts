// Cart feature types
export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  tax?: number;
  subtotal: number;
  notes?: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  customerId?: string;
  createdAt: Date;
  updatedAt: Date;
  status: CartStatus;
}

export enum CartStatus {
  ACTIVE = 'active',
  ABANDONED = 'abandoned',
  CONVERTED = 'converted',
}

export interface CartTotals {
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
}

export interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
}
