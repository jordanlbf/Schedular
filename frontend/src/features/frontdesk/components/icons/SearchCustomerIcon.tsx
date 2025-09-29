interface SearchCustomerIconProps {
  className?: string;
}

export default function SearchCustomerIcon({ className = "card-icon search-customer" }: SearchCustomerIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id="searchCustGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fbbf24"/>
          <stop offset="1" stopColor="#f59e0b"/>
        </linearGradient>
        <linearGradient id="searchCustAccent" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f59e0b"/>
          <stop offset="1" stopColor="#ea580c"/>
        </linearGradient>
      </defs>
      
      {/* Person */}
      <circle cx="10" cy="8" r="3" fill="url(#searchCustGrad)" opacity="0.7"/>
      <path d="M10 12 Q6 12, 6 16 L6 18 Q6 19, 7 19 L13 19 Q14 19, 14 18 L14 16 Q14 12, 10 12" fill="url(#searchCustGrad)" opacity="0.7"/>
      
      {/* Magnifying glass */}
      <circle cx="16" cy="16" r="4" fill="none" stroke="url(#searchCustAccent)" strokeWidth="2"/>
      <line x1="18.5" y1="18.5" x2="21" y2="21" stroke="url(#searchCustAccent)" strokeWidth="2" strokeLinecap="round"/>
      
      {/* Search detail - focus circle inside magnifier */}
      <circle cx="16" cy="16" r="2" fill="url(#searchCustAccent)" opacity="0.2"/>
    </svg>
  );
}