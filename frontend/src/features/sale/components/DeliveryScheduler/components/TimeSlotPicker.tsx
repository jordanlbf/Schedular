import type { DeliveryDetails } from '@/features/sale/types';

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
  
  const handleTimeSlotSelect = (slotId: string) => {
    setDeliveryDetails({ ...deliveryDetails, timeSlot: slotId });
  };

  // Map slot IDs to display values
  const getSlotLabel = (slotId: string) => {
    if (slotId === 'morning') return 'AM';
    if (slotId === 'afternoon') return 'PM';
    if (slotId === 'evening') return 'EVE';
    return slotId;
  };

  return (
    <div className="segmented-section">
      <div className="segmented-label">
        <span className="segment-icon">🕐</span>
        <span className="segment-label-text">TIME</span>
      </div>
      
      {!deliveryDetails.preferredDate ? (
        <div className="segmented-control disabled">
          <button className="segment-btn" disabled>
            <span className="segment-text">ANY</span>
          </button>
          <button className="segment-btn" disabled>
            <span className="segment-text">AM</span>
          </button>
          <button className="segment-btn" disabled>
            <span className="segment-text">PM</span>
          </button>
        </div>
      ) : loadingTimeSlots ? (
        <div className="segmented-control loading">
          <button className="segment-btn" disabled>
            <span className="segment-text">Loading</span>
          </button>
          <button className="segment-btn" disabled>
            <span className="segment-text">AM</span>
          </button>
          <button className="segment-btn" disabled>
            <span className="segment-text">PM</span>
          </button>
        </div>
      ) : (
        <div className="segmented-control">
          <button
            type="button"
            className={`segment-btn ${!deliveryDetails.timeSlot ? 'selected' : ''}`}
            onClick={() => handleTimeSlotSelect('')}
            disabled={deliveryChoiceMode === 'later'}
            aria-label="Anytime - no preference"
          >
            <span className="segment-text">ANY</span>
          </button>
          {timeSlots.filter(slot => slot.id !== 'evening').map((slot) => (
            <button
              key={slot.id}
              type="button"
              className={`segment-btn ${deliveryDetails.timeSlot === slot.id ? 'selected' : ''} ${!slot.available ? 'unavailable' : ''}`}
              onClick={() => slot.available && handleTimeSlotSelect(slot.id)}
              disabled={!slot.available || deliveryChoiceMode === 'later'}
              aria-label={`${slot.label} slot ${slot.timeRange}, ${slot.capacity === 'available' ? 'Available' : slot.capacity === 'few-left' ? 'Few slots left' : 'Full'}`}
              title={!slot.available ? 'No capacity for this time slot' : ''}
            >
              <span className="segment-text">{getSlotLabel(slot.id)}</span>
              {slot.capacity === 'few-left' && (
                <span className="segment-badge">!</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
