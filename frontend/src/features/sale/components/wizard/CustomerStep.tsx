import type { Customer, Address } from '../../types';
import { AUSTRALIAN_STATES } from '../../../../shared/constants/geography';

interface CustomerStepProps {
  customer: Customer;
  setCustomer: (customer: Customer) => void;
  onNext: () => void;
  canProceed: boolean;
  errors?: string[];
}

export default function CustomerStep({ 
  customer, 
  setCustomer, 
  onNext, 
  canProceed,
  errors = []
}: CustomerStepProps) {
  const updateDeliveryAddress = (updates: Partial<Address>) => {
    const current = customer.deliveryAddress || { 
      street: "", 
      city: "", 
      state: "", 
      zip: "", 
      notes: "" 
    };
    setCustomer({
      ...customer,
      deliveryAddress: { ...current, ...updates }
    });
  };

  return (
    <div className="wizard-step">
      <div className="step-content">
        <div className="step-main">
          {/* Page title outside the form sections */}
          <div className="wizard-page-header">
            <h2>Customer Information</h2>
            <p>Enter customer details for order processing and delivery.</p>
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
                    {AUSTRALIAN_STATES.map((state) => (
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
