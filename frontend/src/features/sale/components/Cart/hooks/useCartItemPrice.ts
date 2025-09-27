import { useState, useEffect, useCallback } from 'react';

interface UseCartItemPriceProps {
  linePrice: number;
  lineId: number;
  onPriceChange?: (id: number, newPrice: number) => void;
}

interface UseCartItemPriceReturn {
  isEditingPrice: boolean;
  tempPrice: string;
  originalPrice: number;
  priceAnimating: boolean;
  handlePriceEditStart: () => void;
  handlePriceSubmit: () => void;
  handlePriceKeyDown: (e: React.KeyboardEvent) => void;
  setTempPrice: (value: string) => void;
  setPriceAnimating: (animating: boolean) => void;
}

export function useCartItemPrice({
  linePrice,
  lineId,
  onPriceChange
}: UseCartItemPriceProps): UseCartItemPriceReturn {
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [tempPrice, setTempPrice] = useState(linePrice.toString());
  const [originalPrice, setOriginalPrice] = useState(linePrice);
  const [priceAnimating, setPriceAnimating] = useState(false);

  // Update originalPrice when line.price changes (from external updates)
  useEffect(() => {
    if (!isEditingPrice && linePrice !== originalPrice) {
      setOriginalPrice(linePrice);
      setTempPrice(linePrice.toString());
      // Trigger price animation on external price changes
      setPriceAnimating(true);
      setTimeout(() => setPriceAnimating(false), 500);
    }
  }, [linePrice, isEditingPrice, originalPrice]);

  const handlePriceSubmit = useCallback((): void => {
    const newPrice = parseFloat(tempPrice);
    if (!isNaN(newPrice) && newPrice > 0 && onPriceChange) {
      onPriceChange(lineId, newPrice);
      setOriginalPrice(newPrice);
      // Trigger price animation
      setPriceAnimating(true);
      setTimeout(() => setPriceAnimating(false), 500);
    } else {
      // Revert to the original price if invalid
      setTempPrice(originalPrice.toString());
    }
    setIsEditingPrice(false);
  }, [tempPrice, lineId, onPriceChange, originalPrice]);

  const handlePriceKeyDown = useCallback((e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      handlePriceSubmit();
    } else if (e.key === 'Escape') {
      setTempPrice(originalPrice.toString());
      setIsEditingPrice(false);
    }
  }, [handlePriceSubmit, originalPrice]);

  const handlePriceEditStart = useCallback((): void => {
    setIsEditingPrice(true);
    setOriginalPrice(linePrice);
    setTempPrice(''); // Clear the field when starting to edit
  }, [linePrice]);

  return {
    isEditingPrice,
    tempPrice,
    originalPrice,
    priceAnimating,
    handlePriceEditStart,
    handlePriceSubmit,
    handlePriceKeyDown,
    setTempPrice,
    setPriceAnimating
  };
}