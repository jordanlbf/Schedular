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
          <label className="form-label">Street Address *</label>
          <input
            className="form-input"
            placeholder="123 Main Street"
            value={address?.street || ""}
            onChange={(e) => onChange({ street: e.target.value })}
          />
        </div>

        <div className="form-grid-3">
          <div className="form-group">
            <label className="form-label">City *</label>
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
              {states.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.code || state.name}
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
              onChange={(e) => onChange({ zip: e.target.value })}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Delivery Notes</label>
          <textarea
            className="form-input form-textarea"
            rows={3}
            placeholder="Unit number, building access, special instructions..."
            value={address?.notes || ""}
            onChange={(e) => onChange({ notes: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
