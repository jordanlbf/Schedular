interface TruckIconProps {
  className?: string;
  size?: number;
}

export default function TruckIcon({ className = "", size = 36 }: TruckIconProps) {
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
      {/* Truck body */}
      <rect x="1" y="6" width="14" height="8" rx="1" />
      <path d="M15 8h3l3 3v5h-6V8z" />
      
      {/* Wheels */}
      <circle cx="5.5" cy="17.5" r="2.5" />
      <circle cx="18.5" cy="17.5" r="2.5" />
      
      {/* Details */}
      <path d="M4 6V4" />
      <path d="M8 6V4" />
      <path d="M12 6V4" />
    </svg>
  );
}
