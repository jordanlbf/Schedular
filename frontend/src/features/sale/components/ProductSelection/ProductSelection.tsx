import { MutableRefObject } from 'react';
import type { Line, CatalogItem } from '../../types';
import { ProductSearch } from './components/ProductSearch';
import { ShoppingCart } from './components/ShoppingCart';

interface ProductSelectionProps {
  lines: Line[];
  catalog: CatalogItem[];
  onAddLine: (sku: string | number, color?: string) => void;
  onChangeQty: (id: number, delta: number) => void;
  onRemoveLine: (id: number) => void;
  onPriceChange?: (id: number, newPrice: number) => void;
  searchRef?: MutableRefObject<HTMLInputElement | null>;
  subtotal: number;
  onAddSuccess?: (productName: string) => void;
}

export default function ProductSelection({
  lines,
  catalog,
  onAddLine,
  onChangeQty,
  onRemoveLine,
  onPriceChange,
  searchRef,
  subtotal,
  onAddSuccess
}: ProductSelectionProps) {
  return (
    <div className="products-layout">
      <ProductSearch
        catalog={catalog}
        onAddLine={onAddLine}
        searchRef={searchRef}
        onAddSuccess={onAddSuccess}
      />

      <ShoppingCart
        lines={lines}
        catalog={catalog}
        onChangeQty={onChangeQty}
        onRemoveLine={onRemoveLine}
        onPriceChange={onPriceChange}
        subtotal={subtotal}
      />
    </div>
  );
}