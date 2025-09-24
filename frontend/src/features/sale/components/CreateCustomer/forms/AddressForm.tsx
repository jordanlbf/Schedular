import { useState, useMemo } from 'react';
import type { Address } from '@/shared/types';
import { FormField } from '@/shared/ui/FormField.tsx';

interface AddressFormProps {
  address?: Address;
  onChange: (updates: Partial<Address>) => void;
  states: { code: string; name: string }[];
  fieldErrors?: { [key: string]: string };
}

export function AddressForm({ address, onChange, states, fieldErrors = {} }: AddressFormProps) {
  const [hasFocus, setHasFocus] = useState(false);

  // Check if all required fields are completed
  const isComplete = useMemo(() => {
    return !!(address?.street?.trim() && address?.city?.trim() && address?.state?.trim() && address?.zip?.trim());
  }, [address?.street, address?.city, address?.state, address?.zip]);

  return (
    <div 
      className={`form-card ${isComplete && !hasFocus ? 'complete' : ''}`}
      onFocusCapture={() => setHasFocus(true)}
      onBlurCapture={(e) => {
        // Only set hasFocus to false if focus is leaving the entire form card
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setHasFocus(false);
        }
      }}
    >
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

        <FormField
          label="Street Address"
          required
          error={fieldErrors.street}
        >
          <input
            className={`form-input ${fieldErrors.street ? 'error' : ''}`}
            placeholder="123 Main Street"
            value={address?.street || ""}
            onChange={(e) => onChange({ street: e.target.value })}
          />
        </FormField>

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
          <FormField
            label="City / Suburb"
            required
            error={fieldErrors.city}
          >
            <input
              className={`form-input ${fieldErrors.city ? 'error' : ''}`}
              placeholder="Brisbane"
              value={address?.city || ""}
              onChange={(e) => onChange({ city: e.target.value })}
            />
          </FormField>

          <FormField
            label="State"
            required
            error={fieldErrors.state}
          >
            <select
              className={`form-input ${fieldErrors.state ? 'error' : ''}`}
              value={address?.state || ""}
              onChange={(e) => onChange({ state: e.target.value })}
              required
              data-placeholder="Select state..."
            >
              <option value="">Select state...</option>
              {states.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.code}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            label="Postcode"
            required
            error={fieldErrors.zip}
          >
            <input
              className={`form-input ${fieldErrors.zip ? 'error' : ''}`}
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
          </FormField>
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
        {isComplete && !hasFocus && (
          <div className="completion-indicator">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path 
                d="M20 6L9 17L4 12" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            <span>Complete</span>
          </div>
        )}
      </div>
    </div>
  );
}
