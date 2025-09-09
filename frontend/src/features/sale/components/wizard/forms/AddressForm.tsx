import type { Address } from '@/shared/types';

interface AddressFormProps {
  address?: Address;
  onChange: (updates: Partial<Address>) => void;
  states: { code: string; name: string }[];
}

export function AddressForm({ address, onChange, states }: AddressFormProps) {
  return (
    <div className="form-card">
      <div className="form-card-header">
        <h3>Delivery Address</h3>
      </div>
      <div className="form-card-body">
        <div className="form-group">
          <label className="form-label form-label-optional">Unit / Apartment / Suite</label>
          <input
            className="form-input"
            placeholder="Unit 5, Apartment 2B, Suite 100 (optional)"
            value={address?.unit || ""}
            onChange={(e) => onChange({ unit: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Street Address *</label>
          <input
            className="form-input"
            placeholder="123 Main Street"
            value={address?.street || ""}
            onChange={(e) => onChange({ street: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label form-label-optional">Street Address Line 2</label>
          <input
            className="form-input"
            placeholder="Building name, complex, landmark (optional)"
            value={address?.street2 || ""}
            onChange={(e) => onChange({ street2: e.target.value })}
          />
        </div>

        <div className="form-grid-3">
          <div className="form-group">
            <label className="form-label">City / Suburb *</label>
            <input
              className="form-input"
              placeholder="Brisbane"
              value={address?.city || ""}
              onChange={(e) => onChange({ city: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">State *</label>
            <select
              className="form-input"
              value={address?.state || ""}
              onChange={(e) => onChange({ state: e.target.value })}
            >
              <option value="">Select state...</option>
              {states.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.code}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Postcode *</label>
            <input
              className="form-input"
              placeholder="4000"
              maxLength={4}
              value={address?.zip || ""}
              onChange={(e) => {
                // Only allow numbers
                const value = e.target.value.replace(/\D/g, '');
                onChange({ zip: value });
              }}
              inputMode="numeric"
            />
          </div>
        </div>

        <div className="form-group" style={{ marginTop: 'var(--spacing-xl)' }}>
          <label className="form-label">Delivery Instructions</label>
          <textarea
            className="form-input form-textarea"
            rows={3}
            placeholder="Gate codes, building access, where to leave package, special instructions..."
            value={address?.notes || ""}
            onChange={(e) => onChange({ notes: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
