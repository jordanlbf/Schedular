interface SortIconProps {
  column: string;
  currentColumn: string;
  direction: 'asc' | 'desc';
}

export function SortIcon({ column, currentColumn, direction }: SortIconProps) {
  if (currentColumn !== column) {
    return <span className="sort-icon-inactive">↕</span>;
  }
  return <span className="sort-icon-active">{direction === 'asc' ? '↑' : '↓'}</span>;
}
