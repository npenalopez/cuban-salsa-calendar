// Only /api/* and /admin* reach this Worker (see wrangler.jsonc); every other page is a static asset.
//
//   POST /api/submit   submit a festival / suggest a correction → GitHub issue
//   GET  /admin/…      data editor and the full data file, behind Cloudflare Access
import { hasAccess } from './access';
import { handleSubmit } from './submit';

export interface Env {
  ASSETS: Fetcher;
  SUBMIT_LIMIT?: RateLimit;
  GITHUB_REPO?: string;
  GITHUB_TOKEN?: string;
  TURNSTILE_SECRET?: string;
  ACCESS_TEAM_DOMAIN?: string;
  ACCESS_AUD?: string;
  /** Local development only (.dev.vars). */
  ADMIN_OPEN?: string;
}

const PRIVATE = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow' };

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (pathname === '/api/submit') return handleSubmit(request, env);
    if (pathname.startsWith('/api/')) return new Response('Not found', { status: 404 });

    if (pathname === '/admin' || pathname.startsWith('/admin/')) {
      if (!(await hasAccess(request, env))) return new Response('Not found', { status: 404, headers: PRIVATE });
      const res = await env.ASSETS.fetch(request);
      const out = new Response(res.body, res);
      for (const [k, v] of Object.entries(PRIVATE)) out.headers.set(k, v);
      return out;
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
