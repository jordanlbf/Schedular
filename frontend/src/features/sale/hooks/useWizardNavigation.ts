import { useCallback } from 'react';
import type { WizardStep } from './useSaleDraft';
import type { StepValidation, ValidationState } from './useSaleValidation';

/**
 * Custom hook for managing wizard step navigation
 */
export function useWizardNavigation(
  currentStep: WizardStep,
  setCurrentStep: (step: WizardStep) => void,
  validation: StepValidation,
  markStepAttempted: (step: keyof ValidationState) => void
) {
  const nextStep = useCallback(() => {
    switch (currentStep) {
      case 'customer':
        markStepAttempted('customerAttempted');
        if (validation.customer.isValid) {
          setCurrentStep('products');
        }
        break;
      case 'products':
        markStepAttempted('productsAttempted');
        if (validation.products.isValid) {
          setCurrentStep('delivery');
        }
        break;
      case 'delivery':
        markStepAttempted('deliveryAttempted');
        if (validation.delivery.isValid) {
          setCurrentStep('payment');
        }
        break;
      case 'payment':
        markStepAttempted('paymentAttempted');
        // Final step - handle completion elsewhere
        break;
    }
  }, [currentStep, validation, setCurrentStep, markStepAttempted]);

  const prevStep = useCallback(() => {
    switch (currentStep) {
      case 'products':
        setCurrentStep('customer');
        break;
      case 'delivery':
        setCurrentStep('products');
        break;
      case 'payment':
        setCurrentStep('delivery');
        break;
      case 'customer':
        // First step - no previous
        break;
    }
  }, [currentStep, setCurrentStep]);

  const goToStep = useCallback((step: WizardStep) => {
    setCurrentStep(step);
  }, [setCurrentStep]);

  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 'customer':
        return validation.customer.isValid;
      case 'products':
        return validation.products.isValid;
      case 'delivery':
        return validation.delivery.isValid;
      case 'payment':
        return validation.payment.isValid;
      default:
        return false;
    }
  }, [currentStep, validation]);

  return {
    nextStep,
    prevStep,
    goToStep,
    canProceed: canProceed(),
  };
}
