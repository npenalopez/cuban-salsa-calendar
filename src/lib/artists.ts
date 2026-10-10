import registry from '../../data/artists.json';
import { slugify } from './text';

/** Case-, accent- and punctuation-insensitive key. */
const key = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9&+]+/g, ' ').trim();

const aliases = registry.aliases as Record<string, string>;
const acts = registry.acts as Record<string, string[]>;

// Every known spelling (aliases, and the canonical names themselves) -> canonical name.
const canonical = new Map<string, string>();
for (const name of [...Object.values(aliases), ...Object.keys(acts), ...Object.values(acts).flat()]) canonical.set(key(name), name);
for (const [variant, name] of Object.entries(aliases)) canonical.set(key(variant), name);

/** The one spelling shown on the site. Unknown names are returned trimmed. */
export const canonicalArtist = (name: string) => canonical.get(key(name)) ?? name.trim();

/** A festival's line-up with canonical spellings, duplicates removed, sorted A–Z. */
export function canonicalLineup(names: string[]): string[] {
  const out = new Map<string, string>();
  for (const n of names) {
    const c = canonicalArtist(n);
    if (c && !out.has(key(c))) out.set(key(c), c);
  }
  return [...out.values()].sort((a, b) => a.localeCompare(b));
}

/**
 * The two people of a couple written with full names ("Ernesto Bulnes & Denisse Cambria"), or null.
 * First-name couples ("Andy & Yuliet") need their members in the registry: a first name alone could be anyone.
 */
export function fullNameCouple(name: string): [string, string] | null {
  const parts = name.split(' & ');
  if (parts.length !== 2 || /\b(y su|company|crew|klan|power|team)\b/i.test(name)) return null;
  const [a, b] = parts.map((p) => p.trim());
  return /\s/.test(a) && /\s/.test(b) ? [canonicalArtist(a), canonicalArtist(b)] : null;
}

/** The individual people behind a line-up: couples and groups with known members become their members. Deduplicated. */
export function peopleOf(lineup: string[]): string[] {
  const out = new Map<string, string>();
  for (const a of lineup) for (const p of acts[a] ?? fullNameCouple(a) ?? [a]) if (!out.has(key(p))) out.set(key(p), p);
  return [...out.values()];
}

export { key as artistKey };

/** The artist page for a name; spellings that differ only by accents or case share one page. */
export const artistPath = (name: string) => `/artists/${slugify(canonicalArtist(name))}/`;

export type ArtistKind = 'person' | 'couple' | 'group' | 'dj';
/** Best guess from the name; acts in the registry with two members count as couples. */
export function artistKind(name: string): ArtistKind {
  if (/^dj\b/i.test(name.trim())) return 'dj';
  if (/\b(orquesta|orchestra|band|banda|grupo|group|company|compañía|cia\.?|cía\.?|team|project|trio|quartet|charang[oó]n|tripulaci[oó]n|son con|y su|family|dance company|crew|ensemble)\b/i.test(name)) return 'group';
  if (acts[name]?.length === 2 || /\s(&|y|and|\+)\s/i.test(name)) return 'couple';
  return 'person';
}

/** Acts (couples, groups) that a person belongs to, from the registry. */
export const actsOf = (person: string, lineupNames: string[] = []) => [
  ...new Set([
    ...Object.entries(acts).filter(([, m]) => m.some((x) => key(x) === key(person))).map(([a]) => a),
    ...lineupNames.filter((n) => fullNameCouple(n)?.some((x) => key(x) === key(person))),
  ]),
];
export const membersOf = (act: string) => acts[act] ?? fullNameCouple(act) ?? [];

const known = new Set([...Object.keys(aliases), ...Object.values(aliases), ...Object.keys(acts), ...Object.values(acts).flat(), ...((registry as { people?: string[] }).people ?? [])].map(key));

/**
 * Slugs that get an artist page. A one-word name ("Cristian") that appears at several festivals
 * and is not in the registry may be different people, so it gets no page until it is added there.
 */
export function pagedArtistSlugs(lineups: string[][]): Set<string> {
  const count = new Map<string, number>();
  const oneWord = new Set<string>();
  for (const l of lineups) for (const a of new Set(l.map((x) => slugify(x)))) count.set(a, (count.get(a) ?? 0) + 1);
  for (const l of lineups) for (const a of l) if (!/\s/.test(a.trim()) && !known.has(key(a))) oneWord.add(slugify(a));
  return new Set([...count.keys()].filter((s) => s && !(oneWord.has(s) && count.get(s)! > 1)));
}

export interface ArtistProfile {
  instagram?: string;
  /** Path under /artists/photos/, only with the artist's or organizer's permission. */
  photo?: string;
}
const profiles = ((registry as { profiles?: Record<string, ArtistProfile> }).profiles ?? {}) as Record<string, ArtistProfile>;
const profileByKey = new Map(Object.entries(profiles).map(([n, p]) => [key(n), p]));
/** Instagram handle and photo for an artist, if known. */
export const profileOf = (name: string): ArtistProfile => profileByKey.get(key(canonicalArtist(name))) ?? {};

/** "AS" for Adonis Santiago, "D&M" for Danger & Marielkis: for the round placeholder when there is no photo. */
export function initials(name: string): string {
  const clean = name.replace(/^DJ\s+/i, '').replace(/[()"'.]/g, '');
  const parts = clean.split(/\s*&\s*/);
  if (parts.length === 2) return `${parts[0][0] ?? ''}&${parts[1][0] ?? ''}`.toUpperCase();
  const w = clean.split(/\s+/).filter((x) => /\p{L}/u.test(x[0] ?? ''));
  return ((w[0]?.[0] ?? '') + (w.length > 1 ? w[w.length - 1][0] : '')).toUpperCase();
}
