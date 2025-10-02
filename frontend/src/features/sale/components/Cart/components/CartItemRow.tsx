import { memo } from 'react';
import type { Line } from "@/features/sale/types";
import type { Product } from '@/shared/types';
import { getColorValue } from '@/shared/utils/colors';
import { formatPrice } from '@/shared/utils';
import { StockBadge } from '@/ui/StockBadge';
import { PriceBlock } from './PriceBlock';
import {
  useCartItemPrice,
  useCartItemQuantity,
  useCartItemImage,
  useCartItemHelpers
} from '../hooks';

interface CartItemRowProps {
  line: Line;
  product: Product | undefined;
  onChangeQty: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
  onPriceChange?: (id: number, newPrice: number) => void;
}

export const CartItemRow = memo(function CartItemRow({ line, product, onChangeQty, onRemove, onPriceChange }: CartItemRowProps) {
  // Extract business logic to custom hooks
  const priceHook = useCartItemPrice({
    linePrice: line.price,
    lineId: line.id,
    onPriceChange
  });

  const quantityHook = useCartItemQuantity({
    lineId: line.id,
    quantity: line.qty,
    product,
    onChangeQty,
    onRemove
  });

  const imageHook = useCartItemImage({ line, product });

  const { originalProduct, rrpPrice } = useCartItemHelpers({ line });

  // Calculate total for footer
  const lineTotal = line.price * line.qty;

  return (
    <div className={`cart-item-grid ${quantityHook.isRemoving ? 'removing' : ''}`}>
      {/* Remove button */}
      <button 
        className="cart-item-remove"
        onClick={() => onRemove(line.id)}
        aria-label="Remove item"
        title="Remove item"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      {/* Main Content Area */}
      <div className="cart-item-content">
        {/* Column 1: Image Only */}
        <div className="cart-item-media-stack">
          <div className="cart-item-thumbnail">
            {imageHook.imageLoading && imageHook.productImage && (
              <div className="cart-item-placeholder">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg>
              </div>
            )}
            {imageHook.productImage && !imageHook.imageError ? (
              <img
                key={`cart-img-${line.sku}-${line.color || 'default'}-${imageHook.productImage}`}
                src={imageHook.productImage}
                alt={`${line.name}${line.color ? ` in ${line.color}` : ''}`}
                loading="lazy"
                className="cart-item-image"
                onLoad={imageHook.handleImageLoad}
                onError={imageHook.handleImageError}
              />
            ) : (
              <div className="cart-item-placeholder">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Product Meta + Quantity Controls */}
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
                <span>&nbsp;</span>
              )}
            </div>
          </div>
          
          <div className="cart-item-quantity-row">
            <div className="cart-item-quantity">
              <div className="qty-btn-wrapper" title={line.qty === 1 ? "Remove item" : "Decrease quantity"}>
                <button
                  className={`qty-btn qty-decrease ${line.qty === 1 ? 'at-minimum' : ''}`}
                  onClick={quantityHook.handleQuantityDecrease}
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
              <span className={`qty-value ${quantityHook.quantityAnimating ? 'updating' : ''}`}>{line.qty}</span>
              <div className="qty-btn-wrapper" title={product?.stock?.quantity && line.qty >= product.stock.quantity ? `Maximum stock (${product.stock.quantity})` : "Increase quantity"}>
                <button
                  className={`qty-btn qty-increase ${product?.stock?.quantity && line.qty >= product.stock.quantity ? 'at-maximum' : ''}`}
                  onClick={quantityHook.handleQuantityIncrease}
                  disabled={product?.stock?.quantity ? line.qty >= product.stock.quantity : false}
                  aria-label={product?.stock?.quantity && line.qty >= product.stock.quantity ? "At maximum stock" : "Increase quantity"}
                >
                  +
                </button>
              </div>
            </div>
            {product?.stock && (
              <StockBadge stock={product.stock} />
            )}
          </div>
        </div>

        {/* Column 3: Price */}
        <div className="cart-item-price">
          {priceHook.isEditingPrice ? (
            <div className="price-block-grid">
              <div className="price-grid-row price-grid-item-row">
                <span className="price-grid-label">Item Price</span>
                <div className={`price-grid-value ${priceHook.priceAnimating ? 'price-updating' : ''}`}>
                  <input
                    type="number"
                    className="price-input"
                    value={priceHook.tempPrice}
                    onChange={(e) => priceHook.setTempPrice(e.target.value)}
                    onBlur={priceHook.handlePriceSubmit}
                    onKeyDown={priceHook.handlePriceKeyDown}
                    step="0.01"
                    min="0"
                    placeholder="Enter price"
                    autoFocus
                  />
                </div>
              </div>
              <div className={`price-grid-row price-grid-rrp-row ${rrpPrice === priceHook.originalPrice ? 'price-grid-row-hidden' : ''}`}>
                <span className="price-grid-label">RRP</span>
                <div className={`price-grid-value ${priceHook.priceAnimating ? 'price-updating' : ''}`}>
                  <span className="price-grid-rrp">
                    {rrpPrice !== priceHook.originalPrice ? formatPrice(rrpPrice) : '\u00A0'}
                  </span>
                </div>
              </div>
              <div className={`price-grid-row price-grid-save-row ${rrpPrice === priceHook.originalPrice ? 'price-grid-row-hidden' : ''}`}>
                <span className="price-grid-label">Save</span>
                <div className={`price-grid-value ${priceHook.priceAnimating ? 'price-updating' : ''}`}>
                  <span className={`price-grid-save ${priceHook.priceAnimating ? 'save-updating' : ''}`}>
                    {rrpPrice !== priceHook.originalPrice ? formatPrice(rrpPrice - priceHook.originalPrice) : '\u00A0'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <PriceBlock
              price={line.price}
              compareAtPrice={rrpPrice !== line.price ? rrpPrice : undefined}
              quantity={line.qty}
              showLineTotal={false}
              isEditable={!!onPriceChange}
              onPriceEdit={priceHook.handlePriceEditStart}
            />
          )}
        </div>
      </div>

      {/* Footer with Total */}
      <div className="cart-item-footer">
        <span className="cart-item-footer-label">Total</span>
        <span className={`cart-item-footer-value ${priceHook.priceAnimating || quantityHook.quantityAnimating ? 'price-updating' : ''}`}>
          {formatPrice(lineTotal)}
        </span>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison: only re-render if these values change
  return (
    prevProps.line.id === nextProps.line.id &&
    prevProps.line.qty === nextProps.line.qty &&
    prevProps.line.price === nextProps.line.price &&
    prevProps.line.color === nextProps.line.color &&
    prevProps.product?.sku === nextProps.product?.sku
  );
});
