// Checks every website, ticket and Instagram link in data/festivals.json with a real browser
// (many festival sites and Instagram block plain HTTP clients). Writes data/review/links.md
// and data/review/links.json. Changes nothing in festivals.json.
//
//   node scripts/check-links.mjs [--only id1,id2]
//
// Verdicts: ok · broken (dead, error page, parked domain, removed profile) · check (works, but
// something looks off: blocked by bot protection, redirected elsewhere, festival not mentioned).
import { chromium } from 'playwright-core';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';

const root = new URL('../', import.meta.url);
const { festivals } = JSON.parse(readFileSync(new URL('data/festivals.json', root), 'utf8'));
const only = process.argv.includes('--only') ? new Set(process.argv[process.argv.indexOf('--only') + 1].split(',')) : null;

const PARKED = /domain (is )?for sale|buy this domain|this domain (may be|is) (for sale|parked)|domain parking|parked (free|domain)|domain has expired|domain name registration|hosted by one\.com|account (has been )?suspended|index of \/|error establishing a database connection|website is (currently )?(under construction|unavailable)|site not found|no such app|there isn't a github pages site here|this page isn.t available|domaincatcher|sedoparking|dan\.com|afternic|godaddy.*(parked|for sale)/i;
const EVENT_GONE = /event (has )?(ended|expired|is over)|sales (have )?ended|no longer (available|on sale)|this event (has been|was) (cancelled|canceled)|event not found|veranstaltung (ist )?beendet/i;
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36';

const norm = (s) => s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase();
/** Distinctive words of the festival name (drops "festival", "salsa", years…). */
const nameWords = (f) =>
  norm(f.name).split(/[^a-z0-9]+/).filter((w) => w.length > 3 && !/^(festival|salsa|cuban|cubano|cubana|congress|edition|dance|latin|international|weekend|20\d\d)$/.test(w));
const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return ''; } };

const cached = `${homedir()}/Library/Caches/ms-playwright/chromium-1243/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;
const browser = await chromium.launch(existsSync(cached) ? { executablePath: cached } : { channel: 'chrome' });
const ctx = await browser.newContext({ userAgent: UA, locale: 'en-US', ignoreHTTPSErrors: false });

async function visit(url) {
  const page = await ctx.newPage();
  try {
    const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2500);
    const text = (await page.locator('body').innerText({ timeout: 5000 }).catch(() => '')) || '';
    return { status: res?.status() ?? 0, finalUrl: page.url(), title: await page.title().catch(() => ''), text: text.slice(0, 20000) };
  } catch (e) {
    return { error: String(e.message || e).split('\n')[0].slice(0, 160) };
  } finally {
    await page.close();
  }
}

function judgeWeb(f, kind, url, r) {
  if (r.error) return { verdict: 'broken', why: r.error.replace(/^page\.goto: /, '') };
  const t = `${r.title}\n${r.text}`;
  if (r.status === 404 || r.status === 410) return { verdict: 'broken', why: `HTTP ${r.status}` };
  if (r.status >= 500) return { verdict: 'broken', why: `HTTP ${r.status} (server error)` };
  if (r.status === 403 || r.status === 429 || /just a moment|verify you are human|access denied|attention required/i.test(t))
    return { verdict: 'check', why: `blocked by bot protection (HTTP ${r.status}); open it by hand` };
  if (r.status >= 400) return { verdict: 'broken', why: `HTTP ${r.status}` };
  if (PARKED.test(t)) return { verdict: 'broken', why: `parked, expired or error page ("${(t.match(PARKED) || [''])[0]}")` };
  if (kind === 'ticketUrl' && EVENT_GONE.test(t)) return { verdict: 'broken', why: `ticket page says "${t.match(EVENT_GONE)[0]}"` };
  const notes = [];
  if (host(r.finalUrl) && host(r.finalUrl) !== host(url)) notes.push(`redirects to ${host(r.finalUrl)}`);
  const words = nameWords(f);
  if (words.length && !words.some((w) => norm(t).includes(w))) notes.push(`page doesn't mention "${words.join(' ')}"`);
  if (r.text.trim().length < 40) notes.push('page is nearly empty');
  return notes.length ? { verdict: 'check', why: notes.join('; ') } : { verdict: 'ok', why: '' };
}

