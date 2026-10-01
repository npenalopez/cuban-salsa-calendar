import type { APIRoute } from 'astro';
import { SITE } from '../lib/festivals';

export const GET: APIRoute = () =>
  new Response(`User-agent: *\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: ${SITE}/sitemap.xml\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
