import { useMemo } from 'react';
import type { Line, CatalogItem } from '@/features/sale/types';
import { useProductsContext } from '@/features/sale/contexts/ProductsContext';

interface UseCartItemHelpersProps {
  line: Line;
}

interface UseCartItemHelpersReturn {
  originalProduct: CatalogItem | undefined;
  rrpPrice: number;
}

export function useCartItemHelpers({
  line
}: UseCartItemHelpersProps): UseCartItemHelpersReturn {
  const { getProduct } = useProductsContext();

  // Memoize expensive calculations
  const originalProduct = useMemo(() => getProduct(line.sku), [line.sku, getProduct]);
  const rrpPrice = originalProduct?.price || line.price;

  return {
    originalProduct,
    rrpPrice
  };
}