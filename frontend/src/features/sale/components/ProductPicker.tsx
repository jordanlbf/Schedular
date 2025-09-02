import { useMemo, useState } from "react";
import type { CatalogItem } from "../types";
import { fmt } from "../utils/money";

export default function ProductPicker({
  catalog,
  onAdd,
}: {
  catalog: CatalogItem[];
  onAdd: (sku: string) => void;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return catalog;
    return catalog.filter(
      (p) => p.sku.toLowerCase().includes(q) || p.name.toLowerCase().includes(q)
    );
  }, [query, catalog]);

  return (
    <section className="panel">
      <h2 className="panel-title">Products</h2>

      <div className="search-row">
        <input
          className="input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const top = filtered[0];
              if (top) onAdd(top.sku);
            }
          }}
          placeholder="Search / scan SKU…"
        />
      </div>

      <div className="products">
        {filtered.map((p) => (
          <div key={p.sku} className="product">
            <div className="sku">{p.sku}</div>
            <h3>{p.name}</h3>
            <div className="price">{fmt(p.price)}</div>
            <button className="btn btn-primary full" onClick={() => onAdd(p.sku)}>
              Add to sale
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
