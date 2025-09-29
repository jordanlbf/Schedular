interface FrontDeskIconProps {
  className?: string;
}

export default function FrontDeskIcon({ className = "card-icon frontdesk-register" }: FrontDeskIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id="fdRegisterGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f59e0b"/>
          <stop offset="1" stopColor="#ea580c"/>
        </linearGradient>
        <linearGradient id="fdRegisterAccent" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbbf24"/>
          <stop offset="1" stopColor="#f59e0b"/>
        </linearGradient>
        <linearGradient id="fdDisplayGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#10b981"/>
          <stop offset="1" stopColor="#059669"/>
        </linearGradient>
      </defs>

      {/* Cash drawer base */}
      <rect x="3" y="14" width="18" height="6" rx="1.5" fill="url(#fdRegisterGrad)"/>
      
      {/* Drawer compartments */}
      <g fill="white" opacity="0.85">
        <rect x="5" y="15.5" width="3" height="3" rx="0.3"/>
        <rect x="10.5" y="15.5" width="3" height="3" rx="0.3"/>
        <rect x="16" y="15.5" width="3" height="3" rx="0.3"/>
      </g>
      
      {/* Register body */}
      <path d="M5 6 Q5 4, 7 4 L17 4 Q19 4, 19 6 L19 14 L5 14Z" fill="url(#fdRegisterAccent)"/>
      
      {/* Display screen */}
      <rect x="7" y="6.5" width="10" height="3.5" rx="0.8" fill="#1f2937" opacity="0.95"/>
      <rect x="8" y="7.5" width="8" height="1.5" rx="0.3" fill="url(#fdDisplayGrad)"/>
      
      {/* Display text effect */}
      <g fill="white" opacity="0.8">
        <rect x="9" y="8" width="2" height="0.5" rx="0.1"/>
        <rect x="11.5" y="8" width="1.5" height="0.5" rx="0.1"/>
        <rect x="13.5" y="8" width="2" height="0.5" rx="0.1"/>
      </g>
      
      {/* Number pad */}
      <g fill="white" opacity="0.9">
        <circle cx="8.5" cy="11.5" r="0.6"/>
        <circle cx="10.5" cy="11.5" r="0.6"/>
        <circle cx="12.5" cy="11.5" r="0.6"/>
        <circle cx="14.5" cy="11.5" r="0.6"/>
        <circle cx="16.5" cy="11.5" r="0.6"/>
      </g>
      
      {/* Cash register handle detail */}
      <rect x="11" y="3.5" width="2" height="1" rx="0.5" fill="url(#fdRegisterGrad)" opacity="0.7"/>
      
      {/* Subtle highlight for depth */}
      <path d="M5 6.5 Q12 5.5, 19 6.5 L19 7.2 Q12 6.2, 5 7.2Z" fill="white" opacity="0.12"/>
    </svg>
  );
}