import type { Customer, Line, DeliveryDetails } from '@/features/sale/types';
import type { SaleTotals } from '@/features/sale/hooks/useSaleTotals';
import { OrderSummary } from './OrderSummary';
import { OrderInformation } from './OrderInformation';
import { PaymentMethod } from './PaymentMethod';
import { useEffect, useRef } from 'react';

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
  const rightColumnRef = useRef<HTMLDivElement>(null);
  const orderSummaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Lock the Order Summary height to match the right column
    const lockHeight = () => {
      if (rightColumnRef.current && orderSummaryRef.current) {
        const rightColumnHeight = rightColumnRef.current.offsetHeight;
        const orderSummaryCard = orderSummaryRef.current.querySelector('.form-card');
        
        if (orderSummaryCard) {
          (orderSummaryCard as HTMLElement).style.setProperty('--locked-height', `${rightColumnHeight}px`);
          orderSummaryCard.classList.add('height-locked');
        }
      }
    };

    // Lock height after initial render
    setTimeout(lockHeight, 100);

    // Re-lock on window resize
    window.addEventListener('resize', lockHeight);
    return () => window.removeEventListener('resize', lockHeight);
  }, []);

  return (
    <div className="payment-layout-grid">
      {/* Left Column - Order Summary */}
      <div className="payment-order-summary" ref={orderSummaryRef}>
        <OrderSummary
          lines={lines}
          totals={totals}
          discountPct={discountPct}
          setDiscountPct={setDiscountPct}
        />
      </div>

      {/* Right Column - Order Info & Payment */}
      <div className="payment-right-column" ref={rightColumnRef}>
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
