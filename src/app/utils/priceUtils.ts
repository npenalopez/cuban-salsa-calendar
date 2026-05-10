import type { Translations } from '../translations/index';

// ─── Price normalization ─────────────────────────────────────────────
// Source strings are inconsistent: "120,00 €", "€110", "From AUD 40",
// "1,700.00 ZAR - 2,850.00 ZAR", "$265 (Full) / $235 (Local)" …
// The display layer normalizes all of them to one canonical shape:
// "<symbol><amount>" or "<symbol><lo> – <symbol><hi>".

// Longest first so "NZ$" / "A$" beat "$" in the includes() loop.
const SYMBOLS_BY_PRIORITY = ['NZ$', 'A$', 'C$', '€', '£', '¥', '₽', '฿', 'kr', '$'];

const CURRENCY_CODE_MAP: Record<string, { display: string; spaced: boolean }> = {
  EUR: { display: '€',   spaced: false },
  USD: { display: '$',   spaced: false },
  GBP: { display: '£',   spaced: false },
  AUD: { display: 'A$',  spaced: false },
  CAD: { display: 'C$',  spaced: false },
  NZD: { display: 'NZ$', spaced: false },
  JPY: { display: '¥',   spaced: false },
  RUB: { display: '₽',   spaced: false },
  THB: { display: '฿',   spaced: false },
  ZAR: { display: 'R',   spaced: false },
  MXN: { display: '$',   spaced: false },
  ARS: { display: '$',   spaced: false },
  // Codes with no widely-recognized single-char symbol stay as the code
  // and use "<CODE> <amount>" with a space.
  CHF: { display: 'CHF', spaced: true },
  AED: { display: 'AED', spaced: true },
  SEK: { display: 'kr',  spaced: false },
  NOK: { display: 'kr',  spaced: false },
  DKK: { display: 'kr',  spaced: false },
};

const KNOWN_CODES = Object.keys(CURRENCY_CODE_MAP);

// Words that just clutter the chip — the formatter will re-prefix
// "Starting" once via t.fromPrice.
const PREFIX_NOISE_RE = /^(starting|from|ab|desde|à partir de|od|early bird( from)?|full pass from)\s+/i;

function escapeForRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Best-effort canonicalizer. Returns "" if nothing recognizable was
 * found, in which case the caller should fall back to the raw string.
 */
function normalizePriceForDisplay(raw: string): string {
  let s = raw.trim();
  if (!s) return s;

  // Strip stacked leading prefix words ("Early Bird from From €80").
  while (PREFIX_NOISE_RE.test(s)) s = s.replace(PREFIX_NOISE_RE, '').trim();

  // Multi-option prices ("$265 (Full) / $235 (Local)") — show only the
  // first option in the chip; full text lives in the tooltip.
  if (s.includes('/')) s = s.split('/')[0].trim();

  // Drop parentheticals — "(Full Pass)", "(Pack 1 Individual)" etc.
  s = s.replace(/\s*\([^)]*\)/g, '').trim();

  // Detect the dominant currency. Symbols win over codes (since
  // "$1,800-$3,200 MXN" should read as $, not MXN).
  let display = '';
  let spaced = false;
  for (const sym of SYMBOLS_BY_PRIORITY) {
    if (s.includes(sym)) {
      display = sym;
      break;
    }
  }
  if (!display) {
    for (const code of KNOWN_CODES) {
      if (new RegExp(`\\b${code}\\b`).test(s)) {
        const meta = CURRENCY_CODE_MAP[code];
        display = meta.display;
        spaced = meta.spaced;
        break;
      }
    }
  }

  // Strip every known currency marker so we can re-attach one consistently.
  for (const sym of SYMBOLS_BY_PRIORITY) {
    s = s.replace(new RegExp(`\\s*${escapeForRegex(sym)}\\s*`, 'g'), ' ');
  }
  for (const code of KNOWN_CODES) {
    s = s.replace(new RegExp(`\\s*\\b${code}\\b\\s*`, 'g'), ' ');
  }
  s = s.replace(/\s+/g, ' ').trim();

  // Normalize range separators to a real en-dash with surrounding spaces.
  s = s.replace(/\s*[–—-]\s*/g, ' – ');
  s = s.replace(/\s+/g, ' ').trim();

  if (!display) return s;

  // Re-prefix the currency in front of every number group, and strip
  // empty trailing cents so "120,00" and "129" both render as the
  // whole amount. Real cents like "71.10" or "29.95" stay untouched
  // (only ".00" / ",00" are dropped, and only when they're the LAST
  // separator — the thousands comma in "1,700.00" is preserved).
  const glue = spaced ? ' ' : '';
  s = s.replace(/(\d[\d.,]*)(\+?)/g, (_match, number: string, plus: string) => {
    const cleaned = number.replace(/([.,])00$/, '');
    return `${display}${glue}${cleaned}${plus}`;
  });
  return s;
}

/**
 * Formats festival price for display, handling special cases like
 * "Price to be announced" and "Sold out". Otherwise normalizes the
 * currency / number layout (see normalizePriceForDisplay) and prepends
 * the localized "Starting" prefix.
 */
export function formatFestivalPrice(price: string, t: Translations): string {
  if (!price || price.trim() === '') {
    return t.priceToBeAnnounced || 'Price to be announced';
  }
  if (price.trim() === '-') {
    return t.priceToBeAnnounced || 'Price to be announced';
  }
  if (price.trim().toLowerCase() === 'soldout') {
    return t.soldOut || 'Sold out';
  }
  const normalized = normalizePriceForDisplay(price);
  return `${t.fromPrice} ${normalized || price.trim()}`;
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