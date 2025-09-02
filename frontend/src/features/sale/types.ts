export type Customer = { name: string; phone: string; email: string };

export type Line = {
  id: number;
  sku: string;
  name: string;
  qty: number;
  price: number; // cents
};

export type CatalogItem = { sku: string; name: string; price: number };
