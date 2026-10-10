/**
 * GET /api/saved.ics?ids=a,b,c — one calendar file with several festivals.
 *
 * The saved list lives in the browser, so the site used to build this file as a
 * blob download. In-app browsers (Instagram, Facebook, TikTok) drop blob downloads,
 * and their storage is not the phone browser's. A real URL that carries the ids
 * works there and can be handed over to Safari or Chrome.
 *
 * Each festival already has a static file at /festivals/{id}.ics; this joins their
 * events, so the event text stays in one place (src/lib/ics.ts).
 */
import type { Env } from './index';

const ID = /^[a-z0-9-]{1,120}$/;
const MAX = 200;

export function parseIds(raw: string | null): string[] {
  const ids = (raw ?? '').split(',').map((s) => s.trim()).filter((s) => ID.test(s));
  return [...new Set(ids)].slice(0, MAX);
}

/** The VEVENT blocks of an .ics file, untouched (line folding included). */
export function events(ics: string): string[] {
  return ics.match(/BEGIN:VEVENT\r?\n[\s\S]*?END:VEVENT/g) ?? [];
}

export function joinCalendar(files: string[], name = 'My Cuban salsa festivals'): string {
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Cuban Salsa Calendar//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'X-WR-CALNAME:' + name,
    ...files.flatMap(events),
    'END:VCALENDAR',
  ].join('\r\n') + '\r\n';
}

export async function handleSavedIcs(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('Method not allowed', { status: 405 });
  const url = new URL(request.url);
  const ids = parseIds(url.searchParams.get('ids'));
  const files = await Promise.all(
    ids.map(async (id) => {
      const r = await env.ASSETS.fetch(new URL(`/festivals/${id}.ics`, url));
      return r.ok ? r.text() : '';
    }),
  );
  if (!files.some((f) => f)) return new Response('No festivals with exact dates in this list.', { status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  return new Response(joinCalendar(files), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'inline; filename="my-cuban-salsa-festivals.ics"',
      'Cache-Control': 'public, max-age=3600',
      'X-Robots-Tag': 'noindex',
    },
  });
}
