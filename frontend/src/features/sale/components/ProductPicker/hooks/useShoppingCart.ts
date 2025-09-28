import { useMemo } from 'react';
import type { Line, CatalogItem } from '@/features/sale/types';

interface UseShoppingCartProps {
  lines: Line[];
  catalog: CatalogItem[];
  subtotal: number;
}

export function useShoppingCart({ lines, catalog, subtotal }: UseShoppingCartProps) {

  const itemCount = useMemo(() => {
    return lines.reduce((total, line) => total + line.qty, 0);
  }, [lines]);

  const totalsCalculation = useMemo(() => {
    const rrpTotal = Math.round(lines.reduce((total, line) => {
      const product = catalog.find(p => p.sku === line.sku);
      return total + ((product?.price || line.price) * line.qty);
    }, 0) * 100) / 100;

    const currentTotal = Math.round(subtotal * 100) / 100;
    const totalSavings = Math.round((rrpTotal - currentTotal) * 100) / 100;

    return {
      rrpTotal,
      currentTotal,
      totalSavings,
      hasSavings: totalSavings > 0
    };
  }, [lines, catalog, subtotal]);

  const isEmpty = lines.length === 0;

  return {
    itemCount,
    totalsCalculation,
    isEmpty,
  };
}