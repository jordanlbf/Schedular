import type { DeliveryDetails } from '@/features/sale/types';
import React from 'react';

interface DateSelectorProps {
  deliveryDetails: DeliveryDetails;
  setDeliveryDetails: (details: DeliveryDetails) => void;
  pillDates: string[];
  deliveryChoiceMode: 'later' | 'now';
  showCalendar: boolean;
  setShowCalendar: (show: boolean) => void;
}

// Helper function to format date for segmented control
const formatDateSegment = (dateString: string) => {
  if (!dateString) return { weekday: '', date: '' };
  const date = new Date(dateString);
  const weekday = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  const day = date.getDate();
  return { weekday, date: day.toString() };
};

export function DateSelector({
  deliveryDetails,
  setDeliveryDetails,
  pillDates,
  deliveryChoiceMode,
  showCalendar,
  setShowCalendar
}: DateSelectorProps) {
  // Handle date selection
  const handleDateSelect = (selectedDate: string) => {
    setDeliveryDetails({ ...deliveryDetails, preferredDate: selectedDate, timeSlot: '' });
  };

  // Get next 3 dates
  const displayDates = pillDates.slice(0, 3);

  // Set default date to first available if none selected and mode is 'now'
  React.useEffect(() => {
    if (deliveryChoiceMode === 'now' && !deliveryDetails.preferredDate && displayDates.length > 0) {
      handleDateSelect(displayDates[0]);
    }
  }, [deliveryChoiceMode, displayDates, deliveryDetails.preferredDate]);

  return (
    <div className="segmented-section">
      <div className="segmented-label">
        <span className="segment-icon">📅</span>
        <span className="segment-label-text">DATE</span>
      </div>
      <div className="segmented-control">
        {displayDates.map((date) => {
          const { weekday, date: day } = formatDateSegment(date);
          return (
            <button
              key={date}
              type="button"
              className={`segment-btn ${deliveryDetails.preferredDate === date ? 'selected' : ''}`}
              onClick={() => handleDateSelect(date)}
              disabled={deliveryChoiceMode === 'later'}
              aria-label={`Select ${weekday} ${day} for delivery`}
            >
              <span className="segment-weekday">{weekday}</span>
              <span className="segment-date">{day}</span>
            </button>
          );
        })}
        <button
          type="button"
          className="segment-btn segment-more"
          onClick={() => setShowCalendar(true)}
          disabled={deliveryChoiceMode === 'later'}
          aria-label="View more dates"
        >
          <span className="segment-more-text">More</span>
        </button>
      </div>
    </div>
  );
}
