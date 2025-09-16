import React from 'react';

interface PriceBlockProps {
  price: number;               // current unit price
  compareAtPrice?: number;     // optional RRP/original price
  quantity?: number;           // optional; if >1 we also show line total below
  isEditable?: boolean;        // whether price can be edited
  onPriceEdit?: () => void;    // callback when price edit is clicked
  className?: string;
}

export function PriceBlock({
  price,
  compareAtPrice,
  quantity = 1,
  isEditable = false,
  onPriceEdit,
  className = ''
}: PriceBlockProps) {
  const hasDiscount = typeof compareAtPrice === 'number' && compareAtPrice > price;
  const save = hasDiscount ? (compareAtPrice - price) : 0;
  const lineTotal = price * quantity;
  const compareLineTotal = compareAtPrice ? compareAtPrice * quantity : 0;
  const totalSave = save * quantity;

  // Format currency with proper locale string
  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  return (
    <div className={`price-block ${className}`}>
      {/* Main price - clickable if editable */}
      <div 
        className={`price-block-current ${isEditable ? 'price-block-editable' : ''}`}
        onClick={isEditable ? onPriceEdit : undefined}
        title={isEditable ? 'Click to edit price' : undefined}
      >
        {formatCurrency(lineTotal)}
      </div>

      {/* Discount row with RRP and savings */}
      {hasDiscount && compareAtPrice && (
        <div className="price-block-discount-row">
          <span className="price-block-rrp">
            {formatCurrency(compareLineTotal)}
          </span>
          <span 
            className="price-block-save"
            aria-label={`You save ${formatCurrency(totalSave)}`}
          >
            Save {formatCurrency(totalSave)}
          </span>
        </div>
      )}

      {/* Unit price helper when quantity > 1 */}
      {quantity > 1 && (
        <div className="price-block-unit">
          {formatCurrency(price)} each
        </div>
      )}
    </div>
  );
}
