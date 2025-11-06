import { createContext, useContext, ReactNode } from 'react';
import type { Product } from '@/shared/types';
import { useProducts } from '@/shared/hooks';

interface ProductsContextValue {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  getProduct: (sku: string) => Product | undefined;
}

const ProductsContext = createContext<ProductsContextValue | null>(null);

interface ProductsProviderProps {
  children: ReactNode;
}

/**
 * Products Provider for Sale Wizard
 *
 * Fetches products from the backend API and makes them available
 * to all child components via context. This replaces the old
 * hardcoded CATALOG with real backend data.
 */
export function ProductsProvider({ children }: ProductsProviderProps) {
  const { products, isLoading, error } = useProducts({
    activeOnly: true,
    autoFetch: true,
    enableCache: true
  });

  const getProduct = (sku: string): Product | undefined => {
    return products.find(p => p.sku === sku);
  };

  const value: ProductsContextValue = {
    products,
    isLoading,
    error,
    getProduct
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

/**
 * Hook to access products within the Sale Wizard
 *
 * @throws Error if used outside ProductsProvider
 */
export function useProductsContext(): ProductsContextValue {
  const context = useContext(ProductsContext);

  if (!context) {
    throw new Error('useProductsContext must be used within ProductsProvider');
  }

  return context;
}
