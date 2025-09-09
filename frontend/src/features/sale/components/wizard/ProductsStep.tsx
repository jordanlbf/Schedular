import { MutableRefObject } from 'react';
import type { Line, CatalogItem } from '../../types';
import ProductPicker from '../ProductPicker';
import CartTable from '../CartTable';
import { fmt } from '../../../../shared/utils/money';
import { WizardStepLayout } from './shared/WizardStepLayout';
import { WIZARD_STEP_TITLES } from '../../constants/wizardTitles';

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
      onNext={onNext}
      onPrev={onPrev}
      canProceed={canProceed}
      errors={errors}
    >
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
    </WizardStepLayout>
  );
}
