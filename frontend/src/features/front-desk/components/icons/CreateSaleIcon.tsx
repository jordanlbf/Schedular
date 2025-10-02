interface CreateSaleIconProps {
  className?: string;
}

export default function CreateSaleIcon({ className = "card-icon create-sale" }: CreateSaleIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id="createSaleGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#34d399"/>
          <stop offset="1" stopColor="#10b981"/>
        </linearGradient>
        <linearGradient id="createSalePlus" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#10b981"/>
          <stop offset="1" stopColor="#059669"/>
        </linearGradient>
      </defs>
      
      {/* Cart body */}
      <path d="M5 7 L6 7 L8 15 L18 15 L20 7 L7 7" stroke="url(#createSaleGrad)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 7 L6 7 L8 15 L18 15 L20 7 L7 7" fill="url(#createSaleGrad)" opacity="0.2"/>
      
      {/* Cart items */}
      <rect x="9" y="9" width="3" height="4" rx="0.5" fill="url(#createSaleGrad)" opacity="0.6"/>
      <rect x="13" y="10" width="3" height="3" rx="0.5" fill="url(#createSaleGrad)" opacity="0.6"/>
      
      {/* Wheels */}
      <circle cx="9" cy="19" r="1.5" fill="url(#createSaleGrad)"/>
      <circle cx="17" cy="19" r="1.5" fill="url(#createSaleGrad)"/>
      
      {/* Plus sign circle */}
      <circle cx="18" cy="6" r="4" fill="url(#createSalePlus)"/>
      
      {/* Plus sign */}
      <path d="M16 6 L20 6 M18 4 L18 8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}