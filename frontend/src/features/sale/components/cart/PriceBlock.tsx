import React from 'react';

interface PriceBlockProps {
  price: number;               // current unit price
  compareAtPrice?: number;     // optional RRP/original price
  quantity?: number;           // optional, default 1
  showLineTotal?: boolean;     // optional, default false
  isEditable?: boolean;        // whether price can be edited
  onPriceEdit?: () => void;    // callback when price edit is clicked
  className?: string;
}

export function PriceBlock({
  price,
  compareAtPrice,
  quantity = 1,
  showLineTotal = false,
  isEditable = false,
  onPriceEdit,
  className = ''
}: PriceBlockProps) {
  const hasDiscount = compareAtPrice && compareAtPrice > price;
  const lineTotal = price * quantity;
  const compareLineTotal = compareAtPrice ? compareAtPrice * quantity : 0;
  const totalSave = hasDiscount ? (compareAtPrice - price) * quantity : 0;

  // Format currency using toLocaleString for proper formatting
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className={`price-block ${className}`}>
      {/* Main price - large and bold */}
      <div 
        className={`price-block-current ${isEditable ? 'price-block-editable' : ''}`}
        onClick={isEditable ? onPriceEdit : undefined}
        title={isEditable ? 'Click to edit price' : undefined}
      >
        {formatCurrency(lineTotal)}
      </div>

      {/* Discount row with RRP and Save badge on same line */}
      {hasDiscount && (
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
      {quantity > 1 && showLineTotal && (
        <div className="price-block-unit">
          {formatCurrency(price)} each • {formatCurrency(lineTotal)} total
        </div>
      )}
    </div>
  );
}
