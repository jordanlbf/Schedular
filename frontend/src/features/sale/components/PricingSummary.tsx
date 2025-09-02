import { useEffect, useMemo, useState } from "react";
import Panel from "@/shared/ui/Panel";
import Field from "@/shared/ui/Field";
import Input from "@/shared/ui/Input";
import Button from "@/shared/ui/Button";
import { fmt } from "@/shared/utils/money";

export default function PricingSummary({
  deliveryFee, setDeliveryFee,
  discountPct, setDiscountPct,
  totals, onSave, onConfirm,
}: {
  deliveryFee: number; setDeliveryFee: (cents: number) => void;   // cents
  discountPct: number; setDiscountPct: (pct: number) => void;     // 0..100
  totals: { subtotal: number; discount: number; tax: number; total: number };
  onSave: () => void; onConfirm: () => void;
}) {
  // keep raw text so users can type freely
  const [feeStr, setFeeStr] = useState<string>("");
  const [feeErr, setFeeErr] = useState<string | null>(null);

  const [discStr, setDiscStr] = useState<string>("");
  const [discErr, setDiscErr] = useState<string | null>(null);

  // seed from parent if non-zero and input still empty
  useEffect(() => { if (deliveryFee !== 0 && feeStr === "") setFeeStr((deliveryFee / 100).toFixed(2)); }, [deliveryFee]); // eslint-disable-line
  useEffect(() => { if (discountPct !== 0 && discStr === "") setDiscStr(String(discountPct)); }, [discountPct]); // eslint-disable-line

  // ---- validation helpers (no sanitizing; just check) ----
  const checkMoney = (raw: string):
    | { ok: true; cents: number; normalized: string }
    | { ok: false; msg: string } => {
    const s = raw.trim();
    if (s === "") return { ok: true, cents: 0, normalized: "" }; // empty = 0, keep placeholder
    const normalized = s.replace(",", ".");
    // digits with optional single dot, up to 2 decimals
    if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return { ok: false, msg: "Enter amount like 12.34" };
    const n = Number(normalized);
    if (!Number.isFinite(n) || n < 0) return { ok: false, msg: "Enter a non-negative amount" };
    return { ok: true, cents: Math.round(n * 100), normalized: n.toFixed(2) };
  };

  const checkPercent = (raw: string):
    | { ok: true; value: number; normalized: string }
    | { ok: false; msg: string } => {
    const s = raw.trim();
    if (s === "") return { ok: true, value: 0, normalized: "" };
    if (!/^\d{1,3}$/.test(s)) return { ok: false, msg: "0–100 only" };
    const n = Number(s);
    if (n < 0 || n > 100) return { ok: false, msg: "0–100 only" };
    return { ok: true, value: Math.round(n), normalized: String(Math.round(n)) };
  };

  // ---- handlers (validate; only propagate when valid) ----
  const onFeeChange = (v: string) => {
    setFeeStr(v);
    const res = checkMoney(v);
    if (res.ok) { setFeeErr(null); setDeliveryFee(res.cents); } else { setFeeErr(res.msg); }
  };
  const onFeeBlur = () => {
    const res = checkMoney(feeStr);
    if (res.ok) setFeeStr(res.normalized); // normalize to two decimals if valid
  };

  const onDiscChange = (v: string) => {
    setDiscStr(v);
    const res = checkPercent(v);
    if (res.ok) { setDiscErr(null); setDiscountPct(res.value); } else { setDiscErr(res.msg); }
  };
  const onDiscBlur = () => {
    const res = checkPercent(discStr);
    if (res.ok) setDiscStr(res.normalized); // normalize to integer if valid
  };

  const hasErrors = useMemo(() => Boolean(feeErr || discErr), [feeErr, discErr]);

  return (
    <Panel title="Pricing &amp; Instructions">
      <div className="form-row">
        <Field label="Delivery fee ($)">
          <Input
            type="text"
            inputMode="decimal"
            className={feeErr ? "invalid" : ""}
            value={feeStr}
            onChange={(e) => onFeeChange(e.currentTarget.value)}
            onBlur={onFeeBlur}
            onFocus={(e) => e.currentTarget.select()}
            placeholder="0.00"
          />
          {feeErr && <div className="help-error">{feeErr}</div>}
        </Field>

        <Field label="Discount (%)">
          <Input
            type="text"
            inputMode="numeric"
            className={discErr ? "invalid" : ""}
            value={discStr}
            onChange={(e) => onDiscChange(e.currentTarget.value)}
            onBlur={onDiscBlur}
            onFocus={(e) => e.currentTarget.select()}
            placeholder="0"
          />
          {discErr && <div className="help-error">{discErr}</div>}
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
            <Button onClick={onConfirm} disabled={hasErrors}>Confirm &amp; Pay</Button>
          </div>
        </div>
      </div>
    </Panel>
  );
}
