import React from "react";

export type Customer = {
  name: string;
  phone: string;
  email: string;
};

type Props = {
  value: Customer;
  onChange: (next: Customer) => void;
  /** When false, render only fields (no inner panel/title). */
  framed?: boolean;
  /** Optional title when framed */
  title?: string;
};

export default function CustomerForm({
  value,
  onChange,
  framed = true,
  title = "Customer",
}: Props) {
  const fields = (
    <div className="form-vertical">
      <label className="label">
        <div className="label-title">Name</div>
        <input
          className="input"
          placeholder="Full name"
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
        />
      </label>

      <label className="label">
        <div className="label-title">Phone</div>
        <input
          className="input"
          placeholder="e.g. 555-1234"
          value={value.phone}
          onChange={(e) => onChange({ ...value, phone: e.target.value })}
        />
      </label>

      <label className="label">
        <div className="label-title">Email</div>
        <input
          className="input"
          placeholder="name@example.com"
          value={value.email}
          onChange={(e) => onChange({ ...value, email: e.target.value })}
        />
      </label>
    </div>
  );

  if (!framed) return fields;

  // Existing framed look (kept for compatibility)
  return (
    <div className="panel">
      <div className="panel-head">
        <h3 className="panel-title">{title}</h3>
      </div>
      <div className="panel-body">{fields}</div>
    </div>
  );
}
