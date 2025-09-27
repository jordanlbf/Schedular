/**
 * Payment method options for checkout
 */
export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash', description: 'Full payment today' },
  { value: 'card', label: 'Credit/Debit Card', description: 'Full payment today' },
  { value: 'financing', label: 'Financing', description: 'Deposit today, balance on delivery' },
] as const;