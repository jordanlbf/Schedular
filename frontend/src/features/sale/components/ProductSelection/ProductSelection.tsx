import { MutableRefObject } from 'react';
import type { Line, CatalogItem } from '@/features/sale/types';
import ProductPicker from '../ProductPicker/ProductPicker';
import { ShoppingCart } from './components/ShoppingCart';
import { Card } from '@/shared/components';

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
      <div className="products-search-section">
        <Card title="Add Products">
          <ProductPicker
            catalog={catalog}
            onAdd={onAddLine}
            inputRef={searchRef}
            onAddSuccess={onAddSuccess}
          />
        </Card>
      </div>

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