import { useState, useEffect, useCallback } from 'react';
import type { Product } from '@/shared/types';

interface UseCartItemQuantityProps {
  lineId: number;
  quantity: number;
  product?: Product;
  onChangeQty: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
}

interface UseCartItemQuantityReturn {
  isRemoving: boolean;
  quantityAnimating: boolean;
  handleQuantityDecrease: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleQuantityIncrease: (e: React.MouseEvent<HTMLButtonElement>) => void;
  setQuantityAnimating: (animating: boolean) => void;
}

export function useCartItemQuantity({
  lineId,
  quantity,
  product,
  onChangeQty,
  onRemove
}: UseCartItemQuantityProps): UseCartItemQuantityReturn {
  const [isRemoving, setIsRemoving] = useState(false);
  const [quantityAnimating, setQuantityAnimating] = useState(false);

  const handleQuantityDecrease = useCallback((e: React.MouseEvent<HTMLButtonElement>): void => {
    // Remove focus from button after click
    e.currentTarget.blur();

    if (quantity === 1) {
      setIsRemoving(true);
      setTimeout(() => {
        onRemove(lineId);
      }, 300); // Wait for animation to complete
    } else {
      setQuantityAnimating(true);
      setTimeout(() => setQuantityAnimating(false), 300);
      onChangeQty(lineId, -1);
    }
  }, [quantity, lineId, onRemove, onChangeQty]);

  const handleQuantityIncrease = useCallback((e: React.MouseEvent<HTMLButtonElement>): void => {
    // Remove focus from button after click
    e.currentTarget.blur();

    // Check if we're at max stock
    const maxStock = product?.stock?.quantity || 999; // Default to 999 if no stock info
    if (quantity >= maxStock) {
      return; // Don't allow increase beyond stock
    }
    setQuantityAnimating(true);
    setTimeout(() => setQuantityAnimating(false), 300);
    onChangeQty(lineId, +1);
  }, [lineId, quantity, product?.stock, onChangeQty]);

  // Add animation trigger for quantity changes
  useEffect(() => {
    if (quantity) {
      setQuantityAnimating(true);
      setTimeout(() => {
        setQuantityAnimating(false);
      }, 400);
    }
  }, [quantity]);

  return {
    isRemoving,
    quantityAnimating,
    handleQuantityDecrease,
    handleQuantityIncrease,
    setQuantityAnimating
  };
}