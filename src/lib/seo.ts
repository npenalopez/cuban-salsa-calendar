// Landing pages (country, region, year), festival titles and Event JSON-LD.
import { MONTHS, plural } from './dates';
import { SITE, festivalPath, fmtPrice, place, ticketOf } from './festivals';
import { STYLES, stylePath } from './styles';
import type { Enriched } from './types';

export const slugify = (s: string) =>
  s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const countryPath = (country: string) => `/country/${slugify(country)}/`;
export const regionPath = (region: string) => `/region/${slugify(region)}/`;
export const yearPath = (y: number) => `/${y}/`;

export type LandingKind = 'country' | 'region' | 'year' | 'style';

export interface Landing {
  kind: LandingKind;
  /** "Germany", "Europe", "2027" */
  label: string;
  path: string;
  upcoming: Enriched[];
  past: Enriched[];
}

const byStart = (a: Enriched, b: Enriched) => a.s.getTime() - b.s.getTime() || a.name.localeCompare(b.name);

function landing(kind: LandingKind, label: string, path: string, list: Enriched[]): Landing {
  return { kind, label, path, upcoming: list.filter((f) => !f.arch).sort(byStart), past: list.filter((f) => f.arch).sort((a, b) => byStart(b, a)) };
}

/** Every country, region and year with at least one festival, upcoming or past. */
export function landings(all: Enriched[]): Landing[] {
  const group = (key: (f: Enriched) => string | null) => {
    const m = new Map<string, Enriched[]>();
    for (const f of all) {
      const k = key(f);
      if (k) m.set(k, [...(m.get(k) ?? []), f]);
    }
    return [...m].sort(([a], [b]) => a.localeCompare(b));
  };
  return [
    ...group((f) => f.country).map(([c, l]) => landing('country', c, countryPath(c), l)),
    ...group((f) => f.region).map(([r, l]) => landing('region', r, regionPath(r), l)),
    ...group((f) => String(f.s.getFullYear())).map(([y, l]) => landing('year', y, yearPath(Number(y)), l)),
    ...STYLES.map((st) => landing('style', st.label, stylePath(st.key), all.filter((f) => f.styles?.includes(st.key)))).filter((l) => l.upcoming.length + l.past.length > 0),
  ];
}

export interface Related {
  title: string;
  links: { href: string; label: string; n: number }[];
}

/** Links between landing pages: countries of the same region, other regions, years. */
export function relatedFor(l: Landing, all: Landing[]): Related[] {
  const link = (x: Landing) => ({ href: x.path, label: x.label, n: x.upcoming.length });
  const of = (k: LandingKind) => all.filter((x) => x.kind === k && x.path !== l.path);
  const regionOf = (x: Landing) => (x.upcoming[0] ?? x.past[0]).region;
  const countries = of('country');
  if (l.kind === 'country') {
    const region = regionOf(l);
    const r = all.find((x) => x.kind === 'region' && x.label === region);
    return [
      { title: `More countries in ${region}`, links: countries.filter((x) => regionOf(x) === region).map(link) },
      { title: 'Browse', links: [...(r ? [link(r)] : []), ...of('year').map(link)] },
    ];
  }
  if (l.kind === 'region') {
    return [
      { title: `Countries in ${l.label}`, links: countries.filter((x) => regionOf(x) === l.label).map(link) },
      { title: 'Other regions', links: of('region').map(link) },
    ];
  }
  if (l.kind === 'style') {
    return [
      { title: 'Other styles', links: of('style').map(link) },
      { title: 'By region', links: of('region').map(link) },
    ];
  }
  return [
    { title: 'By region', links: of('region').map(link) },
    { title: 'Other years', links: of('year').map(link) },
  ];
}

const listWords = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);

function topBy<T>(xs: T[], key: (x: T) => string, n: number): string[] {
  const c = new Map<string, number>();
  for (const x of xs) c.set(key(x), (c.get(key(x)) ?? 0) + 1);
  return [...c].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, n).map(([k]) => k);
}

/** Country names that take "the" in running text: "in the Czech Republic". */
export const inName = (country: string) => (/^(united|czech|dominican|netherlands|philippines)\b/i.test(country) ? `the ${country}` : country);

const where = (l: Landing) => (l.kind === 'year' || l.kind === 'style' ? '' : ` in ${l.kind === 'country' ? inName(l.label) : l.label}`);
/** "festival" for most pages, "festival with timba" on style pages. */
const withStyle = (l: Landing) => (l.kind === 'style' ? ` with ${STYLES.find((x) => x.label === l.label)!.key === 'mixed' ? 'mixed styles' : l.label.toLowerCase()}` : '');
const count = (n: number, w: string) => (n === 1 ? `One ${w}` : plural(n, w));

export function landingTitle(l: Landing): string {
  if (l.kind === 'style') {
    const st = STYLES.find((x) => x.label === l.label)!;
    return `${st.plural[0].toUpperCase() + st.plural.slice(1)}: Cuban Salsa Festival Dates and Line-ups`;
  }
  if (l.kind === 'year') return `Cuban Salsa Festivals ${l.label}: Dates, Line-ups and Prices`;
  const years = [...new Set(l.upcoming.map((f) => f.s.getFullYear()))].sort();
  return `Cuban Salsa Festivals in ${inName(l.label)}${years.length ? ' ' + (years.length > 1 ? `${years[0]}–${years[years.length - 1]}` : years[0]) : ''}: Dates and Line-ups`;
}

