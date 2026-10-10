# Plan: closing the gaps with cubansalsafestivals.com

Status 2026-10-10: Phases 0 and 1 are built, not yet committed or deployed. Phases 2–6 are waiting for approval. Decisions from the owner: CSP loosened for the Drive script (to be removed once verified); thin country pages are indexed; no newsletter; no posters.

## What the site is today

- **Framework:** Astro 5, fully static. Every URL is a real HTML page built ahead of time (284 pages). The client-side parts (list, map, search, saved, sheets) are Preact islands. **No SSR or prerender work is needed for SEO.**
- **Hosting:** a Cloudflare Worker serves `dist/` as static assets. Only `/api/*` and `/admin*` run Worker code (forms → GitHub issues, `saved.ics`, the Access-protected editor). A push to `main` deploys through Cloudflare Builds. GitHub Actions runs types, unit tests, axe and Lighthouse.
- **Data:** `data/festivals.json` (133 festivals, 38 countries), validated by `data/festivals.schema.json` and `scripts/validate-data.mjs`. `data/artists.json` already holds artist aliases and couples/duos. A build plugin strips the data down to the client fields, so private notes never ship.
- **Routes:** `/`, `/upcoming/`, `/archive/`, `/saved/`, `/{yyyy}/{mm}/`, `/festivals/{id}/` (plus `.ics`), `/og/{id}.png`, `/feeds/{region}.ics`, `/submit/`, `/submit/{id}/`, `/sitemap.xml`, `/robots.txt`.
- **Already done from the brief:** a JSON-LD `Event` on festival pages (including `EventPostponed`, `offers` and `performer`), `sitemap.xml`, `robots.txt` with the sitemap, filters by region/country/date range/saved, a "nearest first" sort from a chosen city (travel times), and month pages. These get extended, not rebuilt.
- **Security headers:** `public/_headers` sends a strict CSP (`script-src 'self' …`, `connect-src 'self' …`, `form-action 'self'`). Every new third-party script, fetch or external form target needs a CSP change.

## Phase 0: Travelpayouts verification (done, not deployed)

- **Marker check:** `NTgzNzk4` in the script URL is base64 for `583798`, so it matches `t=583798` and the marker in the brief.
- **Config:** `config/affiliates.json` holds the marker, promo_id 3791, the Stay22 AID and `driveScriptEnabled`. Read through `src/lib/affiliates.ts`.
- **Layout:** `src/layouts/Base.astro` renders the snippet, unchanged, in `<head>` on all 283 public pages while the flag is on. The private admin page has its own layout.
- **CSP:** `public/_headers` now allows `https://emrldtp.com` in `script-src`, and `emrldtp.com`, `tp.media`, `*.tp.media` and `*.travelpayouts.com` in `connect-src`. Turning the flag off doesn't change the CSP; tighten it again when the script goes.
- **CI:** builds with `DRIVE_SCRIPT=off`. The script only answers on the real domain; on localhost it logs a CORS error that drops Lighthouse Best Practices to 96.
- **What the script does:** it replaces some DOM functions and `Function.prototype.toString`, wraps `window.open`, sends a snapshot of the page HTML to Travelpayouts, and can rewrite links into affiliate links. Recheck "Get passes" links on the live site after deploy.
- **Removal:** set `driveScriptEnabled` to false once Travelpayouts has verified the site, and remove the CSP origins.

## Phase 1: SEO structure (done, not deployed)

Built: 38 country pages, 5 region pages and the year pages /2026/ and /2027/ (plain HTML, `src/components/LandingPage.astro`, logic in `src/lib/seo.ts`). Festival titles are keyword-first. The JSON-LD is now a `DanceEvent` with every performer (`Person` or `PerformingGroup`), `organizer` and `offers.availability`, and no offers for past editions. The sitemap lists the new pages. Festival pages have "More festivals in {country}" and a linked region; the footer has "Browse by country". The landing pages are in the axe and Lighthouse checks.

Original plan:


- **Landing pages:**
  - `/country/{slug}/` (38), `/region/{slug}/` (6), `/{yyyy}/` year pages (next to the existing `/{yyyy}/{mm}/`).
  - Each gets its own title, meta description, H1, a generated intro (counts, months, top cities) and a canonical URL. They reuse the existing list components, with past festivals in a separate section.
  - Every country page is indexed, including countries with only one or two festivals.
