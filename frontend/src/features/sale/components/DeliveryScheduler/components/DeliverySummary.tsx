import { useState, useEffect, useRef } from 'react';
import { Card } from '@/ui';
import TruckIcon from './icons/TruckIcon';
import PackageIcon from './icons/PackageIcon';
import DollarIcon from './icons/DollarIcon';
import EditIcon from './icons/EditIcon';

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
  const [isEditing, setIsEditing] = useState(false);
  const [feeInputValue, setFeeInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync input value with deliveryFee prop
  useEffect(() => {
    setFeeInputValue(deliveryFee === 0 ? '0.00' : (deliveryFee / 100).toFixed(2));
  }, [deliveryFee]);

  // Auto-select text when input appears
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const newFee = Math.round(parseFloat(feeInputValue || '0') * 100);
    setDeliveryFee(newFee);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setFeeInputValue((deliveryFee / 100).toFixed(2));
    }
  };

  const total = deliveryFee + totalServiceCharges;

  return (
    <Card title="Delivery Summary" size="compact" variant="summary">
      <div className="summary-glass-grid">
        {/* Base Delivery - Editable */}
        <div className="summary-glass-item">
          <div className="summary-label">Base</div>
          <div className="summary-icon-wrapper">
            <TruckIcon className="summary-icon" />
          </div>
          <div className="summary-value">
            {isEditing ? (
              <input
                ref={inputRef}
                type="number"
                step="0.01"
                min="0"
                value={feeInputValue}
                onChange={(e) => setFeeInputValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                autoFocus
                className="summary-value-input"
              />
            ) : (
              <div className="summary-value-with-edit">
                <span>${(deliveryFee / 100).toFixed(2)}</span>
                <button
                  onClick={handleEditClick}
                  className="summary-edit-button"
                  aria-label="Edit delivery fee"
                >
                  <EditIcon className="summary-edit-icon" size={13} />
                  <span className="summary-edit-text">EDIT</span>
                </button>
              </div>
            )}
          </div>
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
          <div className="summary-value summary-value-total">${(total / 100).toFixed(2)}</div>
        </div>
      </div>
    </Card>
  );
}
