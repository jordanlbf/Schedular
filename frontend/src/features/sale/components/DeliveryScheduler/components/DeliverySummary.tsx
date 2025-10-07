import { useState, useEffect } from 'react';
import { Card } from '@/ui';
import TruckIcon from './icons/TruckIcon';
import PackageIcon from './icons/PackageIcon';
import DollarIcon from './icons/DollarIcon';

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
      <div className="summary-glass-grid">
        {/* Base Delivery */}
        <div className="summary-glass-item">
          <div className="summary-label">Base</div>
          <div className="summary-icon-wrapper">
            <TruckIcon className="summary-icon" />
          </div>
          <div className="summary-value">${(deliveryFee / 100).toFixed(2)}</div>
        </div>

        {/* Services */}
        <div className="summary-glass-item">
          <div className="summary-label">Services</div>
          <div className="summary-icon-wrapper">
            <PackageIcon className="summary-icon" />
          </div>
          <div className="summary-value">${(totalServiceCharges / 100).toFixed(2)}</div>
        </div>

        {/* Total */}
        <div className="summary-glass-item summary-glass-item-total">
          <div className="summary-label summary-label-total">Total</div>
          <div className="summary-icon-wrapper">
            <DollarIcon className="summary-icon summary-icon-total" />
          </div>
          <div className="summary-value summary-value-total">${((deliveryFee + totalServiceCharges) / 100).toFixed(2)}</div>
        </div>
      </div>
    </Card>
  );
}
