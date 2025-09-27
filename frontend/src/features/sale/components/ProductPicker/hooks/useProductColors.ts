import { useState, useEffect, useCallback } from 'react';
import type { Product } from '@/shared/types';

interface UseProductColorsProps {
  catalog: Product[];
}

export function useProductColors({ catalog }: UseProductColorsProps) {
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({});

  // Initialize default colors when catalog changes
  useEffect(() => {
    const defaultColors: Record<string, string> = {};
    catalog.forEach(product => {
      if (product.colors && product.colors.length > 0) {
        defaultColors[String(product.sku)] = product.colors[0].value;
      }
    });
    setSelectedColors(defaultColors);
  }, [catalog]);

  const handleColorSelect = useCallback((sku: string | number, color: string) => {
    setSelectedColors(prev => ({
      ...prev,
      [String(sku)]: color
    }));
  }, []);

  const getSelectedColor = useCallback((sku: string | number) => {
    return selectedColors[String(sku)];
  }, [selectedColors]);

  const getProductImage = useCallback((product: Product) => {
    const selectedColor = selectedColors[String(product.sku)];
    if (!selectedColor || !product.colors) return product.image;

    const selectedColorObj = product.colors.find(color => color.value === selectedColor);
    return selectedColorObj?.image || product.image;
  }, [selectedColors]);

  return {
    selectedColors,
    handleColorSelect,
    getSelectedColor,
    getProductImage,
  };
}