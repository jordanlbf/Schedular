interface CheckStockIconProps {
  className?: string;
}

export default function CheckStockIcon({ className = "card-icon check-stock" }: CheckStockIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id="checkStockGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c084fc"/>
          <stop offset="1" stopColor="#a78bfa"/>
        </linearGradient>
        <linearGradient id="checkStockAccent" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a78bfa"/>
          <stop offset="1" stopColor="#9333ea"/>
        </linearGradient>
      </defs>
      
      {/* 3D Box */}
      <path d="M4 8 L12 4 L20 8 L20 16 L12 20 L4 16 Z" fill="url(#checkStockGrad)" opacity="0.3"/>
      <path d="M4 8 L12 12 L20 8" stroke="url(#checkStockGrad)" strokeWidth="1.5" fill="none"/>
      <path d="M12 12 L12 20" stroke="url(#checkStockGrad)" strokeWidth="1.5"/>
      
      {/* Magnifying glass */}
      <circle cx="15" cy="15" r="4" fill="white" stroke="url(#checkStockAccent)" strokeWidth="2"/>
      <line x1="17.5" y1="17.5" x2="20" y2="20" stroke="url(#checkStockAccent)" strokeWidth="2" strokeLinecap="round"/>
      
      {/* Stock level bars inside magnifier */}
      <rect x="13.5" y="14" width="1" height="2" fill="url(#checkStockAccent)"/>
      <rect x="15" y="13" width="1" height="3" fill="url(#checkStockAccent)"/>
      <rect x="16.5" y="14.5" width="1" height="1.5" fill="url(#checkStockAccent)"/>
    </svg>
  );
}