import { useState, useMemo, useCallback } from 'react';
import type { Line } from "../types";
import { CATALOG } from "../catalog";
import type { Product } from '@/shared/types';
import { formatPrice } from '@/shared/utils/price';
import { StockBadge } from '@/shared/components/StockBadge';

interface CartItemRowProps {
  line: Line;
  product: Product | undefined;
  onChangeQty: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
  onPriceChange?: (id: number, newPrice: number) => void;
}

// Helper function to get color value from catalog or fallback to hardcoded values
const getColorValue = (colorName: string, originalProduct?: any): string => {
  // First try to get the color from the actual product catalog
  if (originalProduct?.colors) {
    const catalogColor = originalProduct.colors.find((color: { name: string; value: string }) => color.name === colorName);
    if (catalogColor?.value) {
      return catalogColor.value;
    }
  }

  // Fallback to hardcoded mapping for colors not in catalog
  const colorMap: Record<string, string> = {
    'Red': '#ef4444',
    'Blue': '#3b82f6',
    'Green': '#10b981',
    'Yellow': '#f59e0b',
    'Purple': '#8b5cf6',
    'Pink': '#ec4899',
    'Orange': '#f97316',
    'Teal': '#14b8a6',
    'Indigo': '#6366f1',
    'Gray': '#6b7280',
    'Grey': '#6b7280',
    'Black': '#1f2937',
    'White': '#f9fafb',
    'Brown': '#8b4513',
    'Tan': '#CD853F',
    'Navy': '#1e3a8a',
    'Maroon': '#7f1d1d',
    'Silver': '#d1d5db',
    'Gold': '#fbbf24',
    'Natural Oak': '#C8956D',
    'Dark Walnut': '#4A2C17',
    'Arctic White': '#F8F8FF',
    'Dove Gray': '#696969'
  };

  return colorMap[colorName] || colorMap[colorName.charAt(0).toUpperCase() + colorName.slice(1)] || '#6b7280';
};

export function CartItemRow({ line, product, onChangeQty, onRemove, onPriceChange }: CartItemRowProps) {
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [tempPrice, setTempPrice] = useState(line.price.toString());

  // Memoize expensive calculations
  const originalProduct = useMemo(() => CATALOG.find(p => p.sku === line.sku), [line.sku]);
  const rrpPrice = originalProduct?.price || line.price;
  const discount = rrpPrice - line.price;
  const isDiscounted = discount > 0;
  const totalPrice = line.price * line.qty;

  // Get the correct image based on selected color
  const productImage = useMemo(() => {
    if (!originalProduct) return product?.image;

    // If no color is selected, use default product image
    if (!line.color) return originalProduct.image;

    // Find the color-specific image
    const selectedColor = originalProduct.colors?.find(color => color.name === line.color);
    return selectedColor?.image || originalProduct.image;
  }, [originalProduct, line.color, product?.image]);

  const handlePriceSubmit = (): void => {
    const newPrice = parseFloat(tempPrice);
    if (!isNaN(newPrice) && newPrice > 0 && onPriceChange) {
      onPriceChange(line.id, newPrice);
    } else {
      setTempPrice(line.price.toString());
    }
    setIsEditingPrice(false);
  };

  const handlePriceKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      handlePriceSubmit();
    } else if (e.key === 'Escape') {
      setTempPrice(line.price.toString());
      setIsEditingPrice(false);
    }
  };

  const handleQuantityDecrease = useCallback((): void => {
    if (line.qty === 1) {
      onRemove(line.id);
    } else {
      onChangeQty(line.id, -1);
    }
  }, [line.qty, line.id, onRemove, onChangeQty]);

  const handleQuantityIncrease = useCallback((): void => {
    onChangeQty(line.id, +1);
  }, [line.id, onChangeQty]);

  const handleRemove = useCallback((): void => {
    onRemove(line.id);
  }, [line.id, onRemove]);

  return (
    <div className="cart-item-grid">
      {/* Column 1: Thumbnail */}
      <div className="cart-item-thumbnail">
        {productImage ? (
          <img
            key={`cart-img-${line.sku}-${line.color || 'default'}-${productImage}`}
            src={productImage}
            alt={`${line.name}${line.color ? ` in ${line.color}` : ''}`}
            loading="lazy"
          />
        ) : (
          <div className="cart-item-placeholder">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
          </div>
        )}
      </div>

      {/* Column 2: Product Meta */}
      <div className="cart-item-meta">
        <h4 className="cart-item-name" title={line.name}>
          {line.name}
        </h4>
        <div className="cart-item-details-row">
          <div className="cart-item-sku">SKU: {line.sku}</div>
          {line.color && (
            <div className="cart-item-color-swatch">
              <div
                className="color-dot"
                style={{ backgroundColor: getColorValue(line.color, originalProduct) }}
                title={line.color}
              />
              <span className="color-name">{line.color}</span>
            </div>
          )}
        </div>
      </div>

      {/* Column 3: Stock/Status Chips */}
      <div className="cart-item-status">
        <div className="status-chips">
          {product?.stock && <StockBadge stock={product.stock} />}
          {isDiscounted && (
            <span className="discount-chip">
              Save {formatPrice(discount)}
            </span>
          )}
        </div>
        <button
          className="remove-btn-text"
          onClick={handleRemove}
          aria-label="Remove item from cart"
        >
          Remove
        </button>
      </div>

      {/* Column 4: Quantity Controls */}
      <div className="cart-item-quantity">
        <button
          className="qty-btn qty-decrease"
          onClick={handleQuantityDecrease}
          aria-label={line.qty === 1 ? "Remove item" : "Decrease quantity"}
        >
          −
        </button>
        <span className="qty-value">{line.qty}</span>
        <button
          className="qty-btn qty-increase"
          onClick={handleQuantityIncrease}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      {/* Column 5: Price */}
      <div className="cart-item-price">
        <div className="price-main">
          {isEditingPrice ? (
            <input
              type="number"
              className="price-input"
              value={tempPrice}
              onChange={(e) => setTempPrice(e.target.value)}
              onBlur={handlePriceSubmit}
              onKeyDown={handlePriceKeyDown}
              step="0.01"
              min="0"
              autoFocus
            />
          ) : (
            <div
              className="price-value price-editable"
              onClick={() => setIsEditingPrice(true)}
              title="Click to edit price"
            >
              {formatPrice(totalPrice)}
            </div>
          )}
        </div>

        {(rrpPrice !== line.price || isDiscounted) && (
          <div className="price-meta">
            {rrpPrice !== line.price && (
              <div className="price-rrp">
                RRP {formatPrice(rrpPrice)}
              </div>
            )}
            {isDiscounted && (
              <div className="price-savings">
                Save {formatPrice(discount)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}