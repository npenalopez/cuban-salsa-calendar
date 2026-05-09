#!/usr/bin/env node
/**
 * Within-festival dedupe, smarter than v1:
 *
 *   1) Exact normalized duplicates collapse (case / whitespace).
 *   2) When a single-token name (just a first name) AND its full-name
 *      counterpart both appear in the same festival's artist list, the
 *      single-token version is dropped — the full name is kept.
 *
 * Reports every drop and writes back to src/app/data/festivals.ts.
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

const norm = (s) => s.trim().toLowerCase().replace(/\s+/g, ' ');
const firstWord = (s) => norm(s).split(' ')[0];

let totalDropped = 0;
const reports = [];
for (const f of festivals) {
  if (!Array.isArray(f.artists) || f.artists.length < 2) continue;

  // Build a set of "full-name" first-words (i.e. first words of every
  // multi-token name in this festival). Single-token names whose value
  // matches one of these should be dropped — they're a redundant
  // mention of the same person.
  const fullNameFirstWords = new Set();
  for (const a of f.artists) {
    if (typeof a !== 'string') continue;
    const trimmed = a.trim();
    if (!trimmed) continue;
    const tokens = trimmed.split(/\s+/);
    if (tokens.length > 1) fullNameFirstWords.add(tokens[0].toLowerCase());
  }

  const seenNorm = new Set();
  const unique = [];
  const dropped = [];
  for (const a of f.artists) {
    if (typeof a !== 'string') { unique.push(a); continue; }
    const trimmed = a.trim();
    if (!trimmed) { unique.push(a); continue; }
    const key = norm(trimmed);
    const tokens = trimmed.split(/\s+/);

    // Drop exact normalized duplicate of an entry we already kept.
    if (seenNorm.has(key)) {
      dropped.push({ artist: trimmed, reason: 'exact dup' });
      continue;
    }
    // Drop a single-token first-name when the same first name shows
    // up as the lead of a multi-token name in the same festival.
    if (tokens.length === 1 && fullNameFirstWords.has(tokens[0].toLowerCase())) {
      dropped.push({ artist: trimmed, reason: `subsumed by full name starting with "${tokens[0]}"` });
      continue;
    }
    seenNorm.add(key);
    unique.push(a);
  }

  if (dropped.length > 0) {
    totalDropped += dropped.length;
    reports.push({ id: f.id, name: f.name, dropped });
    f.artists = unique;
  }
}

if (reports.length === 0) {
  console.log('No duplicates found. Nothing to write.');
  process.exit(0);
}

console.log(`Dedupe v2: ${reports.length} festivals affected, ${totalDropped} entries dropped.\n`);
for (const r of reports) {
  console.log(`${r.id} (${r.name}):`);
  for (const d of r.dropped) {
    console.log(`  ✕ "${d.artist}" — ${d.reason}`);
  }
  console.log('');
}

const stringified = JSON.stringify(festivals, null, 2);
const reindented = stringified
  .split('\n')
  .map((line, i) => (i === 0 ? line : '  ' + line))
  .join('\n');
const next = original.slice(0, literalStart) + reindented + original.slice(literalEnd);
fs.writeFileSync(file, next);
console.log(`Wrote ${file}`);
