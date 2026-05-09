#!/usr/bin/env node
/**
 * Drop entries from festival artist arrays that aren't actually
 * individual artists — descriptive count phrases ("15 international
 * top Rueda de Casino artists"), schools ("Academia de Danza
 * Carlos Acosta"), troupes ("Conjunto Folklorico Nacional de Cuba"),
 * cabarets, festival/brand names, etc.
 *
 * Run scripts/audit-non-artists.mjs first to preview what will go.
 */
import fs from 'node:fs';
import path from 'node:path';

const file = path.resolve('src/app/data/festivals.ts');
const original = fs.readFileSync(file, 'utf8');
const startMarker = 'export const festivals: Festival[] = ';
const endMarker = ';\n\nexport default festivals;';
const literalStart = original.indexOf(startMarker) + startMarker.length;
const literalEnd = original.indexOf(endMarker);
const festivals = JSON.parse(original.slice(literalStart, literalEnd));

const NON_ARTIST_EXACT = new Set([
  'cubadanza',
  'cubaneando',
]);

const NON_ARTIST_PATTERNS = [
  /^\d/,
  /\bworkshops?\b/i,
  /\bacademia\b/i,
  /\bacademy\b/i,
  /\bcabaret\b/i,
  /conjunto folkl[oó]rico/i,
  /\bartists?\s*$/i,
  /\bdjs?\s*$/i,
  /\bensemble\b/i,
  /\bcompany\b/i,
  /\bcompañia\b/i,
  /\bschool\b/i,
  /\bescuela\b/i,
  /\binstitute\b/i,
  /\bfestival\b/i,
  /\bcasino\b/i,
];

const isNonArtist = (name) => {
  const trimmed = (name || '').trim();
  if (!trimmed) return false; // empty handled elsewhere
  if (NON_ARTIST_EXACT.has(trimmed.toLowerCase())) return true;
  return NON_ARTIST_PATTERNS.some(re => re.test(trimmed));
};

let totalDropped = 0;
const reports = [];
for (const f of festivals) {
  if (!Array.isArray(f.artists)) continue;
  const dropped = [];
  const keep = f.artists.filter(a => {
    if (typeof a !== 'string') return true;
    if (isNonArtist(a)) {
      dropped.push(a);
      return false;
    }
    return true;
  });
  if (dropped.length > 0) {
    totalDropped += dropped.length;
    reports.push({ id: f.id, name: f.name, dropped });
    f.artists = keep;
  }
}

if (reports.length === 0) {
  console.log('No non-artist entries to drop.');
  process.exit(0);
}

console.log(`Dropped ${totalDropped} entries across ${reports.length} festivals:\n`);
for (const r of reports) {
  console.log(`${r.id} (${r.name}):`);
  for (const d of r.dropped) console.log(`  ✕ "${d}"`);
  console.log('');
}

const stringified = JSON.stringify(festivals, null, 2);
const reindented = stringified
  .split('\n')
  .map((line, i) => (i === 0 ? line : '  ' + line))
  .join('\n');
fs.writeFileSync(
  file,
  original.slice(0, literalStart) + reindented + original.slice(literalEnd),
);
console.log(`Wrote ${file}`);
