# Cuban Salsa Calendar

A worldwide directory of Cuban salsa, timba and Afro-Cuban festivals, built as a
static site from one JSON file. Every page is pre-rendered HTML; search, filters,
the saved list, sheets and the map are small Preact islands.

The design and product spec live in [design/](design/README.md).

## Getting started

```bash
npm install
npm run dev        # http://localhost:4321 (hot reload)
npm test           # unit tests (date formatting, cards, filters, .ics)
npm run check      # types: site + worker
npm run build      # validates data/festivals.json, then builds to dist/

# The real Cloudflare runtime (headers, /api, /admin gate):
cp .dev.vars.example .dev.vars
npm run build && npm run serve:cf    # http://localhost:8789
npm run check:a11y                   # axe, WCAG 2.1 AA: every page + sheets/states, light + dark, 375 + 1440
npm run check:lighthouse             # Lighthouse mobile; fails below 100
```

Set `BUILD_TODAY=YYYY-MM-DD` to build the site as of another day.

## Updating the festival list

`data/festivals.json` is the single source of truth (schema in
`data/festivals.schema.json`). Either edit it directly or use the editor at
`/admin/`, export, and replace the file. `npm run build` fails if the file
doesn't validate. Push to `main` and Cloudflare deploys in about a minute.

- `notes` is private. It is stripped from the client bundle and never rendered;
  only `/admin/festivals.json` contains it, and the Worker serves `/admin/*` only
  to people signed in through Cloudflare Access.
- Upcoming vs past is computed at build time and again in the browser; a daily
  rebuild rolls pages over without a data change (see Deploy).

## Layout

```
data/                     festivals.json, schema, migration report
src/lib/                  pure logic: dates, cards, filters, search, travel, .ics, OG images
src/client/               browser state (saved list, city, theme, sheets) + the client:afterload directive
src/components/           Preact islands + Astro wrappers
src/pages/                routes: months, lists, festivals, .ics feeds, OG images, flags, sitemap
src/styles/               design tokens, styles, generated fonts.css
public/fonts/             self-hosted fonts (scripts/subset-fonts.py)
worker/                   Cloudflare Worker: /api/submit and the /admin Access check
scripts/                  data validation, font subsetting, a11y and Lighthouse checks
```

## Performance notes

Every page is pre-rendered HTML with inlined CSS (~6 KB gzipped). Islands use
`client:afterload` (hydrate after the `load` event), so no JavaScript competes
with first paint. Fonts are self-hosted: Archivo is cut to the axes the design
uses and split so most headings need only a 24 KB file (preloaded); Atkinson uses
`font-display: optional` with a metric-matched fallback, so body text never
shifts. MapLibre and map tiles load only when a map is opened.

## Deploy (Cloudflare Workers, Git integration)

Same setup as the other sites: the GitHub repo is connected in Cloudflare
(Workers & Pages → Create → Import a repository), `wrangler.jsonc` serves `dist/`
as static assets, and only `/api/*` and `/admin*` run Worker code.

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Preview command (non-`main` branches) | `npx wrangler versions upload` |
| Node version | from `.node-version` (22) |
| Build variable | `PUBLIC_TURNSTILE_SITE_KEY` (Turnstile site key) |

Runtime secrets (Worker → Settings → Variables and Secrets, type **Secret**; not
under Build): `GITHUB_TOKEN`, `TURNSTILE_SECRET`, `ACCESS_TEAM_DOMAIN`, `ACCESS_AUD`.
See the comments in `wrangler.jsonc`.

- **Turnstile:** Cloudflare dashboard → Turnstile → Add widget for
  `cubansalsacalendar.com` (Managed). Site key → build variable, secret → runtime secret.
- **GitHub token:** fine-grained token on this repo with "Issues: read and write".
  Create the labels `submission` and `correction`.
- **Cloudflare Access:** Zero Trust → Access → Applications → Self-hosted, domain
  `cubansalsacalendar.com/admin`, policy "emails: penalopez.nestor@gmail.com".
  Copy the Application Audience (AUD) tag → `ACCESS_AUD`; your team name
  (`<team>.cloudflareaccess.com`) → `ACCESS_TEAM_DOMAIN`. Until both are set,
  `/admin` answers 404 everywhere.
- **Daily rebuild:** Worker → Settings → Builds → Deploy hooks → create one, then
  save it as the GitHub repository secret `CF_DEPLOY_HOOK`; `.github/workflows/daily-rebuild.yml` calls it every morning.

`*.workers.dev` test addresses send `X-Robots-Tag: noindex` (`public/_headers`);
the real domain stays indexable.

## Domain: cubansalsacalendar.com (Infomaniak → Cloudflare DNS)

The domain stays registered at **Infomaniak**; only its DNS moves to Cloudflare,
like nestor-pena.ch. Today Infomaniak runs the DNS (`nsany1/nsany2.infomaniak.com`)
and the site is the old Figma site (`www` → `sites.figma.net`). There are no MX or
TXT records, so no email to preserve.

1. Cloudflare → Add a domain → `cubansalsacalendar.com` (Free plan). Delete the
   imported `A`/`CNAME` records that point to Figma.
2. Infomaniak Manager → Domains → cubansalsacalendar.com → DNS servers → use
   external servers → the two `*.ns.cloudflare.com` names Cloudflare shows.
   Wait for "Active" in Cloudflare (minutes to a few hours).
3. Worker → Settings → Domains & Routes → add custom domains
   `cubansalsacalendar.com` and `www.cubansalsacalendar.com`.
4. Rules → Redirect Rules → template "Redirect from WWW to root" (301, keep path
   and query). Canonical URLs use the root domain.
5. SSL/TLS → Edge Certificates: "Always Use HTTPS" on.
6. Set up Turnstile and Access for the real domain (above), then check: the site,
   `/admin/` (asks to sign in), a test submission (opens a GitHub issue).
7. Google Search Console: add the domain, submit
   `https://cubansalsacalendar.com/sitemap.xml`. Run PageSpeed Insights on `/`
   and a festival page.
8. Unpublish the Figma site once the new one is live.

Maps use MapLibre with OpenFreeMap vector tiles (OpenStreetMap data, free, no
key), recoloured in the site palette in `src/components/MapView.tsx`.
