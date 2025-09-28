import { useMemo } from 'react';
import type { Line } from "@/features/sale/types";
import { CATALOG } from "../../catalog";
import { CartItemRow } from './CartItemRow';

interface CartTableProps {
  lines: Line[];
  onChangeQty: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
  onPriceChange?: (id: number, newPrice: number) => void;
}

export default function CartTable({ lines, onChangeQty, onRemove, onPriceChange }: CartTableProps) {
  // Memoize the product lookup to prevent unnecessary re-renders
  const productMap = useMemo(() => {
    const map = new Map();
    CATALOG.forEach(product => {
      map.set(product.sku, product);
    });
    return map;
  }, []);

  if (lines.length === 0) return null;

  return (
    <div className="cart-items-list-horizontal">
      {lines.map((line) => {
        const product = productMap.get(line.sku);

        return (
          <CartItemRow
            key={line.id}
            line={line}
            product={product}
            onChangeQty={onChangeQty}
            onRemove={onRemove}
            onPriceChange={onPriceChange}
          />
        );
      })}
    </div>
  );
}