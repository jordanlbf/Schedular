import { useRef } from 'react';
import CustomerStep from './CustomerStep';
import ProductsStep from './ProductsStep';
import DeliveryStep from './DeliveryStep';
import PaymentStep from './PaymentStep';
import { CATALOG } from '@/features/sale/catalog';
import { getEstimatedDeliveryDate } from '@/shared/utils';
import type { WizardStep, SaleDraftState } from '@/features/sale/stores/useSaleDraftStore';
import type { StepValidation } from '../hooks/useSaleValidation';
import type { SaleTotals } from '@/features/sale/hooks/useSaleTotals';
import { useWizardCartManagement } from '../hooks/useWizardCartManagement';

interface WizardNavigation {
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: WizardStep) => void;
  canProceed: boolean;
  totals: SaleTotals;
}

interface WizardStepsProps {
  currentStep: WizardStep;
  state: Omit<SaleDraftState, 'savedAt'>;
  updateField: <K extends keyof SaleDraftState>(
    field: K,
    value: SaleDraftState[K] | ((prev: SaleDraftState[K]) => SaleDraftState[K])
  ) => void;
  navigation: WizardNavigation;
  validation: StepValidation & {
    markStepAttempted: (step: string) => void;
    resetStepAttempted: (step: string) => void;
  };
  onComplete: () => void;
  onAddSuccess?: (productName: string) => void;
  isSubmitting?: boolean;
}

export function WizardSteps({
  currentStep,
  state,
  updateField,
  navigation,
  validation,
  onComplete,
  onAddSuccess,
  isSubmitting = false
}: WizardStepsProps) {
  const searchRef = useRef<HTMLInputElement | null>(null);

  const {
    addLine,
    changeQty,
    removeLineFromCart,
    changePriceForLine,
    subtotal,
  } = useWizardCartManagement({
    lines: state.lines,
    nextId: state.nextId,
    currentStep,
    updateField,
    validation
  });

  const stepComponents = {
    customer: (
      <CustomerStep
        customer={state.customer}
        setCustomer={(value) => updateField('customer', value)}
        onNext={navigation.nextStep}
        canProceed={validation.customer.isValid}
        fieldErrors={validation.customer.fieldErrors}
      />
    ),
    products: (
      <ProductsStep
        lines={state.lines}
        catalog={CATALOG}
        onAddLine={addLine}
        onChangeQty={changeQty}
        onRemoveLine={removeLineFromCart}
        onPriceChange={changePriceForLine}
        searchRef={searchRef}
        onNext={navigation.nextStep}
        onPrev={navigation.prevStep}
        canProceed={validation.products.isValid}
        subtotal={subtotal}
        onAddSuccess={onAddSuccess}
      />
    ),
    delivery: (
      <DeliveryStep
        deliveryDetails={state.deliveryDetails}
        setDeliveryDetails={(value) => updateField('deliveryDetails', value)}
        deliveryFee={state.deliveryFee}
        setDeliveryFee={(value) => updateField('deliveryFee', value)}
        estimatedDelivery={getEstimatedDeliveryDate()}
        onNext={navigation.nextStep}
        onPrev={navigation.prevStep}
        canProceed={validation.delivery.isValid}
      />
    ),
    payment: (
      <PaymentStep
        paymentMethod={state.paymentMethod}
        setPaymentMethod={(value) => updateField('paymentMethod', value)}
        depositAmount={state.depositAmount}
        setDepositAmount={(value) => updateField('depositAmount', value)}
        discountPct={state.discountPct}
        setDiscountPct={(value) => updateField('discountPct', value)}
        totals={navigation.totals}
        customer={state.customer}
        lines={state.lines}
        deliveryDetails={state.deliveryDetails}
        onPrev={navigation.prevStep}
        onComplete={onComplete}
        canProceed={validation.payment.isValid}
        isSubmitting={isSubmitting}
      />
    )
  };

  return (
    <div className="wizard-content">
      {stepComponents[currentStep]}
    </div>
  );
}
