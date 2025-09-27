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

export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash', description: 'Full payment today' },
  { value: 'card', label: 'Credit/Debit Card', description: 'Full payment today' },
  { value: 'financing', label: 'Financing', description: 'Deposit today, balance on delivery' },
] as const;

export const SERVICE_OPTIONS = {
  whiteGlove: {
    name: 'White Glove Service',
    description: 'Full setup, packaging removal, and room placement',
    price: 15000, // $150 in cents
  },
  mattressRemoval: {
    name: 'Old Mattress Removal',
    description: 'We\'ll haul away your old mattress',
    price: 5000, // $50 in cents
  },
  setupService: {
    name: 'Basic Setup Service',
    description: 'Unpack and position in room',
    price: 7500, // $75 in cents
  },
} as const;

export const MIN_DELIVERY_DAYS = 7;
