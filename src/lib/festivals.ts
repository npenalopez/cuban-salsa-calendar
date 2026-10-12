import { type Lang, lp, t } from '../i18n';
import { countryName } from '../i18n/places';
import { countdown, dateBlock, dateLong, mkey, pISO, type DateBlock } from './dates';
import { canonicalLineup, peopleOf } from './artists';
import { norm } from './text';
import { bestTravel, fromCity, nearCity, type TravelMode } from './travel';
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
      hay: norm([f.name, f.city, f.country, countryName('es', f.countryCode, f.country), countryName('fr', f.countryCode, f.country), f.region, ...artists, ...people].join(' | ')),
    };
  });
}

/** Start date, then name. */
export const byDate = (a: Enriched, b: Enriched) => a.s.getTime() - b.s.getTime() || a.name.localeCompare(b.name);
export const byName = (a: Enriched, b: Enriched) => a.name.localeCompare(b.name);

const CUR: Record<string, string> = { EUR: '€', GBP: '£', USD: 'US$', MXN: 'MX$' };

/** "from €59", "from PLN 470", or the free-text price. */
export function fmtPrice(f: Pick<Festival, 'priceFrom' | 'priceText' | 'currency'>, lang: Lang = 'en'): string | null {
  if (f.priceFrom == null) return f.priceText ? localPriceText(f.priceText, lang) : null;
  const sym = f.currency ? CUR[f.currency] : undefined;
  const n = f.priceFrom.toLocaleString('en');
  return t(lang, 'price.from', { p: sym ? sym + n : (f.currency ? f.currency + ' ' : '') + n });
}

/** For the Price row and calendar files: the organizer's wording, else "From €109". */
// Price text is entered in English; the common shapes are translated, anything else is shown as entered.
const PRICE_WORDS: Record<Exclude<Lang, 'en'>, [RegExp, string][]> = {
  es: [[/^Regular full pass\b/i, 'Pase completo regular'], [/Book by Instagram DM to (\S+) or (\S+)/i, 'Reservas por mensaje directo en Instagram a $1 o $2'], [/^From\b/i, 'Desde'], [/\bfrom\b/gi, 'desde'], [/(\d)\s+to\s+(?=[^;,]{0,6}\d)/gi, '$1 – '], [/\bFull[- ]?(Pass|Pack)\b/gi, 'Pase completo'], [/\btrack passes\b/gi, 'pases por estilo'], [/\bResidential pass\b/gi, 'Pase con alojamiento'], [/\bwith hotel\b/gi, 'con hotel'], [/\(all-inclusive packages\)/gi, '(paquetes todo incluido)'], [/\(hotel and transfers included\)/gi, '(hotel y traslados incluidos)'], [/^Full-board hotel packages$/i, 'Paquetes de hotel con pensión completa']],
  fr: [[/^Regular full pass\b/i, 'Pass complet normal'], [/Book by Instagram DM to (\S+) or (\S+)/i, 'Réservation par message privé Instagram à $1 ou $2'], [/^From\b/i, 'Dès'], [/\bfrom\b/gi, 'dès'], [/(\d)\s+to\s+(?=[^;,]{0,6}\d)/gi, '$1 – '], [/\bFull[- ]?(Pass|Pack)\b/gi, 'Pass complet'], [/\btrack passes\b/gi, 'pass par style'], [/\bResidential pass\b/gi, 'Pass avec hébergement'], [/\bwith hotel\b/gi, 'avec hôtel'], [/\(all-inclusive packages\)/gi, '(formules tout compris)'], [/\(hotel and transfers included\)/gi, '(hôtel et transferts inclus)'], [/^Full-board hotel packages$/i, 'Formules hôtel en pension complète']],
};
export const localPriceText = (text: string, lang: Lang = 'en') => (lang === 'en' ? text : PRICE_WORDS[lang].reduce((s, [re, w]) => s.replace(re, w), text));

export function priceLabel(f: Pick<Festival, 'priceFrom' | 'priceText' | 'currency'>, lang: Lang = 'en'): string | null {
  if (f.priceText) return localPriceText(f.priceText, lang);
  const p = fmtPrice(f, lang);
  return p ? p[0].toUpperCase() + p.slice(1) : null;
}

/** "10% off" or "€15 off". */
export function discountLabel(d: { amount: number; currency?: string | null }, lang: Lang = 'en'): string {
  if (!d.currency) return t(lang, 'discount.percent', { n: d.amount });
  const sym = CUR[d.currency];
  return t(lang, 'discount.amount', { p: sym ? sym + d.amount : d.currency + ' ' + d.amount });
}

