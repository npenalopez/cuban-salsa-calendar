# Cuban Salsa Calendar

A worldwide directory of Cuban salsa festivals, congresses, and events.
Browse by month, country, city, or artist; export events to your
calendar; and see travel-time estimates from your current location.

## Stack

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS v4** with shadcn-style primitives
- **Supabase** for festival data persistence
- **i18n** for English, German, Spanish, French, and Polish

## Getting started

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production build to dist/
npm run typecheck    # TypeScript only, no emit
npm run preview      # serve the built dist/
```

## Project layout

```
src/
├─ main.tsx                       # entry point
├─ styles/                        # Tailwind + theme CSS
└─ app/
   ├─ App.tsx                     # top-level shell
   ├─ components/                 # feature components
   │  └─ ui/                      # shadcn primitives
   ├─ contexts/                   # React contexts (language)
   ├─ data/festivals.ts           # festival type + seed data
   ├─ services/                   # Supabase, geocoding, geolocation
   ├─ translations/               # i18n strings
   └─ utils/                      # date, price, calendar export, …
```

## Admin mode

The festival management screen is hidden behind a 4-click sequence on
the title in the header (within 60 seconds), followed by a password.
Use ⌘/Ctrl-M to toggle once unlocked.
