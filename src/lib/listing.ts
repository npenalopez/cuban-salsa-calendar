import { addDays, daysBetween, monthLabel, months12, pISO, type MonthRef } from './dates';
import { monthInText, monthName } from '../i18n';
import { byDate, byName } from './festivals';
import { norm } from './text';
import { STYLES, isStyle, styleLabel } from './styles';
import { type Lang, t } from '../i18n';
import { countryName, regionName } from '../i18n/places';
import { bestTravel } from './travel';
import type { City, Enriched, Style } from './types';

export interface LatLng {
  lat: number;
  lng: number;
}

/** Great-circle distance in km. */
export function km(a: LatLng, b: LatLng): number {
  const r = (x: number) => (x * Math.PI) / 180;
  const h = Math.sin(r(b.lat - a.lat) / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(r(b.lng - a.lng) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
}



export type When = 'any' | '30' | '90' | 'custom';
/** near = fastest from the travel city; me = straight-line distance from the browser's location (never stored). */
export type Sort = 'date' | 'name' | 'near' | 'length' | 'me';
export type View = 'list' | 'map';

/** List state that lives in the query string. */
export interface Filters {
  q: string;
  /** "region:Europe" | "country:ES" | "" */
  where: string;
  when: When;
  from: string;
  to: string;
  savedOnly: boolean;
  /** A style key from styles.ts, or "" */
  style: string;
  /** Only festivals marked cubanFocused: true */
  cuban: boolean;
  sort: Sort;
  view: View;
}

export const DEFAULT_FILTERS: Filters = { q: '', where: '', when: 'any', from: '', to: '', savedOnly: false, style: '', cuban: false, sort: 'date', view: 'list' };

const SORTS: Sort[] = ['date', 'name', 'near', 'length', 'me'];

export type PageRoute =
  | { name: 'month'; key: string | null }
  | { name: 'all' | 'archive' | 'saved' };

export function parseFilters(search: string): Filters {
  const p = new URLSearchParams(search);
  const when = p.get('when');
  return {
    q: p.get('q') || '',
    where: p.get('where') || '',
    when: when === '30' || when === '90' || when === 'custom' ? when : 'any',
    from: p.get('from') || '',
    to: p.get('to') || '',
    savedOnly: p.get('saved') === '1',
    style: isStyle(p.get('style') || '') ? p.get('style')! : '',
    cuban: p.get('cuban') === '1',
    sort: SORTS.includes(p.get('sort') as Sort) ? (p.get('sort') as Sort) : 'date',
    view: p.get('view') === 'map' ? 'map' : 'list',
  };
}

/** Query string for the given filters ("" or "?…"). */
export function filtersQuery(f: Filters, opts: { keepQuery?: boolean; keepView?: boolean } = {}): string {
  const p = new URLSearchParams();
  if (opts.keepQuery !== false && f.q.trim()) p.set('q', f.q.trim());
  if (f.where) p.set('where', f.where);
  if (f.when !== 'any') p.set('when', f.when);
  if (f.when === 'custom' && f.from) p.set('from', f.from);
  if (f.when === 'custom' && f.to) p.set('to', f.to);
  if (f.savedOnly) p.set('saved', '1');
  if (f.style) p.set('style', f.style);
  if (f.cuban) p.set('cuban', '1');
  if (f.sort !== 'date') p.set('sort', f.sort);
  if (opts.keepView !== false && f.view !== 'list') p.set('view', f.view);
  const s = p.toString();
  return s ? '?' + s : '';
}

export const filterCount = (f: Filters) =>
  (f.where ? 1 : 0) + (f.savedOnly ? 1 : 0) + (f.style ? 1 : 0) + (f.cuban ? 1 : 0) + (f.when !== 'any' ? 1 : 0) + (f.sort !== 'date' ? 1 : 0);

export function matchWhere(f: Enriched, where: string): boolean {
  if (!where) return true;
  const i = where.indexOf(':');
  const k = where.slice(0, i);
  const v = where.slice(i + 1);
  return k === 'region' ? f.region === v : f.countryCode === v;
}

export function baseFilter(list: Enriched[], f: Filters, saved: string[], withQuery = true): Enriched[] {
  const q = withQuery ? norm(f.q) : '';
  return list.filter(
    (x) =>
      matchWhere(x, f.where) &&
      (!f.savedOnly || saved.includes(x.id)) &&
      (!f.style || !!x.styles?.includes(f.style as Style)) &&
      (!f.cuban || x.cubanFocused === true) &&
      (!q || x.hay.includes(q)),
  );
}

function range(f: Filters, today: Date): [Date, Date] | null {
  if (f.when === '30') return [today, addDays(today, 30)];
  if (f.when === '90') return [today, addDays(today, 91)];
  if (f.when === 'custom') return [f.from ? pISO(f.from) : today, f.to ? pISO(f.to) : addDays(today, 3650)];
  return null;
}

/** Sort by date, name, length (longest first), fastest from the travel city, or nearest to the visitor. */
function sortBy(l: Enriched[], sort: Sort, city: City | null = null, me: LatLng | null = null): Enriched[] {
  if (sort === 'near' && city) {
    const t = new Map(l.map((x) => [x.id, bestTravel(city, x.coordinates)?.doorToDoor ?? Infinity]));
    return l.slice().sort((a, b) => t.get(a.id)! - t.get(b.id)! || byDate(a, b));
  }
  if (sort === 'me' && me) {
    const d = new Map(l.map((x) => [x.id, x.coordinates ? km(me, { lat: x.coordinates[0], lng: x.coordinates[1] }) : Infinity]));
    return l.slice().sort((a, b) => d.get(a.id)! - d.get(b.id)! || byDate(a, b));
  }
  if (sort === 'length') return l.slice().sort((a, b) => daysBetween(b.s, b.e) - daysBetween(a.s, a.e) || byDate(a, b));
  return l.slice().sort(sort === 'name' ? byName : byDate);
}

export interface Section {
  title: string;
  head: boolean;
  items: Enriched[];
}

function groupByMonth(list: Enriched[], desc = false, lang: Lang = 'en'): Section[] {
  const g = new Map<string, Enriched[]>();
  for (const f of list) {
    const k = f.mk!;
    if (!g.has(k)) g.set(k, []);
    g.get(k)!.push(f);
  }
  const keys = [...g.keys()].sort();
  if (desc) keys.reverse();
  return keys.map((k) => ({ title: monthLabel(k, lang), head: true, items: g.get(k)! }));
}

export type Mode = 'month' | 'search' | 'range' | 'all' | 'archive' | 'saved';

export interface ListView {
  mode: Mode;
  kicker: string;
  title: string;
  note: string;
  sections: Section[];
  total: number;
  emptyTitle: string;
  emptyText: string;
  m12: MonthRef[];
  /** Index of the shown month in m12, or -1 */
  monthIdx: number;
  monthKey: string | null;
  /** Upcoming festivals after where/saved/query filters */
  upF: Enriched[];
  up: Enriched[];
  arch: Enriched[];
}

export function computeView(
  all: Enriched[], today: Date, route: PageRoute, filters: Filters, saved: string[], shared: string[] | null, city: City | null = null, me: LatLng | null = null, lang: Lang = 'en',
): ListView {
  const T = (k: string, v?: Record<string, string | number>) => t(lang, k, v);
  // "Nearest first" needs a travel city, "Near me" the visitor's location; without them, date order.
  const f: Filters = (filters.sort === 'near' && !city) || (filters.sort === 'me' && !me) ? { ...filters, sort: 'date' } : filters;
  const sortList = (l: Enriched[], sort: Sort) => sortBy(l, sort, city, me);
  const up = all.filter((x) => !x.arch);
  const arch = all.filter((x) => x.arch);
  const q = f.q.trim();
  const upF = baseFilter(up, f, saved);
  const m12 = months12(today);
  const rng = range(f, today);
  const fc = filterCount(f);
  const v: ListView = { mode: route.name === 'month' ? 'month' : route.name, kicker: '', title: '', note: '', sections: [], total: 0, emptyTitle: '', emptyText: '', m12, monthIdx: -1, monthKey: null, upF, up, arch };
  const byMonthOrAZ = (l: Enriched[], desc = false) =>
    f.sort === 'date' ? groupByMonth(l, desc, lang) : [{ title: T(`sortTitle.${f.sort}`), head: true, items: l }];

  if (q && route.name !== 'saved') {
    v.mode = 'search';
    const a = sortList(upF, f.sort);
    const b = sortList(baseFilter(arch, f, saved), f.sort);
    v.kicker = T('n.results', { n: a.length });
    v.title = T('view.search');
    v.note = T('view.searchNote', { q });
    v.sections = [{ title: T('view.upcoming'), items: a, head: b.length > 0 }];
    if (b.length) v.sections.push({ title: T('view.inArchive'), items: b, head: true });
    v.emptyTitle = T('view.nothingMatches', { q });
    v.emptyText = T('view.checkSpelling');
  } else if (route.name === 'archive') {
    const l = sortList(baseFilter(arch, f, saved), f.sort);
    v.kicker = T('view.past', { n: l.length });
    v.title = T('view.archive');
    v.note = T('view.archiveNote');
    v.sections = byMonthOrAZ(l, true);
    v.emptyTitle = T('view.nothingArchive');
    v.emptyText = T('view.tryClear');
  } else if (route.name === 'saved') {
    const ids = shared && shared.length ? shared : saved;
    const l = baseFilter(all.filter((x) => ids.includes(x.id)), f, saved);
    const u = sortList(l.filter((x) => !x.arch), f.sort);
    const p = sortList(l.filter((x) => x.arch), f.sort);
    v.kicker = T(shared && shared.length ? 'view.sharedKicker' : 'view.savedKicker', { n: l.length });
    v.title = T(shared && shared.length ? 'view.shared' : 'view.saved');
    v.note = T(shared && shared.length ? 'view.sharedNote' : 'view.savedNote');
    v.sections = [{ title: T('view.upcoming'), items: u, head: p.length > 0 }];
    if (p.length) v.sections.push({ title: T('view.happened'), items: p, head: true });
    v.emptyTitle = T('view.noSaved');
    v.emptyText = T('view.tapHeart');
  } else if (rng) {
    v.mode = 'range';
    const l = sortList(upF.filter((x) => x.s <= rng[1] && x.e >= rng[0]), f.sort);
    v.kicker = T('n.festivals', { n: l.length });
    v.title = T(f.when === '30' ? 'view.next30' : f.when === '90' ? 'view.next90' : 'view.yourDates');
    v.sections = byMonthOrAZ(l);
    v.emptyTitle = T('view.noInDates');
    v.emptyText = T('view.tryWider');
  } else if (route.name === 'all') {
    const l = sortList(upF, f.sort);
    v.kicker = T('n.festivals', { n: l.length });
    v.title = T('view.allUpcoming');
    v.sections = byMonthOrAZ(l);
    v.emptyTitle = T('view.noMatch');
    v.emptyText = T('view.tryPlace');
  } else {
    const key = (route.name === 'month' && route.key) || m12[0].key;
    const [y, m] = key.split('-').map(Number);
    const l = sortList(upF.filter((x) => x.mk === key), f.sort);
    v.monthKey = key;
    v.monthIdx = m12.findIndex((x) => x.key === key);
    v.kicker = `${y} · ${T('n.festivals', { n: l.length })}`;
    v.title = monthName(lang, m - 1);
    v.sections = [{ title: '', head: false, items: l }];
    v.emptyTitle = T(fc ? 'view.noInMonthFiltered' : 'view.noInMonth', { month: `${lang === 'en' ? monthName(lang, m - 1) : monthInText(lang, m - 1)} ${y}` });
    v.emptyText = T(fc ? 'view.tryMove' : 'view.nothingYet');
  }
  v.sections = v.sections.filter((s) => s.items.length);
  v.total = v.sections.reduce((a, s) => a + s.items.length, 0);
  return v;
}

/** Region (by count) and country (A–Z) options for the Where select. */
export function whereOptions(up: Enriched[], lang: Lang = 'en') {
  const reg = new Map<string, number>();
  const cc = new Map<string, { label: string; n: number }>();
  for (const f of up) {
    reg.set(f.region, (reg.get(f.region) || 0) + 1);
    if (f.countryCode && f.country) {
      const c = cc.get(f.countryCode) || { label: countryName(lang, f.countryCode, f.country), n: 0 };
      c.n++;
      cc.set(f.countryCode, c);
    }
  }
  return {
    regions: [...reg].sort((a, b) => b[1] - a[1]).map(([k, n]) => ({ value: 'region:' + k, label: `${regionName(lang, k)} (${n})`, name: regionName(lang, k) })),
    countries: [...cc].sort((a, b) => a[1].label.localeCompare(b[1].label)).map(([k, c]) => ({ value: 'country:' + k, label: `${c.label} (${c.n})`, name: c.label })),
  };
}

export function filterSummary(f: Filters, up: Enriched[], lang: Lang = 'en'): string {
  const parts: string[] = [];
  if (f.where) {
    const [k, val] = [f.where.slice(0, f.where.indexOf(':')), f.where.slice(f.where.indexOf(':') + 1)];
    const c = up.find((x) => x.countryCode === val);
    parts.push(k === 'region' ? regionName(lang, val) : c ? countryName(lang, c.countryCode, c.country) : val);
  }
  if (f.when !== 'any') parts.push(t(lang, { '30': 'view.next30', '90': 'view.next90', custom: 'view.yourDates' }[f.when]));
  if (f.style) parts.push(styleLabel(f.style, lang));
  if (f.cuban) parts.push(t(lang, 'view.cubanFocused'));
  if (f.savedOnly) parts.push(t(lang, 'view.savedOnly'));
  if (f.sort !== 'date') parts.push(t(lang, `sortTitle.${f.sort}`));
  return t(lang, 'view.filtered', { what: parts.join(' · ') });
}

/** Styles present in the list, with counts, in STYLES order. */
export function styleOptions(up: Enriched[], lang: Lang = 'en') {
  return STYLES.map((s) => ({ value: s.key, label: styleLabel(s.key, lang), n: up.filter((f) => f.styles?.includes(s.key)).length })).filter((o) => o.n > 0);
}
