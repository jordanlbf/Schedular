import type { Customer } from '@/shared/types';
import { FormField } from '@/shared/ui/FormField';
import { formatPhone, isValidEmail, isValidPhone } from '../utils/customerUtils';
import { Card } from '@/shared/components';
import { useContactDetailsForm } from '../hooks/useContactDetailsForm';

interface ContactDetailsFormProps {
  customer: Customer;
  onChange: (customer: Customer) => void;
  fieldErrors?: { [key: string]: string };
}

export function ContactDetailsForm({ customer, onChange, fieldErrors = {} }: ContactDetailsFormProps) {
  const {
    isSecondPersonExpanded,
    hasFocus,
    isComplete,
    updateCustomer,
    updateSecondPerson,
    toggleSecondPersonExpanded,
    handleSecondPersonRemove,
    handleFocusEnter,
    handleFocusLeave,
  } = useContactDetailsForm({ customer, onChange });

  return (
    <Card
      title="Contact Details"
      className={`${isComplete && !hasFocus ? 'complete' : ''}`}
      onFocusCapture={handleFocusEnter}
      onBlurCapture={handleFocusLeave}
    >
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
            error={fieldErrors.phone || (customer.phone && !isValidPhone(customer.phone) ? 'Please enter a valid Australian phone number' : '')}
          >
            <input
              className={`form-input ${(fieldErrors.phone || (customer.phone && !isValidPhone(customer.phone))) ? 'error' : ''}`}
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

        <FormField
          label="Email Address"
          error={customer.email && !isValidEmail(customer.email) ? 'Please enter a valid email address' : ''}
        >
          <input
            className={`form-input ${(customer.email && !isValidEmail(customer.email)) ? 'error' : ''}`}
            placeholder="john.smith@example.com"
            type="email"
            value={customer.email}
            onChange={(e) => updateCustomer({ email: e.target.value })}
            inputMode="email"
          />
        </FormField>

        {/* Optional Second Person Section */}
        <div className="second-person-section">
          <button
            type="button"
            className="add-second-person-btn"
            onClick={toggleSecondPersonExpanded}
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
                  handleSecondPersonRemove();
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
    </Card>
  );
}
