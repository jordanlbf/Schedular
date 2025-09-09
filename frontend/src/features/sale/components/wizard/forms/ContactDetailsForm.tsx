import type { Customer } from '@/shared/types';

interface ContactDetailsFormProps {
  customer: Customer;
  onChange: (customer: Customer) => void;
}

export function ContactDetailsForm({ customer, onChange }: ContactDetailsFormProps) {
  return (
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
              onChange={(e) => onChange({ ...customer, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone *</label>
            <input
              className="form-input"
              placeholder="0412 345 678"
              value={customer.phone}
              onChange={(e) => onChange({ ...customer, phone: e.target.value })}
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
            onChange={(e) => onChange({ ...customer, email: e.target.value })}
            inputMode="email"
          />
        </div>
      </div>
    </div>
  );
}
