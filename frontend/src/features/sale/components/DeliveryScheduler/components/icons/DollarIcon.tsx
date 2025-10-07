interface DollarIconProps {
  className?: string;
  size?: number;
}

export default function DollarIcon({ className = "", size = 36 }: DollarIconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Vertical line */}
      <line x1="12" y1="2" x2="12" y2="22" />
      
      {/* S shape */}
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
