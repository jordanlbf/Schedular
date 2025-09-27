import { useState, useMemo } from 'react';
import type { Address } from '@/shared/types';
import { isValidPostcode } from '../utils/customerUtils';

interface UseAddressFormProps {
  address?: Address;
  onChange: (updates: Partial<Address>) => void;
}

export function useAddressForm({ address, onChange }: UseAddressFormProps) {
  const [hasFocus, setHasFocus] = useState(false);

  // Check if all required fields are completed and valid
  const isComplete = useMemo(() => {
    return !!(
      address?.street?.trim() &&
      address?.city?.trim() &&
      address?.state?.trim() &&
      address?.zip?.trim() &&
      isValidPostcode(address.zip)
    );
  }, [address?.street, address?.city, address?.state, address?.zip]);

  const handlePostcodeChange = (value: string) => {
    // Only allow numbers
    const cleanedValue = value.replace(/\D/g, '');
    onChange({ zip: cleanedValue });
  };

  const handleFocusEnter = () => {
    setHasFocus(true);
  };

  const handleFocusLeave = (e: React.FocusEvent) => {
    // Only set hasFocus to false if focus is leaving the entire form card
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setHasFocus(false);
    }
  };

  return {
    // State
    hasFocus,
    isComplete,

    // Actions
    handlePostcodeChange,
    handleFocusEnter,
    handleFocusLeave,
  };
}