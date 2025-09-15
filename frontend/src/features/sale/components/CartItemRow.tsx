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
    <div className="cart-item-modern">
      {/* Product Image */}
      <div className="cart-item-image">
        {productImage ? (
          <img
            key={`cart-img-${line.sku}-${line.color || 'default'}-${productImage}`}
            src={productImage}
            alt={`${line.name}${line.color ? ` in ${line.color}` : ''}`}
            loading="lazy"
          />
        ) : (
          <div className="cart-item-placeholder">
            <span>📦</span>
          </div>
        )}
      </div>

      {/* Product Details Section */}
      <div className="cart-item-details">
        {/* Product Info */}
        <div className="cart-item-info">
          <h4 className="cart-item-name">
            {line.color ? `${line.name} (${line.color})` : line.name}
          </h4>
          <div className="cart-item-sku">SKU: {line.sku}</div>
        </div>

        {/* Quantity Controls */}
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

        {/* Price Section */}
        <div className="cart-item-price-section">
          <div className="cart-item-pricing">
            <div className="price-column">
              <div className="price-label">RRP</div>
              <div className={`price-value ${discount > 0 ? 'original-price' : ''}`}>
                {formatPrice(rrpPrice)}
              </div>
            </div>
            <div className="price-column">
              <div className="price-label">Savings</div>
              <div className={`price-value ${isDiscounted ? 'discount-amount' : 'no-discount'}`}>
                {formatPrice(discount)}
              </div>
            </div>
            <div className="price-column">
              <div className="price-label">Price</div>
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
          </div>

          {/* Remove Button */}
          <button 
            className="cart-item-remove"
            onClick={handleRemove}
            aria-label="Remove item from cart"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}