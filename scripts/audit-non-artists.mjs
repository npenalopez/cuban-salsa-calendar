#!/usr/bin/env node
/**
 * Read-only audit. Surfaces entries in artist arrays that are likely
 * NOT individual artists — descriptive phrases, schools, troupes,
 * brand names, etc. — so we can decide whether to drop or keep each.
 */
import fs from 'node:fs';
import path from 'node:path';

const file = path.resolve('src/app/data/festivals.ts');
const original = fs.readFileSync(file, 'utf8');
const startMarker = 'export const festivals: Festival[] = ';
const endMarker = ';\n\nexport default festivals;';
const start = original.indexOf(startMarker) + startMarker.length;
const end = original.indexOf(endMarker);
const festivals = JSON.parse(original.slice(start, end));

const NON_ARTIST_EXACT = new Set([
  'cubadanza',
  'cubaneando',
]);

const NON_ARTIST_PATTERNS = [
  { re: /^\d/,                          why: 'starts with a digit (count phrase)' },
  { re: /\bworkshops?\b/i,              why: 'contains "workshop(s)"' },
  { re: /\bacademia\b/i,                why: 'contains "academia"' },
  { re: /\bacademy\b/i,                 why: 'contains "academy"' },
  { re: /\bcabaret\b/i,                 why: 'contains "cabaret"' },
  { re: /conjunto folkl[oó]rico/i,      why: 'matches "conjunto folklorico"' },
  { re: /\bartists?\s*$/i,              why: 'ends with "artist(s)"' },
  { re: /\bdjs?\s*$/i,                  why: 'ends with "DJ(s)"' },
  { re: /\bensemble\b/i,                why: 'contains "ensemble"' },
  { re: /\bcompany\b/i,                 why: 'contains "company"' },
  { re: /\bcompañia\b/i,                why: 'contains "compañia"' },
  { re: /\bschool\b/i,                  why: 'contains "school"' },
  { re: /\bescuela\b/i,                 why: 'contains "escuela"' },
  { re: /\binstitute\b/i,               why: 'contains "institute"' },
  { re: /\bfestival\b/i,                why: 'contains "festival" — likely an event, not a person' },
  { re: /\bcasino\b/i,                  why: 'contains "casino" — likely a discipline, not a person' },
  { re: /^[A-Za-z]+ \(orchestra\)$/i,   why: 'parenthetical "(orchestra)"' },
];

const seen = new Set();
const all = [];
for (const f of festivals) {
  if (!Array.isArray(f.artists)) continue;
  for (const a of f.artists) {
    if (typeof a !== 'string') continue;
    const trimmed = a.trim();
    if (!trimmed || seen.has(trimmed.toLowerCase())) continue;
    seen.add(trimmed.toLowerCase());

    const reasons = [];
    if (NON_ARTIST_EXACT.has(trimmed.toLowerCase())) reasons.push('exact match in non-artist list');
    for (const { re, why } of NON_ARTIST_PATTERNS) {
      if (re.test(trimmed)) reasons.push(why);
    }
    if (reasons.length > 0) all.push({ name: trimmed, reasons });
  }
}

if (all.length === 0) {
  console.log('No suspicious non-artist entries found.');
  process.exit(0);
}

console.log(`Found ${all.length} suspicious entries:\n`);
for (const a of all) {
  console.log(`  ✕ "${a.name}"`);
  for (const r of a.reasons) console.log(`      ${r}`);
}
