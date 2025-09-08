import { useState, useMemo } from 'react';
import type { Customer, Line, DeliveryDetails } from '../types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface StepValidation {
  customer: ValidationResult;
  products: ValidationResult;
  delivery: ValidationResult;
  payment: ValidationResult;
}

export interface ValidationState {
  customerAttempted: boolean;
  productsAttempted: boolean;
  deliveryAttempted: boolean;
  paymentAttempted: boolean;
}

/**
 * Custom hook for sale wizard validation with attempt tracking
 */
export function useSaleValidation(
  customer: Customer,
  lines: Line[],
  deliveryDetails: DeliveryDetails,
  paymentMethod: string,
  depositAmount: number
): StepValidation & {
  markStepAttempted: (step: keyof ValidationState) => void;
  validationState: ValidationState;
} {
  const [validationState, setValidationState] = useState<ValidationState>({
    customerAttempted: false,
    productsAttempted: false,
    deliveryAttempted: false,
    paymentAttempted: false,
  });

  const markStepAttempted = (step: keyof ValidationState) => {
    setValidationState(prev => ({
      ...prev,
      [step]: true
    }));
  };

  const customerValidation = useMemo((): ValidationResult => {
    const errors: string[] = [];
    
    if (!customer.name?.trim()) {
      errors.push('Customer name is required');
    }
    
    if (!customer.phone?.trim()) {
      errors.push('Phone number is required');
    }
    
    if (!customer.deliveryAddress?.street?.trim()) {
      errors.push('Street address is required');
    }
    
    if (!customer.deliveryAddress?.city?.trim()) {
      errors.push('City is required');
    }
    
    if (!customer.deliveryAddress?.state?.trim()) {
      errors.push('State is required');
    }
    
    if (!customer.deliveryAddress?.zip?.trim()) {
      errors.push('Postcode is required');
    }

    return {
      isValid: errors.length === 0,
      errors: validationState.customerAttempted ? errors : [] // Only show errors if attempted
    };
  }, [customer, validationState.customerAttempted]);

  const productsValidation = useMemo((): ValidationResult => {
    const errors: string[] = [];
    
    if (lines.length === 0) {
      errors.push('At least one product must be added');
    }
    
    // Check for invalid quantities
    const invalidLines = lines.filter(line => line.qty <= 0);
    if (invalidLines.length > 0) {
      errors.push('All products must have a quantity greater than 0');
    }

    return {
      isValid: errors.length === 0,
      errors: validationState.productsAttempted ? errors : [] // Only show errors if attempted
    };
  }, [lines, validationState.productsAttempted]);

  const deliveryValidation = useMemo((): ValidationResult => {
    const errors: string[] = [];
    
    if (!deliveryDetails.preferredDate) {
      errors.push('Delivery date is required');
    }
    
    if (!deliveryDetails.timeSlot) {
      errors.push('Time slot is required');
    }

    // Validate date is not in the past
    if (deliveryDetails.preferredDate) {
      const selectedDate = new Date(deliveryDetails.preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        errors.push('Delivery date cannot be in the past');
      }
    }

    return {
      isValid: errors.length === 0,
      errors: validationState.deliveryAttempted ? errors : [] // Only show errors if attempted
    };
  }, [deliveryDetails, validationState.deliveryAttempted]);

  const paymentValidation = useMemo((): ValidationResult => {
    const errors: string[] = [];
    
    if (!paymentMethod) {
      errors.push('Payment method is required');
    }
    
    if (paymentMethod === 'financing' && depositAmount <= 0) {
      errors.push('Deposit amount is required for financing');
    }

    return {
      isValid: errors.length === 0,
      errors: validationState.paymentAttempted ? errors : [] // Only show errors if attempted
    };
  }, [paymentMethod, depositAmount, validationState.paymentAttempted]);

  return {
    customer: customerValidation,
    products: productsValidation,
    delivery: deliveryValidation,
    payment: paymentValidation,
    markStepAttempted,
    validationState,
  };
}
