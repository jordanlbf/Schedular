import { useState } from 'react';
import type { Line } from "../types";
import { CATALOG } from "../catalog";
import type { Product } from '@/shared/types';

function formatPrice(dollars: number): string {
  try {
    return dollars.toLocaleString(undefined, { 
      style: "currency", 
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  } catch {
    return `$${Math.round(dollars)}`;
  }
}

interface CartItemRowProps {
  line: Line;
  product: Product | undefined;
  totalPrice: string;
  onChangeQty: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
  onPriceChange?: (id: number, newPrice: number) => void;
}

function CartItemRow({ line, product, totalPrice, onChangeQty, onRemove, onPriceChange }: CartItemRowProps) {
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [tempPrice, setTempPrice] = useState(line.price.toString());
  const originalProduct = CATALOG.find(p => p.sku === line.sku);
  const isDiscounted = originalProduct && line.price < originalProduct.price;

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

  const applyDiscount = (percentage: number): void => {
    if (originalProduct && onPriceChange) {
      const discountedPrice = originalProduct.price * (1 - percentage / 100);
      onPriceChange(line.id, Math.round(discountedPrice));
    }
  };

  const handleQuantityDecrease = (): void => {
    if (line.qty === 1) {
      onRemove(line.id);
    } else {
      onChangeQty(line.id, -1);
    }
  };

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        {product?.image ? (
          <img src={product.image} alt={line.name} />
        ) : (
          <div className="cart-item-placeholder">
            <span>📦</span>
          </div>
        )}
      </div>
      
      <div className="cart-item-details">
        <div className="cart-item-main">
          <div className="cart-item-info">
            <div className="cart-item-name">
              {line.color ? `${line.name} (${line.color})` : line.name}
              {isDiscounted && <span className="discount-badge">Discounted</span>}
            </div>
            <div className="cart-item-sku">SKU: {line.sku}</div>
            
            <div className="cart-item-price-section">
              {isEditingPrice ? (
                <div className="price-editor">
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
                  <span className="price-suffix">each</span>
                </div>
              ) : (
                <div className="price-display">
                  <button
                    className="price-edit-btn"
                    onClick={() => setIsEditingPrice(true)}
                    title="Click to edit price"
                  >
                    {formatPrice(line.price)} each
                  </button>
                  {originalProduct && line.price !== originalProduct.price && (
                    <div className="original-price">
                      Original: {formatPrice(originalProduct.price)}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <button 
            className="cart-item-remove"
            onClick={() => onRemove(line.id)}
            aria-label={`Remove ${line.name} from cart`}
            title="Remove from cart"
          >
            ✕
          </button>
        </div>
      
        <div className="cart-item-controls">
          <div className="cart-item-quantity">
            <button 
              className="qty-btn qty-btn-decrease"
              onClick={handleQuantityDecrease}
              aria-label={line.qty === 1 ? "Remove item" : "Decrease quantity"}
            >
              {line.qty === 1 ? '🗑' : '−'}
            </button>
            <span className="qty-display">{line.qty}</span>
            <button 
              className="qty-btn qty-btn-increase"
              onClick={() => onChangeQty(line.id, +1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          
          {onPriceChange && originalProduct && (
            <div className="discount-buttons">
              <button 
                className="discount-btn"
                onClick={() => applyDiscount(10)}
                title="Apply 10% discount"
              >
                -10%
              </button>
              <button 
                className="discount-btn"
                onClick={() => applyDiscount(20)}
                title="Apply 20% discount"
              >
                -20%
              </button>
              {line.price !== originalProduct.price && (
                <button 
                  className="reset-price-btn"
                  onClick={() => onPriceChange(line.id, originalProduct.price)}
                  title="Reset to original price"
                >
                  Reset
                </button>
              )}
            </div>
          )}
          
          <div className="cart-item-total">
            <span className="cart-item-total-price">{totalPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CartTableProps {
  lines: Line[];
  onChangeQty: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
  onPriceChange?: (id: number, newPrice: number) => void;
}

export default function CartTable({ lines, onChangeQty, onRemove, onPriceChange }: CartTableProps) {
  if (lines.length === 0) return null;

  return (
    <div className="cart-items-list">
      {lines.map((line) => {
        const product = CATALOG.find(p => p.sku === line.sku);
        const totalPrice = formatPrice(line.qty * line.price);
        
        return (
          <CartItemRow 
            key={line.id} 
            line={line} 
            product={product}
            totalPrice={totalPrice}
            onChangeQty={onChangeQty}
            onRemove={onRemove}
            onPriceChange={onPriceChange}
          />
        );
      })}
    </div>
  );
}
