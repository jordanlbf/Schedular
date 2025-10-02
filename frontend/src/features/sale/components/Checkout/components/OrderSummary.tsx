import type { Line } from '@/features/sale/types';
import type { SaleTotals } from '@/features/sale/hooks/useSaleTotals';
import { fmt } from '@/shared/utils';
import { Card } from '@/shared/components';
import { useOrderSummary } from '../hooks/useOrderSummary';

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
  const { itemCountLabel, handleDiscountChange, formatDiscountValue } = useOrderSummary({
    lines,
    discountPct,
    setDiscountPct
  });

  return (
    <Card title={`Order Summary (${itemCountLabel})`}>
        {/* Top Content - Items and Controls */}
        <div className="order-content-top">
          {/* Order Items */}
          <div className="order-items-list">
            {lines.map((line) => (
              <div key={line.id} className="order-item-row">
                <div className="item-details">
                  <span className="item-name">{line.name}</span>
                  <span className="item-sku">SKU: {line.sku}</span>
                </div>
                <div className="item-quantity">×{line.qty}</div>
                <div className="item-price">{fmt(line.price * 100)}</div>
                <div className="item-total">{fmt(line.qty * line.price * 100)}</div>
              </div>
            ))}
          </div>

          {/* Discount Control */}
          <div className="pricing-controls">
            <div className="form-group">
              <label className="form-label" htmlFor="discount-input">Additional Discount (%)</label>
              <div className="discount-input-wrapper">
                <input
                  id="discount-input"
                  type="number"
                  className="form-input discount-input"
                  min="0"
                  max="100"
                  step="0.1"
                  value={formatDiscountValue()}
                  onChange={(e) => handleDiscountChange(e.target.value)}
                  placeholder="0"
                />
                <span className="input-suffix">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Content - Pricing Breakdown (Pinned) */}
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
    </Card>
  );
}