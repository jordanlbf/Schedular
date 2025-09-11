export interface Address {
  unit?: string;
  street: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  notes?: string;
}

export interface SecondPerson {
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  relationship?: string; // e.g., "Spouse", "Partner", "Roommate", etc.
}

export interface Customer {
  firstName: string;
  lastName: string;
  name?: string; // Keep for backwards compatibility, will be computed
  phone: string;
  email: string;
  additionalPhone?: string;
  secondPerson?: SecondPerson;
  billingAddress?: Address;
  deliveryAddress?: Address;
  sameAsDelivery?: boolean;
}

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock' | 'discontinued';

export interface StockInfo {
  status: StockStatus;
  quantity: number;
  leadTimeDays?: number; // For out-of-stock items
  leadTimeText?: string; // Human readable lead time
}

export interface ColorOption {
  name: string;
  value: string; // hex color code
  inStock?: boolean;
}

export interface Product {
  sku: string;
  name: string;
  price: number;
  category?: string;
  inStock?: boolean; // Keep for backwards compatibility
  image?: string;
  stock: StockInfo;
  colors?: ColorOption[];
}

export interface LineItem {
  id: number;
  sku: string;
  name: string;
  qty: number;
  price: number;
  color?: string;
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
