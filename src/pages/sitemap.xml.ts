import type { APIRoute } from 'astro';
import { monthPath, months12 } from '../lib/dates';
import { ALL, TODAY, TODAY_ISO } from '../lib/data.server';
import { SITE, festivalPath } from '../lib/festivals';
import { landings } from '../lib/seo';
import { artistPages } from '../lib/artistPages';
import { LANGS, lp } from '../i18n';

// Every page in English, Spanish and French, each listing its language versions (hreflang).
export const GET: APIRoute = () => {
  const paths = [
    '/', '/upcoming/', '/archive/', '/submit/', '/privacy/',
    ...months12(TODAY).map((m) => monthPath(m.key)),
    ...landings(ALL).map((l) => l.path),
    '/artists/', ...artistPages(ALL).filter((a) => a.upcoming.length).map((a) => `/artists/${a.slug}/`),
    ...ALL.map((f) => festivalPath(f.id)),
  ];
  const url = (p: string) => {
    const alts = [...LANGS.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${SITE}${lp(l, p)}"/>`), `<xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${p}"/>`].join('');
    return LANGS.map((l) => `  <url><loc>${SITE}${lp(l, p)}</loc><lastmod>${TODAY_ISO}</lastmod>${alts}</url>`).join('\n');
  };
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${paths.map(url).join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
