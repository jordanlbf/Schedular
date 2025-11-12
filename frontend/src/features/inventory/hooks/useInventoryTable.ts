import { useState, useMemo } from 'react';
import type { Product } from '@/shared/types';

type SortDirection = 'asc' | 'desc';
type SortColumn = 'sku' | 'name' | 'category' | 'price' | 'stock';

interface UseInventoryTableOptions {
  products: Product[];
  initialSortBy?: SortColumn;
  initialSortDir?: SortDirection;
}

export function useInventoryTable({
  products,
  initialSortBy = 'name',
  initialSortDir = 'asc'
}: UseInventoryTableOptions) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortColumn>(initialSortBy);
  const [sortDir, setSortDir] = useState<SortDirection>(initialSortDir);

  const handleSort = (column: SortColumn) => {
    if (sortBy === column) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDir('asc');
    }
  };

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;

      // Handle stock sorting specially since it's nested
      if (sortBy === 'stock') {
        aVal = a.stock.quantity;
        bVal = b.stock.quantity;
      } else {
        aVal = a[sortBy] ?? '';
        bVal = b[sortBy] ?? '';
      }

      if (sortDir === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }, [products, sortBy, sortDir]);

  const filteredProducts = useMemo(() => {
    return sortedProducts.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sortedProducts, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    sortBy,
    sortDir,
    handleSort,
    filteredProducts,
  };
}
