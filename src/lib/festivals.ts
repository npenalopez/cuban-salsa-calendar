import { countdown, dateBlock, dateLong, mkey, pISO, type DateBlock } from './dates';
import { canonicalLineup, peopleOf } from './artists';
import { norm } from './text';
import { bestTravel, fromCity, type TravelMode } from './travel';
import type { City, Enriched, Festival } from './types';

/** Sponsored listings are on hold. Flip to true to render the "Sponsored" variant. */
export const FEATURED_ENABLED = false;

export const SITE = 'https://cubansalsacalendar.com';
export const INSTAGRAM = 'https://www.instagram.com/cubansalsacalendar';
/**
 * Only festivals with exact days are published. The others stay in the data (and in /admin)
 * and appear on their own once their dates are known.
 */
export const isListed = (f: Pick<Festival, 'datePrecision'>) => f.datePrecision === 'day';

export const festivalPath = (id: string) => `/festivals/${encodeURIComponent(id)}/`;
export const fixPath = (id: string) => `/submit/${encodeURIComponent(id)}/`;

export function enrich(list: Festival[], today: Date): Enriched[] {
  return list.map((f) => {
    const s = pISO(f.startDate);
    const e = f.endDate ? pISO(f.endDate) : s;
    const past = e < today;
    // One spelling per artist (data/artists.json); `people` expands couples into their members.
    const artists = canonicalLineup(f.artists || []);
    const people = peopleOf(artists);
    return {
      ...f,
      artists,
      people,
      s,
      e,
      past,
      mk: f.datePrecision !== 'year' ? mkey(s.getFullYear(), s.getMonth()) : null,
      arch: past || f.status === 'cancelled',
      hay: norm([f.name, f.city, f.country, f.region, ...artists, ...people].join(' | ')),
    };
  });
}

/** Start date, then name. */
export const byDate = (a: Enriched, b: Enriched) => a.s.getTime() - b.s.getTime() || a.name.localeCompare(b.name);
export const byName = (a: Enriched, b: Enriched) => a.name.localeCompare(b.name);

const CUR: Record<string, string> = { EUR: '€', GBP: '£', USD: 'US$', MXN: 'MX$' };

/** "from €59", "from PLN 470", or the free-text price. */
export function fmtPrice(f: Pick<Festival, 'priceFrom' | 'priceText' | 'currency'>): string | null {
  if (f.priceFrom == null) return f.priceText;
  const sym = f.currency ? CUR[f.currency] : undefined;
  const n = f.priceFrom.toLocaleString('en');
  return 'from ' + (sym ? sym + n : (f.currency ? f.currency + ' ' : '') + n);
}

/** For the Price row and calendar files: the organizer's wording, else "From €109". */
export function priceLabel(f: Pick<Festival, 'priceFrom' | 'priceText' | 'currency'>): string | null {
  if (f.priceText) return f.priceText;
  const p = fmtPrice(f);
  return p ? p[0].toUpperCase() + p.slice(1) : null;
}

export function place(f: Pick<Festival, 'city' | 'country'>): string {
  if (f.city && f.country) return `${f.city}, ${f.country}`;
  return f.city || f.country || 'Location to be announced';
}

export function nextEdition(f: Enriched, all: Enriched[]): Enriched | undefined {
  if (!f.series) return undefined;
  return all.find((x) => x.series === f.series && x.id !== f.id && !x.arch && x.s > f.s);
}

/** Only real ticket links. Never fall back to the website. */
export const ticketOf = (f: Enriched) => (f.ticketUrl && !f.arch && f.status === 'scheduled' ? f.ticketUrl : null);

/** Calendar actions only make sense with exact days. */
export const canAddToCalendar = (f: Enriched) => f.datePrecision === 'day' && !f.arch && f.status !== 'postponed';

export type BadgeKind = 'postponed' | 'cancelled' | 'sold-out' | 'sponsored';
const BADGE_TEXT: Record<BadgeKind, string> = { postponed: 'Postponed', cancelled: 'Cancelled', 'sold-out': 'Sold out', sponsored: 'Sponsored' };

export interface CardVM {
  id: string;
  href: string;
  name: string;
  aria: string;
  place: string;
  countryCode: string | null;
  block: DateBlock;
  badge: { kind: BadgeKind; text: string } | null;
  artists: string[];
  moreArtists: number;
  meta: string;
  /** Fastest practical way to get there from the visitor's city */
  travel: { mode: TravelMode; text: string } | null;
  ticket: string | null;
  showSave: boolean;
  showCal: boolean;
  muted: boolean;
  featured: boolean;
  postponed: boolean;
  struck: boolean;
}

export function cardVM(f: Enriched, all: Enriched[], city: City | null, today?: Date): CardVM {
  const a = f.artists || [];
  const parts: string[] = [];
  if (f.status === 'postponed') parts.push('New dates not announced');
  else if (f.past) parts.push('Took place' + (nextEdition(f, all) ? ' · next edition listed' : ''));
  else if (f.datePrecision === 'year') parts.push('Dates not announced yet');
  else {
    // Days until the festival, for upcoming ones that will go ahead.
    const cd = today && (f.status === 'scheduled' || f.status === 'sold-out') ? countdown(f.s, f.e, today) : null;
    if (cd) parts.push(cd);
    // A starting price alone (no price text) still counts as announced.
    const price = fmtPrice(f);
    if (price) parts.push(price);
    if (!a.length) parts.push(price ? 'Line-up not announced' : 'Line-up and prices not announced');
    else if (!price) parts.push('Price not announced');
  }
  const featured = FEATURED_ENABLED && f.featured && !f.arch;
  let badge: BadgeKind | null = null;
  if (f.status === 'postponed') badge = 'postponed';
  else if (f.status === 'cancelled') badge = 'cancelled';
  else if (f.status === 'sold-out') badge = 'sold-out';
  else if (featured) badge = 'sponsored';
  const showArtists = a.length > 0 && !f.arch && f.status !== 'postponed';
  const best = f.arch ? null : bestTravel(city, f.coordinates);
  const tr = best && city
    ? { mode: best.mode, text: best.mode === 'near' ? (city.name === 'your location' ? 'Near you' : `Near ${city.name}`) : `${best.text} ${fromCity(city)}` }
    : null;
  return {
    id: f.id,
    href: festivalPath(f.id),
    name: f.name,
    aria: `${f.name}, ${dateLong(f)}, ${place(f)}`,
    place: place(f),
    countryCode: f.countryCode,
    block: dateBlock(f, f.past),
    badge: badge ? { kind: badge, text: BADGE_TEXT[badge] } : null,
    artists: showArtists ? a.slice(0, 3) : [],
    moreArtists: showArtists ? Math.max(0, a.length - 3) : 0,
    meta: parts.join(' · '),
    travel: tr,
    ticket: ticketOf(f),
    showSave: !f.arch,
    showCal: canAddToCalendar(f),
    muted: f.arch,
    featured,
    postponed: f.status === 'postponed',
    struck: f.status === 'postponed' || f.status === 'cancelled',
  };
}
