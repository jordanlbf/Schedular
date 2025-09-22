// Customers feature types
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  addresses: CustomerAddress[];
  defaultAddressId?: string;
  loyaltyPoints?: number;
  tier?: CustomerTier;
  tags?: string[];
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerAddress {
  id: string;
  type: AddressType;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export enum AddressType {
  BILLING = 'billing',
  SHIPPING = 'shipping',
  BOTH = 'both',
}

export enum CustomerTier {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
}

export interface CustomerStats {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate?: Date;
  favoriteProducts?: string[];
}

export interface CustomerFilter {
  search?: string;
  tier?: CustomerTier;
  tags?: string[];
  isActive?: boolean;
  hasOrders?: boolean;
}

export interface CustomerActivity {
  id: string;
  customerId: string;
  type: ActivityType;
  description: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export enum ActivityType {
  ORDER_PLACED = 'order_placed',
  ORDER_CANCELLED = 'order_cancelled',
  PAYMENT_RECEIVED = 'payment_received',
  REFUND_ISSUED = 'refund_issued',
  ACCOUNT_UPDATED = 'account_updated',
  NOTE_ADDED = 'note_added',
}

export interface CustomersState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  customerStats: CustomerStats | null;
  activities: CustomerActivity[];
  filters: CustomerFilter;
  isLoading: boolean;
  error: string | null;
}
