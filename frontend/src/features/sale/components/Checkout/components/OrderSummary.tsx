import type { Line } from '@/features/sale/types';
import type { SaleTotals } from '@/features/sale/hooks/useSaleTotals';
import { fmt } from '@/shared/utils';
import { Card } from '@/ui';
import { useOrderSummary } from '../hooks/useOrderSummary';
import { CATALOG } from '@/features/sale/catalog';
import { useRef, useEffect } from 'react';

interface OrderSummaryProps {
  lines: Line[];
  totals: SaleTotals;
  discountPct: number;
  setDiscountPct: (pct: number) => void;
}

export function OrderSummary({
  lines,
  totals,
  discountPct,
  setDiscountPct
}: OrderSummaryProps) {
  const customInputRef = useRef<HTMLInputElement>(null);
  
  const { 
    itemCountLabel, 
    handleDiscountChange, 
    formatDiscountValue,
    isCustomDiscount,
    handlePresetClick,
    handleCustomClick,
    handleClearClick
  } = useOrderSummary({
    lines,
    discountPct,
    setDiscountPct
  });

  // Auto-select input text when custom mode is activated
  useEffect(() => {
    if (isCustomDiscount && customInputRef.current) {
      customInputRef.current.select();
    }
  }, [isCustomDiscount]);

  // Helper function to get product image
  const getProductImage = (line: Line) => {
    const product = CATALOG.find(p => p.sku === line.sku);
    if (!product) return undefined;

    // If no color is selected, use default product image
    if (!line.color) return product.image;

    // Find the color-specific image
    const selectedColor = product.colors?.find(color => color.name === line.color);
    return selectedColor?.image || product.image;
  };

  // Helper function to get discount info
  const getDiscountInfo = (line: Line) => {
    const product = CATALOG.find(p => p.sku === line.sku);
    if (!product) return null;

    const rrpPrice = product.price;
    const currentPrice = line.price;

    if (currentPrice < rrpPrice) {
      const savings = rrpPrice - currentPrice;
      const savingsTotal = savings * line.qty;
      return {
        rrpPrice,
        currentPrice,
        savings,
        savingsTotal
      };
    }

    return null;
  };

  return (
    <Card title={`Order Summary (${itemCountLabel})`}>
        {/* Top Content - Items and Controls */}
        <div className="order-content-top">
          {/* Order Items - Badge Style */}
          <div className="order-items-list">
            {lines.map((line) => {
              const productImage = getProductImage(line);
              const discountInfo = getDiscountInfo(line);
              
              return (
                <div key={line.id} className="order-item-badge">
                  {/* Product Image */}
                  <div className="order-item-image">
                    {productImage ? (
                      <img
                        src={productImage}
                        alt={line.name}
                        loading="lazy"
                      />
                    ) : (
                      <div className="order-item-placeholder">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Product Content */}
                  <div className="order-item-content">
                    <div className="badge-header">
                      <div className="badge-item-info">
                        <div className="item-name">
                          {line.name}{line.color && ` (${line.color})`}
                        </div>
                        <div className="item-sku">SKU: {line.sku}</div>
                      </div>
                      <div className="qty-badge">×{line.qty}</div>
                    </div>
                    
                    <div className="badge-footer">
                      <div className="badge-pricing">
                        {discountInfo ? (
                          <>
                            <span className="price-rrp">{fmt(discountInfo.rrpPrice * 100)}</span>
                            <span className="price-sale">{fmt(line.price * 100)} each</span>
                          </>
                        ) : (
                          <span>{fmt(line.price * 100)} each</span>
                        )}
                      </div>
                      <div className="badge-total">
                        {discountInfo && (
                          <div className="total-save">-{fmt(discountInfo.savingsTotal * 100)}</div>
                        )}
                        {fmt(line.qty * line.price * 100)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Discount Control & Summary - Integrated */}
          <div className="pricing-controls">
            <div className="discount-row">
              <label className="discount-label">Additional Discount</label>
              
              {/* Discount Options - Inline with title */}
              <div className="discount-options">
                <button
                  type="button"
                  className={`discount-btn ${!isCustomDiscount && discountPct === 5 ? 'active' : ''}`}
                  onClick={() => handlePresetClick(5)}
                >
                  5%
                </button>
                <button
                  type="button"
                  className={`discount-btn ${!isCustomDiscount && discountPct === 10 ? 'active' : ''}`}
                  onClick={() => handlePresetClick(10)}
                >
                  10%
                </button>
                <button
                  type="button"
                  className={`discount-btn ${!isCustomDiscount && discountPct === 15 ? 'active' : ''}`}
                  onClick={() => handlePresetClick(15)}
                >
                  15%
                </button>
                <button
                  type="button"
                  className={`discount-btn-custom ${isCustomDiscount ? 'active' : ''}`}
                  onClick={handleCustomClick}
                >
                  {isCustomDiscount ? (
                    <div className="discount-input-wrapper standalone">
                      <input
                        ref={customInputRef}
                        type="number"
                        className="form-input discount-input"
                        min="0"
                        max="100"
                        step="0.1"
                        value={formatDiscountValue()}
                        onChange={(e) => handleDiscountChange(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="0"
                      />
                      <span className="input-suffix">%</span>
                    </div>
                  ) : (
                    'Custom'
                  )}
                </button>
                {discountPct > 0 && (
                  <button
                    type="button"
                    className="discount-btn-clear"
                    onClick={handleClearClick}
                    title="Clear discount"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Order Totals */}
            <div className="order-totals">
              <div className="total-row">
                <span>Items Subtotal:</span>
                <span>{fmt(totals.itemsSum * 100)}</span>
              </div>
              {totals.lineDiscount > 0 && (
                <div className="total-row discount">
                  <span>Item Discounts:</span>
                  <span>-{fmt(totals.lineDiscount * 100)}</span>
                </div>
              )}
              {totals.deliveryFee > 0 && (
                <div className="total-row">
                  <span>Delivery & Services:</span>
                  <span>{fmt(totals.deliveryFee)}</span>
                </div>
              )}
              {totals.discount > 0 && (
                <div className="total-row discount">
                  <span>Additional Discount ({discountPct}%):</span>
                  <span>-{fmt(totals.discount)}</span>
                </div>
              )}
              <div className="total-row total">
                <span><strong>Total Amount:</strong></span>
                <span><strong>{fmt(totals.total)}</strong></span>
              </div>
            </div>
          </div>
        </div>
    </Card>
  );
}
