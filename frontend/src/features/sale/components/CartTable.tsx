import type { Line } from "../types";
import Button from "@/shared/ui/Button";
import Qty from "@/shared/ui/Qty";
import { fmt } from "@/shared/utils/money";

export default function CartTable({ lines, onChangeQty, onRemove }: {
  lines: Line[]; onChangeQty: (id: number, delta: number) => void; onRemove: (id: number) => void;
}) {
  if (lines.length === 0) return null;

  return (
    <>
      <div className="divider" />
      <div className="cart-wrap">
        <table className="cart">
          <colgroup>
            <col className="w-sku" /><col /><col className="w-qty" />
            <col className="w-money" /><col className="w-money" /><col className="w-actions" />
          </colgroup>
          <thead>
            <tr>
              <th>SKU</th><th>Item</th><th className="center">Qty</th>
              <th className="right">Unit</th><th className="right">Line</th><th></th>
            </tr>
          </thead>
          <tbody>
            {lines.map((l) => (
              <tr key={l.id}>
                <td className="mono nowrap">{l.sku}</td>
                <td className="truncate">{l.name}</td>
                <td className="center"><Qty value={l.qty} onDec={() => onChangeQty(l.id, -1)} onInc={() => onChangeQty(l.id, +1)} /></td>
                <td className="right nowrap">{fmt(l.price)}</td>
                <td className="right nowrap">{fmt(l.qty * l.price)}</td>
                <td className="right">
                  <Button variant="ghost" onClick={() => onRemove(l.id)}>Remove</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
