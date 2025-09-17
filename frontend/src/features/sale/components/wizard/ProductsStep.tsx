import { MutableRefObject } from 'react';
import type { Line, CatalogItem } from '../../types';
import ProductPicker from '../ProductPicker';
import CartTable from '../CartTable';
import { WizardStepLayout } from './shared/WizardStepLayout';
import { WIZARD_STEP_TITLES } from '../../constants/wizardTitles';
import { formatPrice, formatSavings } from '@/shared/utils/price';

interface ProductsStepProps {
  lines: Line[];
  catalog: CatalogItem[];
  onAddLine: (sku: string | number, color?: string) => void;
  onChangeQty: (id: number, delta: number) => void;
  onRemoveLine: (id: number) => void;
  onPriceChange?: (id: number, newPrice: number) => void;
  searchRef?: MutableRefObject<HTMLInputElement | null>;
  onNext: () => void;
  onPrev: () => void;
  canProceed: boolean;
  subtotal: number;
  errors?: string[];
  onAddSuccess?: (productName: string) => void;
}

export default function ProductsStep({
  lines,
  catalog,
  onAddLine,
  onChangeQty,
  onRemoveLine,
  onPriceChange,
  searchRef,
  onNext,
  onPrev,
  canProceed,
  subtotal,
  errors = [],
  onAddSuccess
}: ProductsStepProps) {
  const itemCount = lines.reduce((total, line) => total + line.qty, 0);
  
  return (
    <WizardStepLayout
      title={WIZARD_STEP_TITLES.products}
      stepNumber="2"
      onNext={onNext}
      onPrev={onPrev}
      canProceed={canProceed}
      nextLabel="Continue to Delivery"
      errors={errors}
    >
      <div className="products-layout">
        <div className="products-search-section">
          <div className="form-card">
            <div className="form-card-header">
              <h3>Add Products</h3>
            </div>
            <div className="form-card-body">
              <ProductPicker
                catalog={catalog}
                onAdd={onAddLine}
                inputRef={searchRef}
                onAddSuccess={onAddSuccess}
              />
            </div>
          </div>
        </div>

        <div className="products-cart-section">
          <div className="shopping-cart-section">
            <div className="shopping-cart-header">
              <h3>
                Shopping Cart
                {itemCount > 0 && (
                  <span className="cart-item-badge">
                    {itemCount}
                  </span>
                )}
              </h3>
            </div>
            <div className="shopping-cart-body">
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
            </div>
          </div>
        </div>
      </div>
    </WizardStepLayout>
  );
}