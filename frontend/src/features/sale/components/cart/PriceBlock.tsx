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
    <div className={`price-block-grid ${className}`}>
      {/* Row 1: Item Price - Always visible */}
      <div className="price-grid-row">
        <span className="price-grid-label">Item Price</span>
        <div className="price-grid-value">
          <span 
            className={isEditable ? 'price-grid-editable' : ''}
            onClick={isEditable ? onPriceEdit : undefined}
            title={isEditable ? 'Click to edit price' : undefined}
          >
            {formatCurrency(price)}
          </span>
        </div>
      </div>
      
      {/* Row 2: Save - Always takes up space, but only visible if discounted */}
      <div className={`price-grid-row price-grid-save-row ${!hasDiscount ? 'price-grid-row-hidden' : ''}`}>
        <span className="price-grid-label">Save</span>
        <div className="price-grid-value">
          <span className="price-grid-save">
            {hasDiscount ? formatCurrency(totalSave / quantity) : '\u00A0'}
          </span>
        </div>
      </div>

      {/* Row 3: Total - Always visible */}
      <div className="price-grid-row price-grid-total-row">
        <span className="price-grid-label">Total</span>
        <div className="price-grid-value">
          <span className="price-grid-total">
            {formatCurrency(lineTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}