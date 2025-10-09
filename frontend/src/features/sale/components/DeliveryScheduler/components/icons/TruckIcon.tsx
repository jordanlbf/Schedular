interface TruckIconProps {
  className?: string;
  size?: number;
}

export default function TruckIcon({ className = "", size = 40 }: TruckIconProps) {
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
      <path d="M13 16V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h1m8-1a1 1 0 0 1-1 1H9m4-1V8a1 1 0 0 1 1-1h2.586a1 1 0 0 1 .707.293l3.414 3.414a1 1 0 0 1 .293.707V16a1 1 0 0 1-1 1h-1m-6-1a1 1 0 0 0 1 1h1M5 17a2 2 0 1 0 4 0m-4 0a2 2 0 1 1 4 0m-4 0v-5h-.5a1 1 0 0 1-.866-.5L3 11m0 0l-.5-1a1 1 0 0 1 .866-1.5H5M3 11V8m10 8a2 2 0 1 0 4 0m-4 0a2 2 0 1 1 4 0m-4 0v-5h2" />
    </svg>
  );
}
