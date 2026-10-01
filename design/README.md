# Handoff: Cuban Salsa Calendar redesign

## Overview

cubansalsacalendar.com is a worldwide directory of Cuban salsa, timba and Afro-Cuban festivals: 147 records, one maintainer. This package redesigns and rebuilds it as a **static site generated from one JSON file, hosted on Cloudflare Pages**. It replaces a Figma Make React SPA that rendered nothing without JavaScript, wrote to a public Supabase table from every visitor's browser, and shipped an admin password in the bundle.

Audience: salsa dancers planning trips, from beginners to teachers, in many countries. **Mobile first. Most visitors arrive from Instagram links**, often in the Instagram in-app browser, and often land directly on a single festival page. Copy is plain English.

## About the design files

The files in `prototype/` are **design references built in HTML**. They are working prototypes that show the intended look and behaviour, on the real data. They are not production code to copy. The `.dc.html` files run on a small custom runtime (`support.js`) with inline styles and hash routing. None of that should ship.

The task is to **recreate these designs in a real codebase**. No codebase exists yet. Recommended stack:

- **Astro** (static output) + TypeScript. Every page is pre-rendered HTML. Search, filters, saved list, sheets and map are small client islands (Preact or vanilla TS; keep JS small, many users are on in-app browsers over mobile data).
- **Cloudflare Pages** for hosting and build (build on every push to `main`).
- **Cloudflare Pages Functions** + **Turnstile** for the submit and correction forms.
- **Cloudflare Access** to protect `/admin`.
- No database. `data/festivals.json` in the repo is the single source of truth.

To view the prototypes, serve `prototype/` with any static server (`npx serve prototype`) and open `Cuban Salsa Calendar.dc.html` and `Admin.dc.html`. Opening them from `file://` breaks the `fetch` of the JSON.

## Fidelity

**High fidelity.** Colours, type, spacing, radii, copy, states and interactions are final. Recreate them closely. Exceptions are listed under "Prototype shortcuts to replace".

---

## Information architecture and routes

| Route (production) | Prototype hash | Page |
|---|---|---|
| `/` | `#/` | Current month page (same template as below, for the month containing today) |
| `/{yyyy}/{mm}/` | `#/m/2026-11` | Month page. Pre-render 12 months from the build date. |
| `/upcoming/` | `#/all` | All upcoming as one list, grouped by month |
| `/dates-tba/` | `#/tba` | Festivals with `datePrecision: "year"` |
| `/archive/` | `#/archive` | Past and cancelled festivals, newest month first |
| `/saved/` | `#/saved` | Saved list (client-rendered from localStorage; `?ids=a,b,c` shares a list) |
| `/festivals/{id}/` | `#/f/{id}` | Festival page |
| `/submit/` | `#/submit` | Submit a festival |
| `/submit/{id}/` | `#/submit/{id}` | Suggest a correction for one festival |
| `/admin/` | `Admin.dc.html` | Data editor, behind Cloudflare Access, `noindex` |
| `/feeds/{all\|europe\|north-america…}.ics` | — | Calendar subscription feeds, generated at build |
| `/festivals/{id}.ics` | — | Single-event .ics, generated at build |
| `/sitemap.xml`, `/robots.txt` | — | Generated at build |

Search results, date-range results and "Name A–Z" are client-side views on the list pages. Reflect them in the query string (`?q=`, `?when=90`, `?where=country:ES`, `?sort=name`) so links are shareable.

"Upcoming" and "past" are computed **at build time and again on the client** (`endDate < today` means past). Rebuild daily with a Cloudflare cron or a scheduled GitHub Action, so pages roll over without a data change.

---

## Data

- `data/festivals.json`: 147 records, already migrated to the new schema.
- `data/festivals.schema.json`: JSON Schema. Validate it in CI and fail the build on errors.
- `data/migration-report.md`: records the owner still needs to review.

Key rules:

- **Dates** are ISO `startDate` / `endDate` plus `datePrecision`:
  - `day`: exact days.
  - `month`: start = 1st, end = last day of the month; show `dateNote` (Mid / Early / Late) or "TBA" instead of days.
  - `year`: Jan 1 – Dec 31; listed under "Dates TBA", not in month pages.
  Sort by `startDate`, then name.
- **`notes` is private.** Never render it, never put it in .ics, JSON-LD or OG tags.
- **Never guess links.** Show Instagram, website and Get passes only when the field has a value.
- `ticketUrl` is empty for all records today. The prototype has a demo switch that falls back to `website`. **Don't ship that fallback.**
- `series` links editions across years ("Other editions" on the festival page; "next edition listed" on past cards).
- `featured` (sponsored) is **on hold**. Build the variant behind a flag that's off.

---

## Design tokens

### Colour (light / dark)

