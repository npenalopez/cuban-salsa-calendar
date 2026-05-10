import { Badge } from './ui/badge';
import { areArtistsToBeAnnounced } from '../utils/priceUtils';
import { useLanguage } from '../contexts/LanguageContext';

interface SafeArtistsDisplayProps {
  artists?: string[];
  maxDisplay?: number;
  noArtistsText?: string;
  className?: string;
}

export function SafeArtistsDisplay({ 
  artists, 
  maxDisplay = 2, 
  noArtistsText = "No artists",
  className = "flex flex-wrap gap-1"
}: SafeArtistsDisplayProps) {
  const { t } = useLanguage();
  
  // Check for "to be announced" case
  if (areArtistsToBeAnnounced(artists)) {
    return (
      <div className={className}>
        <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
          {t.artistsToBeAnnounced}
        </Badge>
      </div>
    );
  }
  
  const safeArtists = (artists || [])
    .slice()
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

  if (safeArtists.length === 0) {
    return (
      <div className={className}>
        <span className="text-xs text-gray-400">{noArtistsText}</span>
      </div>
    );
  }

  return (
    <div className={className}>
      {safeArtists.slice(0, maxDisplay).map((artist, index) => (
        <Badge key={index} variant="outline" className="text-xs">
          {artist}
        </Badge>
      ))}
      {safeArtists.length > maxDisplay && (
        <Badge variant="outline" className="text-xs">
          +{safeArtists.length - maxDisplay}
        </Badge>
      )}
    </div>
  );
}