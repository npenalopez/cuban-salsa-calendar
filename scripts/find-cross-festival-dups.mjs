#!/usr/bin/env node
/**
 * Read-only audit of the artist database. Surfaces clusters of names
 * that probably refer to the same person but are spelled differently:
 *
 *   1) Same normalized form (case / punctuation / whitespace).
 *   2) Same first word AND one of the names is a single token while
 *      the other has more — likely "first-name-only" vs "full name".
 *   3) Same first word AND second name starts with the second name of
 *      the other (common stage-name pattern).
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

const PLACEHOLDER = /^(?:tba|tbd|n\/a|to be announced|coming soon|pending|not available|—|--|-)$/i;

const map = new Map(); // canonicalKey -> { display, count }
for (const f of festivals) {
  if (!Array.isArray(f.artists)) continue;
  for (const a of f.artists) {
    if (typeof a !== 'string') continue;
    const trimmed = a.trim();
    if (!trimmed || PLACEHOLDER.test(trimmed)) continue;
    const key = trimmed.toLowerCase().replace(/\s+/g, ' ');
    const existing = map.get(key);
    if (existing) existing.count++;
    else map.set(key, { display: trimmed, count: 1 });
  }
}

const all = Array.from(map.values()); // [{ display, count }, ...]

// Group by FIRST word for "first-name-only vs full" suspects.
const byFirst = new Map();
for (const a of all) {
  const first = a.display.toLowerCase().split(/\s+/)[0];
  const list = byFirst.get(first) ?? [];
  list.push(a);
  byFirst.set(first, list);
}

const issues = [];
for (const [first, group] of byFirst) {
  if (group.length < 2) continue;
  const single = group.filter(g => g.display.split(/\s+/).length === 1);
  const multi  = group.filter(g => g.display.split(/\s+/).length > 1);
  if (single.length > 0 && multi.length > 0) {
    issues.push({
      kind: 'first-only-vs-full',
      first,
      candidates: group.map(g => `"${g.display}" (×${g.count})`),
    });
  } else if (group.length > 1) {
    // Same first word, multiple variants; could be different people but
    // worth a glance.
    issues.push({
      kind: 'same-first-word',
      first,
      candidates: group.map(g => `"${g.display}" (×${g.count})`),
    });
  }
}

issues.sort((a, b) => {
  // Higher-priority kind first, then alphabetically.
  const order = { 'first-only-vs-full': 0, 'same-first-word': 1 };
  if (order[a.kind] !== order[b.kind]) return order[a.kind] - order[b.kind];
  return a.first.localeCompare(b.first);
});

if (issues.length === 0) {
  console.log('No suspect clusters.');
  process.exit(0);
}

let lastKind = null;
for (const i of issues) {
  if (i.kind !== lastKind) {
    console.log(`\n## ${i.kind}\n`);
    lastKind = i.kind;
  }
  console.log(`  ${i.first}: ${i.candidates.join(' · ')}`);
}
console.log(`\nTotal clusters: ${issues.length}`);
