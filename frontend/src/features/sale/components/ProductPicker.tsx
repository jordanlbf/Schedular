import { useEffect, useMemo, useRef, useState } from "react";

type CatalogItem = {
  sku: string | number;
  name: string;
  price: number;
};

type Props = {
  catalog: CatalogItem[];
  onAdd: (sku: CatalogItem["sku"]) => void;
};

function formatMoney(n: number) {
  try {
    return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
  } catch {
    return `$${n.toFixed(2)}`;
  }
}

export default function ProductPicker({ catalog, onAdd }: Props) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus search input for better UX
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return catalog;
    return catalog.filter((p) => {
      const skuStr = String(p.sku).toLowerCase();
      return (
        skuStr.includes(term) ||
        p.name.toLowerCase().includes(term)
      );
    });
  }, [catalog, q]);

  // Press Enter to add the first search result
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && filtered.length > 0) {
      onAdd(filtered[0].sku);
      setQ("");
      inputRef.current?.focus();
    }
  };

  return (
    <div className="product-picker">
      {/* Product search input */}
      <div className="product-search">
        <input
          id="product-search-input"
          ref={inputRef}
          className="form-input"
          placeholder="Search products..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* Product grid */}
      <div className="product-grid">
        {filtered.map((p) => (
          <div key={p.sku} className="product-card">
            <div className="sku">{p.sku}</div>
            <h3 className="name">{p.name}</h3>
            <div className="price">{formatMoney(p.price)}</div>

            <div className="actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => onAdd(p.sku)}
              >
                Add to sale
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="product-empty">
            No products match “{q}”.
          </div>
        )}
      </div>
    </div>
  );
}
