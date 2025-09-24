// Products feature types
export interface Product {
  id: string;
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  category: ProductCategory;
  price: number;
  costPrice?: number;
  taxRate?: number;
  images?: ProductImage[];
  variants?: ProductVariant[];
  stock: StockInfo;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductCategory {
  id: string;
  name: string;
  parentId?: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: StockInfo;
  attributes: Record<string, any>;
}

export interface StockInfo {
  quantity: number;
  reserved: number;
  available: number;
  reorderPoint?: number;
  reorderQuantity?: number;
}

export interface ProductFilter {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}
