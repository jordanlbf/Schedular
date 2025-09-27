import { useState, useCallback } from 'react';

export function useScheduleDeliveryForm() {
  const [isFormValid, setIsFormValid] = useState(true);

  // Handle validation state from ScheduleDelivery component
  const handleValidationChange = useCallback((isValid: boolean) => {
    setIsFormValid(isValid);
  }, []);

  return {
    isFormValid,
    handleValidationChange,
  };
}