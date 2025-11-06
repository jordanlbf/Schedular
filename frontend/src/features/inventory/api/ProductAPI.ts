import type { Product, ProductFilters, ProductListResponse } from '@/shared/types';
import { apiClient } from '@/shared/api';

/**
 * Product API Service
 * Handles all product-related API calls
 */
export class ProductAPI {
  /**
   * Get all products with optional filtering
   */
  static async getProducts(filters?: ProductFilters): Promise<Product[]> {
    const params: Record<string, string | number> = {};

    if (filters?.activeOnly !== undefined) {
      params.active_only = filters.activeOnly;
    }
    if (filters?.category) {
      params.category = filters.category;
    }
    if (filters?.inStockOnly !== undefined) {
      params.in_stock_only = filters.inStockOnly;
    }
    if (filters?.search) {
      params.search = filters.search;
    }

    return apiClient.get<Product[]>('/products', { params });
  }

  /**
   * Get paginated products
   */
  static async getProductsPaginated(
    page: number = 1,
    pageSize: number = 50,
    filters?: ProductFilters
  ): Promise<ProductListResponse> {
    const params: Record<string, string | number> = {
      page,
      page_size: pageSize,
    };

    if (filters?.activeOnly !== undefined) {
      params.active_only = filters.activeOnly;
    }
    if (filters?.category) {
      params.category = filters.category;
    }
    if (filters?.search) {
      params.search = filters.search;
    }

    return apiClient.get<ProductListResponse>('/products/paginated', { params });
  }

  /**
   * Get a single product by SKU
   */
  static async getProduct(sku: string, includeInactive: boolean = false): Promise<Product> {
    const params: Record<string, string | number> = {};
    
    if (includeInactive) {
      params.include_inactive = includeInactive;
    }

    return apiClient.get<Product>(`/products/${sku}`, { params });
  }

  /**
   * Check product availability for a given quantity
   */
  static async checkAvailability(
    sku: string,
    quantity: number = 1
  ): Promise<{
    available: boolean;
    inStock?: number;
    requested?: number;
    reason?: string;
    leadTime?: string;
  }> {
    return apiClient.get(`/products/${sku}/availability`, {
      params: { quantity }
    });
  }

  /**
   * Get all product categories
   */
  static async getCategories(): Promise<string[]> {
    return apiClient.get<string[]>('/products/categories/list');
  }

  /**
   * Create a new product (admin only)
   */
  static async createProduct(product: Omit<Product, 'sku'> & { sku: string }): Promise<Product> {
    return apiClient.post<Product>('/products', product);
  }

  /**
   * Update an existing product (admin only)
   */
  static async updateProduct(sku: string, updates: Partial<Product>): Promise<Product> {
    return apiClient.patch<Product>(`/products/${sku}`, updates);
  }

  /**
   * Delete a product (admin only)
   */
  static async deleteProduct(sku: string, hardDelete: boolean = false): Promise<void> {
    return apiClient.delete<void>(`/products/${sku}`, {
      params: { hard_delete: hardDelete }
    });
  }
}
