import { useCallback } from 'react';
import type { Line } from '../../../types';

interface UseOrderSummaryProps {
  lines: Line[];
  discountPct: number;
  setDiscountPct: (pct: number) => void;
}

export function useOrderSummary({ lines, discountPct, setDiscountPct }: UseOrderSummaryProps) {
  const itemCount = lines.length;
  const itemCountLabel = `${itemCount} ${itemCount === 1 ? 'item' : 'items'}`;

  const handleDiscountChange = useCallback((value: string) => {
    const numValue = Number(value || 0);
    // Clamp between 0 and 100
    const clampedValue = Math.min(100, Math.max(0, numValue));
    setDiscountPct(clampedValue);
  }, [setDiscountPct]);

  const formatDiscountValue = useCallback(() => {
    return discountPct || '';
  }, [discountPct]);

  return {
    itemCount,
    itemCountLabel,
    handleDiscountChange,
    formatDiscountValue,
  };
}