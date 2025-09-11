import { MutableRefObject } from 'react';
import type { Line, CatalogItem } from '../../types';
import ProductPicker from '../ProductPicker';
import CartTable from '../CartTable';
import { WizardStepLayout } from './shared/WizardStepLayout';
import { WIZARD_STEP_TITLES } from '../../constants/wizardTitles';

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
          <div className="form-card sale-items">
            <div className="form-card-header">
              <h3>Cart</h3>
            </div>
            <div className="form-card-body cart-container">
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
                  <div className="cart-summary">
                    <div className="summary-details">
                      <span className="summary-count">
                        {lines.reduce((total, line) => total + line.qty, 0)} item{lines.reduce((total, line) => total + line.qty, 0) !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="summary-total">
                      <span>Subtotal:</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="empty-cart">
                  <div className="empty-cart-icon">🛒</div>
                  <h4>Your cart is empty</h4>
                  <p>Search and add products from the catalog to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </WizardStepLayout>
  );
}
