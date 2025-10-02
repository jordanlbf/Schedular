import type { Customer, Line, DeliveryDetails } from '@/features/sale/types';
import type { SaleTotals } from '@/features/sale/hooks/useSaleTotals';
import { WizardStepLayout } from '@/features/sale/components/CreateSaleWizard/components/WizardStepLayout';
import { WIZARD_STEP_TITLES } from '@/features/sale/components/CreateSaleWizard/constants/wizard';
import OrderCheckout from '@/features/sale/components/OrderCheckout/components/OrderCheckout';

interface PaymentStepProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  depositAmount: number;
  setDepositAmount: (amount: number) => void;
  discountPct: number;
  setDiscountPct: (pct: number) => void;
  totals: SaleTotals;
  customer: Customer;
  lines: Line[];
  deliveryDetails: DeliveryDetails;
  onPrev: () => void;
  onComplete: () => void;
  canProceed: boolean;
}

export default function PaymentStep({
  paymentMethod,
  setPaymentMethod,
  depositAmount,
  setDepositAmount,
  discountPct,
  setDiscountPct,
  totals,
  customer,
  lines,
  deliveryDetails,
  onPrev,
  onComplete,
  canProceed
}: PaymentStepProps) {
  return (
    <WizardStepLayout
      title={WIZARD_STEP_TITLES.payment}
      stepNumber="4"
      onPrev={onPrev}
      canProceed={canProceed}
      nextLabel="Complete Order"
      onNext={onComplete}
    >
      <OrderCheckout
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        depositAmount={depositAmount}
        setDepositAmount={setDepositAmount}
        discountPct={discountPct}
        setDiscountPct={setDiscountPct}
        totals={totals}
        customer={customer}
        lines={lines}
        deliveryDetails={deliveryDetails}
      />
    </WizardStepLayout>
  );
}
