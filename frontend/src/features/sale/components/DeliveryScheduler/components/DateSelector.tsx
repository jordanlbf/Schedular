import type { DeliveryDetails } from '@/features/sale/types';

interface DateSelectorProps {
  deliveryDetails: DeliveryDetails;
  setDeliveryDetails: (details: DeliveryDetails) => void;
  pillDates: string[];
  deliveryChoiceMode: 'later' | 'now';
  showCalendar: boolean;
  setShowCalendar: (show: boolean) => void;
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

export function DateSelector({
  deliveryDetails,
  setDeliveryDetails,
  pillDates,
  deliveryChoiceMode,
  showCalendar,
  setShowCalendar
}: DateSelectorProps) {
  // Handle date pill selection
  const handleDatePillSelect = (selectedDate: string) => {
    setDeliveryDetails({ ...deliveryDetails, preferredDate: selectedDate, timeSlot: '' });
  };

  return (
    <div className="selection-section">
      <label className="section-label">
        Select Delivery Date
        <span className="required-indicator">*</span>
      </label>
      <div className="date-pills-row">
        {pillDates.map((date) => (
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
  );
}