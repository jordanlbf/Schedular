import { useState } from 'react';
import type { Customer, SecondPerson } from '@/shared/types';

interface ContactDetailsFormProps {
  customer: Customer;
  onChange: (customer: Customer) => void;
}

export function ContactDetailsForm({ customer, onChange }: ContactDetailsFormProps) {
  const [isSecondPersonExpanded, setIsSecondPersonExpanded] = useState(!!customer.secondPerson);
  
  const formatPhone = (value: string) => {
    let formatted = value.replace(/\D/g, '');
    if (formatted.length > 0) {
      if (formatted.length <= 4) {
        return formatted;
      } else if (formatted.length <= 7) {
        return formatted.slice(0, 4) + ' ' + formatted.slice(4);
      } else {
        return formatted.slice(0, 4) + ' ' + formatted.slice(4, 7) + ' ' + formatted.slice(7, 10);
      }
    }
    return formatted;
  };

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
    <div className="form-card">
      <div className="form-card-header">
        <h3>Contact Details</h3>
      </div>
      <div className="form-card-body">
        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">First Name *</label>
            <input
              className="form-input"
              placeholder="John"
              value={customer.firstName || ''}
              onChange={(e) => updateCustomer({ firstName: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Last Name *</label>
            <input
              className="form-input"
              placeholder="Smith"
              value={customer.lastName || ''}
              onChange={(e) => updateCustomer({ lastName: e.target.value })}
            />
          </div>
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label className="form-label">Primary Phone *</label>
            <input
              className="form-input"
              placeholder="0412 345 678"
              value={customer.phone}
              onChange={(e) => updateCustomer({ phone: formatPhone(e.target.value) })}
              inputMode="tel"
              maxLength={12}
            />
          </div>

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
                {isSecondPersonExpanded ? 'Hide second contact' : 'Add second contact'}
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
            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  className="form-input"
                  placeholder="Jane"
                  value={customer.secondPerson?.firstName || ''}
                  onChange={(e) => updateSecondPerson({ firstName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  className="form-input"
                  placeholder="Smith"
                  value={customer.secondPerson?.lastName || ''}
                  onChange={(e) => updateSecondPerson({ lastName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Relationship</label>
                <select
                  className="form-input"
                  value={customer.secondPerson?.relationship || ''}
                  onChange={(e) => updateSecondPerson({ relationship: e.target.value })}
                >
                  <option value="">Select...</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Partner">Partner</option>
                  <option value="Roommate">Roommate</option>
                  <option value="Family Member">Family Member</option>
                  <option value="Friend">Friend</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  className="form-input"
                  placeholder="0412 345 678 (optional)"
                  value={customer.secondPerson?.phone || ''}
                  onChange={(e) => updateSecondPerson({ phone: formatPhone(e.target.value) })}
                  inputMode="tel"
                  maxLength={12}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  className="form-input"
                  placeholder="jane.smith@example.com (optional)"
                  type="email"
                  value={customer.secondPerson?.email || ''}
                  onChange={(e) => updateSecondPerson({ email: e.target.value })}
                  inputMode="email"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
