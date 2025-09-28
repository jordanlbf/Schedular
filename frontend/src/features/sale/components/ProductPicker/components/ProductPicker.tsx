import { useEffect, useRef, MutableRefObject } from "react";

import type { Line, CatalogItem } from '@/features/sale/types';
import { formatPrice } from '@/shared/utils';
import { StockBadge } from '@/shared/components/StockBadge';
import { Card } from '@/shared/components';
import { ColourSelector } from './ColourSelector';
import { ShoppingCart } from './ShoppingCart';
import { useProductSearch } from '../hooks/useProductSearch';
import { useProductColors } from '../hooks/useProductColors';
import { useProductActions } from '../hooks/useProductActions';
import { useProductKeyboard } from '../hooks/useProductKeyboard';

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
  const internalInputRef = useRef<HTMLInputElement>(null);
  const finalInputRef = searchRef || internalInputRef;

  const { searchQuery, setSearchQuery, filteredProducts, clearSearch, isSearching } = useProductSearch({
    catalog,
    defaultLimit: 3
  });

  const { handleColorSelect, getSelectedColor, getProductImage } = useProductColors({
    catalog
  });

  const { handleAddProduct, isProductAdding, getButtonText, isProductDisabled } = useProductActions({
    catalog,
    onAdd: onAddLine,
    onAddSuccess,
    getSelectedColor
  });

  const focusInput = () => finalInputRef.current?.focus();

  const { handleKeyDown } = useProductKeyboard({
    filteredProducts,
    handleAddProduct,
    clearSearch,
    focusInput
  });

  useEffect(() => {
    finalInputRef.current?.focus();
  }, [finalInputRef]);

  return (
    <div className="products-layout">
      <div className="products-search-section">
        <Card title="Add Products">
          <div className="product-picker">
            <div className="product-search">
              <input
                id="product-search-input"
                ref={finalInputRef}
                className="form-input"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            {!isSearching && (
              <div className="product-hint">
                Popular
              </div>
            )}

            <div className="product-grid">
              {filteredProducts.map((p) => {
                const isOutOfStock = p.stock.status === 'out-of-stock' || p.stock.status === 'discontinued';
                const isAdding = isProductAdding(p.sku);
                const productImage = getProductImage(p);
                const selectedColor = getSelectedColor(p.sku);

                return (
                  <div key={p.sku} className={`product-card ${isOutOfStock ? 'out-of-stock' : ''} ${isAdding ? 'adding' : ''}`}>
                    <div className="product-header">
                      <div className="product-title">
                        <h3 className="name">{p.name}</h3>
                        <StockBadge stock={p.stock} />
                      </div>
                      <div className="product-info-row">
                        <span className="sku">{p.sku}</span>
                        <div className="stock-info-section">
                          {p.stock.leadTimeText && (
                            <div className="lead-time-header">
                              {p.stock.leadTimeText}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {productImage && (
                      <div className="product-image">
                        <img
                          key={`product-img-${p.sku}-${selectedColor || 'default'}`}
                          src={productImage}
                          alt={p.name}
                        />
                      </div>
                    )}
                    <div className="price-section">
                      <div className="price">{formatPrice(p.price)}</div>
                    </div>

                    {p.colors && p.colors.length > 0 && (
                      <div className="product-colors">
                        <ColourSelector
                          colors={p.colors}
                          selectedColor={selectedColor}
                          onColorSelect={(color) => handleColorSelect(p.sku, color)}
                        />
                      </div>
                    )}

                    <div className="actions">
                      <button
                        type="button"
                        className={`btn btn-primary ${isAdding ? 'adding' : ''}`}
                        onClick={() => handleAddProduct(p.sku)}
                        disabled={isProductDisabled(p)}
                      >
                        {getButtonText(p)}
                      </button>
                    </div>
                  </div>
                );
              })}

              {filteredProducts.length === 0 && isSearching && (
                <div className="product-empty">
                  No products match "{searchQuery}"
                </div>
              )}
            </div>
          </div>
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
