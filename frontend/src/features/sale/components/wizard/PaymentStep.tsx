import type { Customer, Line, DeliveryDetails } from '../../types';
import type { SaleTotals } from '../../hooks/useSaleTotals';
import { fmt } from '../../../../shared/utils/money';
import { PAYMENT_METHODS } from '../../constants/wizard';

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
    <div className="wizard-step">
      <div className="step-content">
        <div className="step-main">
          <div className="wizard-page-header">
            <h2>Order Summary & Payment</h2>
            <p>Review your order details and select a payment method.</p>
          </div>

          {/* Error display */}
          {errors.length > 0 && (
            <div className="form-errors">
              <h4>Please fix the following issues:</h4>
              <ul>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="payment-section">
            <h3>Order Summary</h3>
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

            <div className="pricing-section">
              <h3>Pricing</h3>

              <div className="field-row">
                <label className="field">
                  <span className="label">Discount (%)</span>
                  <input
                    type="number"
                    className="input"
                    min="0"
                    max="100"
                    step="0.1"
                    value={discountPct}
                    onChange={(e) => setDiscountPct(Number(e.target.value || 0))}
                    placeholder="0"
                  />
                </label>
              </div>

              <div className="order-totals">
                <div className="total-row">
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
                    <span>Discount:</span>
                    <span>-{fmt(totals.discount)}</span>
                  </div>
                )}
                <div className="total-row">
                  <span>Tax (10%):</span>
                  <span>{fmt(totals.tax)}</span>
                </div>
                <div className="total-row total">
                  <span><strong>Total:</strong></span>
                  <span><strong>{fmt(totals.total)}</strong></span>
                </div>
              </div>
            </div>

            <h3>Payment Method</h3>
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
                <label className="field">
                  <span className="label">Deposit Amount *</span>
                  <input
                    type="number"
                    className="input"
                    min="0"
                    max={totals.total / 100}
                    step="0.01"
                    value={(depositAmount/100).toFixed(2)}
                    onChange={(e) => setDepositAmount(Math.round(Number(e.target.value || 0) * 100))}
                    placeholder="0.00"
                  />
                </label>
                <div className="financing-summary">
                  <div>Deposit: {fmt(depositAmount)}</div>
                  <div>Balance due on delivery: {fmt(totals.total - depositAmount)}</div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="step-actions">
          <button className="btn btn-soft" onClick={onPrev}>
            ← Back to Delivery
          </button>
          <button
            className="btn btn-primary btn-complete"
            onClick={onComplete}
            disabled={!canProceed}
          >
            Complete Order ({fmt(paymentMethod === 'financing' ? depositAmount : totals.total)})
          </button>
          {!canProceed && (
            <div className="step-help">
              {paymentMethod ? 'Please enter a deposit amount' : 'Please select a payment method'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
