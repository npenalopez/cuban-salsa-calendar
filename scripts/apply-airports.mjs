// Writes the approved airports in data/review/airports.json into data/festivals.json.
// Run only after the review: `node scripts/apply-airports.mjs`.
import { readFileSync, writeFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const file = new URL('data/festivals.json', root);
const data = JSON.parse(readFileSync(file, 'utf8'));
const approved = JSON.parse(readFileSync(new URL('data/review/airports.json', root), 'utf8'));

let n = 0;
for (const f of data.festivals) {
  const code = approved[f.id];
  if (!code) continue;
  if (!/^[A-Z]{3}$/.test(code)) throw new Error(`${f.id}: "${code}" is not an IATA code`);
  f.airport = code;
  n++;
}
writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
console.log(`Set the airport of ${n} festivals. Run npm run validate next.`);
