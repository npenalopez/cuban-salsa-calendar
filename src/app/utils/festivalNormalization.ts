import { type Festival } from '../data/festivals';

/**
 * Ensures all festivals have the required fields with proper defaults
 * This is especially important for backward compatibility when new fields are added
 */
export function normalizeFestival(festival: any): Festival {
  return {
    id: festival.id || '',
    name: festival.name || '',
    city: festival.city || '',
    country: festival.country || '',
    continent: festival.continent || 'Europe',
    coordinates: (festival.coordinates && Array.isArray(festival.coordinates) && festival.coordinates.length === 2) 
      ? [festival.coordinates[0] || 0, festival.coordinates[1] || 0] as [number, number]
      : [0, 0] as [number, number],
    price: festival.price || '',
    months: Array.isArray(festival.months) ? festival.months : [],
    dates: festival.dates || '',
    description: festival.description || '',
    artists: Array.isArray(festival.artists) ? festival.artists : []
  };
}

/**
 * Normalizes an array of festivals to ensure they all have proper structure
 */
export function normalizeFestivals(festivals: any[]): Festival[] {
  if (!Array.isArray(festivals)) {
    return [];
  }
  
  return festivals.map(normalizeFestival);
}

/**
 * Removes duplicate festivals based on unique identifier
 * Uses ID if available, otherwise falls back to name+city combination
 */
export function deduplicateFestivals(festivals: Festival[]): Festival[] {
  if (!Array.isArray(festivals)) {
    return [];
  }

  const seen = new Set<string>();
  const unique: Festival[] = [];

  festivals.forEach(festival => {
    const key = festival.id || `${festival.name}-${festival.city}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(festival);
    }
  });

  return unique;
}

/**
 * Counts unique festivals in a given array
 * Uses ID if available, otherwise falls back to name+city combination
 * 
 * This function is used throughout the app to ensure proper festival counting:
 * - SimpleFilters: Month filter badges show unique festival counts
 * - FestivalCalendar: Month headers show unique festival counts
 * - FestivalCalendarView: Month badges show unique festival counts
 * - FestivalCounter: Results display shows unique festival counts
 */
export function countUniqueFestivals(festivals: Festival[]): number {
  if (!Array.isArray(festivals)) {
    return 0;
  }

  const uniqueKeys = new Set<string>();
  festivals.forEach(festival => {
    const key = festival.id || `${festival.name}-${festival.city}`;
    uniqueKeys.add(key);
  });

  return uniqueKeys.size;
}