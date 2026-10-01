// Lighthouse, mobile preset. Fails if any category on any page is below MIN (default 100).
// Not audited on purpose: the 404 page (Lighthouse refuses non-200 pages) and the
// /submit/{id}/ correction forms (noindex by design, which Lighthouse's SEO score penalises).
// Needs the site running: `npm run build && npm run serve:cf` (http://localhost:8789).
import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import { chromium } from 'playwright';

const base = process.env.BASE ?? 'http://localhost:8789';
const MIN = Number(process.env.MIN ?? 100);
// CI runners are slower and noisier than a phone on Lighthouse's simulated network; allow a lower performance floor there.
const MIN_PERF = Number(process.env.MIN_PERF ?? MIN);
const RUNS = Number(process.env.RUNS ?? 1);
const pages = (process.argv.slice(2).length ? process.argv.slice(2) : [
  '/', '/upcoming/', '/archive/', '/saved/', '/festivals/el-que-sabe-sabe-anzio-2026/', '/submit/',
]);

const chrome = await launch({ chromePath: process.env.CHROME_PATH ?? chromium.executablePath(), chromeFlags: ['--headless=new', '--no-sandbox'] });
let fail = false;
for (const p of pages) {
  // Best of RUNS, to smooth out noise on a busy machine.
  let best = null;
  await fetch(base + p); // warm up: the local runtime's first response is a cold start
  for (let i = 0; i < RUNS; i++) {
    // Turnstile only runs on the real hostnames; block it so test-machine errors don't count against the page.
    const r = await lighthouse(base + p, { port: chrome.port, output: 'json', logLevel: 'error', blockedUrlPatterns: process.env.BLOCK_TURNSTILE === '0' ? [] : ['*challenges.cloudflare.com*'] });
    const s = Object.fromEntries(Object.entries(r.lhr.categories).map(([k, c]) => [k, Math.round(c.score * 100)]));
    if (!best || Object.values(s).reduce((a, b) => a + b) > Object.values(best.s).reduce((a, b) => a + b)) best = { s, lhr: r.lhr };
  }
  const low = Object.entries(best.s).filter(([k, v]) => v < (k === 'performance' ? MIN_PERF : MIN));
  console.log(p.padEnd(44), JSON.stringify(best.s));
  if (low.length) {
    fail = true;
    for (const [cat] of low)
      for (const ref of best.lhr.categories[cat].auditRefs) {
        const a = best.lhr.audits[ref.id];
        if (ref.weight > 0 && a.score !== null && a.score < 1) console.log(`    ${cat}: ${a.id} (${a.score}) ${a.displayValue ?? ''}`);
      }
  }
}
await chrome.kill();
process.exit(fail ? 1 : 0);
