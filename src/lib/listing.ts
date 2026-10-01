import { MONTHS, addDays, monthLabel, months12, pISO, plural, type MonthRef } from './dates';
import { byDate, byName } from './festivals';
import { norm } from './text';
import type { Enriched } from './types';

export type When = 'any' | '30' | '90' | 'custom';
export type Sort = 'date' | 'name';
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
  sort: Sort;
  view: View;
}

export const DEFAULT_FILTERS: Filters = { q: '', where: '', when: 'any', from: '', to: '', savedOnly: false, sort: 'date', view: 'list' };

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
    sort: p.get('sort') === 'name' ? 'name' : 'date',
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
  if (f.sort !== 'date') p.set('sort', f.sort);
  if (opts.keepView !== false && f.view !== 'list') p.set('view', f.view);
  const s = p.toString();
  return s ? '?' + s : '';
}

export const filterCount = (f: Filters) => (f.where ? 1 : 0) + (f.savedOnly ? 1 : 0) + (f.when !== 'any' ? 1 : 0) + (f.sort !== 'date' ? 1 : 0);

export function matchWhere(f: Enriched, where: string): boolean {
  if (!where) return true;
  const i = where.indexOf(':');
  const k = where.slice(0, i);
  const v = where.slice(i + 1);
  return k === 'region' ? f.region === v : f.countryCode === v;
}

export function baseFilter(list: Enriched[], f: Filters, saved: string[], withQuery = true): Enriched[] {
  const q = withQuery ? norm(f.q) : '';
  return list.filter((x) => matchWhere(x, f.where) && (!f.savedOnly || saved.includes(x.id)) && (!q || x.hay.includes(q)));
}

function range(f: Filters, today: Date): [Date, Date] | null {
  if (f.when === '30') return [today, addDays(today, 30)];
  if (f.when === '90') return [today, addDays(today, 91)];
  if (f.when === 'custom') return [f.from ? pISO(f.from) : today, f.to ? pISO(f.to) : addDays(today, 3650)];
  return null;
}

const sortList = (l: Enriched[], sort: Sort) => l.slice().sort(sort === 'name' ? byName : byDate);

export interface Section {
  title: string;
  head: boolean;
  items: Enriched[];
}

