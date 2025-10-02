import { useState, useMemo } from 'react';
import type { Customer, LineItem, DeliveryDetails } from '@/shared/types';

export interface ValidationResult {
  isValid: boolean;
  fieldErrors?: { [key: string]: string };
}

export interface StepValidation {
  customer: ValidationResult;
  products: ValidationResult;
  delivery: ValidationResult;
  payment: ValidationResult;
  isValid?: boolean;
}

export interface ValidationState {
  customerAttempted: boolean;
  productsAttempted: boolean;
  deliveryAttempted: boolean;
  paymentAttempted: boolean;
}

export function useSaleValidation(
  customer: Customer,
  lines: LineItem[],
  deliveryDetails: DeliveryDetails,
  paymentMethod: string,
  depositAmount: number
): StepValidation & {
  markStepAttempted: (step: keyof ValidationState | string) => void;
  resetStepAttempted: (step: keyof ValidationState | string) => void;
  validationState: ValidationState;
} {
  const [validationState, setValidationState] = useState<ValidationState>({
    customerAttempted: false,
    productsAttempted: false,
    deliveryAttempted: false,
    paymentAttempted: false,
  });

  const markStepAttempted = (step: keyof ValidationState | string) => {
    setValidationState(prev => ({
      ...prev,
      [step]: true
    }));
  };

  const resetStepAttempted = (step: keyof ValidationState | string) => {
    setValidationState(prev => ({
      ...prev,
      [step]: false
    }));
  };

  const customerValidation = useMemo((): ValidationResult => {
    const fieldErrors: { [key: string]: string } = {};
    
    if (!customer.firstName?.trim()) {
      fieldErrors.firstName = 'First name is required';
    }
    
    if (!customer.lastName?.trim()) {
      fieldErrors.lastName = 'Last name is required';
    }
    
    if (!customer.phone?.trim()) {
      fieldErrors.phone = 'Phone number is required';
    }
    
    if (!customer.deliveryAddress?.street?.trim()) {
      fieldErrors.street = 'Street address is required';
    }
    
    if (!customer.deliveryAddress?.city?.trim()) {
      fieldErrors.city = 'City is required';
    }
    
    if (!customer.deliveryAddress?.state?.trim()) {
      fieldErrors.state = 'State is required';
    }
    
    if (!customer.deliveryAddress?.zip?.trim()) {
      fieldErrors.zip = 'Postcode is required';
    }

    return {
      isValid: Object.keys(fieldErrors).length === 0,
      fieldErrors: validationState.customerAttempted ? fieldErrors : {}
    };
  }, [customer, validationState.customerAttempted]);

  const productsValidation = useMemo((): ValidationResult => {
    const fieldErrors: { [key: string]: string } = {};
    
    if (lines.length === 0) {
      fieldErrors.products = 'Please add an item to continue';
    }
    
    const invalidLines = lines.filter(line => line.qty <= 0);
    if (invalidLines.length > 0) {
      fieldErrors.quantities = 'All products must have a quantity greater than 0';
    }

    return {
      isValid: Object.keys(fieldErrors).length === 0,
      fieldErrors: validationState.productsAttempted ? fieldErrors : {}
    };
  }, [lines, validationState.productsAttempted]);

  const deliveryValidation = useMemo((): ValidationResult => {
    const fieldErrors: { [key: string]: string } = {};

    // For global validation, be lenient and allow delivery to be valid
    // The actual validation happens locally in the DeliveryStep component
    // This allows "Choose Later" to be valid while still validating "Choose Now"

    if (deliveryDetails.preferredDate) {
      const selectedDate = new Date(deliveryDetails.preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        fieldErrors.preferredDate = 'Delivery date cannot be in the past';
      }
    }

    return {
      isValid: Object.keys(fieldErrors).length === 0,
      fieldErrors: validationState.deliveryAttempted ? fieldErrors : {}
    };
  }, [deliveryDetails, validationState.deliveryAttempted]);

  const paymentValidation = useMemo((): ValidationResult => {
    const fieldErrors: { [key: string]: string } = {};
    
    if (!paymentMethod) {
      fieldErrors.paymentMethod = 'Payment method is required';
    }
    
    if (paymentMethod === 'financing' && depositAmount <= 0) {
      fieldErrors.depositAmount = 'Deposit amount is required for financing';
    }

    return {
      isValid: Object.keys(fieldErrors).length === 0,
      fieldErrors: validationState.paymentAttempted ? fieldErrors : {}
    };
  }, [paymentMethod, depositAmount, validationState.paymentAttempted]);

  const isValid = customerValidation.isValid && 
                  productsValidation.isValid && 
                  deliveryValidation.isValid && 
                  paymentValidation.isValid;

  return {
    customer: customerValidation,
    products: productsValidation,
    delivery: deliveryValidation,
    payment: paymentValidation,
    isValid,
    markStepAttempted,
    resetStepAttempted,
    validationState,
  };
}
