import type { Customer, Line, DeliveryDetails } from '../../types';
import type { SaleTotals } from '../../hooks/useSaleTotals';
import { fmt } from '@/shared/lib/money';
import { PAYMENT_METHODS } from '@/features/sale/components/CreateSaleWizard/constants/wizard';
import { WizardStepLayout } from './shared/WizardStepLayout';
import { WIZARD_STEP_TITLES } from '@/features/sale/components/CreateSaleWizard/constants/wizardTitles';

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
      <div className="payment-layout-grid">
        {/* Left Column - Order Summary */}
        <div className="payment-order-summary">
          <div className="form-card">
            <div className="form-card-header">
              <h3>Order Summary ({lines.length} {lines.length === 1 ? 'item' : 'items'})</h3>
            </div>
            <div className="form-card-body">
              {/* Top Content - Items and Controls */}
              <div className="order-content-top">
                {/* Order Items */}
                <div className="order-items-list">
                  {lines.map((line) => (
                    <div key={line.id} className="order-item-row">
                      <div className="item-details">
                        <span className="item-name">{line.name}</span>
                        <span className="item-sku">SKU: {line.sku}</span>
                      </div>
                      <div className="item-quantity">×{line.qty}</div>
                      <div className="item-price">{fmt(line.price * 100)}</div>
                      <div className="item-total">{fmt(line.qty * line.price * 100)}</div>
                    </div>
                  ))}
                </div>

                {/* Discount Control */}
                <div className="pricing-controls">
                  <div className="form-group">
                    <label className="form-label" htmlFor="discount-input">Additional Discount (%)</label>
                    <div className="discount-input-wrapper">
                      <input
                        id="discount-input"
                        type="number"
                        className="form-input discount-input"
                        min="0"
                        max="100"
                        step="0.1"
                        value={discountPct || ''}
                        onChange={(e) => setDiscountPct(Number(e.target.value || 0))}
                        placeholder="0"
                      />
                      <span className="input-suffix">%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Content - Pricing Breakdown (Pinned) */}
              <div className="order-totals">
                <div className="total-row">
                  <span>Items Subtotal:</span>
                  <span>{fmt(totals.itemsSum * 100)}</span>
                </div>
                {totals.lineDiscount > 0 && (
                  <div className="total-row discount">
                    <span>Item Discounts:</span>
                    <span>-{fmt(totals.lineDiscount * 100)}</span>
                  </div>
                )}
                {totals.deliveryFee > 0 && (
                  <div className="total-row">
                    <span>Delivery & Services:</span>
                    <span>{fmt(totals.deliveryFee)}</span>
                  </div>
                )}
                {totals.discount > 0 && (
                  <div className="total-row discount">
                    <span>Additional Discount ({discountPct}%):</span>
                    <span>-{fmt(totals.discount)}</span>
                  </div>
                )}
                <div className="total-row total">
                  <span><strong>Total Amount:</strong></span>
                  <span><strong>{fmt(totals.total)}</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Order Info & Payment */}
        <div className="payment-right-column">
          {/* Order Information */}
          <div className="form-card">
            <div className="form-card-header">
              <h3>Order Information</h3>
            </div>
            <div className="form-card-body">
              <div className="payment-info-grid">
                <div className="info-section">
                  <h4>Customer</h4>
                  <div className="info-content">
                    <div className="customer-name">{customer.name}</div>
                    <div className="customer-contact">{customer.phone}</div>
                    {customer.email && <div className="customer-contact">{customer.email}</div>}
                    <div className="delivery-address">
                      {customer.deliveryAddress?.street}<br/>
                      {customer.deliveryAddress?.city}, {customer.deliveryAddress?.state} {customer.deliveryAddress?.zip}
                    </div>
                  </div>
                </div>

                <div className="info-section">
                  <h4>Delivery</h4>
                  <div className="info-content">
                    <div className="delivery-date">{deliveryDetails.preferredDate || 'To be scheduled'}</div>
                    <div className="delivery-time">{deliveryDetails.timeSlot || 'Time TBD'}</div>
                    {(deliveryDetails.whiteGloveService || deliveryDetails.oldMattressRemoval || deliveryDetails.setupService) && (
                      <div className="delivery-services">
                        {deliveryDetails.whiteGloveService && <div>• White Glove Service</div>}
                        {deliveryDetails.oldMattressRemoval && <div>• Old Mattress Removal</div>}
                        {deliveryDetails.setupService && <div>• Basic Setup Service</div>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
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
            </div>
          </div>
        </div>
      </div>
    </WizardStepLayout>
  );
}
