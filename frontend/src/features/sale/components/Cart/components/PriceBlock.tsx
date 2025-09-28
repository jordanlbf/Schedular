import { useState, useEffect } from 'react';
import { formatPrice } from '@/shared/utils';

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
  isEditable = false,
  onPriceEdit,
  className = ''
}: PriceBlockProps) {
  const [prevPrice, setPrevPrice] = useState(price);
  const [prevQuantity, setPrevQuantity] = useState(quantity);
  const [priceAnimating, setPriceAnimating] = useState(false);
  const [totalAnimating, setTotalAnimating] = useState(false);
  const [saveAnimating, setSaveAnimating] = useState(false);

  // Detect price changes
  useEffect(() => {
    if (price !== prevPrice) {
      setPrevPrice(price);
      setPriceAnimating(true);
      setSaveAnimating(true);
      setTotalAnimating(true);
      setTimeout(() => {
        setPriceAnimating(false);
        setSaveAnimating(false);
        setTotalAnimating(false);
      }, 500);
    }
  }, [price, prevPrice]);

  // Detect quantity changes
  useEffect(() => {
    if (quantity !== prevQuantity) {
      setPrevQuantity(quantity);
      setTotalAnimating(true);
      setSaveAnimating(true);
      setTimeout(() => {
        setTotalAnimating(false);
        setSaveAnimating(false);
      }, 400);
    }
  }, [quantity, prevQuantity]);
  const hasDiscount = compareAtPrice && compareAtPrice > price;
  const lineTotal = price * quantity;
  const totalSave = hasDiscount ? (compareAtPrice - price) * quantity : 0;


  return (
    <div className={`price-block-grid ${className}`}>
      {/* Row 1: Item Price - Always visible */}
      <div className="price-grid-row price-grid-item-row">
        <span className="price-grid-label">Item Price</span>
        <div className={`price-grid-value ${priceAnimating ? 'price-updating' : ''}`}>
          <span
            className={isEditable ? 'price-grid-editable' : ''}
            onClick={isEditable ? onPriceEdit : undefined}
            title={isEditable ? 'Click to edit price' : undefined}
          >
            {formatPrice(price)}
          </span>
        </div>
      </div>

      {/* Row 2: RRP - Only visible if discounted */}
      <div className={`price-grid-row price-grid-rrp-row ${!hasDiscount ? 'price-grid-row-hidden' : ''}`}>
        <span className="price-grid-label">RRP</span>
        <div className={`price-grid-value ${priceAnimating ? 'price-updating' : ''}`}>
          <span className="price-grid-rrp">
            {hasDiscount ? formatPrice(compareAtPrice) : '\u00A0'}
          </span>
        </div>
      </div>

      {/* Row 3: Save - Only visible if discounted */}
      <div className={`price-grid-row price-grid-save-row ${!hasDiscount ? 'price-grid-row-hidden' : ''}`}>
        <span className="price-grid-label">Save</span>
        <div className={`price-grid-value ${saveAnimating ? 'price-updating' : ''}`}>
          <span className={`price-grid-save ${saveAnimating ? 'save-updating' : ''}`}>
            {hasDiscount ? formatPrice(totalSave / quantity) : '\u00A0'}
          </span>
        </div>
      </div>

      {/* Row 4: Total - Always visible */}
      <div className="price-grid-row price-grid-total-row">
        <span className="price-grid-label">Total</span>
        <div className={`price-grid-value ${totalAnimating ? 'price-updating' : ''}`}>
          <span className={`price-grid-total ${totalAnimating ? 'total-updating' : ''}`}>
            {formatPrice(lineTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}