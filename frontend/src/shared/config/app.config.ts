export const APP_CONFIG = {
  name: 'Scheduler',
  version: '1.0.0',
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    timeout: 30000,
  },
  storage: {
    prefix: 'scheduler',
    draftKey: 'saleWizardDraft.v1',
  },
  features: {
    sale: {
      minDeliveryDays: 7,
      maxDeliveryDays: 30,
      defaultDeliveryFee: 0,
      maxDiscountPercent: 50,
    },
    customer: {
      phoneFormat: 'AU',
      postcodeLength: 4,
    },
  },
  ui: {
    toastDuration: 5000,
    debounceDelay: 500,
  },
} as const;

export type AppConfig = typeof APP_CONFIG;
