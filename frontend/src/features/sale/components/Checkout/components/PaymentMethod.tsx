import type { SaleTotals } from '@/features/sale/hooks/useSaleTotals';
import { fmt } from '@/shared/utils';
import { PAYMENT_METHODS } from '../constants/payment';
import { Card } from '@/ui';
import { usePaymentMethod } from '../hooks/usePaymentMethod';

interface PaymentMethodProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  depositAmount: number;
  setDepositAmount: (amount: number) => void;
  totals: SaleTotals;
}

// Payment method icons
const PAYMENT_ICONS: Record<string, string> = {
  cash: '💵',
  card: '💳',
  financing: '📊'
};

export function PaymentMethod({
  paymentMethod,
  setPaymentMethod,
  depositAmount,
  setDepositAmount,
  totals
}: PaymentMethodProps) {
  const {
    isFinancing,
    handlePaymentMethodChange,
    handleDepositChange,
    formatDepositValue,
    financingCalculations
  } = usePaymentMethod({
    paymentMethod,
    setPaymentMethod,
    depositAmount,
    setDepositAmount,
    totals
  });
  
  return (
    <Card title="Payment Method">
        <div className="payment-methods-grid">
          {PAYMENT_METHODS.map((method) => (
            <label key={method.value} className="payment-option-card">
              <div className="payment-icon">{PAYMENT_ICONS[method.value]}</div>
              <div className="payment-content">
                <div className="payment-name">{method.label}</div>
                <div className="payment-description">{method.description}</div>
              </div>
              <input
                type="radio"
                name="payment"
                value={method.value}
                checked={paymentMethod === method.value}
                onChange={(e) => handlePaymentMethodChange(e.target.value)}
              />
            </label>
          ))}
        </div>

        {isFinancing && (
          <div className="financing-details">
            <div className="form-group">
              <label className="form-label" htmlFor="deposit-input">Deposit Amount *</label>
              <div className="deposit-input-wrapper">
                <span className="input-prefix">$</span>
                <input
                  id="deposit-input"
                  type="number"
                  className="form-input deposit-input"
                  min="0"
                  max={financingCalculations?.maxDeposit}
                  step="0.01"
                  value={formatDepositValue()}
                  onChange={(e) => handleDepositChange(e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="financing-summary">
              <div className="financing-row">
                <span>Deposit Today:</span>
                <span className="amount">{fmt(financingCalculations?.depositToday || 0)}</span>
              </div>
              <div className="financing-row">
                <span>Balance on Delivery:</span>
                <span className="amount">{fmt(financingCalculations?.balanceOnDelivery || 0)}</span>
              </div>
            </div>
          </div>
        )}
    </Card>
  );
}
