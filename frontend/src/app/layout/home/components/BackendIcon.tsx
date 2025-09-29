interface BackendIconProps {
  className?: string;
}

export default function BackendIcon({ className = "card-icon backend-inventory" }: BackendIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id="bgInventoryGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#38bdf8"/>
          <stop offset="1" stopColor="#0ea5e9"/>
        </linearGradient>
        <linearGradient id="bgInventoryAccent" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#67e8f9"/>
          <stop offset="1" stopColor="#38bdf8"/>
        </linearGradient>
      </defs>
      
      {/* Back box - stacked inventory */}
      <path d="M4 8 L10 5 L10 14 L4 17 Z" fill="url(#bgInventoryGrad)" opacity="0.7"/>
      <path d="M10 5 L16 8 L16 17 L10 14 Z" fill="url(#bgInventoryGrad)" opacity="0.7"/>
      <path d="M4 8 L10 11 L16 8 L10 5 Z" fill="url(#bgInventoryAccent)" opacity="0.7"/>
      
      {/* Front box - main inventory item */}
      <path d="M8 11 L14 8 L14 19 L8 22 Z" fill="url(#bgInventoryGrad)"/>
      <path d="M14 8 L20 11 L20 22 L14 19 Z" fill="url(#bgInventoryGrad)" opacity="0.9"/>
      <path d="M8 11 L14 14 L20 11 L14 8 Z" fill="url(#bgInventoryAccent)"/>
      
      {/* Box tape/seal details for realism */}
      <path d="M11 12.5 L14 14 L17 12.5" stroke="white" strokeWidth="0.5" fill="none" opacity="0.8"/>
      <path d="M7 6.5 L10 8 L13 6.5" stroke="white" strokeWidth="0.5" fill="none" opacity="0.6"/>
      
      {/* Label on front box */}
      <g opacity="0.9">
        <rect x="11" y="15" width="4" height="2" fill="white" opacity="0.8"/>
        <line x1="11.5" y1="15.7" x2="14.5" y2="15.7" stroke="#0ea5e9" strokeWidth="0.3"/>
        <line x1="11.5" y1="16.3" x2="13.5" y2="16.3" stroke="#0ea5e9" strokeWidth="0.3"/>
      </g>
    </svg>
  );
}