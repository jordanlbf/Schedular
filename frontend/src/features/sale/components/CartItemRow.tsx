import { useState, useMemo, useCallback } from 'react';
import type { Line } from "../types";
import { CATALOG } from "../catalog";
import type { Product } from '@/shared/types';
import { formatPrice } from '@/shared/utils/price';

interface CartItemRowProps {
  line: Line;
  product: Product | undefined;
  onChangeQty: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
  onPriceChange?: (id: number, newPrice: number) => void;
}

export function CartItemRow({ line, product, onChangeQty, onRemove, onPriceChange }: CartItemRowProps) {
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [tempPrice, setTempPrice] = useState(line.price.toString());

  // Memoize expensive calculations
  const originalProduct = useMemo(() => CATALOG.find(p => p.sku === line.sku), [line.sku]);
  const isDiscounted = useMemo(() => originalProduct && line.price < originalProduct.price, [originalProduct, line.price]);

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

  return (
    <div className="cart-item-horizontal">
      {/* Small Product Image */}
      <div className="cart-item-image-small">
        {productImage ? (
          <img
            key={`cart-img-${line.sku}-${line.color || 'default'}-${productImage}`}
            src={productImage}
            alt={`${line.name}${line.color ? ` in ${line.color}` : ''} product image`}
            loading="lazy"
          />
        ) : (
          <div className="cart-item-placeholder-small">
            <span>📦</span>
          </div>
        )}
      </div>

      {/* Product Info with Stacked Layout */}
      <div className="cart-item-details-stacked">
        {/* Row 1: Title and SKU */}
        <div className="title-sku-row">
          <h4 className="cart-item-name-compact">
            {line.color ? `${line.name} (${line.color})` : line.name}
          </h4>
          <div className="cart-item-sku-compact">{line.sku}</div>
        </div>

        {/* Row 2: Price */}
        <div className="price-row">
          <div className="cart-item-unit-price-compact">
            {isEditingPrice ? (
              <input
                type="number"
                className="price-input-compact"
                value={tempPrice}
                onChange={(e) => setTempPrice(e.target.value)}
                onBlur={handlePriceSubmit}
                onKeyDown={handlePriceKeyDown}
                step="0.01"
                min="0"
                autoFocus
              />
            ) : (
              <button
                className="price-edit-btn-compact"
                onClick={() => setIsEditingPrice(true)}
                title="Click to edit price"
              >
                {formatPrice(line.price)}
              </button>
            )}
          </div>
        </div>

        {/* Row 3: Quantity Controls */}
        <div className="quantity-row">
          <div className="cart-item-quantity-compact">
            <button
              className="qty-btn-compact qty-btn-decrease"
              onClick={handleQuantityDecrease}
              aria-label={line.qty === 1 ? "Remove item" : "Decrease quantity"}
            >
              −
            </button>
            <span className="qty-display-compact">{line.qty}</span>
            <button
              className="qty-btn-compact qty-btn-increase"
              onClick={handleQuantityIncrease}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* RRP and Discount Info */}
      <div className="cart-item-pricing-compact">
        {originalProduct && (
          <div className="rrp-line">
            <span className="rrp-label">RRP:</span>
            <span className="rrp-value">
              &nbsp;{formatPrice(originalProduct.price)}
            </span>
          </div>
        )}

        {originalProduct && isDiscounted && (
          <div className="discount-line">
            <span className="discount-label">Discount:</span>
            <span className="discount-value">
              -{formatPrice(originalProduct.price - line.price)}
            </span>
          </div>
        )}
      </div>

    </div>
  );
}