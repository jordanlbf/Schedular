import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
// @ts-ignore
import Header from "@/app/layout/Header";
import "./sale.css";

import type { Customer, Line } from "./types";
import { CATALOG } from "./catalog";

import CustomerForm from "./components/CustomerForm";
import ProductPicker from "./components/ProductPicker";
import CartTable from "./components/CartTable";

const DRAFT_KEY = "schedular.saleWizardDraft.v1";

type WizardStep = 'customer' | 'products' | 'delivery' | 'payment';

// Extended types for wizard (can move to types.ts later)
type Address = {
  street: string;
  city: string;
  state: string;
  zip: string;
  notes?: string;
};

type ExtendedCustomer = Customer & {
  deliveryAddress?: Address;
  billingAddress?: Address;
  sameAsDelivery?: boolean;
};

type DeliveryDetails = {
  preferredDate: string;
  timeSlot: string;
  specialInstructions: string;
  whiteGloveService: boolean;
  oldMattressRemoval: boolean;
  setupService: boolean;
};

// Import your existing money formatter
import { fmt } from "@/shared/utils/money";

export default function CreateSaleWizard() {
  // Wizard state
  const [currentStep, setCurrentStep] = useState<WizardStep>('customer');

  // Customer (with expanded address support)
  const [customer, setCustomer] = useState<ExtendedCustomer>({
    name: "",
    phone: "",
    email: "",
    deliveryAddress: { street: "", city: "", state: "", zip: "", notes: "" },
    billingAddress: { street: "", city: "", state: "", zip: "" },
    sameAsDelivery: true
  });

  // Products & Cart
  const [lines, setLines] = useState<Line[]>([]);
  const [nextId, setNextId] = useState(1);

  // Delivery details
  const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>({
    preferredDate: "",
    timeSlot: "",
    specialInstructions: "",
    whiteGloveService: false,
    oldMattressRemoval: false,
    setupService: false
  });

  // Pricing
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [discountPct, setDiscountPct] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'financing' | ''>('');
  const [depositAmount, setDepositAmount] = useState(0);

  // Refs
  const searchRef = useRef<HTMLInputElement | null>(null);

  // Derived totals
  const subtotal = useMemo(() => lines.reduce((sum, l) => sum + l.qty * l.price, 0), [lines]);
  const serviceCharges = useMemo(() => {
    let charges = 0;
    if (deliveryDetails.whiteGloveService) charges += 15000; // $150
    if (deliveryDetails.oldMattressRemoval) charges += 5000; // $50
    if (deliveryDetails.setupService) charges += 7500; // $75
    return charges;
  }, [deliveryDetails]);
  const discount = useMemo(() => Math.round(subtotal * (discountPct / 100)), [subtotal, discountPct]);
  const taxBase = useMemo(() => Math.max(0, subtotal - discount + deliveryFee + serviceCharges), [subtotal, discount, deliveryFee, serviceCharges]);
  const tax = useMemo(() => Math.round(taxBase * 0.10), [taxBase]);
  const total = useMemo(() => taxBase + tax, [taxBase, tax]);

  // Validation for each step
  const customerValid = useMemo(() => {
    return customer.name.trim().length > 0 &&
           customer.phone.trim().length > 0 &&
           customer.deliveryAddress?.street.trim().length > 0 &&
           customer.deliveryAddress?.city.trim().length > 0;
  }, [customer]);

  const productsValid = useMemo(() => lines.length > 0, [lines]);

  const deliveryValid = useMemo(() => {
    return deliveryDetails.preferredDate.length > 0 &&
           deliveryDetails.timeSlot.length > 0;
  }, [deliveryDetails]);

  const paymentValid = useMemo(() => {
    return paymentMethod.length > 0 &&
           (paymentMethod !== 'financing' || depositAmount > 0);
  }, [paymentMethod, depositAmount]);

  // Step navigation
  const nextStep = () => {
    if (currentStep === 'customer' && customerValid) setCurrentStep('products');
    else if (currentStep === 'products' && productsValid) setCurrentStep('delivery');
    else if (currentStep === 'delivery' && deliveryValid) setCurrentStep('payment');
  };

  const prevStep = () => {
    if (currentStep === 'products') setCurrentStep('customer');
    else if (currentStep === 'delivery') setCurrentStep('products');
    else if (currentStep === 'payment') setCurrentStep('delivery');
  };

  // Auto-save functionality
  const [dirty, setDirty] = useState(false);
  useEffect(() => {
    setDirty(true);
    const t = setTimeout(() => {
      persistDraft();
      setDirty(false);
    }, 1000);
    return () => clearTimeout(t);
  }, [customer, lines, deliveryDetails, deliveryFee, discountPct, paymentMethod, depositAmount]);

  const persistDraft = () => {
    const draft = {
      customer, lines, nextId, deliveryDetails, deliveryFee, discountPct,
      paymentMethod, depositAmount, currentStep, savedAt: Date.now()
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  };

  // Restore draft
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (d.customer) setCustomer(d.customer);
        if (Array.isArray(d.lines)) setLines(d.lines);
        if (typeof d.nextId === "number") setNextId(d.nextId);
        if (d.deliveryDetails) setDeliveryDetails(d.deliveryDetails);
        if (typeof d.deliveryFee === "number") setDeliveryFee(d.deliveryFee);
        if (typeof d.discountPct === "number") setDiscountPct(d.discountPct);
        if (d.paymentMethod) setPaymentMethod(d.paymentMethod);
        if (typeof d.depositAmount === "number") setDepositAmount(d.depositAmount);
        if (d.currentStep) setCurrentStep(d.currentStep);
      }
    } catch {}
  }, []);

  // Product functions
  function addLine(sku: string | number) {
    const item = CATALOG.find(x => x.sku === sku);
    if (!item) return;
    setLines(prev => {
      const idx = prev.findIndex(l => l.sku === String(item.sku));
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 };
        return copy;
      }
      return [...prev, { id: nextId, sku: String(item.sku), name: item.name, qty: 1, price: item.price }];
    });
    setNextId(n => n + 1);
  }

  function changeQty(id: number, delta: number) {
    setLines(prev => prev.map(l => l.id === id ? { ...l, qty: Math.max(1, l.qty + delta) } : l));
  }

  function removeLine(id: number) {
    setLines(prev => prev.filter(l => l.id !== id));
  }

  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  function completeOrder() {
    if (paymentValid) {
      showToast("Order submitted for processing!");
      // Here you'd submit to your backend
    }
  }

  // Get estimated delivery date (14 days from order for custom mattresses)
  const estimatedDelivery = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.toLocaleDateString();
  }, []);

  // Helper function for step status
  const getStepStatus = (step: WizardStep, currentStep: WizardStep, isValid: boolean): string => {
    if (currentStep === step) return 'active';
    if (isValid) return 'completed';
    return 'pending';
  };

  return (
    <>
      <Header right={null} />
      <main className="wizard-container">
        <nav className="breadcrumbs" aria-label="breadcrumbs">
          <Link to="/">Front Desk</Link> <span>/</span> <span>Sales</span> <span>/</span> <strong>Create Sale</strong>
        </nav>

        <div className="wizard-header">
          <h1>Create Sale</h1>
          <div className="header-actions">
            <Link to="/" className="link-back">Back to Front Desk</Link>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar">
          <div className={`progress-step ${getStepStatus('customer', currentStep, customerValid)}`}>
            <div className="step-icon">
              {customerValid ? '✓' : '1'}
            </div>
            <div>
              <div className="step-label">Customer Details</div>
              <div className="step-detail">
                {customerValid ? customer.name : 'Name & delivery address'}
              </div>
            </div>
          </div>

          <div className={`progress-step ${getStepStatus('products', currentStep, productsValid)}`}>
            <div className="step-icon">
              {productsValid ? '✓' : '2'}
            </div>
            <div>
              <div className="step-label">Product Selection</div>
              <div className="step-detail">
                {productsValid ? `${lines.length} item${lines.length !== 1 ? 's' : ''}` : 'Choose products'}
              </div>
            </div>
          </div>

          <div className={`progress-step ${getStepStatus('delivery', currentStep, deliveryValid)}`}>
            <div className="step-icon">
              {deliveryValid ? '✓' : '3'}
            </div>
            <div>
              <div className="step-label">Delivery Details</div>
              <div className="step-detail">
                {deliveryValid ? deliveryDetails.preferredDate : `Est. ${estimatedDelivery}`}
              </div>
            </div>
          </div>

          <div className={`progress-step ${getStepStatus('payment', currentStep, paymentValid)}`}>
            <div className="step-icon">
              {paymentValid ? '✓' : '💳'}
            </div>
            <div>
              <div className="step-label">Payment</div>
              <div className="step-detail">
                {paymentValid ? paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1) : fmt(total)}
              </div>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="wizard-content">
          {currentStep === 'customer' && (
            <CustomerStep
              customer={customer}
              setCustomer={setCustomer}
              onNext={nextStep}
              canProceed={customerValid}
            />
          )}

          {currentStep === 'products' && (
            <ProductsStep
              lines={lines}
              catalog={CATALOG}
              onAddLine={addLine}
              onChangeQty={changeQty}
              onRemoveLine={removeLine}
              searchRef={searchRef}
              onNext={nextStep}
              onPrev={prevStep}
              canProceed={productsValid}
              subtotal={subtotal}
            />
          )}

          {currentStep === 'delivery' && (
            <DeliveryStep
              deliveryDetails={deliveryDetails}
              setDeliveryDetails={setDeliveryDetails}
              deliveryFee={deliveryFee}
              setDeliveryFee={setDeliveryFee}
              estimatedDelivery={estimatedDelivery}
              onNext={nextStep}
              onPrev={prevStep}
              canProceed={deliveryValid}
            />
          )}

          {currentStep === 'payment' && (
            <PaymentStep
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              depositAmount={depositAmount}
              setDepositAmount={setDepositAmount}
              discountPct={discountPct}
              setDiscountPct={setDiscountPct}
              totals={{ subtotal, discount, tax, total, serviceCharges, deliveryFee }}
              customer={customer}
              lines={lines}
              deliveryDetails={deliveryDetails}
              onPrev={prevStep}
              onComplete={completeOrder}
              canProceed={paymentValid}
            />
          )}
        </div>

        {toast && <div className="toast" role="status" aria-live="polite">{toast}</div>}
      </main>
    </>
  );
}

