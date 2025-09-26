import { MutableRefObject } from 'react';
import type { CatalogItem } from '../../../types';
import ProductPicker from '../../ProductPicker/ProductPicker';
import { Card } from '@/features/sale/ui';

interface ProductSearchProps {
  catalog: CatalogItem[];
  onAddLine: (sku: string | number, color?: string) => void;
  searchRef?: MutableRefObject<HTMLInputElement | null>;
  onAddSuccess?: (productName: string) => void;
}

export function ProductSearch({
  catalog,
  onAddLine,
  searchRef,
  onAddSuccess
}: ProductSearchProps) {
  return (
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
  );
}