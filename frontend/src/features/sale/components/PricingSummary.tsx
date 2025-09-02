import Panel from "@/shared/ui/Panel";
import Field from "@/shared/ui/Field";
import Input from "@/shared/ui/Input";
import Button from "@/shared/ui/Button";
import { fmt } from "@/shared/utils/money";

export default function PricingSummary({
  deliveryFee, setDeliveryFee, discountPct, setDiscountPct, totals, onSave, onConfirm,
}: {
  deliveryFee: number; setDeliveryFee: (cents: number) => void;
  discountPct: number; setDiscountPct: (pct: number) => void;
  totals: { subtotal: number; discount: number; tax: number; total: number };
  onSave: () => void; onConfirm: () => void;
}) {
  return (
    <Panel title="Pricing &amp; Instructions">
      <div className="form-row">
        <Field label="Delivery fee">
          <Input
            prefix="$"
            type="number" inputMode="decimal" step="0.01" min={0}
            value={(deliveryFee / 100).toFixed(2)}
            onChange={(e) => {
              const v = (e.currentTarget as HTMLInputElement).valueAsNumber;
              setDeliveryFee(Number.isFinite(v) ? Math.round(v * 100) : 0);
            }}
          />
        </Field>

        <Field label="Discount (%)">
          <Input
            type="number" inputMode="numeric" min={0} max={100} step="1"
            value={Number.isFinite(discountPct) ? discountPct : 0}
            onChange={(e) => {
              const v = (e.currentTarget as HTMLInputElement).valueAsNumber;
              setDiscountPct(Number.isFinite(v) ? Math.max(0, Math.min(100, v)) : 0);
            }}
          />
        </Field>

        <Field label="Notes">
          <Input placeholder="Optional" />
        </Field>
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
            <Button variant="soft" onClick={onSave}>Save draft</Button>
            <Button onClick={onConfirm}>Confirm &amp; Pay</Button>
          </div>
        </div>
      </div>
    </Panel>
  );
}
