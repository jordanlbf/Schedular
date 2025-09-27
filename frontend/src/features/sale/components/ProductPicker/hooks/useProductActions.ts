import { useState, useCallback } from 'react';
import type { Product } from '@/shared/types';

interface UseProductActionsProps {
  catalog: Product[];
  onAdd: (sku: string, color?: string) => void;
  onAddSuccess?: (productName: string) => void;
  getSelectedColor: (sku: string | number) => string | undefined;
}

export function useProductActions({
  catalog,
  onAdd,
  onAddSuccess,
  getSelectedColor
}: UseProductActionsProps) {
  const [addingProduct, setAddingProduct] = useState<string | null>(null);

  const handleAddProduct = useCallback(async (sku: string | number) => {
    const product = catalog.find(p => p.sku === sku);
    if (!product) return;

    setAddingProduct(String(sku));

    const selectedColor = getSelectedColor(sku);
    const colorName = selectedColor && product.colors ?
      product.colors.find(c => c.value === selectedColor)?.name : undefined;

    onAdd(String(sku), colorName);

    if (onAddSuccess) {
      onAddSuccess(product.name);
    }

    setTimeout(() => {
      setAddingProduct(null);
    }, 600);
  }, [catalog, onAdd, onAddSuccess, getSelectedColor]);

  const isProductAdding = useCallback((sku: string | number) => {
    return addingProduct === String(sku);
  }, [addingProduct]);

  const getButtonText = useCallback((product: Product) => {
    const isAdding = isProductAdding(product.sku);
    if (isAdding) return 'Added ✓';
    if (product.stock.status === 'discontinued') return 'Unavailable';
    if (product.stock.status === 'out-of-stock') return 'Pre-order';
    return 'Add';
  }, [isProductAdding]);

  const isProductDisabled = useCallback((product: Product) => {
    return product.stock.status === 'discontinued' || isProductAdding(product.sku);
  }, [isProductAdding]);

  return {
    addingProduct,
    handleAddProduct,
    isProductAdding,
    getButtonText,
    isProductDisabled,
  };
}