import type { SaleTotals } from '../../../hooks/useSaleTotals';
import { fmt } from '../utils/paymentUtils';
import { PAYMENT_METHODS } from '../../CreateSaleWizard/constants/wizard';
import { Card } from '@/features/sale/ui';

interface PaymentMethodProps {
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  depositAmount: number;
  setDepositAmount: (amount: number) => void;
  totals: SaleTotals;
}

export function PaymentMethod({
  paymentMethod,
  setPaymentMethod,
  depositAmount,
  setDepositAmount,
  totals
}: PaymentMethodProps) {
  return (
    <Card title="Payment Method">
        <div className="payment-methods">
          {PAYMENT_METHODS.map((method) => (
            <label key={method.value} className="payment-option">
              <input
                type="radio"
                name="payment"
                value={method.value}
                checked={paymentMethod === method.value}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <div className="payment-details">
                <div className="payment-name">{method.label}</div>
                <div className="payment-description">{method.description}</div>
              </div>
            </label>
          ))}
        </div>

        {paymentMethod === 'financing' && (
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
                  max={totals.total / 100}
                  step="0.01"
                  value={(depositAmount/100).toFixed(2)}
                  onChange={(e) => setDepositAmount(Math.round(Number(e.target.value || 0) * 100))}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="financing-summary">
              <div className="financing-row">
                <span>Deposit Today:</span>
                <span className="amount">{fmt(depositAmount)}</span>
              </div>
              <div className="financing-row">
                <span>Balance on Delivery:</span>
                <span className="amount">{fmt(totals.total - depositAmount)}</span>
              </div>
            </div>
          </div>
        )}
    </Card>
  );
}