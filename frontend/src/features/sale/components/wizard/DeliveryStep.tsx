import { useMemo } from 'react';
import type { DeliveryDetails } from '../../types';
import { TIME_SLOTS, SERVICE_OPTIONS, MIN_DELIVERY_DAYS } from '../../constants/wizard';

interface DeliveryStepProps {
  deliveryDetails: DeliveryDetails;
  setDeliveryDetails: (details: DeliveryDetails) => void;
  deliveryFee: number;
  setDeliveryFee: (fee: number) => void;
  estimatedDelivery: string;
  onNext: () => void;
  onPrev: () => void;
  canProceed: boolean;
  errors?: string[];
}

export default function DeliveryStep({
  deliveryDetails,
  setDeliveryDetails,
  deliveryFee,
  setDeliveryFee,
  estimatedDelivery,
  onNext,
  onPrev,
  canProceed,
  errors = []
}: DeliveryStepProps) {
  // Get minimum delivery date
  const minDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + MIN_DELIVERY_DAYS);
    return date.toISOString().split('T')[0];
  }, []);

  return (
    <div className="wizard-step">
      <div className="step-content">
        <div className="step-main">
          <div className="wizard-page-header">
            <h2>Delivery Schedule</h2>
            <p>Manufacturing time is typically 10-14 business days. Estimated delivery: <strong>{estimatedDelivery}</strong></p>
          </div>

          {/* Error display */}
          {errors.length > 0 && (
            <div className="form-errors">
              <h4>Please fix the following issues:</h4>
              <ul>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="delivery-form">
            <h3>Delivery Schedule</h3>

            <div className="field-row">
              <label className="field">
                <span className="label">Preferred Delivery Date *</span>
                <input
                  type="date"
                  className="input"
                  value={deliveryDetails.preferredDate}
                  onChange={(e) => setDeliveryDetails({
                    ...deliveryDetails, 
                    preferredDate: e.target.value
                  })}
                  min={minDate}
                />
              </label>

              <label className="field">
                <span className="label">Time Slot *</span>
                <select
                  className="input"
                  value={deliveryDetails.timeSlot}
                  onChange={(e) => setDeliveryDetails({
                    ...deliveryDetails, 
                    timeSlot: e.target.value
                  })}
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot.value} value={slot.value}>
                      {slot.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <h3>Additional Services</h3>

            <div className="service-options">
              <label className="service-option">
                <input
                  type="checkbox"
                  checked={deliveryDetails.whiteGloveService}
                  onChange={(e) => setDeliveryDetails({
                    ...deliveryDetails, 
                    whiteGloveService: e.target.checked
                  })}
                />
                <div className="service-details">
                  <div className="service-name">{SERVICE_OPTIONS.whiteGlove.name}</div>
                  <div className="service-description">{SERVICE_OPTIONS.whiteGlove.description}</div>
                  <div className="service-price">+${(SERVICE_OPTIONS.whiteGlove.price / 100).toFixed(0)}</div>
                </div>
              </label>

              <label className="service-option">
                <input
                  type="checkbox"
                  checked={deliveryDetails.oldMattressRemoval}
                  onChange={(e) => setDeliveryDetails({
                    ...deliveryDetails, 
                    oldMattressRemoval: e.target.checked
                  })}
                />
                <div className="service-details">
                  <div className="service-name">{SERVICE_OPTIONS.mattressRemoval.name}</div>
                  <div className="service-description">{SERVICE_OPTIONS.mattressRemoval.description}</div>
                  <div className="service-price">+${(SERVICE_OPTIONS.mattressRemoval.price / 100).toFixed(0)}</div>
                </div>
              </label>

              <label className="service-option">
                <input
                  type="checkbox"
                  checked={deliveryDetails.setupService}
                  onChange={(e) => setDeliveryDetails({
                    ...deliveryDetails, 
                    setupService: e.target.checked
                  })}
                />
                <div className="service-details">
                  <div className="service-name">{SERVICE_OPTIONS.setupService.name}</div>
                  <div className="service-description">{SERVICE_OPTIONS.setupService.description}</div>
                  <div className="service-price">+${(SERVICE_OPTIONS.setupService.price / 100).toFixed(0)}</div>
                </div>
              </label>
            </div>

            <label className="field">
              <span className="label">Special Instructions</span>
              <textarea
                className="input"
                rows={3}
                value={deliveryDetails.specialInstructions}
                onChange={(e) => setDeliveryDetails({
                  ...deliveryDetails, 
                  specialInstructions: e.target.value
                })}
                placeholder="Custom dimensions, firmness preferences, stairs, narrow hallways, gate codes, etc."
              />
            </label>

            <label className="field">
              <span className="label">Delivery Fee</span>
              <input
                type="number"
                className="input"
                min="0"
                step="0.01"
                value={(deliveryFee/100).toFixed(2)}
                onChange={(e) => setDeliveryFee(Math.round(parseFloat(e.target.value || '0') * 100))}
                placeholder="0.00"
              />
            </label>
          </div>
        </div>
        
        <div className="step-actions">
          <button className="btn btn-soft" onClick={onPrev}>
            ← Back to Products
          </button>
          <button
            className="btn btn-primary"
            onClick={onNext}
            disabled={!canProceed}
          >
            Continue to Payment →
          </button>
          {!canProceed && (
            <div className="step-help">
              Please select a delivery date and time slot
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
