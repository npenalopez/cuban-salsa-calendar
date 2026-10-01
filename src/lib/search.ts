import { lev, norm } from './text';
import { place } from './festivals';
import type { Enriched } from './types';

export type Suggestion =
  | { type: 'festival'; id: string; label: string; detail: string; count?: undefined }
  | { type: 'text'; value: string; label: string; count?: number; detail?: string }
  | { type: 'country'; code: string; label: string; count: number; detail?: string };

export interface SuggestionGroup {
  title: string;
  canClear?: boolean;
  items: Suggestion[];
}

/** Recent + Popular on empty focus; grouped matches from 2 characters. */
export function suggestions(up: Enriched[], query: string, recent: string[]): SuggestionGroup[] {
  const q = norm(query);
  const groups: SuggestionGroup[] = [];
  if (!q) {
    if (recent.length) groups.push({ title: 'Recent', canClear: true, items: recent.map((v) => ({ type: 'text', value: v, label: v })) });
    const cities = new Map<string, number>();
    const countries = new Map<string, { label: string; n: number }>();
    for (const f of up) {
      if (f.city) cities.set(f.city, (cities.get(f.city) || 0) + 1);
      if (f.countryCode && f.country) {
        const c = countries.get(f.countryCode) || { label: f.country, n: 0 };
        c.n++;
        countries.set(f.countryCode, c);
      }
    }
    const pop: Suggestion[] = [
      ...[...cities].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([c, n]): Suggestion => ({ type: 'text', value: c, label: c, count: n })),
      ...[...countries].sort((a, b) => b[1].n - a[1].n).slice(0, 2).map(([code, c]): Suggestion => ({ type: 'country', code, label: c.label, count: c.n })),
    ];
    groups.push({ title: 'Popular', items: pop });
    return groups;
  }
  if (q.length < 2) return groups;

  const fest = up.filter((f) => norm(f.name).includes(q)).slice(0, 3)
    .map((f): Suggestion => ({ type: 'festival', id: f.id, label: f.name, detail: place(f) }));
  const cities = new Map<string, number>();
  const countries = new Map<string, { label: string; n: number }>();
  const artists = new Map<string, number>();
  for (const f of up) {
    if (f.city && norm(f.city).includes(q)) cities.set(f.city, (cities.get(f.city) || 0) + 1);
    if (f.country && f.countryCode && norm(f.country).includes(q)) {
      const c = countries.get(f.countryCode) || { label: f.country, n: 0 };
      c.n++;
      countries.set(f.countryCode, c);
    }
    for (const a of new Set([...f.artists, ...f.people])) if (norm(a).includes(q)) artists.set(a, (artists.get(a) || 0) + 1);
  }
  const score = (l: string) => (norm(l).startsWith(q) ? 0 : 1);
  if (fest.length) groups.push({ title: 'Festivals', items: fest });
  const ci = [...cities].sort((a, b) => score(a[0]) - score(b[0]) || b[1] - a[1]).slice(0, 3)
    .map(([c, n]): Suggestion => ({ type: 'text', value: c, label: c, count: n }));
  if (ci.length) groups.push({ title: 'Cities', items: ci });
  const cn = [...countries].sort((a, b) => score(a[1].label) - score(b[1].label) || b[1].n - a[1].n).slice(0, 2)
    .map(([code, c]): Suggestion => ({ type: 'country', code, label: c.label, count: c.n, detail: 'Show only this country' }));
  if (cn.length) groups.push({ title: 'Countries', items: cn });
  const ar = [...artists].sort((a, b) => score(a[0]) - score(b[0]) || b[1] - a[1]).slice(0, 3)
    .map(([a, n]): Suggestion => ({ type: 'text', value: a, label: a, count: n }));
  if (ar.length) groups.push({ title: 'Artists', items: ar });
  return groups;
}

/** Closest city, country or artist within edit distance 2. */
export function didYouMean(up: Enriched[], query: string): string | null {
  const q = norm(query);
  if (q.length < 3) return null;
  const pool = new Set<string>();
  for (const f of up) {
    if (f.city) pool.add(f.city);
    if (f.country) pool.add(f.country);
    [...f.artists, ...f.people].forEach((a) => pool.add(a));
  }
  let best: string | null = null;
  let bd = 3;
  pool.forEach((p) => {
    const d = lev(q, norm(p));
    if (d < bd) {
      bd = d;
      best = p;
    }
  });
  return bd <= 2 ? best : null;
}
