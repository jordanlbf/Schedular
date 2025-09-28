import type { Customer, Line, DeliveryDetails } from '../../../types';
import type { SaleTotals } from '../../../hooks/useSaleTotals';
import { OrderSummary } from './OrderSummary';
import { OrderInformation } from './OrderInformation';
import { PaymentMethod } from './PaymentMethod';

interface OrderCheckoutProps {
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
}

export default function OrderCheckout({
  paymentMethod,
  setPaymentMethod,
  depositAmount,
  setDepositAmount,
  discountPct,
  setDiscountPct,
  totals,
  customer,
  lines,
  deliveryDetails
}: OrderCheckoutProps) {
  return (
    <div className="payment-layout-grid">
      {/* Left Column - Order Summary */}
      <div className="payment-order-summary">
        <OrderSummary
          lines={lines}
          totals={totals}
          discountPct={discountPct}
          setDiscountPct={setDiscountPct}
        />
      </div>

      {/* Right Column - Order Info & Payment */}
      <div className="payment-right-column">
        <OrderInformation
          customer={customer}
          deliveryDetails={deliveryDetails}
        />

        <PaymentMethod
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          depositAmount={depositAmount}
          setDepositAmount={setDepositAmount}
          totals={totals}
        />
      </div>
    </div>
  );
}