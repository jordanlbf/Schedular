/**
 * Centralized wizard step titles - these must match exactly with progress bar labels
 * in useSaleWizard.ts to ensure consistency across the interface
 */
export const WIZARD_STEP_TITLES = {
  customer: 'Customer Details',
  products: 'Product Selection', 
  delivery: 'Delivery Details',
  payment: 'Payment'
} as const;

export type WizardStepTitle = typeof WIZARD_STEP_TITLES[keyof typeof WIZARD_STEP_TITLES];