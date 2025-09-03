import { useRef } from "react";
import { Link } from "react-router-dom";
import Header from "@/app/layout/Header";
import "./sale.css";

// Import our new hooks and components
import { 
  useSaleDraft, 
  useSaleTotals, 
  useSaleValidation, 
  useWizardNavigation
} from "./hooks";
import {
  addLineToCart,
  updateLineQuantity,
  removeLine,
  getEstimatedDeliveryDate
} from "./utils/saleUtils";
import { useToast, fmt } from "../../shared";
import { CATALOG } from "./catalog";

// Import wizard step components
import CustomerStep from "./components/wizard/CustomerStep";
import ProductsStep from "./components/wizard/ProductsStep";
import DeliveryStep from "./components/wizard/DeliveryStep";
import PaymentStep from "./components/wizard/PaymentStep";

export default function CreateSaleWizard() {
  // Initialize our custom hooks
  const {
    currentStep,
    customer,
    lines,
    nextId,
    deliveryDetails,
    deliveryFee,
    discountPct,
    paymentMethod,
    depositAmount,
    setCurrentStep,
    setCustomer,
    setLines,
    setNextId,
    setDeliveryDetails,
    setDeliveryFee,
    setDiscountPct,
    setPaymentMethod,
    setDepositAmount,
    clearDraft,
  } = useSaleDraft();

  // Calculate totals
  const totals = useSaleTotals(lines, deliveryDetails, deliveryFee, discountPct);

  // Validate all steps
  const validation = useSaleValidation(
    customer,
    lines,
    deliveryDetails,
    paymentMethod,
    depositAmount
  );

  // Handle wizard navigation
  const { nextStep, prevStep, canProceed } = useWizardNavigation(currentStep, setCurrentStep, validation);

  // Toast notifications
  const toast = useToast();

  // Refs
  const searchRef = useRef<HTMLInputElement | null>(null);

  // Product management functions
  const addLine = (sku: string | number) => {
    const result = addLineToCart(lines, sku, nextId);
    setLines(result.lines);
    setNextId(result.nextId);
  };

  const changeQty = (id: number, delta: number) => {
    setLines(updateLineQuantity(lines, id, delta));
  };

  const removeLineFromCart = (id: number) => {
    setLines(removeLine(lines, id));
  };

  // Order completion
  const completeOrder = () => {
    if (canProceed) {
      toast.success("Order submitted for processing!");
      // TODO: Submit to backend API
      // Simulate processing with delay before clearing draft
      setTimeout(() => {
        clearDraft();
        // TODO: Redirect to success page or orders list
      }, 2000);
    }
  };

  // Estimated delivery date
  const estimatedDelivery = getEstimatedDeliveryDate();

  // Helper function for step status in progress bar
  const getStepStatus = (step: string, current: string, isValid: boolean): string => {
    if (current === step) return 'active';
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
          <div className={`progress-step ${getStepStatus('customer', currentStep, validation.customer.isValid)}`}>
            <div className="step-icon">
              {validation.customer.isValid ? '✓' : '1'}
            </div>
            <div>
              <div className="step-label">Customer Details</div>
              <div className="step-detail">
                {validation.customer.isValid ? customer.name : 'Name & delivery address'}
              </div>
            </div>
          </div>

          <div className={`progress-step ${getStepStatus('products', currentStep, validation.products.isValid)}`}>
            <div className="step-icon">
              {validation.products.isValid ? '✓' : '2'}
            </div>
            <div>
              <div className="step-label">Product Selection</div>
              <div className="step-detail">
                {validation.products.isValid ? `${lines.length} item${lines.length !== 1 ? 's' : ''}` : 'Choose products'}
              </div>
            </div>
          </div>

          <div className={`progress-step ${getStepStatus('delivery', currentStep, validation.delivery.isValid)}`}>
            <div className="step-icon">
              {validation.delivery.isValid ? '✓' : '3'}
            </div>
            <div>
              <div className="step-label">Delivery Details</div>
              <div className="step-detail">
                {validation.delivery.isValid ? deliveryDetails.preferredDate : `Est. ${estimatedDelivery}`}
              </div>
            </div>
          </div>

          <div className={`progress-step ${getStepStatus('payment', currentStep, validation.payment.isValid)}`}>
            <div className="step-icon">
              {validation.payment.isValid ? '✓' : '💳'}
            </div>
            <div>
              <div className="step-label">Payment</div>
              <div className="step-detail">
                {validation.payment.isValid ? paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1) : 'Select payment method'}
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
              canProceed={validation.customer.isValid}
              errors={validation.customer.errors}
            />
          )}

          {currentStep === 'products' && (
            <ProductsStep
              lines={lines}
              catalog={CATALOG}
              onAddLine={addLine}
              onChangeQty={changeQty}
              onRemoveLine={removeLineFromCart}
              searchRef={searchRef}
              onNext={nextStep}
              onPrev={prevStep}
              canProceed={validation.products.isValid}
              subtotal={totals.subtotal}
              errors={validation.products.errors}
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
              canProceed={validation.delivery.isValid}
              errors={validation.delivery.errors}
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
              totals={totals}
              customer={customer}
              lines={lines}
              deliveryDetails={deliveryDetails}
              onPrev={prevStep}
              onComplete={completeOrder}
              canProceed={validation.payment.isValid}
              errors={validation.payment.errors}
            />
          )}
        </div>

        {/* Toast notifications */}
        <div className="toast-container">
          {toast.toasts.map((t) => (
            <div 
              key={t.id} 
              className={`toast toast-${t.type}`} 
              role="status" 
              aria-live="polite"
            >
              {t.message}
              <button 
                onClick={() => toast.removeToast(t.id)}
                className="toast-close"
                aria-label="Close notification"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
