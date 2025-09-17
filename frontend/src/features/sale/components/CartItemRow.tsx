import { useState, useMemo, useCallback, useEffect } from 'react';
import type { Line } from "../types";
import { CATALOG } from "../catalog";
import type { Product } from '@/shared/types';

import { StockBadge } from '@/shared/components/StockBadge';
import { PriceBlock } from './cart/PriceBlock';

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
  const [originalPrice, setOriginalPrice] = useState(line.price);
  const [isRemoving, setIsRemoving] = useState(false);
  const [quantityAnimating, setQuantityAnimating] = useState(false);
  const [priceAnimating, setPriceAnimating] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Update originalPrice when line.price changes (from external updates)
  useEffect(() => {
    if (!isEditingPrice && line.price !== originalPrice) {
      setOriginalPrice(line.price);
      setTempPrice(line.price.toString());
      // Trigger price animation on external price changes
      setPriceAnimating(true);
      setTimeout(() => setPriceAnimating(false), 500);
    }
  }, [line.price, isEditingPrice, originalPrice]);

  // Memoize expensive calculations
  const originalProduct = useMemo(() => CATALOG.find(p => p.sku === line.sku), [line.sku]);
  const rrpPrice = originalProduct?.price || line.price;

  // Get the correct image based on selected color
  const productImage = useMemo(() => {
    if (!originalProduct) return product?.image;

    // If no color is selected, use default product image
    if (!line.color) return originalProduct.image;

    // Find the color-specific image
    const selectedColor = originalProduct.colors?.find(color => color.name === line.color);
    return selectedColor?.image || originalProduct.image;
  }, [originalProduct, line.color, product?.image]);

  // Format currency helper
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handlePriceSubmit = (): void => {
    const newPrice = parseFloat(tempPrice);
    if (!isNaN(newPrice) && newPrice > 0 && onPriceChange) {
      onPriceChange(line.id, newPrice);
      setOriginalPrice(newPrice);
      // Trigger price animation
      setPriceAnimating(true);
      setTimeout(() => setPriceAnimating(false), 500);
    } else {
      // Revert to the original price if invalid
      setTempPrice(originalPrice.toString());
    }
    setIsEditingPrice(false);
  };

  const handlePriceKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      handlePriceSubmit();
    } else if (e.key === 'Escape') {
      setTempPrice(originalPrice.toString());
      setIsEditingPrice(false);
    }
  };

  const handlePriceEditStart = (): void => {
    setIsEditingPrice(true);
    setOriginalPrice(line.price);
    setTempPrice(''); // Clear the field when starting to edit
  };

  const handleQuantityDecrease = useCallback((e: React.MouseEvent<HTMLButtonElement>): void => {
    // Remove focus from button after click
    e.currentTarget.blur();
    
    if (line.qty === 1) {
      setIsRemoving(true);
      setTimeout(() => {
        onRemove(line.id);
      }, 300); // Wait for animation to complete
    } else {
      setQuantityAnimating(true);
      setTimeout(() => setQuantityAnimating(false), 300);
      onChangeQty(line.id, -1);
    }
  }, [line.qty, line.id, onRemove, onChangeQty]);

  const handleQuantityIncrease = useCallback((e: React.MouseEvent<HTMLButtonElement>): void => {
    // Remove focus from button after click
    e.currentTarget.blur();
    
    // Check if we're at max stock
    const maxStock = product?.stock?.quantity || 999; // Default to 999 if no stock info
    if (line.qty >= maxStock) {
      return; // Don't allow increase beyond stock
    }
    setQuantityAnimating(true);
    setTimeout(() => setQuantityAnimating(false), 300);
    onChangeQty(line.id, +1);
  }, [line.id, line.qty, product?.stock, onChangeQty]);

  // Add animation trigger for quantity changes
  useEffect(() => {
    if (line.qty) {
      setQuantityAnimating(true);
      // Also animate the total price when quantity changes
      setPriceAnimating(true);
      setTimeout(() => {
        setQuantityAnimating(false);
        setPriceAnimating(false);
      }, 400);
    }
  }, [line.qty]);

  // Reset image loading state when image changes
  useEffect(() => {
    if (productImage) {
      // Only set loading if image is not already cached
      const img = new Image();
      img.src = productImage;
      if (!img.complete) {
        setImageLoading(true);
        setImageError(false);
      } else {
        setImageLoading(false);
      }
    }
  }, [productImage]);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  return (
    <div className={`cart-item-grid ${isRemoving ? 'removing' : ''}`}>
      {/* Column 1: Stacked Image + Quantity Controls */}
      <div className="cart-item-media-stack">
        <div className={`cart-item-thumbnail ${imageLoading ? 'loading' : ''}`}>
          {imageLoading && productImage && (
            <div className="cart-item-placeholder">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
              </svg>
            </div>
          )}
          {productImage && !imageError ? (
            <img
              key={`cart-img-${line.sku}-${line.color || 'default'}-${productImage}`}
              src={productImage}
              alt={`${line.name}${line.color ? ` in ${line.color}` : ''}`}
              loading="lazy"
              className={imageLoading ? 'loading' : 'loaded'}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          ) : (
            <div className="cart-item-placeholder">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
              </svg>
            </div>
          )}
        </div>
        
        <div className="cart-item-quantity">
          <div className="qty-btn-wrapper" title={line.qty === 1 ? "Remove item" : "Decrease quantity"}>
            <button
              className={`qty-btn qty-decrease ${line.qty === 1 ? 'at-minimum' : ''}`}
              onClick={handleQuantityDecrease}
              aria-label={line.qty === 1 ? "Remove item" : "Decrease quantity"}
            >
              {line.qty === 1 ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
              ) : (
                '−'
              )}
            </button>
          </div>
          <span className={`qty-value ${quantityAnimating ? 'updating' : ''}`}>{line.qty}</span>
          <div className="qty-btn-wrapper" title={product?.stock?.quantity && line.qty >= product.stock.quantity ? `Maximum stock (${product.stock.quantity})` : "Increase quantity"}>
            <button
              className={`qty-btn qty-increase ${product?.stock?.quantity && line.qty >= product.stock.quantity ? 'at-maximum' : ''}`}
              onClick={handleQuantityIncrease}
              disabled={product?.stock?.quantity ? line.qty >= product.stock.quantity : false}
              aria-label={product?.stock?.quantity && line.qty >= product.stock.quantity ? "At maximum stock" : "Increase quantity"}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Column 2: Product Meta */}
      <div className="cart-item-meta">
        <div className="cart-item-details">
          <h4 className="cart-item-name" title={line.name}>
            {line.name} <span className="sku">{line.sku}</span>
          </h4>
          <div className="cart-item-color-swatch">
            {line.color ? (
              <>
                <div
                  className="color-dot"
                  style={{ backgroundColor: getColorValue(line.color, originalProduct) }}
                  title={line.color}
                />
                <span className="color-name">{line.color}</span>
              </>
            ) : (
              <span className="color-placeholder">&nbsp;</span>
            )}
          </div>
        </div>
        {product?.stock && (
          <div className="cart-item-stock">
            <StockBadge stock={product.stock} />
          </div>
        )}
      </div>

      {/* Column 3: Price */}
      <div className="cart-item-price">
        {isEditingPrice ? (
          <div className="price-block-grid">
            <div className="price-grid-row price-grid-item-row">
              <span className="price-grid-label">Item Price</span>
              <div className={`price-grid-value ${priceAnimating ? 'price-updating' : ''}`}>
                <input
                  type="number"
                  className="price-input"
                  value={tempPrice}
                  onChange={(e) => setTempPrice(e.target.value)}
                  onBlur={handlePriceSubmit}
                  onKeyDown={handlePriceKeyDown}
                  step="0.01"
                  min="0"
                  placeholder="Enter price"
                  autoFocus
                />
              </div>
            </div>
            <div className={`price-grid-row price-grid-rrp-row ${rrpPrice === originalPrice ? 'price-grid-row-hidden' : ''}`}>
              <span className="price-grid-label">RRP</span>
              <div className={`price-grid-value ${priceAnimating ? 'price-updating' : ''}`}>
                <span className="price-grid-rrp">
                  {rrpPrice !== originalPrice ? formatCurrency(rrpPrice) : '\u00A0'}
                </span>
              </div>
            </div>
            <div className={`price-grid-row price-grid-save-row ${rrpPrice === originalPrice ? 'price-grid-row-hidden' : ''}`}>
              <span className="price-grid-label">Save</span>
              <div className={`price-grid-value ${priceAnimating ? 'price-updating' : ''}`}>
                <span className={`price-grid-save ${priceAnimating ? 'save-updating' : ''}`}>
                  {rrpPrice !== originalPrice ? formatCurrency(rrpPrice - originalPrice) : '\u00A0'}
                </span>
              </div>
            </div>
            <div className="price-grid-row price-grid-total-row">
              <span className="price-grid-label">Total</span>
              <div className={`price-grid-value ${priceAnimating || quantityAnimating ? 'price-updating' : ''}`}>
                <span className={`price-grid-total ${priceAnimating || quantityAnimating ? 'total-updating' : ''}`}>
                  {formatCurrency(originalPrice * line.qty)}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <PriceBlock
            price={line.price}
            compareAtPrice={rrpPrice !== line.price ? rrpPrice : undefined}
            quantity={line.qty}
            showLineTotal={true}
            isEditable={!!onPriceChange}
            onPriceEdit={handlePriceEditStart}
          />
        )}
      </div>
    </div>
  );
}