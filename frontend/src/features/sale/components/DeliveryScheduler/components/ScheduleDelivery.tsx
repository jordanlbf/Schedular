import type { DeliveryDetails } from '@/features/sale/types';
import { DateSelector } from './DateSelector';
import { TimeSlotPicker } from './TimeSlotPicker';
import { ServiceSelector } from './ServiceSelector';
import { DeliverySummary } from './DeliverySummary';
import { CalendarPopover } from './CalendarPopover';
import { useDeliveryScheduling } from '../hooks/useDeliveryScheduling';
import { useServiceCalculations } from '../hooks/useServiceCalculations';
import { useDeliveryForm } from '../hooks/useDeliveryForm';
import { Card } from '@/ui';

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
  onValidationChange
}: ScheduleDeliveryProps) {

  // Custom hooks for business logic
  const {
    showCalendar,
    setShowCalendar,
    deliveryChoiceMode,
    validationErrors,
    handleDeliveryChoiceChange,
    handleSpecialInstructionsChange,
  } = useDeliveryForm({
    deliveryDetails,
    setDeliveryDetails,
    onValidationChange
  });

  const {
    timeSlots,
    loadingTimeSlots,
    minDate,
    maxDate,
    pillDates,
    isDateValid
  } = useDeliveryScheduling(deliveryDetails.preferredDate, deliveryChoiceMode);

  const { totalServiceCharges } = useServiceCalculations(deliveryDetails);

  return (
    <div className="delivery-layout-grid">
      {/* Left Column - Schedule & Services */}
      <div className="delivery-left-column">
        {/* Delivery Schedule Card */}
        <Card title="Schedule Delivery" size="compact">
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
        </Card>

        {/* Premium Services Card */}
        <ServiceSelector
          deliveryDetails={deliveryDetails}
          setDeliveryDetails={setDeliveryDetails}
        />
      </div>

      {/* Right Column - Instructions & Summary */}
      <div className="delivery-right-column">
        {/* Special Instructions Card */}
        <Card title="Delivery Instructions" size="compact" className="delivery-instructions-card">
            <div className="form-group delivery-instructions-group">
              <textarea
                className="form-input form-textarea delivery-instructions-textarea"
                value={deliveryDetails.specialInstructions}
                onChange={(e) => handleSpecialInstructionsChange(e.target.value)}
                placeholder="Special requirements: gate codes, stairs, contact preferences, etc."
              />
            </div>
        </Card>

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