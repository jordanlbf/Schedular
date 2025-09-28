import { useCallback } from 'react';
import type { WizardStep } from '@/features/sale/stores/useSaleDraftStore';
import type { StepValidation } from './useSaleValidation';

export function useWizardNavigation(
  currentStep: WizardStep,
  setCurrentStep: (step: WizardStep) => void,
  validation: StepValidation,
  markStepAttempted: (step: string) => void,
  resetStepAttempted: (step: string) => void,
  markStepCompleted?: (step: WizardStep) => void
) {
  const nextStep = useCallback(() => {
    switch (currentStep) {
      case 'customer':
        markStepAttempted('customerAttempted');
        if (validation.customer.isValid) {
          markStepCompleted?.(currentStep);
          setCurrentStep('products');
        }
        break;
      case 'products':
        markStepAttempted('productsAttempted');
        if (validation.products.isValid) {
          markStepCompleted?.(currentStep);
          setCurrentStep('delivery');
        }
        break;
      case 'delivery':
        markStepAttempted('deliveryAttempted');
        if (validation.delivery.isValid) {
          markStepCompleted?.(currentStep);
          setCurrentStep('payment');
        }
        break;
      case 'payment':
        markStepAttempted('paymentAttempted');
        break;
    }
  }, [currentStep, validation, setCurrentStep, markStepAttempted, markStepCompleted]);

  const prevStep = useCallback(() => {
    switch (currentStep) {
      case 'products':
        setCurrentStep('customer');
        break;
      case 'delivery':
        resetStepAttempted('productsAttempted');
        setCurrentStep('products');
        break;
      case 'payment':
        setCurrentStep('delivery');
        break;
      case 'customer':
        break;
    }
  }, [currentStep, setCurrentStep, resetStepAttempted]);

  const goToStep = useCallback((step: WizardStep) => {
    if (step === 'products') {
      resetStepAttempted('productsAttempted');
    }
    setCurrentStep(step);
  }, [setCurrentStep, resetStepAttempted]);

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
