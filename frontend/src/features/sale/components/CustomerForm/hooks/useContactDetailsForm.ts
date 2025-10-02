import { useState, useMemo } from 'react';
import type { Customer, SecondPerson } from '@/shared/types';
import { isValidPhone } from '../utils/customerUtils';

interface UseContactDetailsFormProps {
  customer: Customer;
  onChange: (customer: Customer) => void;
}

export function useContactDetailsForm({ customer, onChange }: UseContactDetailsFormProps) {
  const [isSecondPersonExpanded, setIsSecondPersonExpanded] = useState(!!customer.secondPerson);
  const [hasFocus, setHasFocus] = useState(false);

  // Check if all required fields are completed and valid
  const isComplete = useMemo(() => {
    return !!(
      customer.firstName?.trim() &&
      customer.lastName?.trim() &&
      customer.phone?.trim() &&
      isValidPhone(customer.phone)
    );
  }, [customer.firstName, customer.lastName, customer.phone]);

  // Compute full name for backwards compatibility
  const updateCustomer = (updates: Partial<Customer>) => {
    const newCustomer = { ...customer, ...updates };
    // Auto-compute full name
    newCustomer.name = `${newCustomer.firstName || ''} ${newCustomer.lastName || ''}`.trim();
    onChange(newCustomer);
  };

  const updateSecondPerson = (updates: Partial<SecondPerson>) => {
    const currentSecondPerson = customer.secondPerson || {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      relationship: ''
    };
    updateCustomer({
      secondPerson: { ...currentSecondPerson, ...updates }
    });
  };

  const clearSecondPerson = () => {
    updateCustomer({ secondPerson: undefined });
  };

  const toggleSecondPersonExpanded = () => {
    setIsSecondPersonExpanded(!isSecondPersonExpanded);
  };

  const handleSecondPersonRemove = () => {
    clearSecondPerson();
    setIsSecondPersonExpanded(false);
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
    isSecondPersonExpanded,
    hasFocus,
    isComplete,

    // Actions
    updateCustomer,
    updateSecondPerson,
    clearSecondPerson,
    toggleSecondPersonExpanded,
    handleSecondPersonRemove,
    handleFocusEnter,
    handleFocusLeave,
  };
}