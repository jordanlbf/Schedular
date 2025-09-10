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
  onAddLine: (sku: string | number) => void;
  onChangeQty: (id: number, delta: number) => void;
  onRemoveLine: (id: number) => void;
  searchRef?: MutableRefObject<HTMLInputElement | null>;
  onNext: () => void;
  onPrev: () => void;
  canProceed: boolean;
  subtotal: number;
  errors?: string[];
}

export default function ProductsStep({
  lines,
  catalog,
  onAddLine,
  onChangeQty,
  onRemoveLine,
  searchRef,
  onNext,
  onPrev,
  canProceed,
  subtotal,
  errors = []
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
                    />
                  </div>
                  <div className="cart-summary">
                    <div className="summary-details">
                      <span className="summary-count">
                        {lines.reduce((total, line) => total + line.qty, 0)} item{lines.reduce((total, line) => total + line.qty, 0) !== 1 ? 's' : ''} 
                        {lines.length > 1 ? ` across ${lines.length} products` : ''}
                      </span>
                    </div>
                    <div className="summary-total">
                      <span>Subtotal:</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="empty-sale">
                  <div className="empty-icon">📋</div>
                  <h4>No items added</h4>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </WizardStepLayout>
  );
}
