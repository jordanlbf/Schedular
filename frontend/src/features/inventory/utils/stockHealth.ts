const MAX_STOCK = 15;

export type StockHealthClass = 'high' | 'low' | 'zero';

export interface StockHealth {
  percentage: number;
  healthClass: StockHealthClass;
}

/**
 * Calculate stock health metrics for visual indicators
 */
export function getStockHealth(stock: number): StockHealth {
  const percentage = Math.min((stock / MAX_STOCK) * 100, 100);
  let healthClass: StockHealthClass = 'high';

  if (stock === 0) {
    healthClass = 'zero';
  } else if (stock <= 3) {
    healthClass = 'low';
  }

  return { percentage, healthClass };
}
