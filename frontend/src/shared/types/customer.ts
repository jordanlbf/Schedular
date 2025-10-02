export interface Address {
  unit?: string;
  street: string;
  street2?: string;
  city: string;
  state: string;
  zip: string;
  notes?: string;
}

export interface SecondPerson {
  firstName: string;
  lastName: string;
  phone?: string;
  email?: string;
  relationship?: string; // e.g., "Spouse", "Partner", "Roommate", etc.
}

export interface Customer {
  firstName: string;
  lastName: string;
  name?: string; // Keep for backwards compatibility, will be computed
  phone: string;
  email: string;
  additionalPhone?: string;
  secondPerson?: SecondPerson;
  billingAddress?: Address;
  deliveryAddress?: Address;
  sameAsDelivery?: boolean;
}