export function landingH1(l: Landing): string {
  return l.kind === 'year' ? `Festivals ${l.label}` : l.kind === 'style' ? STYLES.find((x) => x.label === l.label)!.plural : l.label;
}

export function landingDescription(l: Landing): string {
  const n = l.upcoming.length;
  const next = l.upcoming[0];
  const head = n
    ? `${count(n, 'upcoming Cuban salsa, timba and Afro-Cuban festival')}${withStyle(l)}${where(l)}${l.kind === 'year' ? ` in ${l.label}` : ''}: dates, cities, line-ups and prices.`
    : `Cuban salsa, timba and Afro-Cuban festivals${withStyle(l)}${where(l)}${l.kind === 'year' ? ` in ${l.label}` : ''}: past editions with dates and line-ups.`;
  return next ? `${head} Next: ${next.name}, ${next.city || place(next)}.` : head;
}

/** A short factual paragraph built from the data. */
export function landingIntro(l: Landing): string {
  const up = l.upcoming;
  if (!up.length) {
    return `No upcoming festival${withStyle(l)}${where(l)} is on the calendar yet. ${count(l.past.length, 'past edition')} ${l.past.length === 1 ? 'is' : 'are'} listed below, a good hint for next year's dates.`;
  }
  const parts: string[] = [];
  const cities = topBy(up.filter((f) => f.city), (f) => f.city!, 4);
  const countries = topBy(up, (f) => f.country ?? '', 4).filter(Boolean);
  const allCities = new Set(up.map((f) => f.city).filter(Boolean)).size;
  const spread =
    l.kind === 'country'
      ? cities.length ? `, in ${allCities > cities.length ? 'cities including ' : ''}${listWords(cities)}` : ''
      : countries.length ? `, with the most in ${listWords(countries.map(inName))}` : '';
  parts.push(`${count(up.length, 'Cuban salsa festival')}${withStyle(l)} ${up.length === 1 ? 'is' : 'are'} coming up${where(l)}${l.kind === 'year' ? ` in ${l.label}` : ''}${spread}.`);
  const months = topBy(up, (f) => MONTHS[f.s.getMonth()] + (l.kind === 'year' ? '' : ' ' + f.s.getFullYear()), 1);
  if (up.length > 2 && months.length) parts.push(`${months[0]} is the busiest month.`);
  const lined = up.filter((f) => f.artists.length).length;
  if (lined) parts.push(`${lined === up.length ? 'All of them have' : `${lined} ${lined === 1 ? 'has' : 'have'}`} announced line-ups.`);
  const priced = up.filter((f) => f.priceFrom != null && f.currency === 'EUR').sort((a, b) => a.priceFrom! - b.priceFrom!);
  if (priced.length > 1) parts.push(`Passes start ${fmtPrice(priced[0])}.`);
  return parts.join(' ');
}

/** "{Name} {Year}: Cuban Salsa Festival in {City}, {Country}". The year is left out when the name has it. */
export function festivalTitle(f: Enriched): string {
  const y = String(f.s.getFullYear());
  const name = f.name.includes(y) ? f.name : `${f.name} ${y}`;
  return `${name}: ${f.cubanFocused === false ? 'Salsa Festival' : 'Cuban Salsa Festival'} in ${place(f)}`;
}

const isGroup = (name: string) => /\s(&|y|and)\s/i.test(name) || /\b(orquesta|band|team|group|grupo)\b/i.test(name);

/** schema.org Event. Never include `notes`. */
export function eventLd(f: Enriched): Record<string, unknown> {
  const ticket = ticketOf(f);
  const ld: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'DanceEvent',
    name: f.name,
    url: SITE + festivalPath(f.id),
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/' + (f.status === 'postponed' ? 'EventPostponed' : f.status === 'cancelled' ? 'EventCancelled' : 'EventScheduled'),
    location: {
      '@type': 'Place',
      name: f.venue || f.city || place(f),
      address: { '@type': 'PostalAddress', addressLocality: f.city ?? undefined, addressCountry: f.countryCode ?? undefined },
      geo: f.coordinates ? { '@type': 'GeoCoordinates', latitude: f.coordinates[0], longitude: f.coordinates[1] } : undefined,
    },
    image: [SITE + `/og/${f.id}.png`],
  };
  if (f.datePrecision === 'day') {
    ld.startDate = f.startDate;
    ld.endDate = f.endDate;
  }
  if (f.description) ld.description = f.description;
  if (f.artists.length) ld.performer = f.artists.map((name) => ({ '@type': isGroup(name) ? 'PerformingGroup' : 'Person', name }));
  const sameAs = [f.instagram, f.facebook].filter((u): u is string => !!u && !/\/p\//.test(u));
  if (f.website || sameAs.length) ld.organizer = { '@type': 'Organization', name: f.name, url: f.website ?? undefined, sameAs: sameAs.length ? sameAs : undefined };
  if (!f.arch && (ticket || f.priceFrom != null)) {
    ld.offers = {
      '@type': 'Offer',
      url: ticket ?? f.website ?? SITE + festivalPath(f.id),
      price: f.priceFrom ?? undefined,
      priceCurrency: f.priceFrom != null ? f.currency ?? undefined : undefined,
      availability: 'https://schema.org/' + (f.status === 'sold-out' ? 'SoldOut' : 'InStock'),
    };
  }
  return ld;
}