Dark mode follows `prefers-color-scheme`, with a manual override (Auto / Light / Dark) stored in `localStorage` (`csc-theme`). In the prototype these are CSS custom properties on `body`; keep them as CSS variables.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#F6EDE3` | `#15172B` | Page |
| `--surface` | `#FBF6F0` | `#1C1F3D` | Cards, sheets, inputs |
| `--sunken` | `#ECE2D6` | `#2A2D4A` | Date block, chips, hover fill |
| `--line` | `#E2D6C8` | `#383A52` | Card borders, dividers |
| `--line-strong` | `#8A8293` | `#6E7091` | Input and secondary-button borders, hover border |
| `--ink` | `#1C1F3D` | `#F6EDE3` | Headings, names, selected state |
| `--ink2` | `#45475F` | `#D6CFC6` | Body, city/country |
| `--ink3` | `#64667C` | `#A9A7B8` | Meta, counts. The lowest text colour allowed. |
| `--rojo` | `#B8432F` | `#FF8A6E` | Coral **text** on bg: month labels, "Get passes" text link, kickers, filled heart |
| `--accent` | `#FF6B4A` | `#FF6B4A` | Coral **fills**: primary buttons, map pins, rank 1 |
| `--accent-hover` | `#FF8466` | `#FF8466` | Primary button hover |
| `--on-rojo` | `#1C1F3D` | `#1C1F3D` | Text on coral fills. **Never white** (white on #FF6B4A is 2.8:1) |
| `--azul` | `#2F3D8C` | `#9FB2FF` | Text links, focus ring |
| `--mango` | `#FFD2C4` | `#5A3A35` | "Postponed" badge fill (with `--ink` text) |
| `--rojo-tint` | `#FFE1D8` | `#3D2A35` | Pressed/saved wash |
| `--dock` | `#1C1F3D` | `#2A2D4A` | Bottom dock |
| `--dock-inner` | `#383A52` | `#383A52` | Dock centre button, divider |
| `--dock-ink` | `#F6EDE3` | `#F6EDE3` | Dock text |
| `--dock-sub` | `#C9C6D6` | `#C9C6D6` | Dock secondary line |
| `--scrim` | `rgba(28,31,61,.5)` | `rgba(0,0,0,.6)` | Behind sheets |
| `--shadow` | `0 8px 24px rgba(28,31,61,.18)` | `0 8px 24px rgba(0,0,0,.5)` | Sheets, dock, popovers only |

Contrast targets (WCAG 2.1 AA): body and meta text ≥ 4.5:1 on its background; borders that identify controls ≥ 3:1. Navy on coral is 5.6:1; `#B8432F` on cream is 4.6:1.

### Typography

Fonts from Google Fonts. Self-host them in production (`@fontsource-variable/archivo`, Atkinson Hyperlegible Next).

- **Archivo** (variable: weight 400–900, width 62–125) for display, headings, date numerals and labels. Condensing uses `font-stretch`.
- **Atkinson Hyperlegible Next** (400/500/700) for everything else.
- Minimum text size is 14px; 12px only for uppercase labels and date-block sub-lines.

| Role | Spec |
|---|---|
| Page title (month name, "Archive"…) | Archivo 800, `font-stretch:65%`, uppercase, `clamp(52px,12vw,88px)`/0.85, `letter-spacing:-.01em` |
| Festival page H1 | Archivo 800, stretch 72%, uppercase, `clamp(40px,9vw,64px)`/0.92, `text-wrap:balance` |
| Section heading (month in lists) | Archivo 800, stretch 75%, uppercase, 22px/1, `letter-spacing:.02em` |
| Sheet title | Archivo 800, stretch 72%, uppercase, 26px/1 |
| Card title | Archivo 700, stretch 87.5%, 18px/1.2 |
| Date-block days | Archivo 800, stretch 70%, 24px/1, `tabular-nums` |
| Label / kicker | Archivo 700, 12px/1, uppercase, `letter-spacing:.1em` (kicker `.14em`, `--rojo`) |
| Body | Atkinson 400, 16px/1.5–1.55 |
| Place line | Atkinson 400, 15px/1.3, `--ink2` |
| Meta | Atkinson 400, 14px/1.4, `--ink3` |
| Buttons | Atkinson 700, 15–17px |

### Spacing, radius, elevation

- Spacing scale: 4, 8, 12, 16, 20, 24, 32, 48, 64.
- Page gutter 16px. Content max-width 1120px. Card padding 12px. Gap between cards 8px. Section top padding 20px.
- Radii: badges 6px, buttons/inputs 8px, cards 12px, dock 16px, sheets 20px (top corners), chips/pills fully round.
- Cards have **borders, not shadows**. Shadows only on dock, sheets, popovers and toast.
- Touch targets ≥ 44×44 everywhere (chips 40px tall with 8px gap is the one exception).
- Focus: `:focus-visible { outline: 2px solid var(--azul); outline-offset: 2px }`. For the stretched card link, draw the ring on the `::after` overlay so it wraps the whole card.
- Respect `prefers-reduced-motion` (disable the dock slide).

---

## Screens

### 1. Header (all public pages)

- Height 56px, `border-bottom:1px solid var(--line)`, not sticky.
- Left: logo link to `/`: a 22×15 flag mark (5 horizontal stripes, 3px each, `#1C1F3D` / `#F6EDE3`, plus a coral `#FF6B4A` triangle clipped `polygon(0 0,55% 50%,0 100%)`), then the wordmark "Cuban Salsa Calendar" (Archivo 800, stretch 75%, uppercase, 18px).
- Right:
  - Saved link "♡ {n}", 44px tall, `aria-label="Saved festivals, {n}"`.
  - **"☰ Menu"** pill button: 44px tall, 14px horizontal padding, 1px `--line-strong` border, `--surface` fill, radius 22px, bold 15px. It must read as a labelled button, not a bare icon.

### 2. List page (month / upcoming / dates TBA / archive / saved / search / date range)

Top to bottom:

1. **"← Back to upcoming festivals"**: on every list view that isn't a month page. Ink-filled pill, 44px, radius 22px, `--bg` text. Clears search and date filter and goes to `/`.
2. **Search** (max-width 640px): text input 48px tall, radius 8px, 1px `--line-strong`, 16px text (prevents iOS zoom), leading magnifier icon, placeholder "Festival, city, country or artist". Use `type="text"` with `enterkeyhint="search"`, not `type="search"`, to avoid a second native clear button. **Exactly one ✕ clear button**, inside the input. Suggestions are described under Interactions.
3. **Explore chips** (month, upcoming and TBA views, not during search): a horizontal scroll row of pills, 44px, radius 22px, bordered: "♡ Saved (n)", "★ Top artists" (opens sheet), "Travel times" (opens sheet), "Archive", "Submit a festival". These keep the main menu options visible without opening the menu.
4. **Page heading**: kicker (e.g. "2026 · 28 FESTIVALS") and title (e.g. "OCTOBER"), optional note paragraph (15px `--ink2`). If any filter is active: "Filtered: Europe · Next 3 months" plus a "Clear filters" link-button.
5. **List / Map toggle**: two-button segmented control, 44px, min-width 84px each. Selected = ink fill, `--bg` text. `aria-pressed`.
6. **Saved page only**: "Share my list" and "Add all to calendar (.ics)" secondary buttons. If opened with `?ids=` containing unsaved ids: a banner "Someone shared {n} festivals with you." with a "Save all to my list" button.
7. **Sections**: month pages have no section header (the page title is the month). Other views group by "Month YYYY" headings with a count on the right. Cards sit in a grid: `repeat(auto-fill, minmax(min(100%,340px),1fr))`, gap 8px. One column on phones.
8. **Empty state**: dashed `--line-strong` box, radius 12px, a title for the view (e.g. "No festivals in August 2027." / 'Nothing matches "xyz".'), helper text, an optional "Did you mean **Havana**?", "Clear filters" if filters are on, and "Know a festival? Submit it".
9. **Month pages only**: "Next: November 2026 · 21 ›" full-width bordered button (52px, max-width 640px).
10. **Footer**: blurb ("A community-kept list of Cuban salsa, timba and Afro-Cuban festivals around the world. Free to use."), "@cubansalsacalendar ↗", "Submit a festival", "© {year} Cuban Salsa Calendar · {n} upcoming festivals in {m} countries".
11. Bottom padding 140px so the dock never covers the last card.

**Loading:** 4 skeleton cards (104px, `--sunken`, fading opacity), `aria-busy`. **Error:** an alert box saying "Couldn't load the festival list." with a "Try again" button. In the static build this only applies to client-loaded views such as Saved.

### 3. Festival card (one component at every width)

Grid: `60px | 1fr | auto`, gap 12px, padding 12px, radius 12px, 1px `--line` border, `--surface` fill. Hover: border becomes `--line-strong` and the title underlines.

- **Date block** (60px wide, min 60px tall, `--sunken`, radius 8px, centred, `aria-hidden`; the date is in the link's accessible name):
  - Line 1: month label in `--rojo`, Archivo 700 12px, stretch 75%, `nowrap`. Cross-month ranges read "OCT–NOV".
  - Line 2: days, "9–12" (or "30–1" across months, "7" for one day).
  - Line 3: weekdays, "Fri–Mon", 12px `--ink3`. Past cards show the year instead.
  - Month precision: days = `dateNote` uppercased (max 5 chars, e.g. "MID") or "TBA"; line 3 "Days TBA".
  - Year precision: line 1 = year, line 2 = "TBA", dashed borders on block and card, transparent block fill.
- **Main column:**
  - Optional badge: "Postponed" (`--mango` fill, ink text), "Cancelled" / "Sold out" (ink fill, bg text), "Sponsored" (no fill, `--ink2`).
  - Title: `<h3><a href="/festivals/{id}/">`. The link is **stretched** with `::after{content:"";position:absolute;inset:0}` so the whole card opens the festival page. Its `aria-label` is "{name}, {long date}, {city, country}".
  - Place line: flag (20×14, radius 2, 1px inset shadow `rgba(0,0,0,.12)`) + "City, Country". Unknown → "Location to be announced".
  - **Artist chips**: the first 3 artists as chips (padding 4px 9px, radius 13px, `--sunken`, 13px/18px, ellipsis), plus a "+N more" outlined chip (1px `--line-strong`, `--ink2`). Hidden for past and postponed festivals.
  - Meta line (14px `--ink3`):
    - Price "from €59" (`priceFrom` + currency symbol: € £ US$ MX$, otherwise "PLN 470").
    - If no artists: "Line-up not announced" / "Line-up and prices not announced".
    - If artists but no price: "Price not announced".
    - Year precision: "Dates not announced yet". Postponed: "New dates not announced". Past: "Took place" or "Took place · next edition listed".
  - Travel line, only if the user set a city: "≈ 2 h 30 flight from Zurich" / "≈ 3 h drive from Zurich" / "Near Zurich".
  - "Get passes ↗" text link, only when `ticketUrl` exists and status is `scheduled`: bold 15px `--rojo`, `rel="sponsored noopener"`, `target="_blank"`, with screen-reader text ", opens the organizer's site". Positioned above the stretched link (`position:relative; z-index:1`).
- **Action column** (above the stretched link):
  - Save: 44×44 icon button with ♡ / ♥ in `--ink2` / `--rojo`, `aria-pressed`, label "Save {name}". Hidden for archive cards.
  - Add to calendar: 44×44, 20px calendar icon, opens the calendar sheet. Only for `datePrecision: "day"`, not archived, not postponed.
- **Past / cancelled**: `--bg` fill, `--line` date block, muted month colour, name in `--ink2`, struck-through days for postponed and cancelled.
- **Featured** (flag off): 2px coral border.

### 4. Bottom dock (list pages, mobile and desktop)

Fixed to the bottom, centred, max-width 520px, 10px side margins, bottom = `14px + env(safe-area-inset-bottom)`. 64px tall, radius 16px, `--dock` fill, `--shadow`. It's a `<nav aria-label="Browse by month">`.

- **Month pages:**
  - `‹` 44×44 link to the previous month (opacity .35 and `aria-disabled` at the first of the 12 months).
  - Centre button (flex 1, 52px, radius 10px, `--dock-inner`): line 1 "OCTOBER 2026 ▴" (Archivo 800, stretch 75%, uppercase, 18px), line 2 "28 festivals · 1 of 12" (12px `--dock-sub`). Opens the **month sheet**.
  - `›` link to the next month.
  - Divider: 1px × 32px.
  - Filters icon button (52×44): three decreasing lines. Coral badge (18px circle, navy 12px bold) with the active filter count. `aria-label="Filters, 2 active"`.
- **Other views:** "‹ Today" link on the left (to `/`), centre button labelled with the view ("ALL UPCOMING ▴", "ARCHIVE ▴", "6 RESULTS ▴" with sub-line 'for "yus"'), then the divider and Filters. **No clear button in the dock** (search has exactly one ✕, in the input).
- Hide on scroll down (`translateY(120%)`, `.25s ease`) once past 240px. Show again on scroll up and near the end of the page. Never hide while a sheet is open.

### 5. Sheets (bottom sheets: dialog, scrim, Esc and outside tap close)

Container: max-width 560px, centred, max-height 86vh, scrollable, radius 20px at the top, `--surface`. Sticky header with the title (Archivo, uppercase, 26px) and a 44px ✕ "Close". `role="dialog" aria-modal="true" aria-labelledby`. **Production must trap focus** and return it to the opener on close.

- **Choose a month:** "All upcoming, as one list ({n})" row, then per year a 4-column grid of 12 month cells (56px tall, radius 8px):
  - Current month: ink fill, `--bg` text, `aria-current`.
  - Has festivals: 1px `--line-strong` border.
  - Zero festivals: dashed border, `--ink3`.
  - Cell content: "Nov" bold 15px, count 13px.
  Then "Dates to be announced ({n})" and "Archive · past festivals ({n})" rows.
- **Filters:**
  - *When*: 2×2 radio cards: Any time / Next 30 days / Next 3 months / Pick dates. Selected = 2px ink border + `--sunken`. "Pick dates" reveals From/To date inputs.
  - *Where*: native `<select>` with "Anywhere ({n})", an optgroup "Regions" (sorted by count) and an optgroup "Countries" (A–Z, with counts).
  - *Only saved festivals*: a switch (`role="switch"`).
  - *Sort*: a Date / Name A–Z segmented control.
  - Sticky footer: "Clear all" link-button and a coral "Show {n} festivals" button that closes the sheet. Filters apply live.
- **Menu**: rows 64px min-height. Each row is a bold 16px label with a 14px `--ink3` description line, and › (or ↗ for external links) at the end:
  - Saved festivals: "{n} festivals saved on this phone" / "Tap ♡ on any festival to keep it here"
  - Top artists: "Who teaches at the most festivals"
  - Travel times: "On · from Zurich" / "Off · show flight or drive time from your city"
  - Calendar feeds: "New festivals appear in your calendar app"
  - Archive: "{n} festivals that already happened"
  - Submit a festival: "Organizer or dancer? Add one for free"
  - Follow on Instagram: "@cubansalsacalendar" ↗
  - Appearance: Auto / Light / Dark segmented control.
  - Footnote: "{stats}. Something wrong on a festival? Open it and tap "Suggest a correction"."
- **Add to calendar:**
  - Header line: "{name} · {long date}".
  - Three 52px bordered rows: "Google Calendar ↗", "Apple Calendar, Outlook app, others (.ics)", "Outlook.com ↗".
  - Note: "All-day event with reminders a week and a day before. In the Instagram app browser, use Google Calendar, or open this page in Safari or Chrome first."
- **Top artists:**
  - Sub-line "Ranked by festival appearances in {year}. Tap a name to see their festivals." and a This year / All time toggle.
  - Rows 60px on `--sunken`: rank circle (30px; rank 1 coral, rank 2 `--line`, rank 3 `#E8C9B0`; ties share a rank), name, "{n} festivals · {m} countries", up to 3 flags.
  - Top 10, then "Show all {n} artists". Tapping a name searches for that artist on `/upcoming/`.
- **Travel times:** explanation, a "Use my current location" button (geolocation **only on this tap**), a "Or pick a city" select (26 dance hubs, see `CITIES` in the prototype), and "Stop showing travel times". Stored in `localStorage` (`csc-city`). No cookies.
- **Calendar feeds:** rows per feed: All festivals, each region, My saved festivals. Each shows its count of dated festivals plus "Copy link" (`webcal://cubansalsacalendar.com/feeds/{slug}.ics`) and ".ics" download. The saved feed can't be a static URL, so it's a download only.

### 6. Map view

- **List page "Map":** Leaflet, container `height:min(64vh,580px)`, radius 12px, 1px `--line` border, `isolation:isolate`. One pin per festival in the current view, with the same filters.
  - Pin: 18px coral circle with a 3px navy border and `0 2px 6px rgba(0,0,0,.4)` shadow.
  - Popup: name (Archivo 800, 17px, link), long date, place, "View festival →" in `#B8432F`.
  - Fit bounds with 28px padding, `maxZoom:6`. `scrollWheelZoom:false`.
  - Under the map: "{n} festivals on the map. Tap a pin for details."
- **Festival page map:** 240px, one 24px pin, zoom 11, then a "Directions in Maps ↗" link (`https://www.google.com/maps/search/?api=1&query=lat,lng`).
- **Tiles:** Esri Canvas `World_Light_Gray_Base` / `World_Dark_Gray_Base`, switched with the theme, attribution "Tiles © Esri, HERE, Garmin, © OpenStreetMap". **Check the licence terms for production traffic.** Alternatives: Stadia "Alidade Smooth" or self-hosted Protomaps with a custom navy/cream style (best match for the palette). CARTO now needs a key. Lazy-load the map library only when the map is opened.
- **Clustering:** add `leaflet.markercluster` (or the MapLibre equivalent) styled as navy circles with cream counts.

### 7. Festival page

Top bar: "← All festivals" (returns to the last list URL, or `/`), with Save (♥) and "Share" on the right. Two columns from about 760px (`repeat(auto-fit,minmax(min(100%,360px),1fr))`, gap 28px × 48px); one column on phones.

**Left column:**
1. Status banner (if any), `role="status"`, radius 8px:
   - Postponed (mango): "**Postponed.** New dates haven't been announced yet."
   - Cancelled: "**Cancelled.** This edition won't take place."
   - Past: "**This festival already took place.** The next edition is listed below / hasn't been announced."
   - Sold out: "**Sold out.** Check the organizer for a waiting list."
2. Flag + "City, Country". H1 name. Long date (Archivo 800, stretch 75%, 22px), e.g. "Sat 28 – Sun 29 November 2026". Sub-line: "2 days · starts in 58 days" / "happening now" / "ended N days ago" / "Exact days not announced yet". Optional travel line.
3. **Get passes** (scheduled, `ticketUrl` set): full-width 52px coral button with navy text, "Get passes · from €59 ↗", `rel="sponsored noopener"`. Under it, 13px centred: "Passes are sold by the organizer." This is the only primary button on the page: no urgency copy, no countdowns.
4. Secondary actions grid (`auto-fit, minmax(140px,1fr)`, 44px each):
   - "Add to calendar" (bordered, calendar icon)
   - "Instagram ↗" ("Instagram post ↗" for `/p/` URLs)
   - "Festival website ↗" (ghost)
   Show each only if it exists. If there are no links: "We don't have a website or Instagram for this festival yet. Know it? Tell us." linking to the correction form.
5. Facts `<dl>` (88px label column; labels are uppercase Archivo 12px `--ink3`): Where, Price (`priceText` or "Not announced yet"), Region.
6. Other editions (same `series`): rows of name with "Month YYYY ›".

**Right column:**
1. "LINE-UP {n}": artist chips are buttons (40px, radius 20px, `--sunken`) that search for that artist. Show the first 12, then "+N more" / "Show fewer". With no artists: "Not announced yet."
2. "ABOUT": description, 16px/1.55 `--ink2`, or "No description yet."
3. The map, as described above.
4. "Info last checked {date}" (or "Info from the organizer's public channels.") and "Something wrong? Suggest a correction".
5. **More in {Month YYYY}**: up to 4 other upcoming festivals that month, as rows (64px coral day range, bold name, place), plus "See all of {Month} ›". This matters because most visitors land here from Instagram and need somewhere to go next.

**In the `<head>`** (not shown in the UI; the prototype only previews it):
- `<title>{name} · {dates} · {city}</title>` and a meta description.
- Canonical URL.
- OG and Twitter tags with a **build-generated 1200×630 image**: navy background, coral kicker, cream date numerals, name and city, in the style of the palette reference cards.
- `Event` JSON-LD, built as in the prototype's `ld` object:
  - `name`, `url`, `eventAttendanceMode` Offline.
  - `eventStatus`: Scheduled / Postponed / Cancelled.
  - `location`: Place, PostalAddress with locality and country, plus geo.
  - `startDate` / `endDate` **only for day precision**.
  - `performer`: up to 10 people.
  - `description`.
  - `offers`: url, price and currency, when there's a ticket link.
- **No JSON-LD `startDate` for month or year precision** (Google flags it).

### 8. Submit a festival / Suggest a correction

Max-width 640px. "← Back", then a kicker, H1 "Submit a festival" / "Fix a listing", and an intro.

- **New festival** fields:
  - Festival name*
  - City*, Country* (side by side from 400px)
  - Dates: checkbox "Dates not announced yet"; otherwise First day* and Last day
  - Instagram ("@festival or link")
  - Website, Where to buy passes (URL fields)
  - Line-up (textarea, one artist per line)
  - You are: organizer / teacher or artist / dancer
  - Your email*, with the hint "Only used to ask you about this festival. Never shown or shared."
- **Correction** fields: festival name (read-only box), "What should we change?"* (with hint), email (optional).
- **Validation on submit:**
  - A focused error summary (`role="alert"`, 2px `--rojo` border) whose links focus each field.
  - Per field: `aria-invalid`, `aria-describedby`, 2px `--rojo` border, bold 14px error text.
  - Messages are listed in the prototype's `validate()`, for example "Enter the first day, or tick "Dates not announced yet"." and "The last day can't be before the first day."
- **Spam check:** Cloudflare Turnstile (managed / invisible).
- **Success:** a status box: "**Thank you. We got it.** We review every message before anything is published. If you left an email, we'll write back if we have questions." plus a link back.
- **Backend:** a Pages Function `POST /api/submit` that verifies the Turnstile token, validates, and opens a **GitHub issue** in the site repo, labelled `submission` or `correction`, with the payload as a YAML block. A token in a Pages secret. Rate-limit per IP. Never auto-publish.

### 9. Admin (`/admin/`, behind Cloudflare Access)

Desktop-first data editor; the full spec is in `prototype/Admin.dc.html`.

- **Sticky header:**
  - Title "FESTIVAL DATA", status "Published file · {version} · {n} festivals" or "Unpublished draft · {n} festivals".
  - "+ Add festival", "Import JSON" (file input), and a coral "Export festivals.json" button.
- **Quick-filter tiles:** festivals / missing key info / no website or Instagram / no ticket link / dates not exact. They toggle the filter (`aria-pressed`).
- **Search** (id, name, city, country, artists) and a "Show" select: All / Missing key info / Missing: {field} for each check.
- **Table** (min-width 1100px, scrolls horizontally):
  - Columns: Festival (name button + id), Dates (+ precision), City, Country, Region, Status badge, Price, Artists (count), Missing (red if a priority field is missing), Edit / Delete.
  - Sortable headers with `aria-sort`.
  - Default order: incomplete first, then by name.
  - Priority fields: dates, links, artists, price.
- **Edit dialog** (max-width 860px), fieldsets:
  - Basics: name*, id, series, status, featured
  - Dates: precision, start*, end*, note
  - Place: city*, country* (datalist), country code, region, venue, lat, lng
  - Price and links: price text, from, currency, ticket link, website, Instagram
  - Text: description, private notes, last checked
  - Line-up: removable chips, plus an add input with a datalist from all known artists (de-duplicated, accent-insensitive)
- **Dialog behaviour:**
  - Validation: required fields, end ≥ start, unique id, http(s) links, numeric coordinates.
  - Footer: "Mark as checked today", Cancel, Save. Esc closes; Cmd/Ctrl+S saves.
- **Drafts:** saved in `localStorage` (`csc-admin-draft`), with "Discard draft and reload the published file".
- **Export:** sorted by `startDate` then name, fixed field order (see `ORDER`), `version: YYYY.MM-{count}`, `updated: YYYY-MM-DD`.
- **Publishing:** the export is committed manually. A later improvement is "Publish": a Pages Function behind Access that commits through the GitHub API.

---

## Interactions and behaviour

- **Search:**
  - Accent-insensitive substring match across name, city, country, region and artists. **No** "3 letters = country only" rule.
  - Results: an "Upcoming" group, plus an "In the archive" group if there are archive matches.
  - Empty focus shows "Recent" (last 5, `localStorage` `csc-recent`, Clear) and "Popular" (top 3 cities, top 2 countries).
  - From 2 characters: grouped suggestions (Festivals 3, Cities 3, Countries 2, Artists 3), prefix matches first, with counts and highlighted matches. **Escape the query before any regex** (or avoid regex).
  - ARIA 1.2 combobox: `role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`, listbox/options; ↑ ↓ Enter Esc.
  - Picking a Festival opens its page. A City or Artist sets the query. A Country sets the Where filter and clears the query.
  - With zero results: "Did you mean X?" (Levenshtein ≤ 2 against cities, countries and artists).
- **Saved:** stored in `localStorage` (`csc-saved`, an array of ids), with toasts "Saved" / "Removed from saved". Share uses the Web Share API (`navigator.share`), falling back to clipboard copy with the toast "Link copied".
- **Toast:** bottom centre, 96px from the bottom, ink fill, `--bg` text, `aria-live="polite"`, 2.6 s.
- **.ics content:**
  - `VERSION:2.0`; `DTSTART;VALUE=DATE` / `DTEND;VALUE=DATE` (end + 1 day); `UID:{id}@cubansalsacalendar.com` (stable).
  - `SUMMARY` name; `LOCATION` venue, city, country; `DESCRIPTION` line-up, price, website, and a festival page link; `URL`.
  - `VALARM` -P7D and -P1D.
  - Only `datePrecision: "day"` festivals are included.
- **Calendar URLs:**
  - Google: `dates=YYYYMMDD/YYYYMMDD` (all-day, end exclusive).
  - Outlook: `allday=true&startdt=YYYY-MM-DD&enddt=YYYY-MM-DD`.
- **Travel estimate:** haversine distance from the user's city.
  - Under 40 km: "Near {city}".
  - Under 450 km: drive time = km / 75.
  - Otherwise: flight time = km / 750 + 0.75 h.
  - Rounded to the nearest half hour, written as "≈ 2 h 30".
- **Instagram in-app browser:** every external link uses `target="_blank" rel="noopener"`. Static `/festivals/{id}.ics` files open better than blob downloads. Avoid `window.open`, `alert` and `confirm` everywhere.

## State (client)

| Key | Where | Notes |
|---|---|---|
| `query`, `where` (`region:Europe` / `country:ES`), `when` (`any` / `30` / `90` / `custom` + `from` / `to`), `savedOnly`, `sort` (`date` / `name`), `view` (`list` / `map`) | URL query string | Shareable |
| `saved` | `localStorage` `csc-saved` | Array of ids |
| `recent` | `localStorage` `csc-recent` | Max 5 |
| `theme` | `localStorage` `csc-theme` | `system` / `light` / `dark`, applied as `data-theme` on `<html>` before paint |
| `city` | `localStorage` `csc-city` | `{name, lat, lng}` |
| Open sheet, focused suggestion, dock hidden | Component state | — |

Month counts in the dock, the month sheet and the "Show {n}" button must respect every active filter.

## Assets

- **Flags:** use the `flag-icons` package (SVG, bundled). The prototype hot-links flagcdn.com.
- **Icons:** simple inline SVGs (magnifier, calendar, filter lines), plus ♡ ♥ ‹ › ↗ ✕ ☰ as text glyphs. Lucide's `search`, `calendar`, `sliders-horizontal`, `heart` and `menu` are fine replacements.
- **No photography.** OG images are generated at build (e.g. `satori` + `resvg`).

## Accessibility acceptance (WCAG 2.1 AA)

- Skip link "Skip to festivals". Landmarks header / main / nav / footer. One H1 per page.
- Real links for navigation; buttons only for actions. No nested interactive elements (use the stretched-link pattern).
- No auto-rotating content. No location prompt without a user tap.
- All targets ≥ 44px. Contrast per the tokens. `:focus-visible` ring everywhere. Focus trap in sheets and dialogs.
- Live region announcing "{n} festivals shown" after filtering.
- Test with VoiceOver on iOS Safari **and** inside the Instagram in-app browser.

## Prototype shortcuts to replace

1. Hash routes → real pre-rendered paths, with `<head>` meta, OG and JSON-LD.
2. Inline styles and the `support.js` runtime → Astro components plus a CSS file built on the tokens above.
3. Sheets lack a focus trap → use `<dialog>` with `showModal()` or a tested dialog primitive.
4. flagcdn and unpkg Leaflet → bundled dependencies. Lazy-load the map.
5. The `demoTicketLinks` website fallback for Get passes → **remove**.
6. Forms simulate success → implement the Pages Function, Turnstile and the GitHub issue.
7. Feeds and .ics are generated in the browser → generate them at build as static files.
8. English strings inline → collect them in one `strings.en.ts` so a second language can be added later.

## Screenshots

`screenshots/` contains captures of the prototype at about 924px wide (the layout is fluid, so phones get one column). `00-overview.png` puts them all on one sheet.

| File | Shows |
|---|---|
| `01-month-page.png` | Month page, light mode: search, explore chips, title, List/Map, cards with artist chips, dock |
| `02-map-view.png` | Map view (dark). **The capture omits the basemap tiles** (they're cross-origin images); in the browser the Esri gray base shows under the pins. |
| `03-festival-page.png` | Festival page: Get passes, secondary actions, line-up, about |
| `04-month-page-dock.png` | Month page with the dock |
| `05-sheet-months.png` | "Choose a month" sheet |
| `06-sheet-filters.png` | Filters sheet |
| `07-sheet-menu.png` | Menu sheet with row descriptions |
| `08-search-suggestions.png` | Search suggestions for "yus" |
| `09-archive.png` | Archive with "Back to upcoming festivals" and the "‹ Today" dock |
| `10-submit-form.png` / `11-submit-validation.png` | Submit form, empty and with the error summary |
| `12-dark-mode.png` | November month page in dark mode |

The dock is `position:fixed`, so in some captures it sits over the middle of the content. On a real phone it sits at the bottom of the screen.

## Files in this package

```
design_handoff_cuban_salsa_calendar/
├── README.md                      ← this file
├── data/
│   ├── festivals.json             ← source of truth, 147 records, schema v2
│   ├── festivals.schema.json      ← validate in CI
│   └── migration-report.md        ← owner's data review list
├── prototype/                     ← serve this folder, then open the .dc.html files
│   ├── Cuban Salsa Calendar.dc.html   public site (all screens, sheets, map, forms)
│   ├── Admin.dc.html                  /admin editor
│   ├── data/festivals.json            copy used by the prototype
│   └── support.js                     prototype runtime only, do not ship
└── docs/
    ├── Decisions.md               ← every product decision, in order
    ├── Phase 1 Audit.dc.html      ← original audit and feature inventory (F01–F42)
    ├── Phase 3 Report.dc.html     ← inventory re-check: kept / fixed / changed / removed
    └── support.js
```

In the prototype source, the logic class (`class Component`) contains the exact formatting rules: `cardVM()`, `dateLong()`, `fmtPrice()`, `travel()`, `suggestions()`, `validate()`, `icsEvent()`, `calUrls()`, and the JSON-LD object. Port those functions directly into TypeScript utilities, with unit tests for the date formatting (same-month, cross-month, cross-year, single day, month and year precision).

## Suggested build order

1. Repo, Astro, tokens CSS, fonts, JSON Schema validation in CI.
2. Data utilities, ported from the prototype, with tests.
3. Festival card, month page, festival page, `<head>`, JSON-LD, OG images, sitemap. **Deploy here**: this alone fixes SEO and Instagram link previews.
4. Dock, month sheet, filters, search, saved, archive, dates TBA, menu, theme.
5. Calendar (.ics files, feeds), share, travel times.
6. Map view.
7. Submit and correction forms (Pages Function + Turnstile + GitHub issues).
8. `/admin` behind Cloudflare Access.
9. Accessibility pass, then testing inside the Instagram in-app browser on iOS and Android.
