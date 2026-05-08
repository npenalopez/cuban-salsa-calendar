import { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { Trophy, Medal, Award, Hash } from 'lucide-react';
import { Festival } from '../data/festivals';
import { analyzeArtists } from '../utils/artistAnalytics';
import { CountryFlagIcon } from './CountryFlagIcon';
import { useLanguage } from '../contexts/LanguageContext';

interface MinimalArtistRankingsProps {
  festivals: Festival[];
  triggerElement?: React.ReactElement;
}

export function MinimalArtistRankings({ festivals, triggerElement }: MinimalArtistRankingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();
  
  const artistAnalytics = useMemo(() => {
    // Safety check for festivals array
    if (!Array.isArray(festivals) || festivals.length === 0) {
      return { topArtists: [], totalArtists: 0, artistMap: new Map() };
    }
    return analyzeArtists(festivals);
  }, [festivals]);
  const topArtists = artistAnalytics.topArtists.slice(0, 10); // Show only top 10

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-amber-600" />;
      default: return (
        <div className="flex items-center gap-1 text-gray-600">
          <Hash className="h-4 w-4" />
          <span className="text-sm font-semibold">{rank}</span>
        </div>
      );
    }
  };

  return (
    <>
      {/* Custom trigger element with tooltip */}
      {triggerElement && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div onClick={() => setIsOpen(true)} className="cursor-pointer">
              {triggerElement}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t.topArtists}</p>
          </TooltipContent>
        </Tooltip>
      )}
      
      {/* Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md bg-white border border-gray-200">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-center">
              <Trophy className="h-3.5 w-3.5 text-gray-700" />
              {t.topArtistsRanking}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 text-center">
              {t.artistRankingDescription}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {topArtists.map((artist) => (
              <div key={artist.name} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                <div className="flex items-center justify-center w-8 h-8">{getRankIcon(artist.rank)}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">{artist.name}</div>
                  <div className="text-xs text-gray-600 flex items-center justify-between">
                    <span>{artist.festivalCount} {t.festivals || 'festivals'} • {new Set(artist.festivals.map(f => f.continent)).size} continents</span>
                    <div className="flex items-center gap-0.5 ml-2">
                      {Array.from(new Set(artist.festivals.map(f => f.country))).slice(0, 3).map((country, index) => (
                        <CountryFlagIcon key={country} country={country} size={10} />
                      ))}
                      {new Set(artist.festivals.map(f => f.country)).size > 3 && (
                        <span className="text-xs text-gray-500 ml-1">+{new Set(artist.festivals.map(f => f.country)).size - 3}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {artistAnalytics.totalArtists > 10 && (
            <div className="text-center text-xs text-gray-500 pt-2 border-t">
              {typeof t.showingTopArtists === 'function' 
                ? t.showingTopArtists(10, artistAnalytics.totalArtists)
                : `Showing top 10 of ${artistAnalytics.totalArtists} artists`
              }
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}