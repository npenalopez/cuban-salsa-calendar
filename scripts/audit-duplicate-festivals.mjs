#!/usr/bin/env node
/**
 * Find candidate duplicate festivals in src/app/data/festivals.ts.
 *
 * A "duplicate" is detected by three independent heuristics — any
 * match flags a candidate cluster:
 *
 *   1) Same id (cheapest sanity check)
 *   2) Same normalized name + same city + same country
 *   3) Same normalized name + same country (catches cases where the
 *      city is spelled differently, e.g. "Würzburg" vs "Wurzburg")
 *
 * Read-only; outputs a report.
 */
import fs from 'node:fs';
import path from 'node:path';

const file = path.resolve('src/app/data/festivals.ts');
const original = fs.readFileSync(file, 'utf8');
const startMarker = 'export const festivals: Festival[] = ';
const endMarker = ';\n\nexport default festivals;';
const literalRaw = original.slice(
  original.indexOf(startMarker) + startMarker.length,
  original.indexOf(endMarker),
);
const festivals = JSON.parse(literalRaw);

const norm = (s) =>
  (s ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip diacritics
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');

const groupBy = (items, keyFn) => {
  const m = new Map();
  for (const item of items) {
    const k = keyFn(item);
    if (!k) continue;
    const list = m.get(k) ?? [];
    list.push(item);
    m.set(k, list);
  }
  return m;
};

const issues = [];

// 1) Exact id duplicates
const byId = groupBy(festivals, (f) => f.id);
for (const [id, group] of byId) {
  if (group.length > 1) {
    issues.push({
      kind: 'duplicate id',
      key: id,
      members: group.map((f) => `${f.id} — ${f.name} (${f.city}, ${f.country})`),
    });
  }
}

// 2) Same name + city + country
const byNameCityCountry = groupBy(festivals, (f) =>
  `${norm(f.name)}|${norm(f.city)}|${norm(f.country)}`,
);
for (const [key, group] of byNameCityCountry) {
  if (group.length > 1) {
    issues.push({
      kind: 'same name + city + country',
      key,
      members: group.map((f) => `${f.id} — ${f.name} (${f.city}, ${f.country}) [${f.dates}]`),
    });
  }
}

// 3) Same name + country (different city spelling)
const byNameCountry = groupBy(festivals, (f) => `${norm(f.name)}|${norm(f.country)}`);
for (const [key, group] of byNameCountry) {
  if (group.length > 1) {
    // Skip ones that already matched #2 (same city)
    const distinctCities = new Set(group.map((f) => norm(f.city)));
    if (distinctCities.size > 1) {
      issues.push({
        kind: 'same name + country, different city',
        key,
        members: group.map((f) => `${f.id} — ${f.name} (${f.city}, ${f.country}) [${f.dates}]`),
      });
    }
  }
}

if (issues.length === 0) {
  console.log('No duplicate festivals detected.');
  process.exit(0);
}

console.log(`Found ${issues.length} suspect cluster(s):\n`);
for (const i of issues) {
  console.log(`## ${i.kind} — "${i.key}"`);
  for (const m of i.members) console.log(`   ${m}`);
  console.log('');
}
