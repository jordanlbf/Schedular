import { useMemo, useState, useEffect } from 'react';
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

// Helper function to format date nicely
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'long',
    month: 'long', 
    day: 'numeric',
    year: 'numeric'
  });
};

// Helper function to get day of week
const getDayOfWeek = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

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
  const [showCalendar, setShowCalendar] = useState(false);
  const [feeInputValue, setFeeInputValue] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Sync input value with deliveryFee prop
  useEffect(() => {
    setFeeInputValue(deliveryFee === 0 ? '' : (deliveryFee / 100).toString());
  }, [deliveryFee]);

  // Validation function
  const validateForm = () => {
    const newErrors: string[] = [];

    if (!deliveryDetails.preferredDate) {
      newErrors.push('Please select a delivery date');
    }

    if (!deliveryDetails.timeSlot) {
      newErrors.push('Please select a delivery time slot');
    }

    setValidationErrors(newErrors);
    return newErrors.length === 0;
  };

  // Handle next button click with validation
  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  // Clear validation errors when selections are made
  useEffect(() => {
    if (validationErrors.length > 0 && deliveryDetails.preferredDate && deliveryDetails.timeSlot) {
      setValidationErrors([]);
    }
  }, [deliveryDetails.preferredDate, deliveryDetails.timeSlot, validationErrors.length]);
  
  // Get minimum and suggested delivery dates
  const { minDate, suggestedDates, maxDate } = useMemo(() => {
    const min = new Date();
    min.setDate(min.getDate() + MIN_DELIVERY_DAYS);
    
    const max = new Date();
    max.setMonth(max.getMonth() + 3); // Max 3 months out
    
    // Generate suggested dates (weekdays preferred)
    const suggested = [];
    const current = new Date(min);
    while (suggested.length < 5 && current <= max) {
      const dayOfWeek = current.getDay();
      // Prefer weekdays (Mon-Fri)
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        suggested.push(current.toISOString().split('T')[0]);
      }
      current.setDate(current.getDate() + 1);
    }
    
    return {
      minDate: min.toISOString().split('T')[0],
      maxDate: max.toISOString().split('T')[0],
      suggestedDates: suggested
    };
  }, []);

  // Calculate total service charges
  const totalServiceCharges = useMemo(() => {
    let total = 0;
    if (deliveryDetails.whiteGloveService) total += SERVICE_OPTIONS.whiteGlove.price;
    if (deliveryDetails.oldMattressRemoval) total += SERVICE_OPTIONS.mattressRemoval.price;
    if (deliveryDetails.setupService) total += SERVICE_OPTIONS.setupService.price;
    return total;
  }, [deliveryDetails]);

  // Enhanced time slots with availability indicators
  const enhancedTimeSlots = TIME_SLOTS.map(slot => ({
    ...slot,
    available: slot.value !== 'morning' || !deliveryDetails.preferredDate || new Date(deliveryDetails.preferredDate).getDay() !== 0, // Example: morning not available on Sundays
    popular: slot.value === 'afternoon'
  }));

  return (
    <WizardStepLayout
      title={WIZARD_STEP_TITLES.delivery}
      stepNumber="3"
      onNext={handleNext}
      onPrev={onPrev}
      canProceed={canProceed}
      nextLabel="Continue to Payment"
      errors={[...errors, ...validationErrors]}
    >
      {/* Two Column Layout */}
      <div className="delivery-layout-grid">
        {/* Left Column - Schedule & Services */}
        <div className="delivery-left-column">
          {/* Delivery Schedule Card */}
          <div className="form-card compact-card">
            <div className="form-card-header">
              <h3>Schedule Delivery</h3>
            </div>
            <div className="form-card-body">
              {/* Date Selection */}
              <div className="form-group">
                <label className="form-label">Delivery Date *</label>
                <div className="suggested-dates compact">
                  {suggestedDates.slice(0, 4).map((date, index) => (
                    <button
                      key={date}
                      type="button"
                      className={`date-chip compact ${deliveryDetails.preferredDate === date ? 'selected' : ''}`}
                      onClick={() => setDeliveryDetails({ ...deliveryDetails, preferredDate: date })}
                    >
                      <span className="date-day">{getDayOfWeek(date)}</span>
                      <span className="date-number">{new Date(date).getDate()}</span>
                      {index === 0 && <span className="date-badge">Soon</span>}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="date-chip compact date-chip-custom"
                    onClick={() => setShowCalendar(!showCalendar)}
                  >
                    <span className="date-text">More</span>
                  </button>
                </div>
                
                {showCalendar && (
                  <div className="custom-date-picker compact">
                    <input
                      type="date"
                      className="form-input"
                      value={deliveryDetails.preferredDate}
                      onChange={(e) => {
                        setDeliveryDetails({ ...deliveryDetails, preferredDate: e.target.value });
                        setShowCalendar(false);
                      }}
                      min={minDate}
                      max={maxDate}
                    />
                  </div>
                )}
                <div className="form-helper-text">
                  Choose a delivery date
                </div>
              </div>

              {/* Time Slot Selection */}
              <div className="form-group">
                <label className="form-label">Time Slot *</label>
                <div className="time-slots-compact">
                  {enhancedTimeSlots.filter(slot => slot.value).map((slot) => (
                    <button
                      key={slot.value}
                      type="button"
                      className={`time-slot-compact ${deliveryDetails.timeSlot === slot.value ? 'selected' : ''} ${!slot.available ? 'unavailable' : ''}`}
                      onClick={() => slot.available && setDeliveryDetails({ ...deliveryDetails, timeSlot: slot.value })}
                      disabled={!slot.available}
                    >
                      <span className="slot-label">{slot.label.split(' ')[0]}</span>
                      <span className="slot-time">{slot.label.match(/\(([^)]+)\)/)?.[1] || ''}</span>
                    </button>
                  ))}
                </div>
                <div className="form-helper-text">
                  Select a preferred delivery window
                </div>
              </div>
            </div>
          </div>

          {/* Premium Services Card */}
          <div className="form-card compact-card">
            <div className="form-card-header">
              <h3>Additional Services</h3>
            </div>
            <div className="form-card-body">
              <div className="services-list-compact">
                <label className="service-item-compact no-additional-services">
                  <input
                    type="checkbox"
                    checked={!deliveryDetails.whiteGloveService && !deliveryDetails.oldMattressRemoval && !deliveryDetails.setupService}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setDeliveryDetails({
                          ...deliveryDetails,
                          whiteGloveService: false,
                          oldMattressRemoval: false,
                          setupService: false
                        });
                      }
                    }}
                    className="service-checkbox-compact"
                  />
                  <div className="service-info-compact">
                    <div className="service-main">
                      <span className="service-name-compact">No additional services</span>
                      <span className="service-price-compact">$0</span>
                    </div>
                    <span className="service-desc-compact">Standard delivery only - no extra services needed</span>
                  </div>
                </label>

                <label className="service-item-compact">
                  <input
                    type="checkbox"
                    checked={deliveryDetails.whiteGloveService}
                    onChange={(e) => setDeliveryDetails({
                      ...deliveryDetails,
                      whiteGloveService: e.target.checked
                    })}
                    className="service-checkbox-compact"
                  />
                  <div className="service-info-compact">
                    <div className="service-main">
                      <span className="service-name-compact">{SERVICE_OPTIONS.whiteGlove.name}</span>
                      <span className="service-price-compact">+${(SERVICE_OPTIONS.whiteGlove.price / 100).toFixed(0)}</span>
                    </div>
                    <span className="service-desc-compact">{SERVICE_OPTIONS.whiteGlove.description}</span>
                  </div>
                </label>

                <label className="service-item-compact">
                  <input
                    type="checkbox"
                    checked={deliveryDetails.oldMattressRemoval}
                    onChange={(e) => setDeliveryDetails({
                      ...deliveryDetails,
                      oldMattressRemoval: e.target.checked
                    })}
                    className="service-checkbox-compact"
                  />
                  <div className="service-info-compact">
                    <div className="service-main">
                      <span className="service-name-compact">{SERVICE_OPTIONS.mattressRemoval.name}</span>
                      <span className="service-price-compact">+${(SERVICE_OPTIONS.mattressRemoval.price / 100).toFixed(0)}</span>
                    </div>
                    <span className="service-desc-compact">{SERVICE_OPTIONS.mattressRemoval.description}</span>
                  </div>
                </label>

                <label className="service-item-compact">
                  <input
                    type="checkbox"
                    checked={deliveryDetails.setupService}
                    onChange={(e) => setDeliveryDetails({
                      ...deliveryDetails,
                      setupService: e.target.checked
                    })}
                    className="service-checkbox-compact"
                  />
                  <div className="service-info-compact">
                    <div className="service-main">
                      <span className="service-name-compact">{SERVICE_OPTIONS.setupService.name}</span>
                      <span className="service-price-compact">+${(SERVICE_OPTIONS.setupService.price / 100).toFixed(0)}</span>
                    </div>
                    <span className="service-desc-compact">{SERVICE_OPTIONS.setupService.description}</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Instructions & Summary */}
        <div className="delivery-right-column">
          {/* Special Instructions Card */}
          <div className="form-card compact-card delivery-instructions-card">
            <div className="form-card-header">
              <h3>Delivery Instructions</h3>
            </div>
            <div className="form-card-body delivery-instructions-body">
              <div className="form-group delivery-instructions-group">
                <textarea
                  className="form-input form-textarea delivery-instructions-textarea"
                  value={deliveryDetails.specialInstructions}
                  onChange={(e) => setDeliveryDetails({
                    ...deliveryDetails,
                    specialInstructions: e.target.value
                  })}
                  placeholder="Special requirements: gate codes, stairs, contact preferences, etc."
                />
              </div>
            </div>
          </div>

          {/* Delivery Summary Card */}
          <div className="form-card compact-card summary-card">
            <div className="form-card-header">
              <h3>Delivery Summary</h3>
            </div>
            <div className="form-card-body">
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
                        e.target.blur();
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
                  <span>${(deliveryFee/100).toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Additional Services</span>
                  <span>{totalServiceCharges > 0 ? `+$${(totalServiceCharges/100).toFixed(2)}` : '$0.00'}</span>
                </div>
                <div className="summary-row summary-total">
                  <span>Total Delivery</span>
                  <span>${((deliveryFee + totalServiceCharges)/100).toFixed(2)}</span>
                </div>
              </div>

              {/* Delivery Details */}
              {deliveryDetails.preferredDate && deliveryDetails.timeSlot && (
                <div className="delivery-confirmation">
                  <div className="confirmation-label">Scheduled For:</div>
                  <div className="confirmation-date">{formatDate(deliveryDetails.preferredDate)}</div>
                  <div className="confirmation-time">
                    {enhancedTimeSlots.find(s => s.value === deliveryDetails.timeSlot)?.label}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </WizardStepLayout>
  );
}