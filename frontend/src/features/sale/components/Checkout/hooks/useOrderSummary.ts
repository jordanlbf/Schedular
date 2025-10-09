import { useCallback, useState } from 'react';
import type { Line } from '@/features/sale/types';

interface UseOrderSummaryProps {
  lines: Line[];
  discountPct: number;
  setDiscountPct: (pct: number) => void;
}

export function useOrderSummary({ lines, discountPct, setDiscountPct }: UseOrderSummaryProps) {
  const [isCustomDiscount, setIsCustomDiscount] = useState(false);
  
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

  const handlePresetClick = useCallback((value: number) => {
    setIsCustomDiscount(false);
    setDiscountPct(value);
  }, [setDiscountPct]);

  const handleCustomClick = useCallback(() => {
    setIsCustomDiscount(true);
    // Keep current discount value - don't reset until user enters new value
  }, []);

  const handleClearClick = useCallback(() => {
    setIsCustomDiscount(false);
    setDiscountPct(0);
  }, [setDiscountPct]);

  return {
    itemCount,
    itemCountLabel,
    handleDiscountChange,
    formatDiscountValue,
    isCustomDiscount,
    handlePresetClick,
    handleCustomClick,
    handleClearClick,
  };
}
