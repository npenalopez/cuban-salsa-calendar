interface CubanFlagIconProps {
  size?: number;
  className?: string;
}

export function CubanFlagIcon({ size = 18, className = "" }: CubanFlagIconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 18" 
      fill="none" 
      className={className}
      aria-label="Cuban Salsa Calendar logo"
    >
      {/* Blue stripes */}
      <rect x="0" y="0" width="24" height="3.6" fill="#0066CC" />
      <rect x="0" y="7.2" width="24" height="3.6" fill="#0066CC" />
      <rect x="0" y="14.4" width="24" height="3.6" fill="#0066CC" />
      
      {/* White stripes */}
      <rect x="0" y="3.6" width="24" height="3.6" fill="white" />
      <rect x="0" y="10.8" width="24" height="3.6" fill="white" />
      
      {/* Red triangle */}
      <path d="M0 0 L9 9 L0 18 Z" fill="#CC0000" />
      
      {/* White star */}
      <path 
        d="M4.5 6.5 L5.2 8.5 L7.5 8.5 L5.7 9.8 L6.4 11.8 L4.5 10.5 L2.6 11.8 L3.3 9.8 L1.5 8.5 L3.8 8.5 Z" 
        fill="white" 
        stroke="none"
      />
    </svg>
  );
}