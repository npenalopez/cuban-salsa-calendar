/**
 * Artist categorization + non-artist filter.
 *
 * The festival data doesn't tag what kind of artist someone is, so we
 * infer a category from the name: DJs (clear "DJ" prefix), musicians
 * (orchestras, bands, well-known timba/son artists), or dancers
 * (everyone else — the bulk of festival lineups).
 *
 * The non-artist filter catches descriptive phrases ("19+ world-class
 * artists"), schools, troupes, festival names — entries that ended up
 * in artist arrays but shouldn't be there.
 */

export type ArtistCategory = 'dj' | 'musician' | 'dancer';

const NON_ARTIST_EXACT = new Set<string>([
  'cubadanza',
  'cubaneando',
]);

const NON_ARTIST_PATTERNS: RegExp[] = [
  /^\d/,                              // "19+ Cuban artists"
  /\bworkshops?\b/i,                  // "Cuba room workshops"
  /\bacademia\b/i,                    // "Academia de Danza Carlos Acosta"
  /\bacademy\b/i,
  /\bcabaret\b/i,                     // "Cabaret Tropicana de Cuba"
  /conjunto folkl[oó]rico/i,          // "Conjunto Folklorico Nacional de Cuba"
  /\bartists?\s*$/i,                  // "...top Rueda de Casino artists"
  /\bdjs?\s*$/i,                      // "...world-class DJs"
  /\bensemble\b/i,
  /\bcompany\b/i,
  /\bcompañia\b/i,
  /\bschool\b/i,
  /\bescuela\b/i,
  /\binstitute\b/i,
  /\bfestival\b/i,
  /\bcasino\b/i,
];

/**
 * True when the entry is a descriptive phrase / school / troupe /
 * brand name rather than an individual artist.
 */
export function isNonArtistEntry(name: string | undefined | null): boolean {
  if (!name) return false;
  const trimmed = name.trim();
  if (!trimmed) return false;
  if (NON_ARTIST_EXACT.has(trimmed.toLowerCase())) return true;
  return NON_ARTIST_PATTERNS.some(p => p.test(trimmed));
}

// A small allow-list of well-known musicians / bands / orchestras
// whose names don't follow an obvious "Orquesta X" pattern. Lowercased
// for case-insensitive lookup.
const KNOWN_MUSICIANS = new Set<string>([
  'los van van',
  'charanga habanera',
  'la charanga habanera',
  'buena vista social club',
  'bamboleo',
  'los 4',
  'issac delgado',
  'isaac delgado',
  'alexander abreu',
  "alexander abreu y havana d'primera",
  'havana d\'primera',
  'maykel blanco',
  'maykel blanco y su salsa mayor',
  'pupy y los que son son',
  'manolito simonet',
  'manolito simonet y su trabuco',
  'paulo fg',
  'tirso duarte',
  'leoni torres',
  'yulien oviedo',
  'pedrito calvo jr.',
  'pedrito calvo jr',
  'omara portuondo',
  'eliades ochoa',
  'gilberto santa rosa',
  'la india',
  'victor manuelle',
  'roberto fonseca',
  'alain pérez',
  'alain perez',
  'tumbao',
  'orquesta reve',
  'orquesta akokan',
  'grupo niche',
  'grupo olori',
  'kelvis ochoa',
  'haila',
  'lazaro valdes',
  'pedrito martinez',
  'klimax',
  'azucar negra',
  'tumbakin',
  'adonis y osain del monte',
]);

// Words that, when present, indicate a band / orchestra / collective.
const BAND_WORDS_RE = /\b(orquesta|conjunto|banda|grupo|trabuco|charanga)\b/i;

// "X y su Y" / "X y los Y" / "X y la Y" → typically a band
const BAND_Y_PATTERN = /\sy\s+(los|las|su|el|la)\s+/i;

// Fallback parenthetical hint, e.g. "Ivan y La Llegada (orchestra)"
const ORCHESTRA_HINT = /\(orchestra\)/i;

export function getArtistCategory(name: string): ArtistCategory {
  const trimmed = (name || '').trim();
  if (/^dj\b/i.test(trimmed)) return 'dj';
  const lower = trimmed.toLowerCase();
  if (KNOWN_MUSICIANS.has(lower)) return 'musician';
  if (BAND_WORDS_RE.test(trimmed)) return 'musician';
  if (BAND_Y_PATTERN.test(trimmed)) return 'musician';
  if (ORCHESTRA_HINT.test(trimmed)) return 'musician';
  return 'dancer';
}

export const CATEGORY_LABEL: Record<ArtistCategory, string> = {
  dj: 'DJ',
  musician: 'Musician',
  dancer: 'Dancer',
};
