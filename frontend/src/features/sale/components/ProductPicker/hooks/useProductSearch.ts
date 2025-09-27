import { useMemo, useState, useCallback } from 'react';
import type { Product } from '@/shared/types';

interface UseProductSearchProps {
  catalog: Product[];
  defaultLimit?: number;
}

export function useProductSearch({ catalog, defaultLimit = 3 }: UseProductSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    if (!term) {
      return catalog.slice(0, defaultLimit);
    }
    return catalog.filter((product) => {
      const skuStr = String(product.sku).toLowerCase();
      return (
        skuStr.includes(term) ||
        product.name.toLowerCase().includes(term)
      );
    });
  }, [catalog, searchQuery, defaultLimit]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const isSearching = searchQuery.trim().length > 0;
  const hasResults = filteredProducts.length > 0;

  return {
    searchQuery,
    setSearchQuery,
    filteredProducts,
    clearSearch,
    isSearching,
    hasResults,
  };
}