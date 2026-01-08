import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export function PageLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Show loader when route changes
    setIsLoading(true);
    setShowLoader(true);

    // Hide loader after 1 second
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Remove from DOM after fade out animation
    const removeTimer = setTimeout(() => {
      setShowLoader(false);
    }, 1300);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, [location.pathname]);

  if (!showLoader) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-white transition-opacity duration-300 ${
        isLoading ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Waving Brazilian Flag */}
        <div className="relative w-20 h-14 overflow-hidden">
          <svg 
            viewBox="0 0 100 70" 
            className="w-full h-full animate-wave"
            style={{
              filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.2))'
            }}
          >
            {/* Flag background - Green */}
            <rect x="0" y="0" width="100" height="70" fill="#009c3b" />
            
            {/* Yellow diamond */}
            <polygon 
              points="50,5 95,35 50,65 5,35" 
              fill="#ffdf00"
            />
            
            {/* Blue circle */}
            <circle cx="50" cy="35" r="17" fill="#002776" />
            
            {/* White band */}
            <path 
              d="M 33,35 Q 50,28 67,35" 
              stroke="white" 
              strokeWidth="3" 
              fill="none"
            />
          </svg>
          
          {/* Pole */}
          <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-gray-600 to-gray-800 rounded-full" />
        </div>
        
        <span className="text-sm text-gray-500 font-medium">Carregando...</span>
      </div>

      <style>{`
        @keyframes wave {
          0%, 100% {
            transform: perspective(200px) rotateY(0deg) skewY(0deg);
          }
          25% {
            transform: perspective(200px) rotateY(-5deg) skewY(2deg);
          }
          50% {
            transform: perspective(200px) rotateY(0deg) skewY(0deg);
          }
          75% {
            transform: perspective(200px) rotateY(5deg) skewY(-2deg);
          }
        }
        
        .animate-wave {
          animation: wave 1.5s ease-in-out infinite;
          transform-origin: left center;
        }
      `}</style>
    </div>
  );
}
