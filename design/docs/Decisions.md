# Decisions log

## Phase 1 → 2
- New codebase inspired by the export (not preserving it). Phase 1 inventory = feature contract, minus removals below.
- Hosting: Cloudflare Pages, static build from `data/festivals.json`. No Supabase, no public write path. `/admin` behind Cloudflare Access.
- Admin stays as in-browser JSON editor that exports the file.
- New JSON schema (ISO dates, status, ticketUrl, private notes). See `data/migration-report.md`.
- Past festivals → Archive.
- Removed: Help page + 7 tutorials, unreachable code, quick-edit stub.

## Phase 2 → 3
- Design system "cartel" approved (Archivo + Atkinson Hyperlegible Next; paper/ink/rojo/azul/mango; light + dark).
- Filter bar: option 2a, month pages with a bottom transport dock (prev / month grid / next / filters).
- Features to build: festival pages + Event JSON-LD, Get passes, submit + suggest correction, Instagram fix, filters (where/when/saved/sort) + archive, add to calendar fixes + calendar feeds, favorites (+ share list), status + last checked, share.
- Later: map view, artist pages, style tags. On hold: sponsored listings, email alerts.
- Travel time: opt-in "Set your city", no location prompt on load.
- Removed: fun facts carousel, growth modal.
- Languages: English only, i18n-ready.
- Approved behaviour changes: simpler search matching, card opens festival page, real A–Z sort.

## After Phase 3
- Palette changed to navy #1C1F3D / coral #FF6B4A / cream #F6EDE3. Coral fills use navy text (5.6:1); coral text on cream uses #B8432F (4.6:1). Focus ring navy-blue #2F3D8C.
