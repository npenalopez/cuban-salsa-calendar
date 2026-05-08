import { useEffect, useState } from 'react';

export function SalsaLoadingAnimation() {
  const [fillLevel, setFillLevel] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFillLevel(prev => {
        if (prev >= 100) {
          // Reset with a slight delay for a more natural cycle
          setTimeout(() => setFillLevel(0), 500);
          return 100;
        }
        // Slower fill rate for more realistic loading
        const increment = prev < 20 ? 1.5 : prev < 80 ? 1 : 0.5;
        return prev + increment;
      });
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="bg-white rounded-lg p-8 max-w-sm mx-auto border border-gray-200 shadow-sm salsa-loading-container">
        {/* Salsa Bottle SVG Animation */}
        <div className="relative mx-auto mb-6" style={{ width: '80px', height: '120px' }}>
          <svg
            width="80"
            height="120"
            viewBox="0 0 80 120"
            className="absolute inset-0"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Clip path for bottle shape */}
              <clipPath id="bottleClip">
                <path d="M20 25 L20 35 L17 35 Q15 35 15 37 L15 100 Q15 108 23 108 L57 108 Q65 108 65 100 L65 37 Q65 35 63 35 L60 35 L60 25 L55 20 L55 15 Q55 10 50 10 L30 10 Q25 10 25 15 L25 20 Z" />
              </clipPath>
              
              {/* Gradient for liquid */}
              <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#111827" />
                <stop offset="50%" stopColor="#1F2937" />
                <stop offset="100%" stopColor="#111827" />
              </linearGradient>
            </defs>
            
            {/* Bottle body */}
            <path
              d="M20 25 L20 35 L17 35 Q15 35 15 37 L15 100 Q15 108 23 108 L57 108 Q65 108 65 100 L65 37 Q65 35 63 35 L60 35 L60 25 L55 20 L55 15 Q55 10 50 10 L30 10 Q25 10 25 15 L25 20 Z"
              fill="none"
              stroke="#374151"
              strokeWidth="2.5"
              className="bottle-outline"
            />
            
            {/* Bottle neck */}
            <rect
              x="30"
              y="5"
              width="20"
              height="15"
              rx="2"
              fill="none"
              stroke="#374151"
              strokeWidth="2.5"
            />
            
            {/* Bottle cap */}
            <rect
              x="27"
              y="1"
              width="26"
              height="7"
              rx="2"
              fill="#111827"
              stroke="#374151"
              strokeWidth="1"
            />
            
            {/* Cap ridges */}
            <line x1="30" y1="2" x2="30" y2="6" stroke="#6B7280" strokeWidth="0.5" />
            <line x1="33" y1="2" x2="33" y2="6" stroke="#6B7280" strokeWidth="0.5" />
            <line x1="36" y1="2" x2="36" y2="6" stroke="#6B7280" strokeWidth="0.5" />
            <line x1="39" y1="2" x2="39" y2="6" stroke="#6B7280" strokeWidth="0.5" />
            <line x1="42" y1="2" x2="42" y2="6" stroke="#6B7280" strokeWidth="0.5" />
            <line x1="45" y1="2" x2="45" y2="6" stroke="#6B7280" strokeWidth="0.5" />
            <line x1="48" y1="2" x2="48" y2="6" stroke="#6B7280" strokeWidth="0.5" />
            <line x1="51" y1="2" x2="51" y2="6" stroke="#6B7280" strokeWidth="0.5" />
            
            {/* Liquid fill */}
            <rect
              x="15"
              y={108 - (fillLevel * 0.85)} 
              width="50"
              height={fillLevel * 0.85}
              fill="url(#liquidGradient)"
              clipPath="url(#bottleClip)"
              className="liquid-fill"
            />
            
            {/* Liquid surface animation */}
            <ellipse
              cx="40"
              cy={108 - (fillLevel * 0.85)}
              rx="22"
              ry="1.5"
              fill="#374151"
              clipPath="url(#bottleClip)"
              opacity="0.7"
              className="liquid-surface"
            />
            
            {/* Label */}
            <rect
              x="22"
              y="45"
              width="36"
              height="25"
              rx="3"
              fill="rgba(255, 255, 255, 0.9)"
              stroke="#D1D5DB"
              strokeWidth="1"
            />
            
            {/* Label text */}
            <text
              x="40"
              y="53"
              textAnchor="middle"
              fontSize="7"
              fill="#111827"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="700"
            >
              SALSA
            </text>
            
            {/* Label subtext */}
            <text
              x="40"
              y="61"
              textAnchor="middle"
              fontSize="4"
              fill="#6B7280"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="500"
            >
              FESTIVAL
            </text>
            
            {/* Label decoration */}
            <line x1="26" y1="65" x2="54" y2="65" stroke="#E5E7EB" strokeWidth="0.5" />
          </svg>
          
          {/* Bubbles animation - only show when liquid is present */}
          {fillLevel > 20 && (
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="absolute bg-white rounded-full opacity-60"
                  style={{
                    width: `${2 + Math.random() * 2}px`,
                    height: `${2 + Math.random() * 2}px`,
                    left: `${35 + Math.random() * 15}%`,
                    bottom: `${15 + Math.random() * (fillLevel * 0.6)}%`,
                    animationName: `bubble-float-${i}`,
                    animationDuration: `${2 + Math.random() * 2}s`,
                    animationTimingFunction: 'ease-in-out',
                    animationIterationCount: 'infinite',
                    animationDelay: `${i * 0.4}s`
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Loading message */}
        <div className="text-center">
          <h3 className="font-semibold text-gray-900 mb-2">
            Loading Salsa...
          </h3>
          <p className="text-gray-600 text-sm">
            {fillLevel < 25 && "Connecting to festivals..."}
            {fillLevel >= 25 && fillLevel < 50 && "Gathering festival data..."}
            {fillLevel >= 50 && fillLevel < 75 && "Preparing your experience..."}
            {fillLevel >= 75 && "Almost ready..."}
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-gray-800 h-2 rounded-full transition-all duration-150 ease-out relative"
            style={{ width: `${fillLevel}%` }}
          >
            {/* Progress shine effect */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
              style={{
                transform: 'translateX(-100%)',
                animationName: fillLevel > 0 ? 'progress-shine' : 'none',
                animationDuration: fillLevel > 0 ? '2s' : undefined,
                animationTimingFunction: fillLevel > 0 ? 'ease-in-out' : undefined,
                animationIterationCount: fillLevel > 0 ? 'infinite' : undefined
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}