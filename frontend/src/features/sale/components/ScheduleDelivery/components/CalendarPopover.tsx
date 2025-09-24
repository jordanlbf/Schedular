import { useEffect } from 'react';
import type { DeliveryDetails } from '../../../types';

interface CalendarPopoverProps {
  deliveryDetails: DeliveryDetails;
  setDeliveryDetails: (details: DeliveryDetails) => void;
  minDate: string;
  maxDate: string;
  isDateValid: (date: string) => boolean;
  setShowCalendar: (show: boolean) => void;
}

export function CalendarPopover({
  deliveryDetails,
  setDeliveryDetails,
  minDate,
  maxDate,
  isDateValid,
  setShowCalendar
}: CalendarPopoverProps) {
  // Handle calendar date selection
  const handleCalendarDateSelect = (selectedDate: string) => {
    if (isDateValid(selectedDate)) {
      setDeliveryDetails({ ...deliveryDetails, preferredDate: selectedDate, timeSlot: '' });
      setShowCalendar(false);
    }
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
      if (!target.closest('.calendar-popover') && !target.closest('.date-chip-calendar')) {
        setShowCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowCalendar]);

  return (
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
  );
}