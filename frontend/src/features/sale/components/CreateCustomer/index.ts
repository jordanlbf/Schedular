// CreateCustomer feature exports
export { AddressForm } from './components/AddressForm';
export { ContactDetailsForm } from './components/ContactDetailsForm';

// Hooks
export { useAddressForm } from './hooks/useAddressForm';
export { useContactDetailsForm } from './hooks/useContactDetailsForm';
export { useCustomerStepForm } from './hooks/useCustomerStepForm';

// Utils and constants
export {
  AUSTRALIAN_STATES,
  formatPhone,
  isValidEmail,
  isValidPhone,
  isValidPostcode
} from './utils/customerUtils';