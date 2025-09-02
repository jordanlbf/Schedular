export type Customer = {
  name: string;
  phone: string;
  email: string;
  // Expanded for retail
  billingAddress?: Address;
  deliveryAddress?: Address;
  sameAsDelivery?: boolean;
};

export type Address = {
  street: string;
  city: string;
  state: string;
  zip: string;
  notes?: string;
};

export type Line = {
  id: number;
  sku: string;
  name: string;
  qty: number;
  price: number; // cents
};

export type CatalogItem = { sku: string; name: string; price: number };

export type DeliveryDetails = {
  preferredDate: string;
  timeSlot: string;
  specialInstructions: string;
  whiteGloveService: boolean;
  oldMattressRemoval: boolean;
  setupService: boolean;
};
