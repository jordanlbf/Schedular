import { useMemo } from 'react';
import { useSaleTotals } from '@/features/sale/hooks/useSaleTotals';
import { useSaleValidation } from './useSaleValidation';
import { useWizardNavigation } from './useWizardNavigation';
import type { WizardStep } from '@/features/sale/stores/useSaleDraftStore';
import { WIZARD_STEP_TITLES } from '@/features/sale/components/CreateSaleWizard/constants/wizard';

export function useSaleWizard(state: any, updateField: (field: string, value: any) => void) {
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
    validation.markStepAttempted,
    validation.resetStepAttempted,
    (step: WizardStep) => {
      const newCompletedSteps = [...state.completedSteps];
      if (!newCompletedSteps.includes(step)) {
        newCompletedSteps.push(step);
        updateField('completedSteps', newCompletedSteps);
      }
    }
  );

  const progressSteps = useMemo(() => {
    const stepOrder = ['customer', 'products', 'delivery', 'payment'];
    const currentStepIndex = stepOrder.indexOf(state.currentStep);

    // Helper function to determine if a step is completed
    const isStepCompleted = (stepId: string) => {
      // Step is completed only if it's in the completedSteps array
      return state.completedSteps.includes(stepId as WizardStep);
    };

    // Helper function to determine if a step is accessible (clickable)
    const isStepAccessible = (stepId: string, stepIndex: number) => {
      // Always allow current step
      if (stepId === state.currentStep) return true;

      // Allow completed steps
      if (isStepCompleted(stepId)) return true;

      // Allow the next step if we've completed all previous steps
      if (stepIndex > 0) {
        const previousStepId = stepOrder[stepIndex - 1];
        return isStepCompleted(previousStepId);
      }

      // First step is always accessible
      return stepIndex === 0;
    };

    return [
      {
        id: 'customer',
        label: WIZARD_STEP_TITLES.customer,
        detail: validation.customer.isValid ? state.customer.name : 'Name & delivery address',
        icon: '1',
        isActive: state.currentStep === 'customer',
        isCompleted: isStepCompleted('customer'),
        isAccessible: isStepAccessible('customer', 0)
      },
      {
        id: 'products',
        label: WIZARD_STEP_TITLES.products,
        detail: validation.products.isValid
          ? `${state.lines.length} item${state.lines.length !== 1 ? 's' : ''}`
          : 'Choose product-picker',
        icon: '2',
        isActive: state.currentStep === 'products',
        isCompleted: isStepCompleted('products'),
        isAccessible: isStepAccessible('products', 1)
      },
      {
        id: 'delivery',
        label: WIZARD_STEP_TITLES.delivery,
        detail: validation.delivery.isValid
          ? (state.deliveryDetails.preferredDate || 'Delivery scheduled')
          : 'Schedule delivery',
        icon: '3',
        isActive: state.currentStep === 'delivery',
        isCompleted: isStepCompleted('delivery'),
        isAccessible: isStepAccessible('delivery', 2)
      },
      {
        id: 'payment',
        label: WIZARD_STEP_TITLES.payment,
        detail: validation.payment.isValid
          ? state.paymentMethod.charAt(0).toUpperCase() + state.paymentMethod.slice(1)
          : 'Select payment method',
        icon: '💳',
        isActive: state.currentStep === 'payment',
        isCompleted: isStepCompleted('payment'),
        isAccessible: isStepAccessible('payment', 3)
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
