import { useRef } from 'react';
import CustomerStep from './CustomerStep';
import ProductsStep from './ProductsStep';
import DeliveryStep from './DeliveryStep';
import PaymentStep from './PaymentStep';
import { CATALOG } from '../../catalog';
import { addLineToCart, updateLineQuantity, removeLine, getEstimatedDeliveryDate } from '../../utils/saleUtils';
import type { WizardStep, SaleDraftState } from '../../stores/useSaleDraftStore';

interface WizardStepsProps {
  currentStep: WizardStep;
  state: Omit<SaleDraftState, 'savedAt'>;
  updateField: <K extends keyof SaleDraftState>(
    field: K,
    value: SaleDraftState[K]
  ) => void;
  navigation: any;
  validation: any;
  onComplete: () => void;
}

export function WizardSteps({
  currentStep,
  state,
  updateField,
  navigation,
  validation,
  onComplete
}: WizardStepsProps) {
  const searchRef = useRef<HTMLInputElement | null>(null);

  // Product management functions
  const addLine = (sku: string | number) => {
    const result = addLineToCart(state.lines, sku, state.nextId);
    updateField('lines', result.lines);
    updateField('nextId', result.nextId);
  };

  const changeQty = (id: number, delta: number) => {
    updateField('lines', updateLineQuantity(state.lines, id, delta));
  };

  const removeLineFromCart = (id: number) => {
    updateField('lines', removeLine(state.lines, id));
  };

  // Calculate subtotal for products step
  const subtotal = state.lines.reduce((sum: number, line: any) => sum + (line.price * line.qty), 0);

  const stepComponents = {
    customer: (
      <CustomerStep
        customer={state.customer}
        setCustomer={(value) => updateField('customer', value)}
        onNext={navigation.nextStep}
        canProceed={validation.customer.isValid}
        errors={validation.customer.errors}
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
        searchRef={searchRef}
        onNext={navigation.nextStep}
        onPrev={navigation.prevStep}
        canProceed={validation.products.isValid}
        subtotal={subtotal}
        errors={validation.products.errors}
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
        errors={validation.delivery.errors}
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
        errors={validation.payment.errors}
      />
    )
  };

  return (
    <div className="wizard-content">
      {stepComponents[currentStep]}
    </div>
  );
}
