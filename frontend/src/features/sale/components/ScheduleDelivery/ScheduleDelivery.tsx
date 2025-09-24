import { useState, useEffect } from 'react';
import type { DeliveryDetails } from '../../types';
import { DateSelector } from './components/DateSelector';
import { TimeSlotPicker } from './components/TimeSlotPicker';
import { ServiceSelector } from './components/ServiceSelector';
import { DeliverySummary } from './components/DeliverySummary';
import { CalendarPopover } from './components/CalendarPopover';
import { useDeliveryScheduling } from './hooks/useDeliveryScheduling';
import { useServiceCalculations } from './hooks/useServiceCalculations';

interface ScheduleDeliveryProps {
  deliveryDetails: DeliveryDetails;
  setDeliveryDetails: (details: DeliveryDetails) => void;
  deliveryFee: number;
  setDeliveryFee: (fee: number) => void;
  estimatedDelivery: string;
  canProceed: boolean;
  errors?: string[];
  onValidationChange?: (isValid: boolean) => void;
}

export default function ScheduleDelivery({
  deliveryDetails,
  setDeliveryDetails,
  deliveryFee,
  setDeliveryFee,
  estimatedDelivery,
  canProceed,
  errors = [],
  onValidationChange
}: ScheduleDeliveryProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [deliveryChoiceMode, setDeliveryChoiceMode] = useState<'later' | 'now'>('later');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Custom hooks for business logic
  const {
    timeSlots,
    loadingTimeSlots,
    availableDates,
    minDate,
    maxDate,
    pillDates,
    loadTimeSlotsForDate,
    isDateValid
  } = useDeliveryScheduling(deliveryDetails.preferredDate, deliveryChoiceMode);

  const { totalServiceCharges } = useServiceCalculations(deliveryDetails);

  // Validation logic
  const validateForm = () => {
    const newErrors: string[] = [];
    if (deliveryChoiceMode === 'now') {
      if (!deliveryDetails.preferredDate || !deliveryDetails.timeSlot) {
        newErrors.push('Please select a delivery date and time.');
      }
    }
    setValidationErrors(newErrors);
    return newErrors.length === 0;
  };

  // Handle delivery choice mode change
  const handleDeliveryChoiceChange = (mode: 'later' | 'now') => {
    setDeliveryChoiceMode(mode);
    if (mode === 'later') {
      setDeliveryDetails({
        ...deliveryDetails,
        preferredDate: '',
        timeSlot: ''
      });
      setValidationErrors([]);
    }
  };

  // Clear validation errors when selections are made
  useEffect(() => {
    if (validationErrors.length > 0 && (deliveryChoiceMode === 'later' || (deliveryDetails.preferredDate && deliveryDetails.timeSlot))) {
      setValidationErrors([]);
    }
  }, [deliveryDetails.preferredDate, deliveryDetails.timeSlot, validationErrors.length, deliveryChoiceMode]);

  // Notify parent of validation state
  useEffect(() => {
    const isValid = deliveryChoiceMode === 'later' || validateForm();
    onValidationChange?.(isValid);
  }, [deliveryChoiceMode, deliveryDetails.preferredDate, deliveryDetails.timeSlot, onValidationChange]);

  return (
    <div className="delivery-layout-grid">
      {/* Left Column - Schedule & Services */}
      <div className="delivery-left-column">
        {/* Delivery Schedule Card */}
        <div className="form-card compact-card">
          <div className="form-card-header">
            <h3>Schedule Delivery</h3>
          </div>
          <div className="form-card-body">
            {/* Delivery Choice Radio Cards */}
            <div className="delivery-choice-container">
              <label className={`delivery-radio-card ${deliveryChoiceMode === 'later' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="deliveryTiming"
                  value="later"
                  checked={deliveryChoiceMode === 'later'}
                  onChange={() => handleDeliveryChoiceChange('later')}
                  className="delivery-radio-input"
                  aria-label="Choose delivery date and time later"
                />
                <div className="radio-card-content">
                  <span className="radio-indicator"></span>
                  <div className="radio-text">
                    <h4 className="radio-title">Choose Later</h4>
                  </div>
                </div>
              </label>

              <label className={`delivery-radio-card ${deliveryChoiceMode === 'now' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="deliveryTiming"
                  value="now"
                  checked={deliveryChoiceMode === 'now'}
                  onChange={() => handleDeliveryChoiceChange('now')}
                  className="delivery-radio-input"
                  aria-label="Choose delivery date and time now"
                />
                <div className="radio-card-content">
                  <span className="radio-indicator"></span>
                  <div className="radio-text">
                    <h4 className="radio-title">Choose Now</h4>
                  </div>
                </div>
              </label>
            </div>

            {/* Helper Text for Later Choice */}
            {deliveryChoiceMode === 'later' && (
              <div className="delivery-helper-text" role="status" aria-live="polite">
                <span className="helper-icon">ℹ️</span>
                You can select delivery date & time during Payment or later.
              </div>
            )}

            {/* Collapsible Section with Date and Time Selection */}
            <div
              className={`delivery-collapsible ${deliveryChoiceMode === 'now' ? 'expanded' : ''}`}
              aria-hidden={deliveryChoiceMode === 'later'}
            >
              <div className="collapsible-content">
                <DateSelector
                  deliveryDetails={deliveryDetails}
                  setDeliveryDetails={setDeliveryDetails}
                  pillDates={pillDates}
                  deliveryChoiceMode={deliveryChoiceMode}
                  showCalendar={showCalendar}
                  setShowCalendar={setShowCalendar}
                />

                <TimeSlotPicker
                  deliveryDetails={deliveryDetails}
                  setDeliveryDetails={setDeliveryDetails}
                  timeSlots={timeSlots}
                  loadingTimeSlots={loadingTimeSlots}
                  deliveryChoiceMode={deliveryChoiceMode}
                  validationErrors={validationErrors}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Premium Services Card */}
        <ServiceSelector
          deliveryDetails={deliveryDetails}
          setDeliveryDetails={setDeliveryDetails}
        />
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
        <DeliverySummary
          deliveryFee={deliveryFee}
          setDeliveryFee={setDeliveryFee}
          totalServiceCharges={totalServiceCharges}
        />
      </div>

      {/* Calendar Popover - positioned outside normal flow */}
      {showCalendar && (
        <CalendarPopover
          deliveryDetails={deliveryDetails}
          setDeliveryDetails={setDeliveryDetails}
          minDate={minDate}
          maxDate={maxDate}
          isDateValid={isDateValid}
          setShowCalendar={setShowCalendar}
        />
      )}
    </div>
  );
}