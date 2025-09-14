import { useEffect, useMemo, useRef, useState } from "react";

import type { Product, StockStatus, ColorOption } from '@/shared/types';

type CatalogItem = Product;

type Props = {
  catalog: CatalogItem[];
  onAdd: (sku: CatalogItem["sku"], color?: string) => void;
  onAddSuccess?: (productName: string) => void;
};

function formatMoney(dollars: number) {
  try {
    return dollars.toLocaleString(undefined, { 
      style: "currency", 
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  } catch {
    return `$${Math.round(dollars)}`;
  }
}

function StockBadge({ stock }: { stock: CatalogItem['stock'] }) {
  const getBadgeInfo = () => {
    switch (stock.status) {
      case 'in-stock':
        return { text: 'In Stock', className: 'in-stock' };
      case 'low-stock':
        return { text: 'Low Stock', className: 'low-stock' };
      case 'out-of-stock':
        return { text: 'No Stock', className: 'out-of-stock' };
      case 'discontinued':
        return { text: 'Discontinued', className: 'discontinued' };
      default:
        return { text: '', className: '' };
    }
  };

  const { text, className } = getBadgeInfo();
  if (!text) return null;

  return (
    <span className={`stock-badge ${className}`}>
      {text}
    </span>
  );
}

function ColorSelector({ colors, selectedColor, onColorSelect }: {
  colors: CatalogItem['colors'];
  selectedColor?: string;
  onColorSelect: (color: string) => void;
}) {
  if (!colors || colors.length === 0) return null;

  return (
    <div className="color-selector">
      {selectedColor && (
        <div className="selected-color-name">
          {colors.find(c => c.value === selectedColor)?.name}
        </div>
      )}
      <div className="color-options">
        {colors.map((color) => (
          <button
            key={color.value}
            type="button"
            className={`color-option ${selectedColor === color.value ? 'selected' : ''}`}
            style={{ backgroundColor: color.value }}
            onClick={() => onColorSelect(color.value)}
            aria-label={`Select ${color.name} color`}
            title={color.name}
          />
        ))}
      </div>
    </div>
  );
}


export default function ProductPicker({ catalog, onAdd, onAddSuccess }: Props) {
  const [q, setQ] = useState("");
  const [addingProduct, setAddingProduct] = useState<string | null>(null);
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const defaultColors: Record<string, string> = {};
    catalog.forEach(product => {
      if (product.colors && product.colors.length > 0) {
        defaultColors[String(product.sku)] = product.colors[0].value;
      }
    });
    setSelectedColors(defaultColors);
  }, [catalog]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) {
      return catalog.slice(0, 3);
    }
    return catalog.filter((p) => {
      const skuStr = String(p.sku).toLowerCase();
      return (
        skuStr.includes(term) ||
        p.name.toLowerCase().includes(term)
      );
    });
  }, [catalog, q]);

  const handleAddProduct = async (sku: string | number) => {
    const product = catalog.find(p => p.sku === sku);
    if (!product) return;
    
    setAddingProduct(String(sku));
    
    const selectedColor = selectedColors[String(sku)];
    const colorName = selectedColor && product.colors ? 
      product.colors.find(c => c.value === selectedColor)?.name : undefined;
    
    onAdd(sku, colorName);
    
    setTimeout(() => {
      setAddingProduct(null);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && filtered.length > 0) {
      handleAddProduct(filtered[0].sku);
      setQ("");
      inputRef.current?.focus();
    }
  };

  return (
    <div className="product-picker">
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

      {q === "" && (
        <div className="product-hint">
          Popular
        </div>
      )}

      <div className="product-grid">
        {filtered.map((p) => {
          const isOutOfStock = p.stock.status === 'out-of-stock' || p.stock.status === 'discontinued';
          const isAdding = addingProduct === String(p.sku);
          
          // Get the correct image based on selected color
          const getProductImage = () => {
            const selectedColor = selectedColors[String(p.sku)];
            if (!selectedColor || !p.colors) return p.image;
            
            const selectedColorObj = p.colors.find(color => color.value === selectedColor);
            return selectedColorObj?.image || p.image;
          };
          
          const productImage = getProductImage();
          
          const getButtonText = () => {
            if (isAdding) return 'Added ✓';
            if (p.stock.status === 'discontinued') return 'Unavailable';
            if (p.stock.status === 'out-of-stock') return 'Pre-order';
            return 'Add';
          };
          
          return (
            <div key={p.sku} className={`product-card ${isOutOfStock ? 'out-of-stock' : ''} ${isAdding ? 'adding' : ''}`}>
              <div className="product-header">
                <div className="product-title">
                  <h3 className="name">{p.name}</h3>
                  <StockBadge stock={p.stock} />
                </div>
                <div className="product-info-row">
                  <span className="sku">{p.sku}</span>
                  <div className="stock-info-section">
                    {p.stock.leadTimeText && (
                      <div className="lead-time-header">
                        {p.stock.leadTimeText}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {productImage && (
                <div className="product-image">
                  <img 
                    key={`product-img-${p.sku}-${selectedColors[String(p.sku)] || 'default'}`}
                    src={productImage} 
                    alt={p.name} 
                  />
                </div>
              )}
              <div className="price-section">
                <div className="price">{formatMoney(p.price)}</div>
              </div>

              {p.colors && p.colors.length > 0 && (
                <div className="product-colors">
                  <ColorSelector
                    colors={p.colors}
                    selectedColor={selectedColors[String(p.sku)]}
                    onColorSelect={(color) => setSelectedColors(prev => ({
                      ...prev,
                      [String(p.sku)]: color
                    }))}
                  />
                </div>
              )}

              <div className="actions">
                <button
                  type="button"
                  className={`btn btn-primary ${isAdding ? 'adding' : ''}`}
                  onClick={() => handleAddProduct(p.sku)}
                  disabled={p.stock.status === 'discontinued' || isAdding}
                >
                  {getButtonText()}
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && q.trim() && (
          <div className="product-empty">
            No products match "{q}"
          </div>
        )}
      </div>
    </div>
  );
}
