import { MutableRefObject } from 'react';
import type { Line, CatalogItem } from '@/features/sale/types';
import { WizardStepLayout } from '@/features/sale/components/CreateSaleWizard/components/WizardStepLayout';
import { WIZARD_STEP_TITLES } from '@/features/sale/components/CreateSaleWizard/constants/wizard';
import ProductSelection from '../ProductSelection/ProductSelection';

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
      <ProductSelection
        lines={lines}
        catalog={catalog}
        onAddLine={onAddLine}
        onChangeQty={onChangeQty}
        onRemoveLine={onRemoveLine}
        onPriceChange={onPriceChange}
        searchRef={searchRef}
        subtotal={subtotal}
        onAddSuccess={onAddSuccess}
      />
    </WizardStepLayout>
  );
}