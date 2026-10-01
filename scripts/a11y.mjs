// axe-core WCAG 2.1 AA scan: every page type, light + dark, 375 + 1440,
// plus the interactive states (sheets, search suggestions, map, form errors).
// Needs the site running: `npm run build && npm run serve:cf` (http://localhost:8789).
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const base = process.env.BASE ?? 'http://localhost:8789';
const FEST = '/festivals/el-que-sabe-sabe-anzio-2026/';
const pages = ['/', '/upcoming/', '/dates-tba/', '/archive/', '/saved/', FEST, '/submit/', '/submit/el-que-sabe-sabe-anzio-2026/', '/no-such-page/', '/admin/'];

/** [label, path, steps] for interactive states. */
const states = [
  ['menu sheet', '/', async (p) => p.click('.header__menu')],
  ['top artists sheet', '/', async (p) => (await p.click('.header__menu'), p.locator('dialog[open]').getByRole('button', { name: /Top artists/ }).click())],
  ['travel sheet', '/', async (p) => (await p.click('.header__menu'), p.locator('dialog[open]').getByRole('button', { name: /Travel times/ }).click())],
  ['feeds sheet', '/', async (p) => (await p.click('.header__menu'), p.locator('dialog[open]').getByRole('button', { name: /Calendar feeds/ }).click())],
  ['months sheet', '/', async (p) => p.click('.dock__center')],
  ['filters sheet', '/', async (p) => (await p.click('.dock__filters'), p.getByText('Pick dates').click())],
  ['calendar sheet', '/', async (p) => p.locator('.card [aria-haspopup="dialog"]').first().click()],
  ['search suggestions', '/', async (p) => (await p.click('#search'), p.fill('#search', 'yus'))],
  ['empty search', '/', async (p) => p.fill('#search', 'zzzqqq')],
  ['saved list', '/', async (p) => (await p.locator('.card .heart').first().click(), p.goto(base + '/saved/'))],
  ['map view', '/upcoming/?view=map', async (p) => p.waitForSelector('.map-cluster, .map-pin')],
  ['form errors', '/submit/', async (p) => p.click('.submit-btn')],
  ['festival map', FEST, async (p) => (await p.locator('.map').scrollIntoViewIfNeeded(), p.waitForSelector('.map-pin'))],
];

const browser = await chromium.launch();
let total = 0;
for (const theme of ['light', 'dark']) {
  for (const w of [375, 1440]) {
    const ctx = await browser.newContext({ colorScheme: theme, viewport: { width: w, height: 900 }, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    const run = async (label) => {
      await page.waitForTimeout(250);
      // Map tiles are third-party images with their own text; scan our UI only.
      const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).exclude('.leaflet-tile-pane').analyze();
      total += r.violations.length;
      for (const v of r.violations) console.log(`${theme} ${w} ${label}: ${v.id} (${v.impact}) ×${v.nodes.length}: ${v.nodes[0].target.join(' ')}\n    ${v.nodes[0].failureSummary?.split('\n')[1] ?? ''}`);
    };
    for (const p of pages) {
      await page.goto(base + p, { waitUntil: 'networkidle' });
      await run(p);
    }
    for (const [label, path, steps] of states) {
      await page.goto(base + path, { waitUntil: 'networkidle' });
      await steps(page);
      await run(label);
    }
    await ctx.close();
  }
}
await browser.close();
console.log(total ? `${total} violation groups` : 'No axe violations');
process.exit(total ? 1 : 0);
