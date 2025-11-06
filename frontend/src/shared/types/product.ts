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
  image?: string;
  stock: StockInfo;
  colors?: ColorOption[];
}

export interface ProductFilters {
  activeOnly?: boolean;
  category?: string;
  inStockOnly?: boolean;
  search?: string;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}
