import { MutableRefObject } from 'react';
import type { CatalogItem } from '../../../types';
import ProductPicker from '../../ProductPicker/ProductPicker';

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
      <div className="form-card">
        <div className="form-card-header">
          <h3>Add Products</h3>
        </div>
        <div className="form-card-body">
          <ProductPicker
            catalog={catalog}
            onAdd={onAddLine}
            inputRef={searchRef}
            onAddSuccess={onAddSuccess}
          />
        </div>
      </div>
    </div>
  );
}