import type { Translations } from '../translations/index';

/**
 * Formats festival price for display, handling special cases like "Price to be announced" and "Sold out"
 * @param price - The raw price string from the festival data
 * @param t - Translation object for internationalization
 * @returns Formatted price string for display
 */
export function formatFestivalPrice(price: string, t: Translations): string {
  // Handle empty, undefined, or null price
  if (!price || price.trim() === '') {
    return t.priceToBeAnnounced || 'Price to be announced';
  }
  
  // Handle the "-" case which means price is yet to be announced
  if (price.trim() === '-') {
    return t.priceToBeAnnounced || 'Price to be announced';
  }
  
  // Handle the "soldout" case which means the festival is sold out
  if (price.trim().toLowerCase() === 'soldout') {
    return t.soldOut || 'Sold out';
  }
  
  // For all other cases (actual prices), prepend "From" to indicate prices may not be up to date
  return `${t.fromPrice} ${price}`;
}

// Placeholder strings used in the wild to mean "we don't know the price yet".
const PRICE_TBA_PATTERNS: RegExp[] = [
  /^tba$/i,
  /^t\.b\.a\.?$/i,
  /^tbd$/i,
  /^n\/a$/i,
  /to be announced/i,
  /to be determined/i,
  /not yet announced/i,
  /not announced/i,
  /coming soon/i,
  /pending/i,
  /not available/i,
  /\bask\b/i,
  /contact (us|organi[sz]er)/i,
];

/**
 * Checks if a price indicates that it's yet to be announced. Recognizes
 * empty / "-" and the common placeholder phrases (TBA, TBD, "to be
 * announced", "coming soon", etc.).
 */
export function isPriceToBeAnnounced(price: string | undefined | null): boolean {
  if (!price) return true;
  const trimmed = price.trim();
  if (trimmed === '' || trimmed === '-' || trimmed === '--' || trimmed === '—') return true;
  return PRICE_TBA_PATTERNS.some(p => p.test(trimmed));
}

/**
 * Treated as a real price: free entry or sold-out events.
 */
function isPriceFreeOrSoldOut(price: string): boolean {
  const lower = price.trim().toLowerCase();
  return lower === 'free' || lower === 'gratis' || lower === 'no charge' || lower === 'soldout' || lower === 'sold out';
}

/**
 * Stricter "missing" check intended for the admin Needs-Attention tab.
 * A price is considered MISSING when it's a placeholder OR contains no
 * recognizable numeric value (and isn't an explicit "Free" / "Sold out").
 *
 * Examples:
 *   "€150 (Full Pass)"       → not missing
 *   "From AUD 40"            → not missing
 *   "Free"                   → not missing
 *   "soldout"                → not missing
 *   ""                       → missing
 *   "-"                      → missing
 *   "TBA"                    → missing
 *   "Coming soon"            → missing
 *   "Ask the organizer"      → missing
 */
export function isPriceMissing(price: string | undefined | null): boolean {
  if (isPriceToBeAnnounced(price)) return true;
  const trimmed = (price ?? '').trim();
  if (isPriceFreeOrSoldOut(trimmed)) return false;
  // Real prices always contain at least one digit.
  return !/\d/.test(trimmed);
}

/**
 * Checks if a price indicates that the festival is sold out
 * @param price - The price string to check
 * @returns true if the festival is sold out
 */
export function isPriceSoldOut(price: string): boolean {
  return !!price && price.trim().toLowerCase() === 'soldout';
}

/**
 * Checks if a price requires special styling (either to be announced or sold out)
 * @param price - The price string to check
 * @returns true if the price requires special styling
 */
export function isPriceSpecial(price: string): boolean {
  return isPriceToBeAnnounced(price) || isPriceSoldOut(price);
}

/**
 * Gets the appropriate CSS classes for price display based on price status
 * @param price - The price string to check
 * @returns CSS classes for styling the price
 */
export function getPriceDisplayClasses(price: string): string {
  const baseClasses = 'px-2 py-0.5 rounded font-medium border border-gray-200';
  
  if (isPriceToBeAnnounced(price)) {
    // Style for "price to be announced" - yellow/amber colored
    return `${baseClasses} bg-yellow-50 text-yellow-700 border-yellow-200`;
  }
  
  if (isPriceSoldOut(price)) {
    // Style for "sold out" - red colored to indicate urgency/unavailability
    return `${baseClasses} bg-red-50 text-red-700 border-red-200`;
  }
  
  // Default styling for regular prices
  return `${baseClasses} bg-gray-100 text-gray-700`;
}

/**
 * Checks if artists array indicates that artists are yet to be announced
 * @param artists - The artists array to check
 * @returns true if the artists are yet to be announced
 */
export function areArtistsToBeAnnounced(artists?: string[]): boolean {
  return !artists || 
         artists.length === 0 || 
         (artists.length === 1 && (!artists[0] || artists[0].trim() === '-' || artists[0].trim() === ''));
}

/**
 * Formats festival artists for display, handling special cases like "Artists to be announced"
 * @param artists - The artists array from the festival data
 * @param t - Translation object for internationalization
 * @returns Object containing formatted display information
 */
export function formatFestivalArtists(artists: string[] | undefined, t: Translations): {
  displayText: string;
  isToBeAnnounced: boolean;
  count: number;
  artists: string[];
} {
  if (areArtistsToBeAnnounced(artists)) {
    return {
      displayText: t.artistsToBeAnnounced || 'Artists to be announced',
      isToBeAnnounced: true,
      count: 0,
      artists: []
    };
  }
  
  // Filter out any empty or "-" entries from the artists array
  const safeArtists = (artists || []).filter(artist => artist && artist.trim() !== '' && artist.trim() !== '-');
  
  if (safeArtists.length === 0) {
    return {
      displayText: t.artistsToBeAnnounced || 'Artists to be announced',
      isToBeAnnounced: true,
      count: 0,
      artists: []
    };
  }
  
  return {
    displayText: safeArtists.length === 1 ? safeArtists[0] : `${safeArtists.length} ${safeArtists.length > 1 ? t.artists : t.artist}`,
    isToBeAnnounced: false,
    count: safeArtists.length,
    artists: safeArtists
  };
}