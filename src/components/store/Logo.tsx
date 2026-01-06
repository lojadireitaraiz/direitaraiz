export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background gradient for DIREITA */}
      <defs>
        <linearGradient id="greenYellowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4CAF50" />
          <stop offset="100%" stopColor="#FFEB3B" />
        </linearGradient>
      </defs>
      
      {/* Top section with gradient background */}
      <rect x="0" y="0" width="160" height="35" fill="url(#greenYellowGradient)" />
      
      {/* DIREITA text */}
      <text
        x="80"
        y="27"
        textAnchor="middle"
        fontFamily="Arial Black, sans-serif"
        fontSize="26"
        fontWeight="900"
        fill="#1a1a1a"
      >
        DIREITA
      </text>
      
      {/* Bottom section with black background */}
      <rect x="0" y="35" width="160" height="35" fill="#000000" />
      
      {/* RAIZ text */}
      <text
        x="80"
        y="70"
        textAnchor="middle"
        fontFamily="Arial Black, sans-serif"
        fontSize="42"
        fontWeight="900"
        fill="#FFFFFF"
      >
        RAIZ
      </text>
    </svg>
  );
}
