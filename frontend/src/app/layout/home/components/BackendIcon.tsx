interface BackendIconProps {
  className?: string;
}

export default function BackendIcon({ className = "card-icon backend-inventory" }: BackendIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <linearGradient id="bgOfficeDesk" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#60a5fa"/>
          <stop offset="1" stopColor="#3b82f6"/>
        </linearGradient>
        <linearGradient id="bgDeskAccent" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#93c5fd"/>
          <stop offset="1" stopColor="#60a5fa"/>
        </linearGradient>
        <linearGradient id="bgDeskDrawer" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1e40af"/>
          <stop offset="1" stopColor="#1d4ed8"/>
        </linearGradient>
      </defs>
      
      {/* Desk surface - brighter blue */}
      <rect x="2" y="12" width="20" height="8" rx="1" fill="url(#bgOfficeDesk)"/>
      
      {/* Desk drawers - darker for contrast */}
      <rect x="3" y="14" width="6" height="2" rx="0.3" fill="url(#bgDeskDrawer)" opacity="0.8"/>
      <rect x="3" y="17" width="6" height="2" rx="0.3" fill="url(#bgDeskDrawer)" opacity="0.8"/>
      <circle cx="6" cy="15" r="0.4" fill="white" opacity="0.9"/>
      <circle cx="6" cy="18" r="0.4" fill="white" opacity="0.9"/>
      
      {/* Computer monitor - better contrast */}
      <rect x="11" y="7" width="8" height="5" rx="0.5" fill="#1e293b"/>
      <rect x="12" y="8" width="6" height="3" rx="0.3" fill="url(#bgDeskAccent)"/>
      
      {/* Monitor stand - matching desk color */}
      <rect x="14" y="12" width="2" height="1" fill="#2563eb"/>
      <rect x="13" y="13" width="4" height="0.5" fill="#2563eb"/>
      
      {/* Paperwork/documents - brighter white */}
      <rect x="4" y="10" width="3" height="2" fill="white"/>
      <line x1="4.5" y1="10.5" x2="6.5" y2="10.5" stroke="#3b82f6" strokeWidth="0.3"/>
      <line x1="4.5" y1="11" x2="6" y2="11" stroke="#3b82f6" strokeWidth="0.3"/>
      <line x1="4.5" y1="11.5" x2="6.5" y2="11.5" stroke="#3b82f6" strokeWidth="0.3"/>
      
      {/* Coffee mug (instead of lamp) for office feel */}
      <ellipse cx="19" cy="11" rx="1.2" ry="0.3" fill="#6b7280"/>
      <path d="M17.8 11 L17.8 13 Q17.8 14, 19 14 Q20.2 14, 20.2 13 L20.2 11" fill="#f3f4f6"/>
      <path d="M19.8 11.5 Q20.5 11.5, 20.5 12.5 Q20.5 13.5, 19.8 13.5" fill="none" stroke="#f3f4f6" strokeWidth="0.8"/>
      
      {/* Pen holder */}
      <rect x="9" y="10.5" width="1.5" height="1.5" rx="0.2" fill="#4b5563"/>
      <line x1="9.3" y1="9.5" x2="9.3" y2="10.5" stroke="#1e293b" strokeWidth="0.3"/>
      <line x1="9.7" y1="9" x2="9.7" y2="10.5" stroke="#ef4444" strokeWidth="0.3"/>
      <line x1="10.1" y1="9.3" x2="10.1" y2="10.5" stroke="#3b82f6" strokeWidth="0.3"/>
    </svg>
  );
}