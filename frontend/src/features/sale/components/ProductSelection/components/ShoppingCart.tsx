import type { Line, CatalogItem } from '../../../types';
import CartTable from '../../Cart/CartTable';
import { formatPrice, formatSavings } from '@/shared/utils';
import { Card } from '@/features/sale/ui';

interface ShoppingCartProps {
  lines: Line[];
  catalog: CatalogItem[];
  onChangeQty: (id: number, delta: number) => void;
  onRemoveLine: (id: number) => void;
  onPriceChange?: (id: number, newPrice: number) => void;
  subtotal: number;
}

export function ShoppingCart({
  lines,
  catalog,
  onChangeQty,
  onRemoveLine,
  onPriceChange,
  subtotal
}: ShoppingCartProps) {
  const itemCount = lines.reduce((total, line) => total + line.qty, 0);

  return (
    <div className="products-cart-section">
      <div className="shopping-cart-wrapper">
        <Card
          title="Shopping Cart"
          className="shopping-cart-section"
        >
          {lines.length > 0 ? (
            <>
              <div className="cart-items-section">
                <CartTable
                  lines={lines}
                  onChangeQty={onChangeQty}
                  onRemove={onRemoveLine}
                  onPriceChange={onPriceChange}
                />
              </div>

              <div className="cart-footer">
                <div className="cart-totals">
                  <div className="totals-summary">
                    {(() => {
                      const rrpTotal = Math.round(lines.reduce((total, line) => {
                        const product = catalog.find(p => p.sku === line.sku);
                        return total + ((product?.price || line.price) * line.qty);
                      }, 0) * 100) / 100;
                      const currentTotal = Math.round(subtotal * 100) / 100;
                      const totalSavings = Math.round((rrpTotal - currentTotal) * 100) / 100;

                      return (
                        <>
                          <div className="summary-row">
                            <span className="summary-label">Items Sum ({itemCount})</span>
                            <span className="summary-value">{formatPrice(rrpTotal)}</span>
                          </div>

                          {totalSavings > 0 && (
                            <div className="summary-row">
                              <span className="summary-label discount-label">
                                Discount
                              </span>
                              <span className="summary-value discount-amount">
                                -{formatSavings(totalSavings)}
                              </span>
                            </div>
                          )}

                          <div className="summary-row summary-total">
                            <span className="summary-label">Subtotal</span>
                            <span className="summary-value summary-price">{formatPrice(subtotal)}</span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <h4>Your Cart is Empty</h4>
              <div className="empty-cart-hint">
                <span>Use the search bar to add products</span>
              </div>
            </div>
          )}
        </Card>
        {/* Item count badge positioned absolutely */}
        {itemCount > 0 && (
          <span className="cart-header-badge">
            {itemCount}
          </span>
        )}
      </div>
    </div>
  );
}