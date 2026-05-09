import { memo } from 'react';

interface CountryFlagIconProps {
  country: string;
  size?: number;
  className?: string;
}

function CountryFlagIconImpl({ country, size = 16, className = "" }: CountryFlagIconProps) {
  const normalizedCountry = country.toLowerCase().trim();

  // Common aspect ratio for flags (3:2)
  const width = size;
  const height = Math.round(size * 0.67);

  const getFlagSVG = () => {
    switch (normalizedCountry) {
      case 'cuba':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            {/* Blue stripes */}
            <rect x="0" y="0" width="24" height="3.2" fill="#0066CC" />
            <rect x="0" y="6.4" width="24" height="3.2" fill="#0066CC" />
            <rect x="0" y="12.8" width="24" height="3.2" fill="#0066CC" />
            {/* White stripes */}
            <rect x="0" y="3.2" width="24" height="3.2" fill="white" />
            <rect x="0" y="9.6" width="24" height="3.2" fill="white" />
            {/* Red triangle */}
            <path d="M0 0 L8 8 L0 16 Z" fill="#CC0000" />
            {/* White star */}
            <path d="M4 5.5 L4.5 7 L6 7 L4.8 7.8 L5.3 9.3 L4 8.5 L2.7 9.3 L3.2 7.8 L2 7 L3.5 7 Z" fill="white" />
          </svg>
        );

      case 'spain':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            <rect x="0" y="0" width="24" height="4" fill="#AA151B" />
            <rect x="0" y="4" width="24" height="8" fill="#F1BF00" />
            <rect x="0" y="12" width="24" height="4" fill="#AA151B" />
            {/* Simplified coat of arms */}
            <rect x="6" y="6" width="4" height="4" fill="#AA151B" rx="0.5" />
          </svg>
        );

      case 'colombia':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            <rect x="0" y="0" width="24" height="8" fill="#FFDE00" />
            <rect x="0" y="8" width="24" height="4" fill="#003893" />
            <rect x="0" y="12" width="24" height="4" fill="#CE1126" />
          </svg>
        );

      case 'puerto rico':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            {/* Red stripes */}
            <rect x="0" y="0" width="24" height="3.2" fill="#ED1C24" />
            <rect x="0" y="6.4" width="24" height="3.2" fill="#ED1C24" />
            <rect x="0" y="12.8" width="24" height="3.2" fill="#ED1C24" />
            {/* White stripes */}
            <rect x="0" y="3.2" width="24" height="3.2" fill="white" />
            <rect x="0" y="9.6" width="24" height="3.2" fill="white" />
            {/* Blue triangle */}
            <path d="M0 0 L8 8 L0 16 Z" fill="#0050F0" />
            {/* White star */}
            <path d="M4 5.5 L4.5 7 L6 7 L4.8 7.8 L5.3 9.3 L4 8.5 L2.7 9.3 L3.2 7.8 L2 7 L3.5 7 Z" fill="white" />
          </svg>
        );

      case 'usa':
      case 'united states':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            {/* Red stripes */}
            <rect x="0" y="0" width="24" height="1.23" fill="#B22234" />
            <rect x="0" y="2.46" width="24" height="1.23" fill="#B22234" />
            <rect x="0" y="4.92" width="24" height="1.23" fill="#B22234" />
            <rect x="0" y="7.38" width="24" height="1.23" fill="#B22234" />
            <rect x="0" y="9.84" width="24" height="1.23" fill="#B22234" />
            <rect x="0" y="12.3" width="24" height="1.23" fill="#B22234" />
            <rect x="0" y="14.76" width="24" height="1.24" fill="#B22234" />
            {/* White stripes */}
            <rect x="0" y="1.23" width="24" height="1.23" fill="white" />
            <rect x="0" y="3.69" width="24" height="1.23" fill="white" />
            <rect x="0" y="6.15" width="24" height="1.23" fill="white" />
            <rect x="0" y="8.61" width="24" height="1.23" fill="white" />
            <rect x="0" y="11.07" width="24" height="1.23" fill="white" />
            <rect x="0" y="13.53" width="24" height="1.23" fill="white" />
            {/* Blue canton */}
            <rect x="0" y="0" width="9.6" height="8.61" fill="#3C3B6E" />
            {/* Simplified stars */}
            <circle cx="2.4" cy="2" r="0.3" fill="white" />
            <circle cx="4.8" cy="2" r="0.3" fill="white" />
            <circle cx="7.2" cy="2" r="0.3" fill="white" />
            <circle cx="3.6" cy="4" r="0.3" fill="white" />
            <circle cx="6" cy="4" r="0.3" fill="white" />
            <circle cx="2.4" cy="6" r="0.3" fill="white" />
            <circle cx="4.8" cy="6" r="0.3" fill="white" />
            <circle cx="7.2" cy="6" r="0.3" fill="white" />
          </svg>
        );

      case 'mexico':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            <rect x="0" y="0" width="8" height="16" fill="#006847" />
            <rect x="8" y="0" width="8" height="16" fill="white" />
            <rect x="16" y="0" width="8" height="16" fill="#CE1126" />
            {/* Simplified eagle */}
            <circle cx="12" cy="8" r="2" fill="#8B4513" />
          </svg>
        );

      case 'venezuela':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            <rect x="0" y="0" width="24" height="5.33" fill="#FFDE00" />
            <rect x="0" y="5.33" width="24" height="5.33" fill="#003893" />
            <rect x="0" y="10.66" width="24" height="5.34" fill="#CE1126" />
            {/* Simplified stars */}
            <circle cx="8" cy="8" r="0.4" fill="white" />
            <circle cx="10" cy="8" r="0.4" fill="white" />
            <circle cx="12" cy="8" r="0.4" fill="white" />
            <circle cx="14" cy="8" r="0.4" fill="white" />
            <circle cx="16" cy="8" r="0.4" fill="white" />
          </svg>
        );

      case 'brazil':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            <rect x="0" y="0" width="24" height="16" fill="#009639" />
            {/* Yellow diamond */}
            <path d="M12 2 L20 8 L12 14 L4 8 Z" fill="#FEDF00" />
            {/* Blue circle */}
            <circle cx="12" cy="8" r="3" fill="#002776" />
          </svg>
        );

      case 'argentina':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            <rect x="0" y="0" width="24" height="5.33" fill="#75AADB" />
            <rect x="0" y="5.33" width="24" height="5.33" fill="white" />
            <rect x="0" y="10.66" width="24" height="5.34" fill="#75AADB" />
            {/* Sun */}
            <circle cx="12" cy="8" r="2" fill="#FCDD09" stroke="#F25C05" strokeWidth="0.2" />
          </svg>
        );

      case 'france':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            <rect x="0" y="0" width="8" height="16" fill="#002395" />
            <rect x="8" y="0" width="8" height="16" fill="white" />
            <rect x="16" y="0" width="8" height="16" fill="#ED2939" />
          </svg>
        );

      case 'italy':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            <rect x="0" y="0" width="8" height="16" fill="#009246" />
            <rect x="8" y="0" width="8" height="16" fill="white" />
            <rect x="16" y="0" width="8" height="16" fill="#CE2B37" />
          </svg>
        );

      case 'germany':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            <rect x="0" y="0" width="24" height="5.33" fill="#000000" />
            <rect x="0" y="5.33" width="24" height="5.33" fill="#DD0000" />
            <rect x="0" y="10.66" width="24" height="5.34" fill="#FFCE00" />
          </svg>
        );

      case 'canada':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            <rect x="0" y="0" width="6" height="16" fill="#FF0000" />
            <rect x="6" y="0" width="12" height="16" fill="white" />
            <rect x="18" y="0" width="6" height="16" fill="#FF0000" />
            {/* Simplified maple leaf */}
            <path d="M12 4 L13 6 L15 6 L13.5 7.5 L14 9 L12 8 L10 9 L10.5 7.5 L9 6 L11 6 Z" fill="#FF0000" />
          </svg>
        );

      case 'uk':
      case 'united kingdom':
      case 'england':
        return (
          <svg width={width} height={height} viewBox="0 0 50 30" fill="none" className={className}>
            {/* Blue background */}
            <rect width="50" height="30" fill="#012169" />
            
            {/* White diagonals - thicker background */}
            <polygon points="0,0 0,6 44,30 50,30 50,24 6,0" fill="white" />
            <polygon points="0,30 0,24 44,0 50,0 50,6 6,30" fill="white" />
            
            {/* Red diagonals - offset and narrower */}
            <polygon points="0,0 0,3 47,30 50,30 50,27 3,0" fill="#C8102E" />
            <polygon points="0,30 0,27 47,0 50,0 50,3 3,30" fill="#C8102E" />
            
            {/* White cross - background for red cross */}
            <rect x="0" y="10" width="50" height="10" fill="white" />
            <rect x="20" y="0" width="10" height="30" fill="white" />
            
            {/* Red cross - St George's Cross */}
            <rect x="0" y="12" width="50" height="6" fill="#C8102E" />
            <rect x="22" y="0" width="6" height="30" fill="#C8102E" />
          </svg>
        );

      case 'chile':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            <rect x="0" y="0" width="24" height="8" fill="white" />
            <rect x="0" y="8" width="24" height="8" fill="#D52B1E" />
            <rect x="0" y="0" width="8" height="8" fill="#0039A6" />
            <path d="M4 2.5 L4.5 4 L6 4 L4.8 4.8 L5.3 6.3 L4 5.5 L2.7 6.3 L3.2 4.8 L2 4 L3.5 4 Z" fill="white" />
          </svg>
        );

      case 'peru':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            <rect x="0" y="0" width="8" height="16" fill="#D91023" />
            <rect x="8" y="0" width="8" height="16" fill="white" />
            <rect x="16" y="0" width="8" height="16" fill="#D91023" />
          </svg>
        );

      case 'ecuador':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            <rect x="0" y="0" width="24" height="8" fill="#FFDE00" />
            <rect x="0" y="8" width="24" height="4" fill="#003893" />
            <rect x="0" y="12" width="24" height="4" fill="#CE1126" />
          </svg>
        );

      case 'dominican republic':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            <rect x="0" y="0" width="24" height="16" fill="white" />
            <rect x="0" y="0" width="24" height="7" fill="#003893" />
            <rect x="0" y="9" width="24" height="7" fill="#CE1126" />
            <rect x="0" y="7" width="10" height="2" fill="white" />
            <rect x="14" y="7" width="10" height="2" fill="white" />
            <rect x="10" y="0" width="4" height="16" fill="white" />
          </svg>
        );

      case 'hungary':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            <rect x="0" y="0" width="24" height="5.33" fill="#CD212A" />
            <rect x="0" y="5.33" width="24" height="5.33" fill="white" />
            <rect x="0" y="10.66" width="24" height="5.34" fill="#436F4D" />
          </svg>
        );

      case 'norway':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            <rect x="0" y="0" width="24" height="16" fill="#BA0C2F" />
            {/* White cross */}
            <rect x="0" y="6" width="24" height="4" fill="white" />
            <rect x="6" y="0" width="4" height="16" fill="white" />
            {/* Blue cross */}
            <rect x="0" y="7" width="24" height="2" fill="#00205B" />
            <rect x="7" y="0" width="2" height="16" fill="#00205B" />
          </svg>
        );

      case 'poland':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            <rect x="0" y="0" width="24" height="8" fill="white" />
            <rect x="0" y="8" width="24" height="8" fill="#DC143C" />
          </svg>
        );

      case 'serbia':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            <rect x="0" y="0" width="24" height="5.33" fill="#C6363C" />
            <rect x="0" y="5.33" width="24" height="5.33" fill="#0C4076" />
            <rect x="0" y="10.66" width="24" height="5.34" fill="white" />
            {/* Simplified coat of arms */}
            <rect x="4" y="4" width="4" height="8" fill="#FFD700" rx="0.5" />
            <rect x="5" y="5" width="2" height="6" fill="#C6363C" />
          </svg>
        );

      case 'portugal':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            <rect x="0" y="0" width="9.6" height="16" fill="#046A38" />
            <rect x="9.6" y="0" width="14.4" height="16" fill="#DA020E" />
            {/* Simplified armillary sphere */}
            <circle cx="9.6" cy="8" r="2.5" fill="none" stroke="#FFD700" strokeWidth="0.5" />
            <circle cx="9.6" cy="8" r="1.5" fill="#FFD700" />
          </svg>
        );

      case 'austria':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            <rect x="0" y="0" width="24" height="5.33" fill="#ED2939" />
            <rect x="0" y="5.33" width="24" height="5.33" fill="white" />
            <rect x="0" y="10.66" width="24" height="5.34" fill="#ED2939" />
          </svg>
        );

      case 'croatia':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            <rect x="0" y="0" width="24" height="5.33" fill="#FF0000" />
            <rect x="0" y="5.33" width="24" height="5.33" fill="white" />
            <rect x="0" y="10.66" width="24" height="5.34" fill="#171796" />
            {/* Simplified coat of arms - Croatian checkerboard */}
            <rect x="10" y="4" width="4" height="8" fill="white" />
            <rect x="10" y="4" width="1" height="2" fill="#FF0000" />
            <rect x="11" y="6" width="1" height="2" fill="#FF0000" />
            <rect x="12" y="4" width="1" height="2" fill="#FF0000" />
            <rect x="13" y="6" width="1" height="2" fill="#FF0000" />
            <rect x="10" y="8" width="1" height="2" fill="#FF0000" />
            <rect x="11" y="10" width="1" height="2" fill="#FF0000" />
            <rect x="12" y="8" width="1" height="2" fill="#FF0000" />
            <rect x="13" y="10" width="1" height="2" fill="#FF0000" />
          </svg>
        );

      case 'slovenia':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            <rect x="0" y="0" width="24" height="5.33" fill="white" />
            <rect x="0" y="5.33" width="24" height="5.33" fill="#0000FF" />
            <rect x="0" y="10.66" width="24" height="5.34" fill="#FF0000" />
            {/* Simplified coat of arms - Mount Triglav */}
            <rect x="4" y="3" width="4" height="6" fill="white" stroke="#0000FF" strokeWidth="0.3" />
            <path d="M6 4 L5 6 L7 6 Z" fill="#0000FF" />
            <circle cx="6" cy="7" r="0.5" fill="#FFD700" />
          </svg>
        );

      case 'tunisia':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            <rect x="0" y="0" width="24" height="16" fill="#E70013" />
            {/* White circle */}
            <circle cx="12" cy="8" r="4" fill="white" />
            {/* Red crescent */}
            <circle cx="12.5" cy="8" r="2.5" fill="#E70013" />
            <circle cx="13.2" cy="8" r="2" fill="white" />
            {/* Red star */}
            <path d="M11.5 6 L11.8 7 L12.8 7 L12 7.6 L12.3 8.6 L11.5 8 L10.7 8.6 L11 7.6 L10.2 7 L11.2 7 Z" fill="#E70013" />
          </svg>
        );

      case 'greece':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            {/* Blue stripes (1st, 3rd, 5th, 7th, 9th) */}
            <rect x="0" y="0" width="24" height="1.78" fill="#0D5EAF" />
            <rect x="0" y="3.56" width="24" height="1.78" fill="#0D5EAF" />
            <rect x="0" y="7.11" width="24" height="1.78" fill="#0D5EAF" />
            <rect x="0" y="10.67" width="24" height="1.78" fill="#0D5EAF" />
            <rect x="0" y="14.22" width="24" height="1.78" fill="#0D5EAF" />
            {/* White stripes (2nd, 4th, 6th, 8th) */}
            <rect x="0" y="1.78" width="24" height="1.78" fill="white" />
            <rect x="0" y="5.33" width="24" height="1.78" fill="white" />
            <rect x="0" y="8.89" width="24" height="1.78" fill="white" />
            <rect x="0" y="12.44" width="24" height="1.78" fill="white" />
            {/* Blue canton */}
            <rect x="0" y="0" width="9.6" height="8.89" fill="#0D5EAF" />
            {/* White cross */}
            <rect x="0" y="3.56" width="9.6" height="1.78" fill="white" />
            <rect x="3.91" y="0" width="1.78" height="8.89" fill="white" />
          </svg>
        );

      case 'netherlands':
      case 'holland':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            <rect x="0" y="0" width="24" height="5.33" fill="#AE1C28" />
            <rect x="0" y="5.33" width="24" height="5.33" fill="white" />
            <rect x="0" y="10.66" width="24" height="5.34" fill="#21468B" />
          </svg>
        );

      case 'israel':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            <rect x="0" y="0" width="24" height="16" fill="white" />
            {/* Blue stripes */}
            <rect x="0" y="2" width="24" height="1.5" fill="#0038B8" />
            <rect x="0" y="12.5" width="24" height="1.5" fill="#0038B8" />
            {/* Star of David */}
            <path d="M12 5 L13.5 7.5 L16.5 7.5 L14.25 9.25 L15 12 L12 10 L9 12 L9.75 9.25 L7.5 7.5 L10.5 7.5 Z" fill="#0038B8" />
            <path d="M12 11 L10.5 8.5 L7.5 8.5 L9.75 6.75 L9 4 L12 6 L15 4 L14.25 6.75 L16.5 8.5 L13.5 8.5 Z" fill="#0038B8" />
          </svg>
        );

      case 'costa rica':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            {/* Blue stripe */}
            <rect x="0" y="0" width="24" height="3.2" fill="#002B7F" />
            {/* White stripe */}
            <rect x="0" y="3.2" width="24" height="3.2" fill="white" />
            {/* Red stripe */}
            <rect x="0" y="6.4" width="24" height="3.2" fill="#CE1126" />
            {/* White stripe */}
            <rect x="0" y="9.6" width="24" height="3.2" fill="white" />
            {/* Blue stripe */}
            <rect x="0" y="12.8" width="24" height="3.2" fill="#002B7F" />
          </svg>
        );

      case 'romania':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            <rect x="0" y="0" width="8" height="16" fill="#002B7F" />
            <rect x="8" y="0" width="8" height="16" fill="#FCD116" />
            <rect x="16" y="0" width="8" height="16" fill="#CE1126" />
          </svg>
        );

      case 'finland':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            <rect x="0" y="0" width="24" height="16" fill="white" />
            {/* Blue cross */}
            <rect x="0" y="6" width="24" height="4" fill="#003580" />
            <rect x="6" y="0" width="4" height="16" fill="#003580" />
          </svg>
        );

      case 'switzerland':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            <rect x="0" y="0" width="24" height="16" fill="#FF0000" />
            {/* White Swiss cross - bold and compact */}
            <rect x="7" y="5" width="10" height="6" fill="white" />
            <rect x="10" y="2" width="4" height="12" fill="white" />
          </svg>
        );

      case 'czech republic':
      case 'czechia':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            {/* White stripe */}
            <rect x="0" y="0" width="24" height="8" fill="white" />
            {/* Red stripe */}
            <rect x="0" y="8" width="24" height="8" fill="#D7141A" />
            {/* Blue triangle */}
            <path d="M0 0 L12 8 L0 16 Z" fill="#11457E" />
          </svg>
        );

      case 'japan':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            <rect x="0" y="0" width="24" height="16" fill="white" />
            {/* Red circle (sun) */}
            <circle cx="12" cy="8" r="4.5" fill="#BC002D" />
          </svg>
        );

      case 'sweden':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            <rect width="24" height="16" fill="#006AA7" />
            {/* Yellow Nordic cross (off-center toward hoist) */}
            <rect x="0" y="6" width="24" height="4" fill="#FECC00" />
            <rect x="6" y="0" width="4" height="16" fill="#FECC00" />
          </svg>
        );

      case 'russia':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            <rect x="0" y="0" width="24" height="5.33" fill="white" />
            <rect x="0" y="5.33" width="24" height="5.33" fill="#0039A6" />
            <rect x="0" y="10.66" width="24" height="5.34" fill="#D52B1E" />
          </svg>
        );

      case 'thailand':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            <rect x="0" y="0" width="24" height="2.67" fill="#A51931" />
            <rect x="0" y="2.67" width="24" height="2.67" fill="white" />
            <rect x="0" y="5.34" width="24" height="5.32" fill="#2D2A4A" />
            <rect x="0" y="10.66" width="24" height="2.67" fill="white" />
            <rect x="0" y="13.33" width="24" height="2.67" fill="#A51931" />
          </svg>
        );

      case 'uae':
      case 'united arab emirates':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            {/* Red vertical at hoist */}
            <rect x="0" y="0" width="6" height="16" fill="#EF3340" />
            {/* Green / white / black horizontals on the fly */}
            <rect x="6" y="0" width="18" height="5.33" fill="#009739" />
            <rect x="6" y="5.33" width="18" height="5.33" fill="white" />
            <rect x="6" y="10.66" width="18" height="5.34" fill="#000000" />
          </svg>
        );

      case 'egypt':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            <rect x="0" y="0" width="24" height="5.33" fill="#CE1126" />
            <rect x="0" y="5.33" width="24" height="5.33" fill="white" />
            <rect x="0" y="10.66" width="24" height="5.34" fill="#000000" />
            {/* Simplified Eagle of Saladin */}
            <circle cx="12" cy="8" r="1.5" fill="#C09300" />
          </svg>
        );

      case 'australia':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            <rect width="24" height="16" fill="#012169" />
            {/* Union Jack canton (top-left half) */}
            <polygon points="0,0 0,1.6 10.5,8 12,8 12,6.4 1.5,0" fill="white" />
            <polygon points="0,8 0,6.4 10.5,0 12,0 12,1.6 1.5,8" fill="white" />
            <polygon points="0,0 0,0.8 11.3,8 12,8 12,7.2 0.7,0" fill="#C8102E" />
            <polygon points="0,8 0,7.2 11.3,0 12,0 12,0.8 0.7,8" fill="#C8102E" />
            <rect x="0" y="3.2" width="12" height="1.6" fill="white" />
            <rect x="5.2" y="0" width="1.6" height="8" fill="white" />
            <rect x="0" y="3.6" width="12" height="0.8" fill="#C8102E" />
            <rect x="5.6" y="0" width="0.8" height="8" fill="#C8102E" />
            {/* Commonwealth Star (lower hoist) */}
            <path d="M6 12 L6.6 13.3 L8 13.3 L6.9 14.2 L7.3 15.5 L6 14.7 L4.7 15.5 L5.1 14.2 L4 13.3 L5.4 13.3 Z" fill="white" />
            {/* Southern Cross (right side) */}
            <circle cx="18" cy="4" r="0.6" fill="white" />
            <circle cx="20.5" cy="6.5" r="0.5" fill="white" />
            <circle cx="17.5" cy="9" r="0.5" fill="white" />
            <circle cx="20" cy="11.5" r="0.7" fill="white" />
            <circle cx="22" cy="13.5" r="0.4" fill="white" />
          </svg>
        );

      case 'new zealand':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            <rect width="24" height="16" fill="#012169" />
            {/* Union Jack canton (top-left half) */}
            <polygon points="0,0 0,1.6 10.5,8 12,8 12,6.4 1.5,0" fill="white" />
            <polygon points="0,8 0,6.4 10.5,0 12,0 12,1.6 1.5,8" fill="white" />
            <polygon points="0,0 0,0.8 11.3,8 12,8 12,7.2 0.7,0" fill="#C8102E" />
            <polygon points="0,8 0,7.2 11.3,0 12,0 12,0.8 0.7,8" fill="#C8102E" />
            <rect x="0" y="3.2" width="12" height="1.6" fill="white" />
            <rect x="5.2" y="0" width="1.6" height="8" fill="white" />
            <rect x="0" y="3.6" width="12" height="0.8" fill="#C8102E" />
            <rect x="5.6" y="0" width="0.8" height="8" fill="#C8102E" />
            {/* Southern Cross — 4 red stars with white outline on the fly */}
            <circle cx="20" cy="4" r="0.85" fill="white" />
            <circle cx="20" cy="4" r="0.55" fill="#C8102E" />
            <circle cx="17.5" cy="7.5" r="0.85" fill="white" />
            <circle cx="17.5" cy="7.5" r="0.55" fill="#C8102E" />
            <circle cx="21" cy="10" r="0.85" fill="white" />
            <circle cx="21" cy="10" r="0.55" fill="#C8102E" />
            <circle cx="18.5" cy="13" r="0.7" fill="white" />
            <circle cx="18.5" cy="13" r="0.45" fill="#C8102E" />
          </svg>
        );

      case 'south africa':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            {/* Top: red, Bottom: blue */}
            <rect x="0" y="0" width="24" height="8" fill="#E03C31" />
            <rect x="0" y="8" width="24" height="8" fill="#001489" />
            {/* White borders of the pall */}
            <polygon points="0,1.5 0,4 7,8 24,8 24,7 9,7 2,1.5" fill="white" />
            <polygon points="0,14.5 0,12 7,8 24,8 24,9 9,9 2,14.5" fill="white" />
            {/* Green pall (Y) */}
            <polygon points="0,3 0,13 8,8" fill="#007749" />
            <polygon points="6,7 24,7 24,9 6,9" fill="#007749" />
            {/* Yellow inner triangle border + black hoist triangle */}
            <polygon points="0,4.5 0,11.5 7,8" fill="#FFB81C" />
            <polygon points="0,5.5 0,10.5 5,8" fill="#000000" />
          </svg>
        );

      case 'belgium':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            <rect x="0" y="0" width="8" height="16" fill="#000000" />
            <rect x="8" y="0" width="8" height="16" fill="#FAE042" />
            <rect x="16" y="0" width="8" height="16" fill="#ED2939" />
          </svg>
        );

      case 'denmark':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            <rect width="24" height="16" fill="#C8102E" />
            {/* White Nordic cross (off-center toward hoist) */}
            <rect x="0" y="6" width="24" height="4" fill="white" />
            <rect x="6" y="0" width="4" height="16" fill="white" />
          </svg>
        );

      case 'morocco':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            <rect width="24" height="16" fill="#C1272D" />
            {/* Green pentagram outline */}
            <path
              d="M12 5 L13.18 8.65 L17 8.65 L13.91 10.91 L15.09 14.55 L12 12.29 L8.91 14.55 L10.09 10.91 L7 8.65 L10.82 8.65 Z"
              fill="none"
              stroke="#006233"
              strokeWidth="0.6"
            />
          </svg>
        );

      case 'indonesia':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            <rect x="0" y="0" width="24" height="8" fill="#FF0000" />
            <rect x="0" y="8" width="24" height="8" fill="white" />
          </svg>
        );

      case 'slovakia':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            <rect x="0" y="0" width="24" height="5.33" fill="white" />
            <rect x="0" y="5.33" width="24" height="5.33" fill="#0B4EA2" />
            <rect x="0" y="10.66" width="24" height="5.34" fill="#EE1C25" />
            {/* Simplified coat-of-arms shield on hoist side */}
            <path d="M4 4 L9 4 L9 9 L6.5 11 L4 9 Z" fill="#EE1C25" stroke="white" strokeWidth="0.3" />
            {/* Patriarchal double cross — vertical with two horizontals */}
            <rect x="6.2" y="5" width="0.6" height="4.5" fill="white" />
            <rect x="5.4" y="5.7" width="2.2" height="0.5" fill="white" />
            <rect x="5" y="6.7" width="3" height="0.5" fill="white" />
          </svg>
        );

      case 'singapore':
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            <rect x="0" y="0" width="24" height="8" fill="#EF3340" />
            <rect x="0" y="8" width="24" height="8" fill="white" />
            {/* Crescent: white disc with red bite */}
            <circle cx="5.5" cy="4" r="2.5" fill="white" />
            <circle cx="6.3" cy="4" r="2" fill="#EF3340" />
            {/* 5 small stars (simplified to dots) in the canonical arc */}
            <circle cx="9.5" cy="2.6" r="0.4" fill="white" />
            <circle cx="11" cy="3.7" r="0.4" fill="white" />
            <circle cx="11" cy="5.5" r="0.4" fill="white" />
            <circle cx="9" cy="5.5" r="0.4" fill="white" />
            <circle cx="8.5" cy="3.7" r="0.4" fill="white" />
          </svg>
        );

      default:
        // Generic flag placeholder for unknown countries
        return (
          <svg width={width} height={height} viewBox="0 0 24 16" fill="none" className={className}>
            <rect x="0" y="0" width="24" height="16" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="1" />
            <circle cx="12" cy="8" r="3" fill="#9CA3AF" />
          </svg>
        );
    }
  };

  return (
    <span className="inline-flex items-center justify-center flex-shrink-0" title={`${country} flag`}>
      {getFlagSVG()}
    </span>
  );
}

// memoized — country/size/className change rarely once a card is mounted,
// and the giant switch statement is purely a function of those inputs.
export const CountryFlagIcon = memo(CountryFlagIconImpl);