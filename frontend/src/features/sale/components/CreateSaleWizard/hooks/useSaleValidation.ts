import { useState, useMemo } from 'react';
import type { Customer, LineItem, DeliveryDetails } from '@/shared/types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
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
    const errors: string[] = [];
    const fieldErrors: { [key: string]: string } = {};
    
    if (!customer.firstName?.trim()) {
      errors.push('First name is required');
      fieldErrors.firstName = 'First name is required';
    }
    
    if (!customer.lastName?.trim()) {
      errors.push('Last name is required');
      fieldErrors.lastName = 'Last name is required';
    }
    
    if (!customer.phone?.trim()) {
      errors.push('Phone number is required');
      fieldErrors.phone = 'Phone number is required';
    }
    
    if (!customer.deliveryAddress?.street?.trim()) {
      errors.push('Street address is required');
      fieldErrors.street = 'Street address is required';
    }
    
    if (!customer.deliveryAddress?.city?.trim()) {
      errors.push('City is required');
      fieldErrors.city = 'City is required';
    }
    
    if (!customer.deliveryAddress?.state?.trim()) {
      errors.push('State is required');
      fieldErrors.state = 'State is required';
    }
    
    if (!customer.deliveryAddress?.zip?.trim()) {
      errors.push('Postcode is required');
      fieldErrors.zip = 'Postcode is required';
    }

    return {
      isValid: errors.length === 0,
      errors: validationState.customerAttempted ? errors : [],
      fieldErrors: validationState.customerAttempted ? fieldErrors : {}
    };
  }, [customer, validationState.customerAttempted]);

  const productsValidation = useMemo((): ValidationResult => {
    const errors: string[] = [];
    const fieldErrors: { [key: string]: string } = {};
    
    if (lines.length === 0) {
      errors.push('Please add an item to continue');
      fieldErrors.products = 'Please add an item to continue';
    }
    
    const invalidLines = lines.filter(line => line.qty <= 0);
    if (invalidLines.length > 0) {
      errors.push('All product-picker must have a quantity greater than 0');
      fieldErrors.quantities = 'All product-picker must have a quantity greater than 0';
    }

    return {
      isValid: errors.length === 0,
      errors: validationState.productsAttempted ? errors : [],
      fieldErrors: validationState.productsAttempted ? fieldErrors : {}
    };
  }, [lines, validationState.productsAttempted]);

  const deliveryValidation = useMemo((): ValidationResult => {
    const errors: string[] = [];
    const fieldErrors: { [key: string]: string } = {};

    // For global validation, be lenient and allow delivery to be valid
    // The actual validation happens locally in the DeliveryStep component
    // This allows "Choose Later" to be valid while still validating "Choose Now"

    if (deliveryDetails.preferredDate) {
      const selectedDate = new Date(deliveryDetails.preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        errors.push('Delivery date cannot be in the past');
        fieldErrors.preferredDate = 'Delivery date cannot be in the past';
      }
    }

    return {
      isValid: errors.length === 0,
      errors: validationState.deliveryAttempted ? errors : [],
      fieldErrors: validationState.deliveryAttempted ? fieldErrors : {}
    };
  }, [deliveryDetails, validationState.deliveryAttempted]);

  const paymentValidation = useMemo((): ValidationResult => {
    const errors: string[] = [];
    const fieldErrors: { [key: string]: string } = {};
    
    if (!paymentMethod) {
      errors.push('Payment method is required');
      fieldErrors.paymentMethod = 'Payment method is required';
    }
    
    if (paymentMethod === 'financing' && depositAmount <= 0) {
      errors.push('Deposit amount is required for financing');
      fieldErrors.depositAmount = 'Deposit amount is required for financing';
    }

    return {
      isValid: errors.length === 0,
      errors: validationState.paymentAttempted ? errors : [],
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
