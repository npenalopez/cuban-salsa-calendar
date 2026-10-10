// Writes the approved suggestions in data/review/styles.json into data/festivals.json.
// Run only after the review: `node scripts/apply-styles.mjs`. Existing values are replaced.
import { readFileSync, writeFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const file = new URL('data/festivals.json', root);
const data = JSON.parse(readFileSync(file, 'utf8'));
const approved = JSON.parse(readFileSync(new URL('data/review/styles.json', root), 'utf8'));

let n = 0;
for (const f of data.festivals) {
  const a = approved[f.id];
  if (!a) continue;
  if (a.styles?.length) f.styles = a.styles;
  else delete f.styles;
  if (typeof a.cubanFocused === 'boolean') f.cubanFocused = a.cubanFocused;
  else delete f.cubanFocused;
  n++;
}
writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
console.log(`Applied styles to ${n} festivals. Run npm run validate next.`);
