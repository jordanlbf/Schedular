export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  notes?: string;
}

export interface Customer {
  name: string;
  phone: string;
  email: string;
  billingAddress?: Address;
  deliveryAddress?: Address;
  sameAsDelivery?: boolean;
}

export interface Product {
  sku: string;
  name: string;
  price: number;
  category?: string;
  inStock?: boolean;
}

export interface LineItem {
  id: number;
  sku: string;
  name: string;
  qty: number;
  price: number;
}

export interface DeliveryDetails {
  preferredDate: string;
  timeSlot: string;
  specialInstructions: string;
  whiteGloveService: boolean;
  oldMattressRemoval: boolean;
  setupService: boolean;
}

export type PaymentMethod = 'cash' | 'card' | 'transfer' | 'layby';

export interface SaleOrder {
  customer: Customer;
  items: LineItem[];
  delivery: DeliveryDetails;
  payment: {
    method: PaymentMethod;
    depositAmount: number;
    discountPercent: number;
  };
  totals: {
    subtotal: number;
    deliveryFee: number;
    discount: number;
    total: number;
  };
  createdAt: string;
  status: 'draft' | 'pending' | 'confirmed' | 'completed' | 'cancelled';
}
