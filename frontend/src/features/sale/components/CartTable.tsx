import type { Line } from "../types";

function formatPrice(dollars: number) {
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

export default function CartTable({ lines, onChangeQty, onRemove }: {
  lines: Line[]; onChangeQty: (id: number, delta: number) => void; onRemove: (id: number) => void;
}) {
  if (lines.length === 0) return null;

  return (
    <div className="cart-items-list">
      {lines.map((line) => (
        <div key={line.id} className="cart-item">
          <div className="cart-item-main">
            <div className="cart-item-info">
              <div className="cart-item-name">{line.name}</div>
              <div className="cart-item-sku">{line.sku}</div>
            </div>
            
            <div className="cart-item-price">
              <div className="cart-item-total-price">{formatPrice(line.qty * line.price)}</div>
            </div>
          </div>
          
          <div className="cart-item-controls">
            <div className="cart-item-quantity">
              <button 
                className="qty-btn qty-btn-decrease"
                onClick={() => {
                  if (line.qty === 1) {
                    onRemove(line.id);
                  } else {
                    onChangeQty(line.id, -1);
                  }
                }}
                aria-label={line.qty === 1 ? "Remove item" : "Decrease quantity"}
              >
                −
              </button>
              <span className="qty-display">{line.qty}</span>
              <button 
                className="qty-btn qty-btn-increase"
                onClick={() => onChangeQty(line.id, +1)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            
            <button 
              className="cart-item-remove"
              onClick={() => onRemove(line.id)}
              aria-label={`Remove ${line.name} from cart`}
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
