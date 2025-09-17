import type { Customer, Line, DeliveryDetails } from '../../types';
import type { SaleTotals } from '../../hooks/useSaleTotals';
import { fmt } from '../../../../shared/utils/money';
import { PAYMENT_METHODS } from '../../constants/wizard';
import { WizardStepLayout } from './shared/WizardStepLayout';
import { WIZARD_STEP_TITLES } from '../../constants/wizardTitles';

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
  errors?: string[];
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
  canProceed,
  errors = []
}: PaymentStepProps) {
  return (
    <WizardStepLayout
      title={WIZARD_STEP_TITLES.payment}
      stepNumber="4"
      onPrev={onPrev}
      canProceed={canProceed}
      nextLabel="Complete Order"
      onNext={onComplete}
      errors={errors}
    >
      <div className="form-card">
        <div className="form-card-header">
          <h3>Order Summary</h3>
        </div>
        <div className="form-card-body">
          <div className="order-summary-card">
            <div className="summary-customer">
              <h4>Customer</h4>
              <div><strong>{customer.name}</strong></div>
              <div>{customer.phone}</div>
              {customer.email && <div>{customer.email}</div>}
              <div className="delivery-address">
                {customer.deliveryAddress?.street}<br/>
                {customer.deliveryAddress?.city}, {customer.deliveryAddress?.state} {customer.deliveryAddress?.zip}
              </div>
            </div>

            <div className="summary-items">
              <h4>Items ({lines.length})</h4>
              {lines.map((line) => (
                <div key={line.id} className="summary-item">
                  <span>{line.name}</span>
                  <span>×{line.qty}</span>
                  <span>{fmt(line.qty * line.price)}</span>
                </div>
              ))}
            </div>

            <div className="summary-delivery">
              <h4>Delivery</h4>
              <div><strong>{deliveryDetails.preferredDate}</strong></div>
              <div>{deliveryDetails.timeSlot}</div>
              {deliveryDetails.whiteGloveService && <div>• White Glove Service</div>}
              {deliveryDetails.oldMattressRemoval && <div>• Old Mattress Removal</div>}
              {deliveryDetails.setupService && <div>• Basic Setup Service</div>}
            </div>
          </div>
        </div>
      </div>

      <div className="form-card">
        <div className="form-card-header">
          <h3>Pricing</h3>
        </div>
        <div className="form-card-body">
          <div className="form-group">
            <label className="form-label">Discount (%)</label>
            <input
              type="number"
              className="form-input"
              min="0"
              max="100"
              step="0.1"
              value={discountPct}
              onChange={(e) => setDiscountPct(Number(e.target.value || 0))}
              placeholder="0"
            />
          </div>

          <div className="order-totals">
            <div className="total-row">
              <span>Items Sum:</span>
              <span>{fmt(totals.itemsSum)}</span>
            </div>
            {totals.lineDiscount > 0 && (
              <div className="total-row discount">
                <span>Line Discount:</span>
                <span>-{fmt(totals.lineDiscount)}</span>
              </div>
            )}
            <div className="total-row subtotal">
              <span>Subtotal:</span>
              <span>{fmt(totals.subtotal)}</span>
            </div>
            {totals.serviceCharges > 0 && (
              <div className="total-row">
                <span>Service Charges:</span>
                <span>{fmt(totals.serviceCharges)}</span>
              </div>
            )}
            {totals.deliveryFee > 0 && (
              <div className="total-row">
                <span>Delivery:</span>
                <span>{fmt(totals.deliveryFee)}</span>
              </div>
            )}
            {totals.discount > 0 && (
              <div className="total-row discount">
                <span>Discount ({discountPct}%):</span>
                <span>-{fmt(totals.discount)}</span>
              </div>
            )}
            {totals.tax > 0 && (
              <div className="total-row">
                <span>Tax (10%):</span>
                <span>{fmt(totals.tax)}</span>
              </div>
            )}
            <div className="total-row total">
              <span><strong>Total:</strong></span>
              <span><strong>{fmt(totals.total)}</strong></span>
            </div>
          </div>
        </div>
      </div>

      <div className="form-card">
        <div className="form-card-header">
          <h3>Payment Method</h3>
        </div>
        <div className="form-card-body">
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
                <label className="form-label">Deposit Amount *</label>
                <input
                  type="number"
                  className="form-input"
                  min="0"
                  max={totals.total / 100}
                  step="0.01"
                  value={(depositAmount/100).toFixed(2)}
                  onChange={(e) => setDepositAmount(Math.round(Number(e.target.value || 0) * 100))}
                  placeholder="0.00"
                />
              </div>
              <div className="financing-summary">
                <div>Deposit: {fmt(depositAmount)}</div>
                <div>Balance due on delivery: {fmt(totals.total - depositAmount)}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </WizardStepLayout>
  );
}
