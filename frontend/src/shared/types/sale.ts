import type { Customer } from './customer';
import type { PaymentMethod } from './payment';

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

export interface SaleOrder {
  id?: number; // Optional for creation, required after backend response
  orderNumber?: number; // Sequential order number, set by backend
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
  createdAt?: string; // Optional for creation, set by backend
  status: 'draft' | 'pending' | 'confirmed' | 'completed' | 'cancelled';
}
