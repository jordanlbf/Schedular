import { useMemo } from 'react';
import type { Line } from "@/features/sale/types";
import { CartItemRow } from './CartItemRow';
import { useProductsContext } from '@/features/sale/contexts/ProductsContext';

interface CartTableProps {
  lines: Line[];
  onChangeQty: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
  onPriceChange?: (id: number, newPrice: number) => void;
}

export function CartTable({ lines, onChangeQty, onRemove, onPriceChange }: CartTableProps) {
  const { products } = useProductsContext();

  // Memoize the product lookup to prevent unnecessary re-renders
  const productMap = useMemo(() => {
    const map = new Map();
    products.forEach(product => {
      map.set(product.sku, product);
    });
    return map;
  }, [products]);

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