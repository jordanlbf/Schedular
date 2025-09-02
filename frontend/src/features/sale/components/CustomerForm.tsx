import type { Customer } from "../types";

export default function CustomerForm({
  value,
  onChange,
}: {
  value: Customer;
  onChange: (next: Customer) => void;
}) {
  return (
    <section className="panel">
      <h2 className="panel-title">Customer</h2>
      <div className="form-row">
        <label className="field">
          <span className="label">Name</span>
          <input
            className="input"
            value={value.name}
            onChange={(e) => onChange({ ...value, name: e.target.value })}
            placeholder="Full name"
          />
        </label>
        <label className="field">
          <span className="label">Phone</span>
          <input
            className="input"
            value={value.phone}
            onChange={(e) => onChange({ ...value, phone: e.target.value })}
            placeholder="e.g. 555-1234"
          />
        </label>
        <label className="field">
          <span className="label">Email</span>
          <input
            className="input"
            value={value.email}
            onChange={(e) => onChange({ ...value, email: e.target.value })}
            placeholder="name@example.com"
          />
        </label>
      </div>
    </section>
  );
}
