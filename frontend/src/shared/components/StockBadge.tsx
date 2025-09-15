import type { Product } from '@/shared/types';

interface StockBadgeProps {
  stock: Product['stock'];
}

export function StockBadge({ stock }: StockBadgeProps) {
  const getBadgeInfo = () => {
    switch (stock.status) {
      case 'in-stock':
        return { text: 'In Stock', className: 'in-stock' };
      case 'low-stock':
        return { text: 'Low Stock', className: 'low-stock' };
      case 'out-of-stock':
        return { text: 'No Stock', className: 'out-of-stock' };
      case 'discontinued':
        return { text: 'Discontinued', className: 'discontinued' };
      default:
        return { text: '', className: '' };
    }
  };

  const { text, className } = getBadgeInfo();
  if (!text) return null;

  return (
    <span className={`stock-badge ${className}`}>
      {text}
    </span>
  );
}