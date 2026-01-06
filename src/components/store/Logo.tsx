export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 -5 200 80"
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
      <rect x="0" y="0" width="200" height="40" fill="url(#greenYellowGradient)" />
      
      {/* DIREITA text */}
      <text
        x="100"
        y="28"
        textAnchor="middle"
        fontFamily="Arial Black, sans-serif"
        fontSize="30"
        fontWeight="900"
        fill="#1a1a1a"
      >
        DIREITA
      </text>
      
      {/* Bottom section with black background */}
      <rect x="0" y="40" width="200" height="40" fill="#000000" />
      
      {/* RAIZ text */}
      <text
        x="100"
        y="79"
        textAnchor="middle"
        fontFamily="Arial Black, sans-serif"
        fontSize="49"
        fontWeight="900"
        fill="#FFFFFF"
      >
        RAIZ
      </text>
    </svg>
  );
}
