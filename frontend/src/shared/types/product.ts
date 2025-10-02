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
  image?: string; // color-specific product image
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
