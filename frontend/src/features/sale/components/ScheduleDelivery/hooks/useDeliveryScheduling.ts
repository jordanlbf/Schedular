import { useState, useEffect, useMemo } from 'react';

interface TimeSlot {
  id: string;
  label: string;
  timeRange: string;
  capacity: 'available' | 'few-left' | 'full';
  available: boolean;
}

// Business rules configuration - moved outside component to avoid dependency issues
const BLACKOUT_DAYS = ['2024-12-25', '2024-01-01']; // Example holidays

export function useDeliveryScheduling(selectedDate: string, deliveryChoiceMode: 'later' | 'now') {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);
  const MINIMUM_LEAD_HOURS = 24;
  const MAX_PILLS_SHOWN = 4;

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
        capacity: capacities[0] as 'available' | 'few-left' | 'full',
        available: capacities[0] !== 'full'
      },
      {
        id: 'afternoon',
        label: 'Afternoon',
        timeRange: '12pm-5pm',
        capacity: capacities[1] as 'available' | 'few-left' | 'full',
        available: capacities[1] !== 'full'
      },
      {
        id: 'evening',
        label: 'Evening',
        timeRange: '5pm-8pm',
        capacity: capacities[2] as 'available' | 'few-left' | 'full',
        available: capacities[2] !== 'full'
      }
    ];

    setTimeSlots(slots);
    setLoadingTimeSlots(false);
  };

  // Load time slots when date changes
  useEffect(() => {
    if (selectedDate && deliveryChoiceMode === 'now') {
      loadTimeSlotsForDate(selectedDate);
    } else {
      setTimeSlots([]);
    }
  }, [selectedDate, deliveryChoiceMode]);

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
    if (selectedDate && !pills.includes(selectedDate)) {
      // Insert selected date and trim to max pills
      pills.push(selectedDate);
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
  }, [selectedDate, MINIMUM_LEAD_HOURS, MAX_PILLS_SHOWN]);

  // Check if a date is valid for selection
  const isDateValid = (dateStr: string) => {
    const date = new Date(dateStr);
    const minDateTime = new Date();
    minDateTime.setHours(minDateTime.getHours() + MINIMUM_LEAD_HOURS);

    return date >= minDateTime &&
           date.getDay() !== 0 && date.getDay() !== 6 && // No weekends
           !BLACKOUT_DAYS.includes(dateStr);
  };

  return {
    timeSlots,
    loadingTimeSlots,
    minDate,
    maxDate,
    pillDates,
    loadTimeSlotsForDate,
    isDateValid
  };
}