// Validates data/festivals.json against the JSON Schema plus rules the schema can't express.
// Runs before every build; a non-zero exit fails the build.
import { readFileSync } from 'node:fs';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const read = (p) => JSON.parse(readFileSync(new URL(`../data/${p}`, import.meta.url), 'utf8'));
const schema = read('festivals.schema.json');
const data = read('festivals.json');

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);
const errors = [];
if (!validate(data)) {
  for (const e of validate.errors) {
    const m = e.instancePath.match(/^\/festivals\/(\d+)/);
    const id = m ? data.festivals[+m[1]]?.id : '';
    errors.push(`${id || '(file)'} ${e.instancePath} ${e.message}`);
  }
}

const seen = new Set();
for (const f of data.festivals ?? []) {
  if (seen.has(f.id)) errors.push(`${f.id}: duplicate id`);
  seen.add(f.id);
  if (f.endDate < f.startDate) errors.push(`${f.id}: endDate is before startDate`);
  if (f.datePrecision === 'month') {
    const [y, m] = f.startDate.split('-').map(Number);
    const last = new Date(y, m, 0).getDate();
    if (!f.startDate.endsWith('-01') || f.endDate !== `${f.startDate.slice(0, 8)}${String(last).padStart(2, '0')}`)
      errors.push(`${f.id}: month precision must span the 1st to the last day of the month`);
  }
  if (f.datePrecision === 'year' && (!f.startDate.endsWith('-01-01') || !f.endDate.endsWith('-12-31')))
    errors.push(`${f.id}: year precision must span Jan 1 – Dec 31`);
  if (f.priceFrom != null && !f.currency) errors.push(`${f.id}: priceFrom needs a currency`);
}

if (errors.length) {
  console.error(`data/festivals.json: ${errors.length} problem(s)\n` + errors.map((e) => '  - ' + e).join('\n'));
  process.exit(1);
}
console.log(`data/festivals.json OK · ${data.festivals.length} festivals · version ${data.version}`);
