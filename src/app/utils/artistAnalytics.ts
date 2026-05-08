import { Festival } from '../data/festivals';

export interface ArtistRanking {
  name: string;
  festivalCount: number;
  festivals: Array<{
    name: string;
    city: string;
    country: string;
    dates: string;
    continent: string;
  }>;
  rank: number;
}

export interface ArtistAnalytics {
  totalArtists: number;
  topArtists: ArtistRanking[];
  artistMap: Map<string, ArtistRanking>;
}

/**
 * Checks if an artist name should be excluded from analytics
 */
function shouldExcludeArtist(artistName: string): boolean {
  const excludePatterns = [
    /^-$/, // Exclude standalone dash
    /to be announced/i,
    /tba/i,
    /t\.b\.a\./i,
    /coming soon/i,
    /more artists/i,
    /lineup tbd/i,
    /announcement coming/i,
    /^tbd$/i
  ];
  
  return excludePatterns.some(pattern => pattern.test(artistName.trim()));
}

/**
 * Analyzes all festivals to create artist rankings and statistics
 */
export function analyzeArtists(festivals: Festival[]): ArtistAnalytics {
  const artistMap = new Map<string, ArtistRanking>();
  
  // Process each festival
  festivals.forEach(festival => {
    if (!Array.isArray(festival.artists) || festival.artists.length === 0) {
      return;
    }
    
    // Process each artist in the festival
    festival.artists.forEach(artist => {
      if (typeof artist !== 'string' || !artist.trim()) {
        return;
      }
      
      const normalizedArtist = artist.trim();
      
      // Skip excluded artists (like "to be announced")
      if (shouldExcludeArtist(normalizedArtist)) {
        return;
      }
      
      // Add or update artist entry
      if (!artistMap.has(normalizedArtist)) {
        artistMap.set(normalizedArtist, {
          name: normalizedArtist,
          festivalCount: 0,
          festivals: [],
          rank: 0
        });
      }
      
      const artistData = artistMap.get(normalizedArtist)!;
      artistData.festivalCount++;
      artistData.festivals.push({
        name: festival.name,
        city: festival.city,
        country: festival.country,
        dates: festival.dates,
        continent: festival.continent
      });
    });
  });
  
  // Convert to array and sort by festival count
  const sortedArtists = Array.from(artistMap.values())
    .sort((a, b) => {
      // Primary sort: festival count (descending)
      if (b.festivalCount !== a.festivalCount) {
        return b.festivalCount - a.festivalCount;
      }
      // Secondary sort: alphabetical by name
      return a.name.localeCompare(b.name);
    });
  
  // Assign ranks (handling ties)
  let currentRank = 1;
  sortedArtists.forEach((artist, index) => {
    if (index > 0 && sortedArtists[index - 1].festivalCount > artist.festivalCount) {
      currentRank = index + 1;
    }
    artist.rank = currentRank;
  });
  
  return {
    totalArtists: artistMap.size,
    topArtists: sortedArtists,
    artistMap
  };
}

/**
 * Gets the top N artists by festival count
 */
export function getTopArtists(festivals: Festival[], limit: number = 10): ArtistRanking[] {
  const analytics = analyzeArtists(festivals);
  return analytics.topArtists.slice(0, limit);
}

/**
 * Gets artist ranking for a specific artist
 */
export function getArtistRanking(festivals: Festival[], artistName: string): ArtistRanking | null {
  const analytics = analyzeArtists(festivals);
  return analytics.artistMap.get(artistName.trim()) || null;
}

/**
 * Gets artists that appear in multiple festivals (minimum threshold)
 */
export function getFrequentArtists(festivals: Festival[], minFestivals: number = 2): ArtistRanking[] {
  const analytics = analyzeArtists(festivals);
  return analytics.topArtists.filter(artist => artist.festivalCount >= minFestivals);
}

/**
 * Gets artist statistics by continent
 */
export function getArtistsByContinent(festivals: Festival[]): Record<string, ArtistRanking[]> {
  const continentMap: Record<string, Map<string, ArtistRanking>> = {};
  
  festivals.forEach(festival => {
    if (!Array.isArray(festival.artists) || festival.artists.length === 0) {
      return;
    }
    
    if (!continentMap[festival.continent]) {
      continentMap[festival.continent] = new Map();
    }
    
    festival.artists.forEach(artist => {
      if (typeof artist !== 'string' || !artist.trim()) {
        return;
      }
      
      const normalizedArtist = artist.trim();
      
      // Skip excluded artists (like "to be announced")
      if (shouldExcludeArtist(normalizedArtist)) {
        return;
      }
      
      const map = continentMap[festival.continent];
      
      if (!map.has(normalizedArtist)) {
        map.set(normalizedArtist, {
          name: normalizedArtist,
          festivalCount: 0,
          festivals: [],
          rank: 0
        });
      }
      
      const artistData = map.get(normalizedArtist)!;
      artistData.festivalCount++;
      artistData.festivals.push({
        name: festival.name,
        city: festival.city,
        country: festival.country,
        dates: festival.dates,
        continent: festival.continent
      });
    });
  });
  
  // Convert to sorted arrays for each continent
  const result: Record<string, ArtistRanking[]> = {};
  Object.keys(continentMap).forEach(continent => {
    const artists = Array.from(continentMap[continent].values())
      .sort((a, b) => {
        if (b.festivalCount !== a.festivalCount) {
          return b.festivalCount - a.festivalCount;
        }
        return a.name.localeCompare(b.name);
      });
    
    // Assign ranks
    let currentRank = 1;
    artists.forEach((artist, index) => {
      if (index > 0 && artists[index - 1].festivalCount > artist.festivalCount) {
        currentRank = index + 1;
      }
      artist.rank = currentRank;
    });
    
    result[continent] = artists;
  });
  
  return result;
}

/**
 * Format artist statistics for display
 */
export function formatArtistStats(analytics: ArtistAnalytics): {
  summary: string;
  topArtistsText: string;
  diversityScore: number;
} {
  const { totalArtists, topArtists } = analytics;
  
  if (totalArtists === 0) {
    return {
      summary: "No artists found",
      topArtistsText: "",
      diversityScore: 0
    };
  }
  
  const top3 = topArtists.slice(0, 3);
  const topArtistsText = top3
    .map((artist, index) => {
      const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉";
      return `${medal} ${artist.name} (${artist.festivalCount} festivals)`;
    })
    .join(", ");
  
  // Calculate diversity score (lower score = more diverse, higher score = concentrated)
  const maxFestivals = topArtists[0]?.festivalCount || 0;
  const averageFestivals = totalArtists > 0 ? 
    topArtists.reduce((sum, artist) => sum + artist.festivalCount, 0) / totalArtists : 0;
  
  const diversityScore = maxFestivals > 0 ? Math.round((averageFestivals / maxFestivals) * 100) : 100;
  
  return {
    summary: `${totalArtists} unique artists across all festivals`,
    topArtistsText,
    diversityScore
  };
}

/**
 * Get artist suggestions for search/autocomplete
 */
export function getArtistSuggestions(festivals: Festival[], query: string, limit: number = 6): ArtistRanking[] {
  if (!query.trim()) {
    return getTopArtists(festivals, limit);
  }
  
  const analytics = analyzeArtists(festivals);
  const normalizedQuery = query.toLowerCase().trim();
  
  return analytics.topArtists
    .filter(artist => {
      // Skip excluded artists in suggestions too
      if (shouldExcludeArtist(artist.name)) {
        return false;
      }
      return artist.name.toLowerCase().includes(normalizedQuery);
    })
    .slice(0, limit);
}