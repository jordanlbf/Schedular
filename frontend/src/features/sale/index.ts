// Hooks exports
export { useSaleDraft } from './hooks/useSaleDraft';
export { useSaleTotals } from './hooks/useSaleTotals';
export { useSaleValidation } from './hooks/useSaleValidation';
export { useWizardNavigation } from './hooks/useWizardNavigation';

// Types exports
export type { Customer, Line, DeliveryDetails, Address, CatalogItem } from './types';
export type { WizardStep, SaleDraft } from './hooks/useSaleDraft';
export type { SaleTotals } from './hooks/useSaleTotals';
export type { ValidationResult, StepValidation } from './hooks/useSaleValidation';

// Utils exports
export * from './utils/saleUtils';

// Constants exports
export * from './constants/wizard';

// Catalog export
export { CATALOG } from './catalog';

// Components exports
export { default as CreateSaleWizard } from './CreateSaleWizard';
export { default as ProductPicker } from './components/ProductPicker';
export { default as CartTable } from './components/CartTable';
export { default as CustomerForm } from './components/CustomerForm';
export { default as PricingSummary } from './components/PricingSummary';
