import { useState, useEffect, useCallback, useRef } from 'react';
import type { Product, ProductFilters } from '@/shared/types';
import { ProductAPI } from '../api';

/**
 * Simple in-memory cache for products
 */
interface CacheEntry {
  data: Product[];
  timestamp: number;
  key: string;
}

const cache = new Map<string, CacheEntry>();

interface UseProductsOptions extends ProductFilters {
  /**
   * Automatically fetch products on mount
   * @default true
   */
  autoFetch?: boolean;
  
  /**
   * Enable caching of results
   * @default true
   */
  enableCache?: boolean;
  
  /**
   * Cache duration in milliseconds
   * @default 300000 (5 minutes)
   */
  cacheDuration?: number;
}

interface UseProductsResult {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearError: () => void;
  isCached: boolean;
}

/**
 * Hook to fetch and manage products with caching, filtering, and error handling
 * 
 * @example
 * ```tsx
 * const { products, isLoading, error, refetch } = useProducts({
 *   activeOnly: true,
 *   inStockOnly: false,
 *   category: 'furniture'
 * });
 * ```
 */
export function useProducts(options: UseProductsOptions = {}): UseProductsResult {
  const {
    activeOnly = true,
    category,
    inStockOnly = false,
    search,
    autoFetch = true,
    enableCache = true,
    cacheDuration = 300000, // 5 minutes default
  } = options;

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCached, setIsCached] = useState(false);

  /**
   * Generate cache key from filters
   */
  const getCacheKey = useCallback((filters: ProductFilters): string => {
    return JSON.stringify({
      activeOnly: filters.activeOnly,
      category: filters.category,
      inStockOnly: filters.inStockOnly,
      search: filters.search,
    });
  }, []);

  /**
   * Fetch products from API or cache
   */
  const fetchProducts = useCallback(async () => {
    const filters: ProductFilters = {
      activeOnly,
      category,
      inStockOnly,
      search,
    };

    const cacheKey = getCacheKey(filters);

    // Check cache first
    if (enableCache) {
      const cached = cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < cacheDuration) {
        setProducts(cached.data);
        setIsCached(true);
        setIsLoading(false);
        return;
      }
    }

    setIsLoading(true);
    setError(null);
    setIsCached(false);

    try {
      const data = await ProductAPI.getProducts(filters);
      
      setProducts(data);
      setIsLoading(false);

      // Update cache
      if (enableCache) {
        cache.set(cacheKey, {
          data,
          timestamp: Date.now(),
          key: cacheKey
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to load products';
      
      setError(errorMessage);
      setIsLoading(false);
    }
  }, [activeOnly, category, inStockOnly, search, enableCache, cacheDuration, getCacheKey]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Auto-fetch on mount and when options change
   */
  useEffect(() => {
    if (autoFetch) {
      fetchProducts();
    }
  }, [autoFetch, fetchProducts]);

  return {
    products,
    isLoading,
    error,
    refetch: fetchProducts,
    clearError,
    isCached
  };
}

/**
 * Hook to fetch a single product by SKU
 * 
 * @example
 * ```tsx
 * const { product, isLoading, error } = useProduct('DT-1001');
 * ```
 */
export function useProduct(sku: string | null, includeInactive: boolean = false) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!sku) {
      setProduct(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await ProductAPI.getProduct(sku, includeInactive);
      
      setProduct(data);
      setIsLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to load product';
      
      setError(errorMessage);
      setIsLoading(false);
    }
  }, [sku, includeInactive]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    isLoading,
    error,
    refetch: fetchProduct
  };
}

/**
 * Clear the products cache
 * Useful after creating/updating/deleting products
 */
export function clearProductsCache(): void {
  cache.clear();
}
