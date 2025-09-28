import { useMemo } from 'react';
import type { Line } from '@/features/sale/types';
import { CATALOG } from '@/features/sale/catalog';

interface UseCartItemHelpersProps {
  line: Line;
}

interface UseCartItemHelpersReturn {
  originalProduct: any;
  rrpPrice: number;
}

export function useCartItemHelpers({
  line
}: UseCartItemHelpersProps): UseCartItemHelpersReturn {
  // Memoize expensive calculations
  const originalProduct = useMemo(() => CATALOG.find(p => p.sku === line.sku), [line.sku]);
  const rrpPrice = originalProduct?.price || line.price;

  return {
    originalProduct,
    rrpPrice
  };
}