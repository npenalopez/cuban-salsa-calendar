// Landing pages (country, region, year), festival titles and Event JSON-LD.
import { SITE, festivalPath, fmtPrice, place, ticketOf } from './festivals';
import { STYLES, styleLabel, stylePath, stylePlural } from './styles';
import { type Lang, LOCALES, lp, monthName, t } from '../i18n';
import { countryName, inCountry, inRegion, regionName } from '../i18n/places';
import type { Enriched } from './types';

export const slugify = (s: string) =>
  s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const countryPath = (country: string) => `/country/${slugify(country)}/`;
export const regionPath = (region: string) => `/region/${slugify(region)}/`;
export const yearPath = (y: number) => `/${y}/`;

export type LandingKind = 'country' | 'region' | 'year' | 'style';

export interface Landing {
  kind: LandingKind;
  /** Country code, region name, year or style key: what the label is translated from. */
  key: string;
  /** "Germany", "Europe", "2027" */
  label: string;
  path: string;
  upcoming: Enriched[];
  past: Enriched[];
}

const byStart = (a: Enriched, b: Enriched) => a.s.getTime() - b.s.getTime() || a.name.localeCompare(b.name);

function landing(kind: LandingKind, label: string, path: string, list: Enriched[], key = label): Landing {
  return { kind, key, label, path, upcoming: list.filter((f) => !f.arch).sort(byStart), past: list.filter((f) => f.arch).sort((a, b) => byStart(b, a)) };
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
    ...group((f) => f.country).map(([c, l]) => landing('country', c, countryPath(c), l, l[0].countryCode ?? c)),
    ...group((f) => f.region).map(([r, l]) => landing('region', r, regionPath(r), l)),
    ...group((f) => String(f.s.getFullYear())).map(([y, l]) => landing('year', y, yearPath(Number(y)), l)),
    ...STYLES.map((st) => landing('style', st.label, stylePath(st.key), all.filter((f) => f.styles?.includes(st.key)), st.key)).filter((l) => l.upcoming.length + l.past.length > 0),
  ];
}

export interface Related {
  title: string;
  links: { href: string; label: string; n: number }[];
}

/** The landing's name in a language: "Alemania", "Europa", "2027", "Festivales de timba". */
export function landingLabel(l: Landing, lang: Lang = 'en'): string {
  if (l.kind === 'country') return countryName(lang, l.key, l.label);
  if (l.kind === 'region') return regionName(lang, l.key);
  if (l.kind === 'style') return styleLabel(l.key, lang);
  return l.label;
}

/** Links between landing pages: countries of the same region, other regions, years. */
export function relatedFor(l: Landing, all: Landing[], lang: Lang = 'en'): Related[] {
  const T = (k: string, v?: Record<string, string | number>) => t(lang, k, v);
  const link = (x: Landing) => ({ href: lp(lang, x.path), label: landingLabel(x, lang), n: x.upcoming.length });
  const byLabel = (a: { label: string }, b: { label: string }) => a.label.localeCompare(b.label, LOCALES[lang]);
  const of = (k: LandingKind) => all.filter((x) => x.kind === k && x.path !== l.path);
  const regionOf = (x: Landing) => (x.upcoming[0] ?? x.past[0]).region;
  const countries = of('country');
  if (l.kind === 'country') {
    const region = regionOf(l);
    const r = all.find((x) => x.kind === 'region' && x.key === region);
    return [
      { title: T('land.moreCountries', { region: regionName(lang, region) }), links: countries.filter((x) => regionOf(x) === region).map(link).sort(byLabel) },
      { title: T('land.browse'), links: [...(r ? [link(r)] : []), ...of('year').map(link)] },
    ];
  }
  if (l.kind === 'region') {
    return [
      { title: T('land.countriesIn', { region: regionName(lang, l.key) }), links: countries.filter((x) => regionOf(x) === l.key).map(link).sort(byLabel) },
      { title: T('land.otherRegions'), links: of('region').map(link) },
    ];
  }
  if (l.kind === 'style') {
    return [
      { title: T('land.otherStyles'), links: of('style').map(link) },
      { title: T('land.byRegion'), links: of('region').map(link) },
    ];
  }
  return [
    { title: T('land.byRegion'), links: of('region').map(link) },
    { title: T('land.otherYears'), links: of('year').map(link) },
  ];
}

const listWords = (xs: string[], lang: Lang = 'en') => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')}${t(lang, 'land.and')}${xs[xs.length - 1]}`);

function topBy<T>(xs: T[], key: (x: T) => string, n: number): string[] {
  const c = new Map<string, number>();
  for (const x of xs) c.set(key(x), (c.get(key(x)) ?? 0) + 1);
  return [...c].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, n).map(([k]) => k);
}

/** Country names that take "the" in running text: "in the Czech Republic". */
export const inName = (country: string) => inCountry('en', null, country);

