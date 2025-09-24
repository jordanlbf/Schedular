import type { DeliveryDetails } from '../../../types';

interface TimeSlot {
  id: string;
  label: string;
  timeRange: string;
  capacity: 'available' | 'few-left' | 'full';
  available: boolean;
}

interface TimeSlotPickerProps {
  deliveryDetails: DeliveryDetails;
  setDeliveryDetails: (details: DeliveryDetails) => void;
  timeSlots: TimeSlot[];
  loadingTimeSlots: boolean;
  deliveryChoiceMode: 'later' | 'now';
  validationErrors: string[];
}

export function TimeSlotPicker({
  deliveryDetails,
  setDeliveryDetails,
  timeSlots,
  loadingTimeSlots,
  deliveryChoiceMode,
  validationErrors
}: TimeSlotPickerProps) {
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

  return (
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
  );
}