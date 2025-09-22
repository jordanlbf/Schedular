export { AUSTRALIAN_STATES, CURRENCIES, DEFAULT_CURRENCY } from './geography';

export const TIME_SLOTS = [
  { value: "", label: "Select time slot" },
  { value: "morning", label: "Morning (8 AM - 12 PM)" },
  { value: "afternoon", label: "Afternoon (12 PM - 5 PM)" },
  { value: "evening", label: "Evening (5 PM - 8 PM)" }
];

export const DELIVERY_OPTIONS = {
  whiteGlove: {
    label: "White Glove Service",
    price: 150,
    description: "Professional setup and packaging removal"
  },
  removal: {
    label: "Old Mattress Removal",
    price: 50,
    description: "We'll take away your old mattress"
  },
  setup: {
    label: "Setup Service",
    price: 75,
    description: "Professional assembly and installation"
  }
};
