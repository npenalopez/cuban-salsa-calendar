import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import { readFileSync } from 'node:fs';

// Fields the browser needs. `notes` is private and `description`,
// `instagram`, `lastVerified` are only shown on pre-rendered festival pages,
// so they never ship in the shared client bundle.
const CLIENT_FIELDS = [
  'id', 'series', 'name', 'status', 'startDate', 'endDate', 'datePrecision', 'dateNote',
  'city', 'country', 'countryCode', 'region', 'venue', 'coordinates',
  'priceText', 'priceFrom', 'currency', 'ticketUrl', 'website', 'artists', 'featured',
];

/** `virtual:festivals` = published festivals (exact days only, as `isListed`), stripped to CLIENT_FIELDS. */
function festivalsModule() {
  const ID = 'virtual:festivals';
  const RESOLVED = '\0' + ID;
  const file = new URL('./data/festivals.json', import.meta.url);
  return {
    name: 'csc-festivals',
    resolveId: (id) => (id === ID ? RESOLVED : null),
    load(id) {
      if (id !== RESOLVED) return null;
      this.addWatchFile(file.pathname);
      const json = JSON.parse(readFileSync(file, 'utf8'));
      const list = json.festivals.filter((f) => f.datePrecision === 'day').map((f) => Object.fromEntries(CLIENT_FIELDS.map((k) => [k, f[k] ?? null])));
      return `export default ${JSON.stringify(list)};`;
    },
  };
}

/** Adds `client:afterload` (src/client/afterload.ts). */
const afterLoad = {
  name: 'csc-afterload',
  hooks: {
    'astro:config:setup': ({ addClientDirective }) => addClientDirective({ name: 'afterload', entrypoint: './src/client/afterload.ts' }),
  },
};

export default defineConfig({
  site: 'https://cubansalsacalendar.com',
  trailingSlash: 'always',
  integrations: [preact(), afterLoad],
  // The floating dev toolbar sits on top of the bottom dock.
  devToolbar: { enabled: false },
  // One request less before first paint: the CSS is small (~6 KB gzipped).
  build: { inlineStylesheets: 'always' },
  vite: { plugins: [festivalsModule()] },
});
