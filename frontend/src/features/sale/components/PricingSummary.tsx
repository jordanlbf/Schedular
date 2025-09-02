import { fmt } from "../utils/money";

export default function PricingSummary({
  deliveryFee,
  setDeliveryFee,
  discountPct,
  setDiscountPct,
  totals,
  onSave,
  onConfirm,
}: {
  deliveryFee: number;           // cents
  setDeliveryFee: (cents: number) => void;
  discountPct: number;           // 0..100
  setDiscountPct: (pct: number) => void;
  totals: { subtotal: number; discount: number; tax: number; total: number };
  onSave: () => void;
  onConfirm: () => void;
}) {
  return (
    <section className="panel">
      <h2 className="panel-title">Pricing &amp; Instructions</h2>

      <div className="form-row">
        <label className="field">
          <span className="label">Delivery fee</span>
          <div className="input prefix">
            <span className="prefix">$</span>
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              min={0}
              value={(deliveryFee / 100).toFixed(2)}
              onChange={(e) => {
                const v = (e.currentTarget as HTMLInputElement).valueAsNumber;
                setDeliveryFee(Number.isFinite(v) ? Math.round(v * 100) : 0);
              }}
            />
          </div>
        </label>

        <label className="field">
          <span className="label">Discount (%)</span>
          <input
            className="input"
            type="number"
            inputMode="numeric"
            min={0}
            max={100}
            step="1"
            value={Number.isFinite(discountPct) ? discountPct : 0}
            onChange={(e) => {
              const v = (e.currentTarget as HTMLInputElement).valueAsNumber;
              setDiscountPct(Number.isFinite(v) ? Math.max(0, Math.min(100, v)) : 0);
            }}
          />
        </label>

        <label className="field">
          <span className="label">Notes</span>
          <input className="input" placeholder="Optional" />
        </label>
      </div>

      <div className="summary-grid">
        <div className="summary">
          <div className="row"><span>Subtotal</span><span>{fmt(totals.subtotal)}</span></div>
          <div className="row"><span>Discount</span><span>{totals.discount ? `– ${fmt(totals.discount)}` : fmt(0)}</span></div>
          <div className="row"><span>Delivery fee</span><span>{fmt(deliveryFee)}</span></div>
          <div className="row"><span>Tax (10%)</span><span>{fmt(totals.tax)}</span></div>
          <div className="row total"><span>Total</span><span>{fmt(totals.total)}</span></div>
        </div>

        <div className="summary">
          <div className="actions">
            <button className="btn btn-soft" onClick={onSave}>Save draft</button>
            <button className="btn btn-primary" onClick={onConfirm}>Confirm &amp; Pay</button>
          </div>
        </div>
      </div>
    </section>
  );
}