- **Festival titles:** "{Name} {Year}: Cuban Salsa Festival in {City}, {Country}". For mixed events (`cubanFocused: false`, from Phase 2) the wording becomes "Salsa Festival". Line-ups stay in the meta description.
- **JSON-LD:**
  - Use all line-up names, not just the first 10, as `Person`, or `MusicGroup` for orchestras.
  - Add `offers.availability` (sold out, in stock).
  - Add `startDate`/`endDate`, `organizer` (from the website) and `image` (the OG card).
  - `streetAddress` waits until we have one.
- **Sitemap:** add the new pages. robots.txt already points to it.
- **Internal links:** "More festivals in {Country}" on festival pages, and a "browse by country" block in the footer.

## Phase 2: Styles and filters

- **Schema** (optional): `styles: ("casino"|"timba"|"son"|"rumba"|"afro-cuban"|"rueda"|"reggaeton"|"mixed")[]` and `cubanFocused: boolean`.
- **Filters:** country (exists), style, month (exists as month pages and a date range), and "Cuban-focused only".
- **Sorts:** date, length, and distance from me. Distance uses opt-in browser geolocation, never stored; the Permissions-Policy already allows `geolocation=(self)`. The existing pick-a-city sort stays.
- **Style pages:** `/style/{style}/`.
- **Pre-fill script:** `scripts/suggest-styles.mjs` writes `data/review/styles.md` from names, descriptions and line-up hints. Nothing goes into the JSON until you confirm.

## Phase 3: Artist pages

- **Pages:** `/artists/{slug}/` with upcoming and past festivals, `Person` (or `MusicGroup`) schema, and links to each festival.
- **Artist file:** build on `data/artists.json`, adding `slug`, `type` (person/couple/group/dj) and optional `instagram`.
- **Duplicates:** `scripts/artist-duplicates.mjs` writes probable duplicates (accents, "y"/"&", DJ prefixes, school suffixes) to `data/review/artists.md` for you to review.
- **Links:** line-up names link to the artist pages instead of search. The Top artists sheet links there too.
- **Page count:** roughly 420 artists. Whether artists with a single past festival are indexed is decided after the duplicate review.

## Phase 4: Monetization

- **Schema** (optional):
  - `airport` (IATA code). `scripts/suggest-airports.mjs` uses a small bundled list of major airports to write `data/review/airports.md`; nothing goes into the JSON until you confirm.
  - `discount { code, amount, currency }`.
- **"Plan your trip" block** on festival pages:
  - Nearest airport, "Find flights" (Travelpayouts/Kiwi) and "Find a place to stay" (Stay22), all built from `config/affiliates.json`.
  - Check-in is the start date minus 1 day and check-out the end date plus 1 day. Links get `rel="sponsored noopener"` and `target="_blank"`.
  - No airport means no flights link. The block is hidden for past festivals, and for postponed ones without new dates.
  - It sits next to the existing travel-times panel, which stays.
  - One line of disclosure underneath.
- **Discount badge** on cards and festival pages when a discount is set.
- **"Get passes"** stays pointed at organizers.
- **Privacy page** `/privacy/`, linked in the footer: affiliates (Travelpayouts, Stay22), their cookies, the map tiles, Turnstile on forms, and saved lists kept only in your browser.
- **Tests:** a unit test that builds the links for 3 sample festivals and checks dates (including month and year boundaries), encoding and parameters.
- **CSP:** plain links need no change.

## Phase 5: Imagery and links

- **No newsletter and no posters** (owner's decision).
- **Facebook:** optional `facebook` link next to Instagram.

## Phase 6: Languages

- **Routes:** `/es/…` and `/fr/…` for every page type, with `hreflang` alternates and `x-default`. Page counts roughly triple, so builds get longer, but it stays static.
- **Strings:** UI text moves into `src/i18n/{en,es,fr}.json`, for Astro pages and Preact islands alike. Dates and prices are formatted with `Intl` per language. Descriptions stay English unless `description_es` / `description_fr` exist.
- **Translations:** I draft Spanish and French; a native speaker should review them before launch.

## Rules that apply to every phase

- Existing URLs keep working; any moved URL gets a Worker or `_redirects` redirect.
- New schema fields are optional and the validator learns them.
- Every new page is checked at 375 px, with axe and Lighthouse rerun.
- After each phase: build, tests, a summary of what changed, and a stop for your go-ahead.
