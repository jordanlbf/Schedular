import { useRef } from 'react';
import CustomerStep from './CustomerStep';
import ProductsStep from './ProductsStep';
import DeliveryStep from './DeliveryStep';
import PaymentStep from './PaymentStep';
import { CATALOG } from '../../catalog';
import { addLineToCart, updateLineQuantity, removeLine, getEstimatedDeliveryDate } from '../../utils/saleUtils';
import type { WizardStep, SaleDraftState } from '../../stores/useSaleDraftStore';
import type { StepValidation } from '../../hooks/useSaleValidation';

interface WizardStepsProps {
  currentStep: WizardStep;
  state: Omit<SaleDraftState, 'savedAt'>;
  updateField: <K extends keyof SaleDraftState>(
    field: K,
    value: SaleDraftState[K]
  ) => void;
  navigation: any; // Navigation interface - contains nextStep, prevStep, goToStep, canProceed
  validation: StepValidation & {
    markStepAttempted: (step: string) => void;
    resetStepAttempted: (step: string) => void;
  };
  onComplete: () => void;
  onAddSuccess?: (productName: string) => void;
}

export function WizardSteps({
  currentStep,
  state,
  updateField,
  navigation,
  validation,
  onComplete,
  onAddSuccess
}: WizardStepsProps) {
  const searchRef = useRef<HTMLInputElement | null>(null);

  // Product management functions
  const addLine = (sku: string | number, color?: string) => {
    const result = addLineToCart(state.lines, sku, state.nextId, color);
    updateField('lines', result.lines);
    updateField('nextId', result.nextId);
  };

  const changeQty = (id: number, delta: number) => {
    const newLines = updateLineQuantity(state.lines, id, delta);
    updateField('lines', newLines);
    // Reset validation state if no valid items remain
    if (currentStep === 'products') {
      const validItems = newLines.filter(line => line.qty > 0);
      if (validItems.length === 0) {
        validation.resetStepAttempted('productsAttempted');
      }
    }
  };

  const removeLineFromCart = (id: number) => {
    const newLines = removeLine(state.lines, id);
    updateField('lines', newLines);
    // Reset validation state if cart becomes empty
    if (newLines.length === 0 && currentStep === 'products') {
      validation.resetStepAttempted('productsAttempted');
    }
  };

  const changePriceForLine = (id: number, newPrice: number) => {
    const newLines = state.lines.map(line => 
      line.id === id ? { ...line, price: newPrice } : line
    );
    updateField('lines', newLines);
  };

  // Calculate subtotal for product-picker step
  const subtotal = state.lines.reduce((sum: number, line) => sum + (line.price * line.qty), 0);

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
        onPriceChange={changePriceForLine}
        searchRef={searchRef}
        onNext={navigation.nextStep}
        onPrev={navigation.prevStep}
        canProceed={validation.products.isValid}
        subtotal={subtotal}
        errors={validation.products.errors}
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