function judgeIg(r) {
  if (r.error) return { verdict: 'check', why: r.error };
  if (/profile isn.t available|page isn.t available|sorry, this page/i.test(`${r.title}\n${r.text}`)) return { verdict: 'broken', why: 'profile removed or never existed' };
  if (/\(@[\w.]+\)/.test(r.title)) return { verdict: 'ok', why: '' };
  if (/\/accounts\/login|\/challenge/.test(r.finalUrl)) return { verdict: 'check', why: 'Instagram asked to log in; check by hand' };
  return { verdict: 'check', why: `unexpected page: "${r.title.slice(0, 60)}"` };
}

const jobs = [];
for (const f of festivals) {
  if (only && !only.has(f.id)) continue;
  for (const kind of ['website', 'ticketUrl', 'instagram']) if (f[kind]) jobs.push({ f, kind, url: f[kind] });
}

const results = [];
const web = jobs.filter((j) => j.kind !== 'instagram');
const ig = jobs.filter((j) => j.kind === 'instagram');
let done = 0;
// Websites: 4 at a time.
await Promise.all(Array.from({ length: 4 }, async () => {
  while (web.length) {
    const j = web.shift();
    let r = await visit(j.url);
    if (r.error && /timeout/i.test(r.error)) r = await visit(j.url); // one retry
    results.push({ id: j.f.id, name: j.f.name, kind: j.kind, url: j.url, finalUrl: r.finalUrl ?? null, status: r.status ?? null, ...judgeWeb(j.f, j.kind, j.url, r) });
    if (++done % 20 === 0) console.log(`${done}/${jobs.length}`);
  }
}));
// Instagram: one at a time, slowly, so it doesn't start asking for a login.
for (const j of ig) {
  const r = await visit(j.url);
  results.push({ id: j.f.id, name: j.f.name, kind: j.kind, url: j.url, finalUrl: r.finalUrl ?? null, status: r.status ?? null, ...judgeIg(r) });
  if (++done % 20 === 0) console.log(`${done}/${jobs.length}`);
  await new Promise((ok) => setTimeout(ok, 2500));
}
await browser.close();

const order = { broken: 0, check: 1, ok: 2 };
results.sort((a, b) => order[a.verdict] - order[b.verdict] || a.id.localeCompare(b.id) || a.kind.localeCompare(b.kind));
mkdirSync(new URL('data/review/', root), { recursive: true });
writeFileSync(new URL('data/review/links.json', root), JSON.stringify(results, null, 2) + '\n');
const label = { website: 'Website', ticketUrl: 'Tickets', instagram: 'Instagram' };
const cell = (s) => String(s ?? '').replace(/\|/g, '\\|');
const n = (v) => results.filter((r) => r.verdict === v).length;
const table = (v) => ['| Festival | Link | URL | Why |', '|---|---|---|---|', ...results.filter((r) => r.verdict === v).map((r) => `| ${cell(r.name)} \`${r.id}\` | ${label[r.kind]} | ${cell(r.url)} | ${cell(r.why)} |`)];
writeFileSync(
  new URL('data/review/links.md', root),
  [
    '# Link check',
    '',
    `Run on ${new Date().toISOString().slice(0, 10)} with \`node scripts/check-links.mjs\`: ${results.length} links, ${n('broken')} broken, ${n('check')} to check, ${n('ok')} ok.`,
    '',
    `## Broken (${n('broken')})`, '', ...table('broken'), '',
    `## To check by hand (${n('check')})`, '', ...table('check'), '',
  ].join('\n'),
);
console.log(`${results.length} links: ${n('broken')} broken, ${n('check')} to check, ${n('ok')} ok → data/review/links.md`);
