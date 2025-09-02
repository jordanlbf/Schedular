import React, { useMemo } from "react";

export type Customer = {
  name: string;
  phone: string;
  email: string;
  billingAddress?: Address;
  deliveryAddress?: Address;
  sameAsDelivery?: boolean;
};

export type Address = {
  street: string;
  city: string;
  state: string;
  zip: string;
  notes?: string;
};

type Props = {
  value: Customer;
  onChange: (next: Customer) => void;
  /** When false, render only fields (no inner panel/title). */
  framed?: boolean;
  /** Optional title when framed */
  title?: string;
  /** Show expanded fields for retail (addresses) */
  expanded?: boolean;
};

export default function CustomerForm({
  value,
  onChange,
  framed = true,
  title = "Customer",
  expanded = false
}: Props) {
  const emailOk = useMemo(() => !value.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email), [value.email]);
  const phoneOk = useMemo(() => !value.phone || /^[0-9+()\-\s]{6,}$/.test(value.phone), [value.phone]);
  const nameOk = useMemo(() => value.name.trim().length > 0, [value.name]);

  // For expanded mode, require delivery address
  const deliveryAddressOk = useMemo(() => {
    if (!expanded) return true;
    const addr = value.deliveryAddress;
    return addr && addr.street.trim().length > 0 && addr.city.trim().length > 0;
  }, [value.deliveryAddress, expanded]);

  const updateDeliveryAddress = (updates: Partial<Address>) => {
    const current = value.deliveryAddress || { street: "", city: "", state: "", zip: "", notes: "" };
    onChange({
      ...value,
      deliveryAddress: { ...current, ...updates }
    });
  };

  const updateBillingAddress = (updates: Partial<Address>) => {
    const current = value.billingAddress || { street: "", city: "", state: "", zip: "", notes: "" };
    onChange({
      ...value,
      billingAddress: { ...current, ...updates }
    });
  };

  const australianStates = [
    { code: "", name: "Select State" },
    { code: "NSW", name: "New South Wales" },
    { code: "VIC", name: "Victoria" },
    { code: "QLD", name: "Queensland" },
    { code: "WA", name: "Western Australia" },
    { code: "SA", name: "South Australia" },
    { code: "TAS", name: "Tasmania" },
    { code: "ACT", name: "Australian Capital Territory" },
    { code: "NT", name: "Northern Territory" },
  ];

  const fields = (
    <div className="fields">
      {expanded ? (
        // Enhanced wizard layout
        <div className="customer-form-grid">
          <div className="customer-form-left">
            <label className="field">
              <span className="label">Name *</span>
              <input
                className={["input", nameOk ? "" : "invalid"].join(" ")}
                placeholder="Full name"
                value={value.name}
                onChange={(e) => onChange({ ...value, name: e.target.value })}
                aria-invalid={!nameOk}
              />
              {!nameOk && <div className="help-error">Name is required</div>}
            </label>

            <label className="field">
              <span className="label">Phone *</span>
              <input
                className={["input", phoneOk ? "" : "invalid"].join(" ")}
                placeholder="e.g. 0412 345 678"
                value={value.phone}
                onChange={(e) => onChange({ ...value, phone: e.target.value })}
                aria-invalid={!phoneOk}
                inputMode="tel"
              />
              {!phoneOk && <div className="help-error">Enter a valid phone number</div>}
            </label>

            <label className="field">
              <span className="label">Email</span>
              <input
                className={["input", emailOk ? "" : "invalid"].join(" ")}
                placeholder="name@example.com"
                type="email"
                value={value.email}
                onChange={(e) => onChange({ ...value, email: e.target.value })}
                aria-invalid={!emailOk}
                inputMode="email"
              />
              {!emailOk && <div className="help-error">Enter a valid email</div>}
            </label>
          </div>

          <div className="customer-form-right">
            <h4>Delivery Address *</h4>

            <label className="field">
              <span className="label">Street Address</span>
              <input
                className={["input", deliveryAddressOk ? "" : "invalid"].join(" ")}
                placeholder="123 Main Street"
                value={value.deliveryAddress?.street || ""}
                onChange={(e) => updateDeliveryAddress({ street: e.target.value })}
              />
            </label>

            <div className="address-grid">
              <label className="field">
                <span className="label">City</span>
                <input
                  className="input"
                  placeholder="Brisbane"
                  value={value.deliveryAddress?.city || ""}
                  onChange={(e) => updateDeliveryAddress({ city: e.target.value })}
                />
              </label>

              <label className="field">
                <span className="label">State</span>
                <select
                  className="input"
                  value={value.deliveryAddress?.state || ""}
                  onChange={(e) => updateDeliveryAddress({ state: e.target.value })}
                >
                  {australianStates.map((state) => (
                    <option key={state.code} value={state.code}>
                      {state.code ? `${state.code}` : state.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span className="label">Postcode</span>
                <input
                  className="input"
                  placeholder="4000"
                  maxLength={4}
                  value={value.deliveryAddress?.zip || ""}
                  onChange={(e) => updateDeliveryAddress({ zip: e.target.value })}
                />
              </label>
            </div>

            <label className="field">
              <span className="label">Delivery Notes</span>
              <textarea
                className="input"
                rows={3}
                placeholder="Unit number, building access, special instructions..."
                value={value.deliveryAddress?.notes || ""}
                onChange={(e) => updateDeliveryAddress({ notes: e.target.value })}
              />
            </label>
          </div>
        </div>
      ) : (
        // Original compact layout
        <>
          <label className="field">
            <span className="label">Name *</span>
            <input
              className={["input", nameOk ? "" : "invalid"].join(" ")}
              placeholder="Full name"
              value={value.name}
              onChange={(e) => onChange({ ...value, name: e.target.value })}
              aria-invalid={!nameOk}
            />
            {!nameOk && <div className="help-error">Name is required</div>}
          </label>

          <div className="field-row">
            <label className="field">
              <span className="label">Phone *</span>
              <input
                className={["input", phoneOk ? "" : "invalid"].join(" ")}
                placeholder="e.g. 0412 345 678"
                value={value.phone}
                onChange={(e) => onChange({ ...value, phone: e.target.value })}
                aria-invalid={!phoneOk}
                inputMode="tel"
              />
              {!phoneOk && <div className="help-error">Enter a valid phone number</div>}
            </label>

            <label className="field">
              <span className="label">Email</span>
              <input
                className={["input", emailOk ? "" : "invalid"].join(" ")}
                placeholder="name@example.com"
                type="email"
                value={value.email}
                onChange={(e) => onChange({ ...value, email: e.target.value })}
                aria-invalid={!emailOk}
                inputMode="email"
              />
              {!emailOk && <div className="help-error">Enter a valid email</div>}
            </label>
          </div>

          {expanded && (
            <>
              <div className="section-divider">
                <h4>Delivery Address *</h4>
              </div>

              <label className="field">
                <span className="label">Street Address</span>
                <input
                  className={["input", deliveryAddressOk ? "" : "invalid"].join(" ")}
                  placeholder="123 Main Street"
                  value={value.deliveryAddress?.street || ""}
                  onChange={(e) => updateDeliveryAddress({ street: e.target.value })}
                />
              </label>

              <div className="field-row">
                <label className="field">
                  <span className="label">City</span>
                  <input
                    className="input"
                    placeholder="Brisbane"
                    value={value.deliveryAddress?.city || ""}
                    onChange={(e) => updateDeliveryAddress({ city: e.target.value })}
                  />
                </label>

                <label className="field field-small">
                  <span className="label">State</span>
                  <select
                    className="input"
                    value={value.deliveryAddress?.state || ""}
                    onChange={(e) => updateDeliveryAddress({ state: e.target.value })}
                  >
                    {australianStates.map((state) => (
                      <option key={state.code} value={state.code}>
                        {state.code ? `${state.code}` : state.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="field field-small">
                  <span className="label">Postcode</span>
                  <input
                    className="input"
                    placeholder="4000"
                    maxLength={4}
                    value={value.deliveryAddress?.zip || ""}
                    onChange={(e) => updateDeliveryAddress({ zip: e.target.value })}
                  />
                </label>
              </div>

              <label className="field">
                <span className="label">Delivery Notes</span>
                <textarea
                  className="input"
                  rows={2}
                  placeholder="Unit number, building access, special instructions..."
                  value={value.deliveryAddress?.notes || ""}
                  onChange={(e) => updateDeliveryAddress({ notes: e.target.value })}
                />
              </label>

              <label className="checkbox-field">
                <input
                  type="checkbox"
                  checked={value.sameAsDelivery ?? true}
                  onChange={(e) => onChange({ ...value, sameAsDelivery: e.target.checked })}
                />
                <span>Billing address same as delivery</span>
              </label>

              {!value.sameAsDelivery && (
                <>
                  <div className="section-divider">
                    <h4>Billing Address</h4>
                  </div>

                  <label className="field">
                    <span className="label">Street Address</span>
                    <input
                      className="input"
                      placeholder="123 Main Street"
                      value={value.billingAddress?.street || ""}
                      onChange={(e) => updateBillingAddress({ street: e.target.value })}
                    />
                  </label>

                  <div className="field-row">
                    <label className="field">
                      <span className="label">City</span>
                      <input
                        className="input"
                        placeholder="Brisbane"
                        value={value.billingAddress?.city || ""}
                        onChange={(e) => updateBillingAddress({ city: e.target.value })}
                      />
                    </label>

                    <label className="field field-small">
                      <span className="label">State</span>
                      <select
                        className="input"
                        value={value.billingAddress?.state || ""}
                        onChange={(e) => updateBillingAddress({ state: e.target.value })}
                      >
                        {australianStates.map((state) => (
                          <option key={state.code} value={state.code}>
                            {state.code ? `${state.code}` : state.name}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="field field-small">
                      <span className="label">Postcode</span>
                      <input
                        className="input"
                        placeholder="4000"
                        maxLength={4}
                        value={value.billingAddress?.zip || ""}
                        onChange={(e) => updateBillingAddress({ zip: e.target.value })}
                      />
                    </label>
                  </div>
                </>
              )}

              {!deliveryAddressOk && <div className="help-error">Delivery address is required</div>}
            </>
          )}
        </>
      )}
    </div>
  );

  if (!framed) return fields;

  return (
    <div className="panel">
      <div className="panel-head">
        <h3 className="panel-title">{title}</h3>
      </div>
      <div className="panel-body">{fields}</div>
    </div>
  );
}