function groupByMonth(list: Enriched[], desc = false): Section[] {
  const g = new Map<string, Enriched[]>();
  for (const f of list) {
    const k = f.mk!;
    if (!g.has(k)) g.set(k, []);
    g.get(k)!.push(f);
  }
  const keys = [...g.keys()].sort();
  if (desc) keys.reverse();
  return keys.map((k) => ({ title: monthLabel(k), head: true, items: g.get(k)! }));
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

export function computeView(all: Enriched[], today: Date, route: PageRoute, f: Filters, saved: string[], shared: string[] | null): ListView {
  const up = all.filter((x) => !x.arch);
  const arch = all.filter((x) => x.arch);
  const q = f.q.trim();
  const upF = baseFilter(up, f, saved);
  const m12 = months12(today);
  const rng = range(f, today);
  const fc = filterCount(f);
  const v: ListView = { mode: route.name === 'month' ? 'month' : route.name, kicker: '', title: '', note: '', sections: [], total: 0, emptyTitle: '', emptyText: '', m12, monthIdx: -1, monthKey: null, upF, up, arch };
  const byMonthOrAZ = (l: Enriched[], desc = false) => (f.sort === 'name' ? [{ title: 'A–Z', head: true, items: l }] : groupByMonth(l, desc));

  if (q && route.name !== 'saved') {
    v.mode = 'search';
    const a = sortList(upF, f.sort);
    const b = sortList(baseFilter(arch, f, saved), f.sort);
    v.kicker = plural(a.length, 'result');
    v.title = 'Search';
    v.note = `Results for "${q}" across names, cities, countries and artists.`;
    v.sections = [{ title: 'Upcoming', items: a, head: b.length > 0 }];
    if (b.length) v.sections.push({ title: 'In the archive', items: b, head: true });
    v.emptyTitle = `Nothing matches "${q}".`;
    v.emptyText = 'Check the spelling, or try a city, country or artist name.';
  } else if (route.name === 'archive') {
    const l = sortList(baseFilter(arch, f, saved), f.sort);
    v.kicker = plural(l.length, 'past festival');
    v.title = 'Archive';
    v.note = "Festivals that already took place or were cancelled. Useful for guessing next year's dates.";
    v.sections = byMonthOrAZ(l, true);
    v.emptyTitle = 'Nothing in the archive matches.';
    v.emptyText = 'Try clearing filters.';
  } else if (route.name === 'saved') {
    const ids = shared && shared.length ? shared : saved;
    const l = baseFilter(all.filter((x) => ids.includes(x.id)), f, saved);
    const u = sortList(l.filter((x) => !x.arch), f.sort);
    const p = sortList(l.filter((x) => x.arch), f.sort);
    v.kicker = plural(l.length, shared && shared.length ? 'shared festival' : 'saved festival');
    v.title = shared && shared.length ? 'Shared list' : 'Saved';
    v.note = shared && shared.length ? 'A list someone shared with you.' : 'Saved on this device only. Use "Share my list" to open it on another phone.';
    v.sections = [{ title: 'Upcoming', items: u, head: p.length > 0 }];
    if (p.length) v.sections.push({ title: 'Already happened', items: p, head: true });
    v.emptyTitle = 'No saved festivals yet.';
    v.emptyText = 'Tap ♡ on any festival to keep it here.';
  } else if (rng) {
    v.mode = 'range';
    const l = sortList(upF.filter((x) => x.s <= rng[1] && x.e >= rng[0]), f.sort);
    v.kicker = plural(l.length, 'festival');
    v.title = f.when === '30' ? 'Next 30 days' : f.when === '90' ? 'Next 3 months' : 'Your dates';
    v.sections = byMonthOrAZ(l);
    v.emptyTitle = 'No festivals in these dates.';
    v.emptyText = 'Try a wider range or a different place.';
  } else if (route.name === 'all') {
    const l = sortList(upF, f.sort);
    v.kicker = plural(l.length, 'festival');
    v.title = 'All upcoming';
    v.sections = byMonthOrAZ(l);
    v.emptyTitle = 'No festivals match these filters.';
    v.emptyText = 'Try a different place.';
  } else {
    const key = (route.name === 'month' && route.key) || m12[0].key;
    const [y, m] = key.split('-').map(Number);
    const l = sortList(upF.filter((x) => x.mk === key), f.sort);
    v.monthKey = key;
    v.monthIdx = m12.findIndex((x) => x.key === key);
    v.kicker = `${y} · ${plural(l.length, 'festival')}`;
    v.title = MONTHS[m - 1];
    v.sections = [{ title: '', head: false, items: l }];
    v.emptyTitle = `No festivals in ${MONTHS[m - 1]} ${y}${fc ? ' with these filters' : ''}.`;
    v.emptyText = fc ? 'Try clearing filters, or move to another month.' : 'Nothing listed yet. Know one?';
  }
  v.sections = v.sections.filter((s) => s.items.length);
  v.total = v.sections.reduce((a, s) => a + s.items.length, 0);
  return v;
}

/** Region (by count) and country (A–Z) options for the Where select. */
export function whereOptions(up: Enriched[]) {
  const reg = new Map<string, number>();
  const cc = new Map<string, { label: string; n: number }>();
  for (const f of up) {
    reg.set(f.region, (reg.get(f.region) || 0) + 1);
    if (f.countryCode && f.country) {
      const c = cc.get(f.countryCode) || { label: f.country, n: 0 };
      c.n++;
      cc.set(f.countryCode, c);
    }
  }
  return {
    regions: [...reg].sort((a, b) => b[1] - a[1]).map(([k, n]) => ({ value: 'region:' + k, label: `${k} (${n})`, name: k })),
    countries: [...cc].sort((a, b) => a[1].label.localeCompare(b[1].label)).map(([k, c]) => ({ value: 'country:' + k, label: `${c.label} (${c.n})`, name: c.label })),
  };
}

export function filterSummary(f: Filters, up: Enriched[]): string {
  const parts: string[] = [];
  if (f.where) {
    const [k, val] = [f.where.slice(0, f.where.indexOf(':')), f.where.slice(f.where.indexOf(':') + 1)];
    parts.push(k === 'region' ? val : up.find((x) => x.countryCode === val)?.country || val);
  }
  if (f.when !== 'any') parts.push({ '30': 'Next 30 days', '90': 'Next 3 months', custom: 'Your dates' }[f.when]);
  if (f.savedOnly) parts.push('Saved only');
  if (f.sort === 'name') parts.push('A–Z');
  return 'Filtered: ' + parts.join(' · ');
}
