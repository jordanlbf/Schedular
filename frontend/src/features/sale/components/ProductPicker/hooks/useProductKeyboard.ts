import { useCallback } from 'react';
import type { Product } from '@/shared/types';

interface UseProductKeyboardProps {
  filteredProducts: Product[];
  handleAddProduct: (sku: string | number) => void;
  clearSearch: () => void;
  focusInput: () => void;
}

export function useProductKeyboard({
  filteredProducts,
  handleAddProduct,
  clearSearch,
  focusInput
}: UseProductKeyboardProps) {

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && filteredProducts.length > 0) {
      handleAddProduct(filteredProducts[0].sku);
      clearSearch();
      focusInput();
    }
  }, [filteredProducts, handleAddProduct, clearSearch, focusInput]);

  return {
    handleKeyDown,
  };
}