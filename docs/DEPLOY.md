# Deploying and operating cubansalsacalendar.com

Runbook for the site owner. The project overview is in the [README](../README.md).

## How it runs

- **Hosting:** a Cloudflare Worker with static assets (`wrangler.jsonc`). `dist/` is
  served as static files; only `/api/*` and `/admin*` run Worker code (`worker/`).
- **Deploys:** Cloudflare Builds is connected to the GitHub repo. Every push to
  `main` builds and deploys in about a minute; other branches get preview versions.
- **Checks:** GitHub Actions (`.github/workflows/ci.yml`) runs types, unit tests,
  the build, axe and Lighthouse on every push. It does not deploy.
- **Daily rebuild:** `.github/workflows/daily-rebuild.yml` calls a Cloudflare deploy
  hook every morning, so upcoming and past festivals roll over without a data change.

### Cloudflare build settings

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Non-production branch deploy command | `npx wrangler versions upload` |
| Node version | from `.node-version` (22) |

## Configuration

| What | Where | Notes |
|---|---|---|
| `PUBLIC_TURNSTILE_SITE_KEY` | `.env.production` (committed) | Public by design; it ends up in the page. |
| `TURNSTILE_SECRET` | Worker secret | Turnstile → widget → secret key. |
| `GITHUB_TOKEN` | Worker secret | Fine-grained token on this repo, "Issues: read and write". Create the labels `submission` and `correction`. |
| `GITHUB_REPO` | `wrangler.jsonc` vars | `owner/name` of the repo that receives submissions. |
| `ACCESS_TEAM_DOMAIN`, `ACCESS_AUD` | Worker secrets | From the Cloudflare Access application protecting `/admin` (see below). |
| `CF_DEPLOY_HOOK` | GitHub repository secret | Worker → Settings → Build → Deploy hooks. Used by the daily rebuild. |

Worker secrets go in **Worker → Settings → Variables and Secrets**, type **Secret**
(not under Build), or `npx wrangler secret put <NAME>`. `keep_vars` in
`wrangler.jsonc` keeps dashboard values across deploys.

- **Turnstile:** Cloudflare → Turnstile → Add widget (Managed). Hostnames:
  `cubansalsacalendar.com` and, for testing, the `*.workers.dev` address.
- **Cloudflare Access for `/admin`:** Zero Trust → Access → Applications →
  Self-hosted, domain `cubansalsacalendar.com/admin`, policy "Emails: your own
  email address". Copy the Application Audience (AUD) tag to `ACCESS_AUD` and the
  team name (`<team>.cloudflareaccess.com`) to `ACCESS_TEAM_DOMAIN`. The Worker
  verifies the Access token itself; until both values are set, `/admin` answers 404
  on every hostname.

Until `GITHUB_TOKEN` and `TURNSTILE_SECRET` are set, the submit and correction
forms answer "Couldn't send that" (the endpoint returns 503).

## Domain: Infomaniak registration, Cloudflare DNS

The domain stays registered at Infomaniak; only its DNS is served by Cloudflare.
It has no email records, so the switch affects only the website.

1. Cloudflare → **Add a domain** → `cubansalsacalendar.com` (Free plan). Delete
   imported `A`/`CNAME` records that point to the previous host.
2. Infomaniak Manager → Domains → `cubansalsacalendar.com`. If DNSSEC is on, turn it
   off first. **DNS servers** → external → the two `*.ns.cloudflare.com` names.
   Wait until Cloudflare shows the domain as **Active**.
3. Worker → **Settings → Domains & Routes** → add custom domains
   `cubansalsacalendar.com` and `www.cubansalsacalendar.com`.
4. **Rules → Redirect Rules** → template "Redirect from WWW to root" (301, keep path
   and query). Canonical URLs use the root domain.
5. **SSL/TLS → Edge Certificates** → Always Use HTTPS: on.
6. Point Cloudflare Access and Turnstile at the real domain (above).
7. Check: the site, `www` redirect, `/admin/` asks to sign in, a test submission
   opens a GitHub issue. Run PageSpeed Insights on `/` and a festival page.
8. Google Search Console → add the domain → submit `https://cubansalsacalendar.com/sitemap.xml`.

`*.workers.dev` addresses send `X-Robots-Tag: noindex` (`public/_headers`), so only
the real domain is indexed.

## Editing festivals

1. Open `/admin/` (signed in through Access), or `npm run dev` and
   `http://localhost:4321/admin/` locally.
2. Edits are a draft in that browser only. Before a new editing session, use
   **Discard draft and reload the published file**, so you start from the current data.
3. **Export festivals.json**, replace `data/festivals.json`, commit and push. The
   build validates the file and deploys.

Artist spellings and couples are normalised by `data/artists.json` (aliases and
acts with their members); add new variants there.
