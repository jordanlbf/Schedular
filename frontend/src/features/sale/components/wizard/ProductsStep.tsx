import { MutableRefObject } from 'react';
import type { Line, CatalogItem } from '../../types';
import ProductPicker from '../ProductPicker';
import CartTable from '../CartTable';
import { fmt } from '../../../../shared/utils/money';

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
    <div className="wizard-step">
      <div className="step-content">
        <div className="step-main">
          <div className="wizard-page-header">
            <h2>Product Selection</h2>
            <p>Search and select items for this order. For custom sizes or specifications, add the base product and include details in delivery notes.</p>
          </div>

          {/* Error display */}
          {errors.length > 0 && (
            <div className="form-errors">
              <h4>Please fix the following issues:</h4>
              <ul>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="products-section">
            <h3>Add Products</h3>
            <ProductPicker
              catalog={catalog}
              onAdd={onAddLine}
              inputRef={searchRef}
            />
          </div>

          {lines.length > 0 && (
            <div className="cart-section">
              <h3>Selected Items ({lines.length})</h3>
              <CartTable 
                lines={lines} 
                onChangeQty={onChangeQty} 
                onRemove={onRemoveLine} 
              />
              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>{fmt(subtotal)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="step-actions">
          <button className="btn btn-soft" onClick={onPrev}>
            ← Back to Customer
          </button>
          <button
            className="btn btn-primary"
            onClick={onNext}
            disabled={!canProceed}
          >
            Continue to Delivery →
          </button>
          {!canProceed && (
            <div className="step-help">
              Please add at least one product to continue
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
