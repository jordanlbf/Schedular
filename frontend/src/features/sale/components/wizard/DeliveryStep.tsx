import { useMemo } from 'react';
import type { DeliveryDetails } from '../../types';
import { TIME_SLOTS, SERVICE_OPTIONS, MIN_DELIVERY_DAYS } from '../../constants/wizard';
import { WizardStepLayout } from './shared/WizardStepLayout';
import { WIZARD_STEP_TITLES } from '../../constants/wizardTitles';

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
    <WizardStepLayout
      title={WIZARD_STEP_TITLES.delivery}
      onNext={onNext}
      onPrev={onPrev}
      canProceed={canProceed}
      nextLabel="Continue to Payment"
      errors={errors}
    >
      <div className="form-card">
        <div className="form-card-header">
          <h3>Delivery Schedule</h3>
        </div>
        <div className="form-card-body">
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Preferred Delivery Date *</label>
              <input
                type="date"
                className="form-input"
                value={deliveryDetails.preferredDate}
                onChange={(e) => setDeliveryDetails({
                  ...deliveryDetails, 
                  preferredDate: e.target.value
                })}
                min={minDate}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Time Slot *</label>
              <select
                className="form-input"
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
            </div>
          </div>
        </div>
      </div>

      <div className="form-card">
        <div className="form-card-header">
          <h3>Additional Services</h3>
        </div>
        <div className="form-card-body">
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

          <div className="form-group">
            <label className="form-label">Special Instructions</label>
            <textarea
              className="form-input form-textarea"
              rows={3}
              value={deliveryDetails.specialInstructions}
              onChange={(e) => setDeliveryDetails({
                ...deliveryDetails, 
                specialInstructions: e.target.value
              })}
              placeholder="Custom dimensions, firmness preferences, stairs, narrow hallways, gate codes, etc."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Delivery Fee</label>
            <input
              type="number"
              className="form-input"
              min="0"
              step="0.01"
              value={(deliveryFee/100).toFixed(2)}
              onChange={(e) => setDeliveryFee(Math.round(parseFloat(e.target.value || '0') * 100))}
              placeholder="0.00"
            />
          </div>
        </div>
      </div>
    </WizardStepLayout>
  );
}
