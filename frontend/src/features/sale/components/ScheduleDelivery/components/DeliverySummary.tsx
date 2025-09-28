import { useState, useEffect } from 'react';
import { Card } from '@/shared/components';

interface DeliverySummaryProps {
  deliveryFee: number;
  setDeliveryFee: (fee: number) => void;
  totalServiceCharges: number;
}

export function DeliverySummary({
  deliveryFee,
  setDeliveryFee,
  totalServiceCharges
}: DeliverySummaryProps) {
  const [feeInputValue, setFeeInputValue] = useState('');

  // Sync input value with deliveryFee prop
  useEffect(() => {
    setFeeInputValue(deliveryFee === 0 ? '' : (deliveryFee / 100).toString());
  }, [deliveryFee]);

  return (
    <Card title="Delivery Summary" size="compact" variant="summary">
        {/* Base Delivery Fee */}
        <div className="form-group">
          <label className="form-label">Base Delivery Fee</label>
          <div className="fee-input-wrapper">
            <span className="fee-currency">$</span>
            <input
              type="text"
              inputMode="decimal"
              className="form-input fee-input"
              value={feeInputValue}
              onChange={(e) => {
                let value = e.target.value;

                // Only allow numbers and one decimal point
                value = value.replace(/[^0-9.]/g, '');

                // Prevent multiple decimal points
                const decimalCount = (value.match(/\./g) || []).length;
                if (decimalCount > 1) {
                  const firstDecimalIndex = value.indexOf('.');
                  value = value.substring(0, firstDecimalIndex + 1) + value.substring(firstDecimalIndex + 1).replace(/\./g, '');
                }

                // Limit to 2 decimal places
                const decimalIndex = value.indexOf('.');
                if (decimalIndex !== -1 && value.length > decimalIndex + 3) {
                  value = value.substring(0, decimalIndex + 3);
                }

                // Update local state immediately for smooth typing
                setFeeInputValue(value);

                // Update deliveryFee for valid numbers
                if (value === '' || value === '.') {
                  setDeliveryFee(0);
                } else {
                  const numValue = parseFloat(value);
                  if (!isNaN(numValue)) {
                    setDeliveryFee(Math.round(numValue * 100));
                  }
                }
              }}
              onFocus={(e) => e.target.select()}
              onBlur={(e) => {
                const value = e.target.value;
                if (value === '' || value === '.') {
                  setDeliveryFee(0);
                  setFeeInputValue('');
                } else if (!isNaN(parseFloat(value))) {
                  const numValue = parseFloat(value);
                  setDeliveryFee(Math.round(numValue * 100));
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  (e.target as HTMLInputElement).blur();
                }
              }}
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Fee Breakdown */}
        <div className="summary-breakdown">
          <div className="summary-row">
            <span>Base Delivery</span>
            <span>${(deliveryFee / 100).toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Additional Services</span>
            <span>{totalServiceCharges > 0 ? `+$${(totalServiceCharges / 100).toFixed(2)}` : '$0.00'}</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total Delivery</span>
            <span>${((deliveryFee + totalServiceCharges) / 100).toFixed(2)}</span>
          </div>
        </div>
    </Card>
  );
}