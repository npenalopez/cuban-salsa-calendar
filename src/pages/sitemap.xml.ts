import type { APIRoute } from 'astro';
import { monthPath, months12 } from '../lib/dates';
import { ALL, TODAY, TODAY_ISO } from '../lib/data.server';
import { SITE, festivalPath } from '../lib/festivals';
import { landings } from '../lib/seo';
import { artistPages } from '../lib/artistPages';

export const GET: APIRoute = () => {
  const paths = ['/', '/upcoming/', '/archive/', '/submit/', ...months12(TODAY).map((m) => monthPath(m.key)), ...landings(ALL).map((l) => l.path), '/artists/', ...artistPages(ALL).filter((a) => a.upcoming.length).map((a) => `/artists/${a.slug}/`), ...ALL.map((f) => festivalPath(f.id))];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${SITE}${p}</loc><lastmod>${TODAY_ISO}</lastmod></url>`).join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
