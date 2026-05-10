#!/usr/bin/env node
/**
 * Drop the festivals with the given IDs from src/app/data/festivals.ts.
 * Pass IDs as CLI args, e.g.:
 *
 *   node scripts/remove-festivals.mjs cuba-me-mucho-angers-2026 \
 *     arrasando-bremen-2026 saoco-cuban-festival-aix-2026
 */
import fs from 'node:fs';
import path from 'node:path';

const idsToDrop = process.argv.slice(2);
if (idsToDrop.length === 0) {
  console.error('Usage: node scripts/remove-festivals.mjs <id> [<id> ...]');
  process.exit(1);
}

const file = path.resolve('src/app/data/festivals.ts');
const original = fs.readFileSync(file, 'utf8');
const startMarker = 'export const festivals: Festival[] = ';
const endMarker = ';\n\nexport default festivals;';
const literalStart = original.indexOf(startMarker) + startMarker.length;
const literalEnd = original.indexOf(endMarker);
const festivals = JSON.parse(original.slice(literalStart, literalEnd));

const before = festivals.length;
const dropped = [];
const remaining = festivals.filter((f) => {
  if (idsToDrop.includes(f.id)) {
    dropped.push(`${f.id} — ${f.name}`);
    return false;
  }
  return true;
});

if (dropped.length === 0) {
  console.log('Nothing dropped — none of those IDs exist.');
  process.exit(0);
}

console.log(`Dropped ${dropped.length} of ${before} festivals:`);
for (const d of dropped) console.log(`  ✕ ${d}`);

const stringified = JSON.stringify(remaining, null, 2);
const reindented = stringified
  .split('\n')
  .map((line, i) => (i === 0 ? line : '  ' + line))
  .join('\n');
fs.writeFileSync(
  file,
  original.slice(0, literalStart) + reindented + original.slice(literalEnd),
);
console.log(`\nWrote ${file} — ${remaining.length} festivals remain.`);
