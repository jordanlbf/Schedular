import type { WizardStep } from '../hooks/useSaleDraft';

export const WIZARD_STEPS: WizardStep[] = ['customer', 'products', 'delivery', 'payment'];

export const STEP_LABELS = {
  customer: 'Customer Details',
  products: 'Product Selection', 
  delivery: 'Delivery Details',
  payment: 'Payment'
} as const;

export const TIME_SLOTS = [
  { value: '', label: 'Select time slot' },
  { value: 'morning', label: 'Morning (8am-12pm)' },
  { value: 'afternoon', label: 'Afternoon (12pm-5pm)' },
  { value: 'evening', label: 'Evening (5pm-8pm)' },
] as const;

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

export const DEFAULT_TAX_RATE = 0.10; // 10%

export const MANUFACTURING_DAYS = 14;
export const MIN_DELIVERY_DAYS = 7;
