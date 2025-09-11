import type { CatalogItem } from "./types";

export const CATALOG: CatalogItem[] = [
  { 
    sku: "DT-1001", 
    name: "Oak Dining Table",  
    price: 1999, 
    image: "/images/products/oak-dining-table.png",
    stock: { status: 'in-stock', quantity: 12 },
    colors: [
      { name: "Natural Oak", value: "#C8956D" },
      { name: "Dark Walnut", value: "#4A2C17" }
    ]
  },
  { 
    sku: "SF-2040", 
    name: "Leather Sofa", 
    price: 1499, 
    image: "/images/products/leather-sofa-tan.png",
    stock: { status: 'low-stock', quantity: 3 },
    colors: [
      { name: "Tan", value: "#CD853F" },
      { name: "Black", value: "#1A1A1A" }
    ]
  },
  { 
    sku: "BS-3055", 
    name: "Bookshelf", 
    price: 799, 
    image: "/images/products/bookshelf-walnut.png",
    stock: { status: 'out-of-stock', quantity: 0, leadTimeDays: 14, leadTimeText: 'ETA: 2-3 Weeks' }
  },
  { 
    sku: "CH-4110", 
    name: "Office Chair",       
    price: 399, 
    image: "/images/products/office-chair.png",
    stock: { status: 'in-stock', quantity: 28 },
    colors: [
      { name: "Black", value: "#1C1C1C" },
      { name: "Navy", value: "#1B2951" }
    ]
  },
  { 
    sku: "BD-5201", 
    name: "Queen Memory Foam Mattress", 
    price: 1299, 
    image: "/images/products/memory-foam-mattress.png",
    stock: { status: 'out-of-stock', quantity: 0, leadTimeDays: 28, leadTimeText: 'ETA: 4-6 Weeks' }
    // No colors for mattress
  },
  { 
    sku: "LT-6088", 
    name: "Modern Floor Lamp", 
    price: 249, 
    image: "/images/products/modern-floor-lamp.png",
    stock: { status: 'in-stock', quantity: 15 }
  },
  { 
    sku: "CF-7134", 
    name: "Glass Coffee Table", 
    price: 649, 
    image: "/images/products/glass-coffee-table.png",
    stock: { status: 'low-stock', quantity: 2 }
    // No colors for glass table
  },
  { 
    sku: "DR-8095", 
    name: "6-Drawer Dresser", 
    price: 899, 
    image: "/images/products/6-drawer-dresser.png",
    stock: { status: 'discontinued', quantity: 0, leadTimeText: 'No Longer Available' },
    colors: [
      { name: "Arctic White", value: "#F8F8FF" },
      { name: "Dove Gray", value: "#696969" }
    ]
  },
];
