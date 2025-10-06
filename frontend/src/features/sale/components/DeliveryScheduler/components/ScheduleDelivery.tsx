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
              <label className={`delivery-radio-card glass-tile ${deliveryChoiceMode === 'later' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="deliveryTiming"
                  value="later"
                  checked={deliveryChoiceMode === 'later'}
                  onChange={() => handleDeliveryChoiceChange('later')}
                  className="delivery-radio-input"
                  aria-label="Choose delivery date and time later"
                />
                <span className="ripple"></span>
                <div className="radio-card-content">
                  <div className="radio-icon-wrapper">
                    <svg className="radio-svg-icon" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19,4H18V2H16V4H8V2H6V4H5C3.89,4 3,4.9 3,6V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V6A2,2 0 0,0 19,4M19,20H5V10H19V20M19,8H5V6H19V8M12,13H17V18H12V13Z"/>
                    </svg>
                  </div>
                  <h4 className="radio-title">Choose Later</h4>
                </div>
              </label>

              <label className={`delivery-radio-card glass-tile ${deliveryChoiceMode === 'now' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="deliveryTiming"
                  value="now"
                  checked={deliveryChoiceMode === 'now'}
                  onChange={() => handleDeliveryChoiceChange('now')}
                  className="delivery-radio-input"
                  aria-label="Choose delivery date and time now"
                />
                <span className="ripple"></span>
                <div className="radio-card-content">
                  <div className="radio-icon-wrapper">
                    <svg className="radio-svg-icon" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19,4H18V2H16V4H8V2H6V4H5C3.89,4 3,4.9 3,6V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V6A2,2 0 0,0 19,4M19,20H5V10H19V20M17,13.5L16,14.5L11.5,10V7H13V9.5L17,13.5Z"/>
                    </svg>
                  </div>
                  <h4 className="radio-title">Choose Now</h4>
                </div>
              </label>
            </div>

            {/* Collapsible Section with Date and Time Selection */}
            <div
              className={`delivery-collapsible ${deliveryChoiceMode === 'now' ? 'expanded' : ''}`}
              aria-hidden={deliveryChoiceMode === 'later'}
            >
              <div className="collapsible-content">
                <div className="segmented-grid">
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
