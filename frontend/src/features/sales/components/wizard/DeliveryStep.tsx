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
  const [deliveryChoiceMode, setDeliveryChoiceMode] = useState<'later' | 'now'>('later');
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<Array<{
    id: string;
    label: string;
    timeRange: string;
    capacity: 'available' | 'few-left' | 'full';
    available: boolean;
  }>>([]);
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);

  // Stub API function to load time slots for a given date
  const loadTimeSlotsForDate = async (dateStr: string) => {
    setLoadingTimeSlots(true);

    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Stub data based on date (in real app, this would be an API call)
    const mockCapacities = {
      '0': ['available', 'few-left', 'full'], // Sunday
      '1': ['available', 'available', 'few-left'], // Monday
      '2': ['few-left', 'available', 'available'], // Tuesday
      '3': ['available', 'full', 'available'], // Wednesday
      '4': ['few-left', 'few-left', 'available'], // Thursday
      '5': ['full', 'available', 'few-left'], // Friday
      '6': ['available', 'available', 'available'], // Saturday
    };

    const dayOfWeek = new Date(dateStr).getDay().toString();
    const capacities = mockCapacities[dayOfWeek as keyof typeof mockCapacities] || ['available', 'available', 'available'];

    const slots = [
      {
        id: 'morning',
        label: 'Morning',
        timeRange: '8am-12pm',
        capacity: capacities[0],
        available: capacities[0] !== 'full'
      },
      {
        id: 'afternoon',
        label: 'Afternoon',
        timeRange: '12pm-5pm',
        capacity: capacities[1],
        available: capacities[1] !== 'full'
      },
      {
        id: 'evening',
        label: 'Evening',
        timeRange: '5pm-8pm',
        capacity: capacities[2],
        available: capacities[2] !== 'full'
      }
    ] as const;

    setTimeSlots(slots);
    setLoadingTimeSlots(false);
  };

  // Load time slots when date changes
  useEffect(() => {
    if (deliveryDetails.preferredDate && deliveryChoiceMode === 'now') {
      loadTimeSlotsForDate(deliveryDetails.preferredDate);
      // Clear time slot when date changes to ensure clean state transitions
      if (deliveryDetails.timeSlot) {
        setDeliveryDetails({ ...deliveryDetails, timeSlot: '' });
      }
    } else {
      setTimeSlots([]);
    }
  }, [deliveryDetails.preferredDate, deliveryChoiceMode]);

  // Sync input value with deliveryFee prop
  useEffect(() => {
    setFeeInputValue(deliveryFee === 0 ? '' : (deliveryFee / 100).toString());
  }, [deliveryFee]);

  // Validation function
  const validateForm = () => {
    const newErrors: string[] = [];

    // Only validate date/time if user chose to select now
    if (deliveryChoiceMode === 'now') {
      if (!deliveryDetails.preferredDate || !deliveryDetails.timeSlot) {
        newErrors.push('Please select a delivery date and time.');
      }
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

  // Override canProceed when "Choose Later" is selected
  const canActuallyProceed = deliveryChoiceMode === 'later' || canProceed;

  // Handle delivery choice mode change
  const handleDeliveryChoiceChange = (mode: 'later' | 'now') => {
    setDeliveryChoiceMode(mode);
    if (mode === 'later') {
      // Clear date and time when switching to "later" and set to null
      setDeliveryDetails({
        ...deliveryDetails,
        preferredDate: '',
        timeSlot: ''
      });
      setValidationErrors([]);
    }
  };

  // Handle keyboard navigation for delivery choice cards
  const handleKeyDown = (event: React.KeyboardEvent, currentMode: 'later' | 'now') => {
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        handleDeliveryChoiceChange(currentMode === 'later' ? 'now' : 'later');
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        handleDeliveryChoiceChange(currentMode === 'later' ? 'now' : 'later');
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        handleDeliveryChoiceChange(currentMode);
        break;
    }
  };

  // Handle keyboard navigation for time slots
  const handleTimeSlotKeyDown = (event: React.KeyboardEvent, currentSlotId: string) => {
    const availableSlots = timeSlots.filter(slot => slot.available);
    const currentIndex = availableSlots.findIndex(slot => slot.id === currentSlotId);

    let nextIndex = currentIndex;

    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : availableSlots.length - 1;
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        nextIndex = currentIndex < availableSlots.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (availableSlots[currentIndex]?.available) {
          setDeliveryDetails({ ...deliveryDetails, timeSlot: currentSlotId });
        }
        return;
    }

    if (availableSlots[nextIndex]) {
      // Focus the next slot
      const nextSlotElement = document.querySelector(`[data-slot-id="${availableSlots[nextIndex].id}"]`) as HTMLElement;
      nextSlotElement?.focus();
    }
  };

  // Clear validation errors when selections are made or mode changes
  useEffect(() => {
    if (validationErrors.length > 0 && (deliveryChoiceMode === 'later' || (deliveryDetails.preferredDate && deliveryDetails.timeSlot))) {
      setValidationErrors([]);
    }
  }, [deliveryDetails.preferredDate, deliveryDetails.timeSlot, validationErrors.length, deliveryChoiceMode]);
  
  // Business rules configuration
  const BLACKOUT_DAYS = ['2024-12-25', '2024-01-01']; // Example holidays
  const MINIMUM_LEAD_HOURS = 24;
  const MAX_PILLS_SHOWN = 4;

  // Generate available dates with business rules
  const { minDate, maxDate, pillDates } = useMemo(() => {
    const min = new Date();
    min.setHours(min.getHours() + MINIMUM_LEAD_HOURS);

    const max = new Date();
    max.setMonth(max.getMonth() + 3);

    // Generate dates for pills (next available days)
    const pills = [];
    const current = new Date(min);

    while (pills.length < MAX_PILLS_SHOWN && current <= max) {
      const dateStr = current.toISOString().split('T')[0];
      const dayOfWeek = current.getDay();

      // Skip weekends and blackout days
      if (dayOfWeek !== 0 && dayOfWeek !== 6 && !BLACKOUT_DAYS.includes(dateStr)) {
        pills.push(dateStr);
      }
      current.setDate(current.getDate() + 1);
    }

    // Add selected date if it's not in the default pills
    if (deliveryDetails.preferredDate && !pills.includes(deliveryDetails.preferredDate)) {
      // Insert selected date and trim to max pills
      pills.push(deliveryDetails.preferredDate);
      pills.sort();
      if (pills.length > MAX_PILLS_SHOWN) {
        pills.splice(0, 1); // Remove oldest date
      }
    }

    return {
      minDate: min.toISOString().split('T')[0],
      maxDate: max.toISOString().split('T')[0],
      pillDates: pills
    };
  }, [deliveryDetails.preferredDate]);

  // Check if a date is valid for selection
  const isDateValid = (dateStr: string) => {
    const date = new Date(dateStr);
    const minDateTime = new Date();
    minDateTime.setHours(minDateTime.getHours() + MINIMUM_LEAD_HOURS);

    return date >= minDateTime &&
           date.getDay() !== 0 && date.getDay() !== 6 && // No weekends
           !BLACKOUT_DAYS.includes(dateStr);
  };

  // Handle calendar date selection
  const handleCalendarDateSelect = (selectedDate: string) => {
    if (isDateValid(selectedDate)) {
      setDeliveryDetails({ ...deliveryDetails, preferredDate: selectedDate, timeSlot: '' });
      setShowCalendar(false);
    }
  };

  // Handle date pill selection
  const handleDatePillSelect = (selectedDate: string) => {
    setDeliveryDetails({ ...deliveryDetails, preferredDate: selectedDate, timeSlot: '' });
  };

  // Handle ESC key to close calendar
  const handleCalendarKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setShowCalendar(false);
    }
  };

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showCalendar && !target.closest('.calendar-popover') && !target.closest('.date-chip-calendar')) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showCalendar]);

  // Calculate total service charges
  const totalServiceCharges = useMemo(() => {
    let total = 0;
    if (deliveryDetails.whiteGloveService) total += SERVICE_OPTIONS.whiteGlove.price;
    if (deliveryDetails.oldMattressRemoval) total += SERVICE_OPTIONS.mattressRemoval.price;
    if (deliveryDetails.setupService) total += SERVICE_OPTIONS.setupService.price;
    return total;
  }, [deliveryDetails]);

  return (
    <WizardStepLayout
      title={WIZARD_STEP_TITLES.delivery}
      stepNumber="3"
      onNext={handleNext}
      onPrev={onPrev}
      canProceed={canActuallyProceed}
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
              {/* Delivery Choice Radio Cards - Redesigned */}
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

              {/* Collapsible Section with Smooth Animation */}
              <div
                className={`delivery-collapsible ${deliveryChoiceMode === 'now' ? 'expanded' : ''}`}
                aria-hidden={deliveryChoiceMode === 'later'}
              >
                <div className="collapsible-content">
                  {/* Date Selection Section */}
                  <div className="selection-section">
                    <label className="section-label">
                      Select Delivery Date
                      <span className="required-indicator">*</span>
                    </label>
                    <div className="date-pills-row">
                      {pillDates.map((date, index) => (
                        <button
                          key={date}
                          type="button"
                          className={`date-pill ${deliveryDetails.preferredDate === date ? 'selected' : ''}`}
                          onClick={() => handleDatePillSelect(date)}
                          tabIndex={deliveryChoiceMode === 'later' ? -1 : 0}
                          disabled={deliveryChoiceMode === 'later'}
                          aria-pressed={deliveryDetails.preferredDate === date}
                          aria-label={`Select ${formatDate(date)} for delivery`}
                        >
                          <span className="pill-day">{getDayOfWeek(date)}</span>
                          <span className="pill-date">{new Date(date).getDate()}</span>
                        </button>
                      ))}
                      <button
                        type="button"
                        className="date-pill more-dates"
                        onClick={() => setShowCalendar(!showCalendar)}
                        tabIndex={deliveryChoiceMode === 'later' ? -1 : 0}
                        disabled={deliveryChoiceMode === 'later'}
                        aria-label="More dates"
                        aria-expanded={showCalendar}
                      >
                        <span className="more-text">More</span>
                      </button>
                    </div>

                  </div>

                  {/* Time Slot Selection Section */}
                  <div className="selection-section">
                    <label className="section-label">
                      Select Time Slot
                      <span className="required-indicator">*</span>
                    </label>

                    {!deliveryDetails.preferredDate ? (
                      <div className="time-slots-row disabled">
                        <div className="time-slot-placeholder">Morning</div>
                        <div className="time-slot-placeholder">Afternoon</div>
                        <div className="time-slot-placeholder">Evening</div>
                      </div>
                    ) : loadingTimeSlots ? (
                      <div className="time-slots-row loading">
                        <div className="time-slot-skeleton">Loading...</div>
                        <div className="time-slot-skeleton">Loading...</div>
                        <div className="time-slot-skeleton">Loading...</div>
                      </div>
                    ) : (
                      <div className="time-slots-row">
                        {timeSlots.map((slot, index) => (
                          <button
                            key={slot.id}
                            type="button"
                            data-slot-id={slot.id}
                            className={`time-slot-card ${deliveryDetails.timeSlot === slot.id ? 'selected' : ''} ${!slot.available ? 'unavailable' : ''}`}
                            onClick={() => slot.available && setDeliveryDetails({ ...deliveryDetails, timeSlot: slot.id })}
                            onKeyDown={(e) => handleTimeSlotKeyDown(e, slot.id)}
                            disabled={!slot.available || deliveryChoiceMode === 'later' || !deliveryDetails.preferredDate}
                            aria-disabled={!slot.available || deliveryChoiceMode === 'later' || !deliveryDetails.preferredDate}
                            tabIndex={deliveryChoiceMode === 'later' || !deliveryDetails.preferredDate ? -1 : (slot.available && index === 0 ? 0 : -1)}
                            title={!slot.available ? 'No capacity for this date' : ''}
                            aria-label={`${slot.label} slot ${slot.timeRange}, ${slot.capacity === 'available' ? 'Available' : slot.capacity === 'few-left' ? 'Few slots left' : 'Full'}`}
                          >
                            <div className="slot-header">
                              <span className="slot-title">{slot.label}</span>
                              <span className="slot-range">{slot.timeRange}</span>
                            </div>
                            {slot.capacity === 'few-left' && (
                              <span className="slot-status warning">FEW LEFT</span>
                            )}
                            {slot.capacity === 'full' && (
                              <span className="slot-status unavailable">FULL</span>
                            )}
                            {deliveryDetails.timeSlot === slot.id && (
                              <span className="slot-selected-indicator" aria-hidden="true">✓</span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}


                    {/* Validation Messages */}
                    {deliveryChoiceMode === 'now' && validationErrors.length > 0 && (
                      <div className="validation-message" role="alert" aria-live="assertive">
                        <span className="validation-icon">⚠️</span>
                        {validationErrors[0]}
                      </div>
                    )}
                  </div>
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

            </div>
          </div>
        </div>
      </div>

      {/* Calendar Popover - positioned outside normal flow */}
      {showCalendar && (
        <div
          className="calendar-popover-overlay"
          onClick={() => setShowCalendar(false)}
        >
          <div
            className="calendar-popover"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleCalendarKeyDown}
            role="dialog"
            aria-modal="true"
            aria-label="Date selection calendar"
          >
            <div className="calendar-header">
              <h6>Select Delivery Date</h6>
              <button
                type="button"
                className="calendar-close"
                onClick={() => setShowCalendar(false)}
                aria-label="Close calendar"
              >
                ×
              </button>
            </div>
            <div className="calendar-body">
              <input
                type="date"
                className="calendar-input"
                value={deliveryDetails.preferredDate}
                onChange={(e) => handleCalendarDateSelect(e.target.value)}
                min={minDate}
                max={maxDate}
                tabIndex={0}
                aria-label="Select delivery date from calendar"
                autoFocus
              />
            </div>
          </div>
        </div>
      )}
    </WizardStepLayout>
  );
}