export function place(f: Pick<Festival, 'city' | 'country'> & { countryCode?: string | null }, lang: Lang = 'en'): string {
  const country = f.country ? countryName(lang, f.countryCode, f.country) : null;
  if (f.city && country) return `${f.city}, ${country}`;
  return f.city || country || t(lang, 'place.tba');
}

export function nextEdition(f: Enriched, all: Enriched[]): Enriched | undefined {
  if (!f.series) return undefined;
  return all.find((x) => x.series === f.series && x.id !== f.id && !x.arch && x.s > f.s);
}

/** Only real ticket links. Never fall back to the website. */
/** Ticket shops that apply a discount code from a URL parameter (go&dance: ?discount=CODE prefills and applies it). */
const DISCOUNT_PARAM: Record<string, string> = { 'goandance.com': 'discount' };

/** The ticket link with the discount code built in, when the shop supports it; otherwise the link unchanged. */
export function withDiscount(url: string, d: Festival['discount']): string {
  if (!d || d.via === 'promoter') return url;
  try {
    const u = new URL(url);
    const param = DISCOUNT_PARAM[u.hostname.replace(/^www\./, '')];
    if (!param) return url;
    u.searchParams.set(param, d.code);
    return u.toString();
  } catch {
    return url;
  }
}

export const ticketOf = (f: Enriched) => (f.ticketUrl && !f.arch && f.status === 'scheduled' ? withDiscount(f.ticketUrl, f.discount) : null);

/** Calendar actions only make sense with exact days. */
export const canAddToCalendar = (f: Enriched) => f.datePrecision === 'day' && !f.arch && f.status !== 'postponed';

export type BadgeKind = 'postponed' | 'cancelled' | 'sold-out' | 'sponsored' | 'discount';

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

export function cardVM(f: Enriched, all: Enriched[], city: City | null, today?: Date, lang: Lang = 'en'): CardVM {
  const a = f.artists || [];
  const parts: string[] = [];
  if (f.status === 'postponed') parts.push(t(lang, 'card.newDatesNot'));
  else if (f.past) parts.push(t(lang, 'card.tookPlace') + (nextEdition(f, all) ? ' · ' + t(lang, 'card.nextListed') : ''));
  else if (f.datePrecision === 'year') parts.push(t(lang, 'card.datesNotYet'));
  else {
    // Days until the festival, for upcoming ones that will go ahead.
    const cd = today && (f.status === 'scheduled' || f.status === 'sold-out') ? countdown(f.s, f.e, today, lang) : null;
    if (cd) parts.push(cd);
    // A starting price alone (no price text) still counts as announced.
    const price = fmtPrice(f, lang);
    if (price) parts.push(price);
    if (!a.length) parts.push(t(lang, price ? 'card.lineupNot' : 'card.lineupPriceNot'));
    else if (!price) parts.push(t(lang, 'card.priceNot'));
  }
  const featured = FEATURED_ENABLED && f.featured && !f.arch;
  let badge: BadgeKind | null = null;
  if (f.status === 'postponed') badge = 'postponed';
  else if (f.status === 'cancelled') badge = 'cancelled';
  else if (f.status === 'sold-out') badge = 'sold-out';
  else if (featured) badge = 'sponsored';
  const showArtists = a.length > 0 && !f.arch && f.status !== 'postponed';
  const best = f.arch ? null : bestTravel(city, f.coordinates, lang);
  const tr = best && city ? { mode: best.mode, text: best.mode === 'near' ? nearCity(city, lang) : `${best.text} ${fromCity(city, lang)}` } : null;
  return {
    id: f.id,
    href: lp(lang, festivalPath(f.id)),
    name: f.name,
    aria: `${f.name}, ${dateLong(f, lang)}, ${place(f, lang)}`,
    place: place(f, lang),
    countryCode: f.countryCode,
    block: dateBlock(f, f.past, lang),
    // Status badges come first; a discount code shows only on festivals still on sale.
    badge: badge ? { kind: badge, text: t(lang, `badge.${badge}`) } : f.discount && !f.arch && f.status === 'scheduled' ? { kind: 'discount', text: t(lang, f.discount.via === 'promoter' ? 'discount.deal' : 'discount.code', { label: discountLabel(f.discount, lang) }) } : null,
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
