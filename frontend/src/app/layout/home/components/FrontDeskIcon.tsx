interface FrontDeskIconProps {
  className?: string;
}

export default function FrontDeskIcon({ className = "card-icon frontdesk-register" }: FrontDeskIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id="fdModernTill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbbf24"/>
          <stop offset="1" stopColor="#f59e0b"/>
        </linearGradient>
        <linearGradient id="fdTillAccent" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fed7aa"/>
          <stop offset="1" stopColor="#fbbf24"/>
        </linearGradient>
        <linearGradient id="fdTillScreen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#10b981"/>
          <stop offset="1" stopColor="#059669"/>
        </linearGradient>
      </defs>
      
      {/* Till body */}
      <path d="M4 10 L20 10 L20 20 Q20 21, 19 21 L5 21 Q4 21, 4 20 Z" fill="url(#fdModernTill)"/>
      
      {/* Display screen */}
      <rect x="6" y="12" width="12" height="5" rx="0.5" fill="#1f2937" opacity="0.9"/>
      <rect x="7" y="13" width="10" height="3" rx="0.3" fill="url(#fdTillScreen)" opacity="0.9"/>
      
      {/* Number display */}
      <text x="12" y="15.2" textAnchor="middle" fill="white" fontSize="2" fontWeight="bold">$42.50</text>
      
      {/* Keys/buttons */}
      <g fill="white" opacity="0.9">
        <circle cx="7" cy="19" r="0.5"/>
        <circle cx="9" cy="19" r="0.5"/>
        <circle cx="11" cy="19" r="0.5"/>
        <circle cx="13" cy="19" r="0.5"/>
        <circle cx="15" cy="19" r="0.5"/>
        <circle cx="17" cy="19" r="0.5"/>
      </g>
      
      {/* Receipt slot at top */}
      <rect x="9" y="6" width="6" height="4" rx="0.3" fill="url(#fdTillAccent)"/>
      
      {/* Receipt paper */}
      <rect x="10" y="3" width="4" height="3.5" fill="white" opacity="0.9"/>
      <line x1="11" y1="4" x2="13" y2="4" stroke="#f59e0b" strokeWidth="0.3"/>
      <line x1="11" y1="5" x2="13" y2="5" stroke="#f59e0b" strokeWidth="0.3"/>
    </svg>
  );
}