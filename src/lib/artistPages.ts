// Artist pages: one per name in any line-up (and every member of a known act).
import { actsOf, artistKind, artistPath, membersOf, pagedArtistSlugs, type ArtistKind } from './artists';
import { slugify } from './text';
import type { Enriched } from './types';

export interface ArtistPage {
  slug: string;
  name: string;
  kind: ArtistKind;
  /** Festivals that list this name, or an act they belong to ("with Seo & Eneris"). */
  upcoming: { f: Enriched; via: string | null }[];
  past: { f: Enriched; via: string | null }[];
  members: string[];
  memberOf: string[];
  countries: string[];
}

const byStart = (a: { f: Enriched }, b: { f: Enriched }) => a.f.s.getTime() - b.f.s.getTime() || a.f.name.localeCompare(b.f.name);

export function artistPages(all: Enriched[]): ArtistPage[] {
  // Most common spelling wins when several only differ by accents or case.
  const spellings = new Map<string, Map<string, number>>();
  const add = (name: string) => {
    const s = slugify(name);
    if (!s) return;
    const m = spellings.get(s) ?? new Map<string, number>();
    m.set(name, (m.get(name) ?? 0) + 1);
    spellings.set(s, m);
  };
  for (const f of all) for (const a of f.artists) add(a);
  for (const f of all) for (const p of f.people) add(p);

  const paged = pagedArtistSlugs(all.map((f) => [...f.artists, ...f.people]));
  const pages: ArtistPage[] = [];
  for (const [slug, m] of spellings) {
    if (!paged.has(slug)) continue;
    const name = [...m].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0][0];
    const memberOf = actsOf(name);
    const hits: { f: Enriched; via: string | null }[] = [];
    for (const f of all) {
      if (f.artists.some((a) => slugify(a) === slug)) hits.push({ f, via: null });
      else {
        const act = f.artists.find((a) => memberOf.includes(a));
        if (act) hits.push({ f, via: act });
      }
    }
    if (!hits.length) continue;
    pages.push({
      slug,
      name,
      kind: artistKind(name),
      upcoming: hits.filter((h) => !h.f.arch).sort(byStart),
      past: hits.filter((h) => h.f.arch).sort((a, b) => byStart(b, a)),
      members: membersOf(name),
      memberOf,
      countries: [...new Set(hits.filter((h) => !h.f.arch).map((h) => h.f.country).filter((c): c is string => !!c))],
    });
  }
  return pages.sort((a, b) => a.name.localeCompare(b.name));
}

export { artistPath };
