import registry from '../../data/artists.json';

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

/** The individual people behind a line-up: acts with known members become their members. Deduplicated. */
export function peopleOf(lineup: string[]): string[] {
  const out = new Map<string, string>();
  for (const a of lineup) for (const p of acts[a] ?? [a]) if (!out.has(key(p))) out.set(key(p), p);
  return [...out.values()];
}

export { key as artistKey };
