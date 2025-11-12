import { useState, useMemo } from 'react';

interface Product {
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
}

type SortDirection = 'asc' | 'desc';
type SortColumn = keyof Product;

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
      const aVal = a[sortBy];
      const bVal = b[sortBy];

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
