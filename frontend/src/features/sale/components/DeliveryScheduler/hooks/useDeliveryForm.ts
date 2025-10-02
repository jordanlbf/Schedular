import { useState, useEffect, useCallback } from 'react';
import type { DeliveryDetails } from '@/features/sale/types';

interface UseDeliveryFormProps {
  deliveryDetails: DeliveryDetails;
  setDeliveryDetails: (details: DeliveryDetails) => void;
  onValidationChange?: (isValid: boolean) => void;
}

export function useDeliveryForm({
  deliveryDetails,
  setDeliveryDetails,
  onValidationChange
}: UseDeliveryFormProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [deliveryChoiceMode, setDeliveryChoiceMode] = useState<'later' | 'now'>('later');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Validation logic
  const validateForm = useCallback(() => {
    const newErrors: string[] = [];
    if (deliveryChoiceMode === 'now') {
      if (!deliveryDetails.preferredDate || !deliveryDetails.timeSlot) {
        newErrors.push('Please select a delivery date and time.');
      }
    }
    setValidationErrors(newErrors);
    return newErrors.length === 0;
  }, [deliveryChoiceMode, deliveryDetails.preferredDate, deliveryDetails.timeSlot]);

  // Handle delivery choice mode change
  const handleDeliveryChoiceChange = useCallback((mode: 'later' | 'now') => {
    setDeliveryChoiceMode(mode);
    if (mode === 'later') {
      setDeliveryDetails({
        ...deliveryDetails,
        preferredDate: '',
        timeSlot: ''
      });
      setValidationErrors([]);
    }
  }, [deliveryDetails, setDeliveryDetails]);

  // Handle special instructions change
  const handleSpecialInstructionsChange = useCallback((instructions: string) => {
    setDeliveryDetails({
      ...deliveryDetails,
      specialInstructions: instructions
    });
  }, [deliveryDetails, setDeliveryDetails]);

  // Clear validation errors when selections are made
  useEffect(() => {
    if (validationErrors.length > 0 && (deliveryChoiceMode === 'later' || (deliveryDetails.preferredDate && deliveryDetails.timeSlot))) {
      setValidationErrors([]);
    }
  }, [deliveryDetails.preferredDate, deliveryDetails.timeSlot, validationErrors.length, deliveryChoiceMode]);

  // Notify parent of validation state
  useEffect(() => {
    const isValid = deliveryChoiceMode === 'later' || validateForm();
    onValidationChange?.(isValid);
  }, [deliveryChoiceMode, deliveryDetails.preferredDate, deliveryDetails.timeSlot, onValidationChange, validateForm]);

  return {
    showCalendar,
    setShowCalendar,
    deliveryChoiceMode,
    validationErrors,
    handleDeliveryChoiceChange,
    handleSpecialInstructionsChange,
    validateForm,
  };
}