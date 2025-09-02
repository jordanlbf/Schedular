// @ts-ignore
import React from "react";

export default function Qty({ value, onDec, onInc }: { value: number; onDec: () => void; onInc: () => void }) {
  return (
    <div className="qty">
      <button onClick={onDec} aria-label="Decrease">−</button>
      <input value={value} readOnly />
      <button onClick={onInc} aria-label="Increase">+</button>
    </div>
  );
}
