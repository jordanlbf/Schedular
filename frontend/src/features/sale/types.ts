// Re-export shared types with sale-specific aliases
export type {
  Customer,
  Product,
  LineItem,
  DeliveryDetails,
  PaymentMethod,
  SaleOrder,
  Address,
  SecondPerson,
  StockInfo,
  StockStatus,
  ColorOption
} from '@/shared/types';

// Sale-specific type aliases
export type { LineItem as Line } from '@/shared/types';
export type { Product as CatalogItem } from '@/shared/types';

// Sale-specific types
export type WizardStep = 'customer' | 'products' | 'delivery' | 'payment';