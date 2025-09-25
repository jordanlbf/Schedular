import { useState, useMemo } from 'react';
import type { Customer, SecondPerson } from '@/shared/types';
import { FormField } from '@/shared/ui/FormField.tsx';
import { formatPhone } from '../../../utils/validation';

interface ContactDetailsFormProps {
  customer: Customer;
  onChange: (customer: Customer) => void;
  fieldErrors?: { [key: string]: string };
}

export function ContactDetailsForm({ customer, onChange, fieldErrors = {} }: ContactDetailsFormProps) {
  const [isSecondPersonExpanded, setIsSecondPersonExpanded] = useState(!!customer.secondPerson);
  const [hasFocus, setHasFocus] = useState(false);

  // Check if all required fields are completed
  const isComplete = useMemo(() => {
    return !!(customer.firstName?.trim() && customer.lastName?.trim() && customer.phone?.trim());
  }, [customer.firstName, customer.lastName, customer.phone]);

  // Compute full name for backwards compatibility
  const updateCustomer = (updates: Partial<Customer>) => {
    const newCustomer = { ...customer, ...updates };
    // Auto-compute full name
    newCustomer.name = `${newCustomer.firstName || ''} ${newCustomer.lastName || ''}`.trim();
    onChange(newCustomer);
  };

  const updateSecondPerson = (updates: Partial<SecondPerson>) => {
    const currentSecondPerson = customer.secondPerson || {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      relationship: ''
    };
    updateCustomer({
      secondPerson: { ...currentSecondPerson, ...updates }
    });
  };

  const clearSecondPerson = () => {
    updateCustomer({ secondPerson: undefined });
  };

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
        <h3>Contact Details</h3>
      </div>
      <div className="form-card-body">
        <div className="form-grid-2">
          <FormField
            label="First Name"
            required
            error={fieldErrors.firstName}
          >
            <input
              className={`form-input ${fieldErrors.firstName ? 'error' : ''}`}
              placeholder="John"
              value={customer.firstName || ''}
              onChange={(e) => updateCustomer({ firstName: e.target.value })}
            />
          </FormField>

          <FormField
            label="Last Name"
            required
            error={fieldErrors.lastName}
          >
            <input
              className={`form-input ${fieldErrors.lastName ? 'error' : ''}`}
              placeholder="Smith"
              value={customer.lastName || ''}
              onChange={(e) => updateCustomer({ lastName: e.target.value })}
            />
          </FormField>
        </div>

        <div className="form-grid-2">
          <FormField
            label="Primary Phone"
            required
            error={fieldErrors.phone}
          >
            <input
              className={`form-input ${fieldErrors.phone ? 'error' : ''}`}
              placeholder="0412 345 678"
              value={customer.phone}
              onChange={(e) => updateCustomer({ phone: formatPhone(e.target.value) })}
              inputMode="tel"
              maxLength={12}
            />
          </FormField>

          <div className="form-group">
            <label className="form-label">Additional Phone</label>
            <input
              className="form-input"
              placeholder="0412 345 678 (optional)"
              value={customer.additionalPhone || ''}
              onChange={(e) => updateCustomer({ additionalPhone: formatPhone(e.target.value) })}
              inputMode="tel"
              maxLength={12}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            className="form-input"
            placeholder="john.smith@example.com"
            type="email"
            value={customer.email}
            onChange={(e) => updateCustomer({ email: e.target.value })}
            inputMode="email"
          />
        </div>

        {/* Optional Second Person Section */}
        <div className="second-person-section">
          <button
            type="button"
            className="add-second-person-btn"
            onClick={() => setIsSecondPersonExpanded(!isSecondPersonExpanded)}
            aria-expanded={isSecondPersonExpanded}
          >
            <div className="add-person-content">
              <span className="add-person-icon">{isSecondPersonExpanded ? '−' : '+'}</span>
              <span className="add-person-text">
                {isSecondPersonExpanded ? 'Hide Second Contact' : 'Add Second Contact'}
              </span>
              <span className="optional-badge">Optional</span>
            </div>
            {customer.secondPerson && (
              <button
                type="button"
                className="btn-link btn-sm remove-person-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  clearSecondPerson();
                  setIsSecondPersonExpanded(false);
                }}
                title="Remove second person"
              >
                ✕
              </button>
            )}
          </button>
          
          <div className={`form-section-content ${isSecondPersonExpanded ? 'expanded' : ''}`}>
            <div className="form-grid-2">
              <FormField label="First Name">
                <input
                  className="form-input"
                  placeholder="Jane"
                  value={customer.secondPerson?.firstName || ''}
                  onChange={(e) => updateSecondPerson({ firstName: e.target.value })}
                />
              </FormField>

              <FormField label="Last Name">
                <input
                  className="form-input"
                  placeholder="Smith"
                  value={customer.secondPerson?.lastName || ''}
                  onChange={(e) => updateSecondPerson({ lastName: e.target.value })}
                />
              </FormField>
            </div>


            <div className="form-grid-2">
              <FormField label="Phone">
                <input
                  className="form-input"
                  placeholder="0412 345 678 (optional)"
                  value={customer.secondPerson?.phone || ''}
                  onChange={(e) => updateSecondPerson({ phone: formatPhone(e.target.value) })}
                  inputMode="tel"
                  maxLength={12}
                />
              </FormField>

              <FormField label="Email">
                <input
                  className="form-input"
                  placeholder="jane.smith@example.com (optional)"
                  type="email"
                  value={customer.secondPerson?.email || ''}
                  onChange={(e) => updateSecondPerson({ email: e.target.value })}
                  inputMode="email"
                />
              </FormField>
            </div>
          </div>
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
