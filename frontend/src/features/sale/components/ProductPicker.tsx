import { useMemo, useState } from "react";
import type { CatalogItem } from "../types";
import Panel from "@/shared/ui/Panel";
import Input from "@/shared/ui/Input";
import Button from "@/shared/ui/Button";
import { fmt } from "@/shared/utils/money";

export default function ProductPicker({ catalog, onAdd }: { catalog: CatalogItem[]; onAdd: (sku: string) => void; }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return catalog;
    return catalog.filter((p) => p.sku.toLowerCase().includes(q) || p.name.toLowerCase().includes(q));
  }, [query, catalog]);

  return (
    <Panel title="Products">
      <div className="search-row">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { const top = filtered[0]; if (top) onAdd(top.sku); } }}
          placeholder="Search / scan SKU…"
        />
      </div>

      <div className="products">
        {filtered.map((p) => (
          <div key={p.sku} className="product">
            <div className="sku">{p.sku}</div>
            <h3>{p.name}</h3>
            <div className="price">{fmt(p.price)}</div>
            <Button full onClick={() => onAdd(p.sku)}>Add to sale</Button>
          </div>
        ))}
      </div>
    </Panel>
  );
}