/** " in Germany" / " en Alemania" / " en Allemagne"; years and styles have none. */
function where(l: Landing, lang: Lang): string {
  if (l.kind === 'style') return '';
  if (l.kind === 'year') return t(lang, 'land.where', { place: lang === 'fr' ? `en ${l.label}` : l.label });
  return t(lang, 'land.where', { place: l.kind === 'country' ? inCountry(lang, l.key, l.label) : inRegion(lang, l.key) });
}
/** " with timba" on style pages. */
const withStyle = (l: Landing, lang: Lang) =>
  l.kind === 'style' ? t(lang, 'land.with', { style: l.key === 'mixed' ? t(lang, 'styleWith.mixed') : styleLabel(l.key, lang).toLocaleLowerCase(LOCALES[lang]) }) : '';
const yearsOf = (l: Landing) => {
  const ys = [...new Set(l.upcoming.map((f) => f.s.getFullYear()))].sort();
  return ys.length ? ' ' + (ys.length > 1 ? `${ys[0]}–${ys[ys.length - 1]}` : ys[0]) : '';
};

export function landingTitle(l: Landing, lang: Lang = 'en'): string {
  if (l.kind === 'style') return t(lang, 'land.titleStyle', { plural: stylePlural(l.key, lang) });
  if (l.kind === 'year') return t(lang, 'land.titleYear', { year: l.label });
  const place = l.kind === 'country' ? inCountry(lang, l.key, l.label) : inRegion(lang, l.key);
  return t(lang, 'land.titlePlace', { place, years: yearsOf(l) });
}

export function landingH1(l: Landing, lang: Lang = 'en'): string {
  return l.kind === 'year' ? t(lang, 'land.h1Year', { year: l.label }) : l.kind === 'style' ? stylePlural(l.key, lang) : landingLabel(l, lang);
}

export function landingDescription(l: Landing, lang: Lang = 'en'): string {
  const n = l.upcoming.length;
  const next = l.upcoming[0];
  const vars = { n, with: withStyle(l, lang), where: where(l, lang) };
  const head = n ? t(lang, 'land.desc', vars) : t(lang, 'land.descPast', vars);
  return next ? `${head} ${t(lang, 'land.next', { name: next.name, city: next.city || place(next, lang) })}` : head;
}

/** A short factual paragraph built from the data. */
export function landingIntro(l: Landing, lang: Lang = 'en'): string {
  const up = l.upcoming;
  const w = withStyle(l, lang);
  const wh = where(l, lang);
  if (!up.length) return `${t(lang, 'land.none', { with: w, where: wh })} ${t(lang, 'land.pastListed', { n: l.past.length })}`;
  const parts: string[] = [];
  const cities = topBy(up.filter((f) => f.city), (f) => f.city!, 4);
  const codes = topBy(up.filter((f) => f.countryCode), (f) => f.countryCode!, 4);
  const allCities = new Set(up.map((f) => f.city).filter(Boolean)).size;
  const spread =
    l.kind === 'country'
      ? cities.length ? t(lang, allCities > cities.length ? 'land.spreadCitiesIncl' : 'land.spreadCities', { list: listWords(cities, lang) }) : ''
      : codes.length ? t(lang, 'land.spreadCountries', { list: listWords(codes.map((c) => inCountry(lang, c, up.find((f) => f.countryCode === c)!.country)), lang) }) : '';
  parts.push(t(lang, 'land.coming', { n: up.length, with: w, where: wh, spread }));
  const months = topBy(up, (f) => `${f.s.getFullYear()}-${f.s.getMonth()}`, 1);
  if (up.length > 2 && months.length) {
    const [y, m] = months[0].split('-').map(Number);
    parts.push(t(lang, 'land.busiest', { month: monthName(lang, m) + (l.kind === 'year' ? '' : ' ' + y) }));
  }
  const lined = up.filter((f) => f.artists.length).length;
  if (lined) parts.push(lined === up.length ? t(lang, 'land.lineupAll') : t(lang, 'land.lineupSome', { n: lined }));
  const priced = up.filter((f) => f.priceFrom != null && f.currency === 'EUR').sort((a, b) => a.priceFrom! - b.priceFrom!);
  if (priced.length > 1) parts.push(t(lang, 'land.passes', { price: fmtPrice(priced[0], lang)! }));
  return parts.join(' ');
}

/** "{Name} {Year}: Cuban Salsa Festival in {City}, {Country}". The year is left out when the name has it. */
export function festivalTitle(f: Enriched, lang: Lang = 'en'): string {
  const y = String(f.s.getFullYear());
  const name = f.name.includes(y) ? f.name : `${f.name} ${y}`;
  return t(lang, f.cubanFocused === false ? 'fest.titleMixed' : 'fest.titleCuban', { name, place: place(f, lang) });
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