// Step Components

function CustomerStep({ customer, setCustomer, onNext, canProceed }: {
  customer: ExtendedCustomer;
  setCustomer: (customer: ExtendedCustomer) => void;
  onNext: () => void;
  canProceed: boolean;
}) {
  const updateDeliveryAddress = (updates: Partial<Address>) => {
    const current = customer.deliveryAddress || { street: "", city: "", state: "", zip: "", notes: "" };
    setCustomer({
      ...customer,
      deliveryAddress: { ...current, ...updates }
    });
  };

  const australianStates = [
    { code: "", name: "Select State" },
    { code: "NSW", name: "New South Wales" },
    { code: "VIC", name: "Victoria" },
    { code: "QLD", name: "Queensland" },
    { code: "WA", name: "Western Australia" },
    { code: "SA", name: "South Australia" },
    { code: "TAS", name: "Tasmania" },
    { code: "ACT", name: "Australian Capital Territory" },
    { code: "NT", name: "Northern Territory" },
  ];

  return (
    <div className="wizard-step">
      <div className="step-content">
        <div className="step-main">
          {/* Page title outside the form sections */}
          <div className="wizard-page-header">
            <h2>Customer Information</h2>
            <p>Enter customer details for order processing and delivery.</p>
          </div>

          {/* Customer Details Card */}
          <div className="form-card">
            <div className="form-card-header">
              <h3>Contact Details</h3>
            </div>
            <div className="form-card-body">
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Name *</label>
                  <input
                    className="form-input"
                    placeholder="Full name"
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone *</label>
                  <input
                    className="form-input"
                    placeholder="0412 345 678"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    inputMode="tel"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  className="form-input"
                  placeholder="name@example.com"
                  type="email"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  inputMode="email"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address Card */}
          <div className="form-card">
            <div className="form-card-header">
              <h3>Delivery Address *</h3>
            </div>
            <div className="form-card-body">
              <div className="form-group">
                <label className="form-label">Street Address</label>
                <input
                  className="form-input"
                  placeholder="123 Main Street"
                  value={customer.deliveryAddress?.street || ""}
                  onChange={(e) => updateDeliveryAddress({ street: e.target.value })}
                />
              </div>

              <div className="form-grid-3">
                <div className="form-group form-group-2">
                  <label className="form-label">City</label>
                  <input
                    className="form-input"
                    placeholder="Brisbane"
                    value={customer.deliveryAddress?.city || ""}
                    onChange={(e) => updateDeliveryAddress({ city: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">State</label>
                  <select
                    className="form-input"
                    value={customer.deliveryAddress?.state || ""}
                    onChange={(e) => updateDeliveryAddress({ state: e.target.value })}
                  >
                    {australianStates.map((state) => (
                      <option key={state.code} value={state.code}>
                        {state.code || state.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Postcode</label>
                  <input
                    className="form-input"
                    placeholder="4000"
                    maxLength={4}
                    value={customer.deliveryAddress?.zip || ""}
                    onChange={(e) => updateDeliveryAddress({ zip: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Delivery Notes</label>
                <textarea
                  className="form-input form-textarea"
                  rows={3}
                  placeholder="Unit number, building access, special instructions..."
                  value={customer.deliveryAddress?.notes || ""}
                  onChange={(e) => updateDeliveryAddress({ notes: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="step-actions">
          <div></div>
          <button
            className="btn btn-primary"
            onClick={onNext}
            disabled={!canProceed}
          >
            Continue to Products →
          </button>
          {!canProceed && (
            <div className="step-help">
              Please complete all required fields (marked with *)
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductsStep({ lines, catalog, onAddLine, onChangeQty, onRemoveLine, searchRef, onNext, onPrev, canProceed, subtotal }: any) {
  return (
    <div className="wizard-step">
      <div className="step-content">
        <div className="step-main">
          <div className="products-section">
            <h3>Add Products</h3>
            <p className="section-help">Search and select items for this order. For custom sizes or specifications, add the base product and include details in delivery notes.</p>
            <ProductPicker
              catalog={catalog}
              onAdd={onAddLine}
              inputRef={searchRef}
            />
          </div>

          {lines.length > 0 && (
            <div className="cart-section">
              <h3>Selected Items ({lines.length})</h3>
              <CartTable lines={lines} onChangeQty={onChangeQty} onRemove={onRemoveLine} />
              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>{fmt(subtotal)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="step-actions">
          <button className="btn btn-soft" onClick={onPrev}>
            ← Back to Customer
          </button>
          <button
            className="btn btn-primary"
            onClick={onNext}
            disabled={!canProceed}
          >
            Continue to Delivery →
          </button>
          {!canProceed && (
            <div className="step-help">
              Please add at least one product to continue
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DeliveryStep({ deliveryDetails, setDeliveryDetails, deliveryFee, setDeliveryFee, estimatedDelivery, onNext, onPrev, canProceed }: any) {
  // Get minimum delivery date (7 days from now)
  const minDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
  }, []);

  return (
    <div className="wizard-step">
      <div className="step-content">
        <div className="step-main">
          <div className="delivery-form">
            <h3>Delivery Schedule</h3>
            <p className="section-help">Manufacturing time is typically 10-14 business days. Estimated delivery: <strong>{estimatedDelivery}</strong></p>

            <div className="field-row">
              <label className="field">
                <span className="label">Preferred Delivery Date *</span>
                <input
                  type="date"
                  className="input"
                  value={deliveryDetails.preferredDate}
                  onChange={(e) => setDeliveryDetails({...deliveryDetails, preferredDate: e.target.value})}
                  min={minDate}
                />
              </label>

              <label className="field">
                <span className="label">Time Slot *</span>
                <select
                  className="input"
                  value={deliveryDetails.timeSlot}
                  onChange={(e) => setDeliveryDetails({...deliveryDetails, timeSlot: e.target.value})}
                >
                  <option value="">Select time slot</option>
                  <option value="morning">Morning (8am-12pm)</option>
                  <option value="afternoon">Afternoon (12pm-5pm)</option>
                  <option value="evening">Evening (5pm-8pm)</option>
                </select>
              </label>
            </div>

            <h3>Additional Services</h3>

            <div className="service-options">
              <label className="service-option">
                <input
                  type="checkbox"
                  checked={deliveryDetails.whiteGloveService}
                  onChange={(e) => setDeliveryDetails({...deliveryDetails, whiteGloveService: e.target.checked})}
                />
                <div className="service-details">
                  <div className="service-name">White Glove Service</div>
                  <div className="service-description">Full setup, packaging removal, and room placement</div>
                  <div className="service-price">+$150</div>
                </div>
              </label>

              <label className="service-option">
                <input
                  type="checkbox"
                  checked={deliveryDetails.oldMattressRemoval}
                  onChange={(e) => setDeliveryDetails({...deliveryDetails, oldMattressRemoval: e.target.checked})}
                />
                <div className="service-details">
                  <div className="service-name">Old Mattress Removal</div>
                  <div className="service-description">We'll haul away your old mattress</div>
                  <div className="service-price">+$50</div>
                </div>
              </label>

              <label className="service-option">
                <input
                  type="checkbox"
                  checked={deliveryDetails.setupService}
                  onChange={(e) => setDeliveryDetails({...deliveryDetails, setupService: e.target.checked})}
                />
                <div className="service-details">
                  <div className="service-name">Basic Setup Service</div>
                  <div className="service-description">Unpack and position in room</div>
                  <div className="service-price">+$75</div>
                </div>
              </label>
            </div>

            <label className="field">
              <span className="label">Special Instructions</span>
              <textarea
                className="input"
                rows={3}
                value={deliveryDetails.specialInstructions}
                onChange={(e) => setDeliveryDetails({...deliveryDetails, specialInstructions: e.target.value})}
                placeholder="Custom dimensions, firmness preferences, stairs, narrow hallways, gate codes, etc."
              />
            </label>

            <label className="field">
              <span className="label">Delivery Fee</span>
              <input
                type="number"
                className="input"
                min="0"
                step="0.01"
                value={(deliveryFee/100).toFixed(2)}
                onChange={(e) => setDeliveryFee(Math.round(parseFloat(e.target.value || '0') * 100))}
                placeholder="0.00"
              />
            </label>
          </div>
        </div>
        <div className="step-actions">
          <button className="btn btn-soft" onClick={onPrev}>
            ← Back to Products
          </button>
          <button
            className="btn btn-primary"
            onClick={onNext}
            disabled={!canProceed}
          >
            Continue to Payment →
          </button>
          {!canProceed && (
            <div className="step-help">
              Please select a delivery date and time slot
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PaymentStep({ paymentMethod, setPaymentMethod, depositAmount, setDepositAmount, discountPct, setDiscountPct, totals, customer, lines, deliveryDetails, onPrev, onComplete, canProceed }: any) {
  return (
    <div className="wizard-step">
      <div className="step-content">
        <div className="step-main">
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
                {lines.map((line: any) => (
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
              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                />
                <div className="payment-details">
                  <div className="payment-name">Cash</div>
                  <div className="payment-description">Full payment today</div>
                </div>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                />
                <div className="payment-details">
                  <div className="payment-name">Credit/Debit Card</div>
                  <div className="payment-description">Full payment today</div>
                </div>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value="financing"
                  checked={paymentMethod === 'financing'}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                />
                <div className="payment-details">
                  <div className="payment-name">Financing</div>
                  <div className="payment-description">Deposit today, balance on delivery</div>
                </div>
              </label>
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