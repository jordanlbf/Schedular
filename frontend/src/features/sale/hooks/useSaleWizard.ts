import { useMemo } from 'react';
import { useSaleTotals } from './useSaleTotals';
import { useSaleValidation } from './useSaleValidation';
import { useWizardNavigation } from './useWizardNavigation';
import type { WizardStep } from '../stores/useSaleDraftStore';
import { WIZARD_STEP_TITLES } from '../constants/wizardTitles';

export function useSaleWizard(state: any, updateField: any) {
  const totals = useSaleTotals(
    state.lines,
    state.deliveryDetails,
    state.deliveryFee,
    state.discountPct
  );

  const validation = useSaleValidation(
    state.customer,
    state.lines,
    state.deliveryDetails,
    state.paymentMethod,
    state.depositAmount
  );

  const navigation = useWizardNavigation(
    state.currentStep,
    (step: WizardStep) => updateField('currentStep', step),
    validation,
    validation.markStepAttempted
  );

  const progressSteps = useMemo(() => {
    const stepOrder = ['customer', 'products', 'delivery', 'payment'];
    const currentStepIndex = stepOrder.indexOf(state.currentStep);
    
    return [
      {
        id: 'customer',
        label: WIZARD_STEP_TITLES.customer,
        detail: validation.customer.isValid ? state.customer.name : 'Name & delivery address',
        icon: '1',
        isActive: state.currentStep === 'customer',
        isCompleted: currentStepIndex > 0
      },
      {
        id: 'products',
        label: WIZARD_STEP_TITLES.products,
        detail: validation.products.isValid 
          ? `${state.lines.length} item${state.lines.length !== 1 ? 's' : ''}` 
          : 'Choose products',
        icon: '2',
        isActive: state.currentStep === 'products',
        isCompleted: currentStepIndex > 1
      },
      {
        id: 'delivery',
        label: WIZARD_STEP_TITLES.delivery,
        detail: validation.delivery.isValid 
          ? state.deliveryDetails.preferredDate 
          : 'Schedule delivery',
        icon: '3',
        isActive: state.currentStep === 'delivery',
        isCompleted: currentStepIndex > 2
      },
      {
        id: 'payment',
        label: WIZARD_STEP_TITLES.payment,
        detail: validation.payment.isValid 
          ? state.paymentMethod.charAt(0).toUpperCase() + state.paymentMethod.slice(1) 
          : 'Select payment method',
        icon: '💳',
        isActive: state.currentStep === 'payment',
        isCompleted: false // Payment is never completed since it's the final step
      }
    ];
  }, [state, validation]);

  return {
    totals,
    validation,
    navigation,
    progressSteps
  };
}
