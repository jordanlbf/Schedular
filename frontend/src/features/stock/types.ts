// Stock feature types
export interface StockItem {
  id: string;
  productId: string;
  warehouseId?: string;
  quantity: number;
  reserved: number;
  available: number;
  reorderPoint: number;
  reorderQuantity: number;
  lastRestocked?: Date;
  nextReorderDate?: Date;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: StockMovementType;
  quantity: number;
  reference?: string;
  reason?: string;
  performedBy: string;
  createdAt: Date;
}

export enum StockMovementType {
  IN = 'in',
  OUT = 'out',
  ADJUSTMENT = 'adjustment',
  TRANSFER = 'transfer',
  RETURN = 'return',
}

export interface StockAlert {
  id: string;
  productId: string;
  type: StockAlertType;
  message: string;
  severity: 'low' | 'medium' | 'high';
  createdAt: Date;
  resolvedAt?: Date;
}

export enum StockAlertType {
  LOW_STOCK = 'low_stock',
  OUT_OF_STOCK = 'out_of_stock',
  OVERSTOCK = 'overstock',
  EXPIRING = 'expiring',
}

export interface StockCheck {
  productId: string;
  requestedQuantity: number;
  availableQuantity: number;
  isAvailable: boolean;
  alternatives?: string[];
}

export interface StockState {
  items: StockItem[];
  movements: StockMovement[];
  alerts: StockAlert[];
  isLoading: boolean;
  error: string | null;
}
