/**
 * POST /api/submit: the "Submit a festival" and "Suggest a correction" forms.
 *
 * Verifies the Turnstile token, applies a per-IP rate limit, validates the
 * payload, and opens a GitHub issue labelled `submission` or `correction`.
 * Nothing is published automatically.
 */
import type { Env } from './index';

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

const str = (v: unknown, max = 500) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const isUrl = (v: string) => !v || /^https?:\/\/\S+\.\S+/.test(v);
const isMail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v);

export async function handleSubmit(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') return json(405, { error: 'Use POST' });
  if (!env.GITHUB_TOKEN || !env.GITHUB_REPO || !env.TURNSTILE_SECRET) return json(503, { error: 'Not configured' });
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: 'Invalid JSON' });
  }
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';

  // Rate limit, then spam check
  if (env.SUBMIT_LIMIT && !(await env.SUBMIT_LIMIT.limit({ key: ip })).success) return json(429, { error: 'Too many requests' });
  const form = new FormData();
  form.append('secret', env.TURNSTILE_SECRET);
  form.append('response', str(body.token, 4096));
  form.append('remoteip', ip);
  const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
  if (!((await verify.json()) as { success?: boolean }).success) return json(403, { error: 'Spam check failed' });

  // Validate and normalise
  const kind = body.kind === 'correction' ? 'correction' : 'submission';
  let title: string;
  let data: Record<string, unknown>;
  if (kind === 'correction') {
    const change = str(body.change, 4000);
    const email = str(body.email, 200);
    if (!change || (email && !isMail(email))) return json(422, { error: 'Invalid correction' });
    data = { festivalId: str(body.festivalId, 200), festivalName: str(body.festivalName, 200), change, email: email || null };
    title = `Correction: ${data.festivalName || data.festivalId}`;
  } else {
    const d = {
      name: str(body.name, 200), city: str(body.city, 120), country: str(body.country, 120),
      datesTba: body.datesTba === true, startDate: str(body.startDate, 10), endDate: str(body.endDate, 10),
      instagram: str(body.instagram, 300), website: str(body.website, 500), ticketUrl: str(body.ticketUrl, 500),
      artists: Array.isArray(body.artists) ? body.artists.slice(0, 80).map((a) => str(a, 120)).filter(Boolean) : [],
      role: ['organizer', 'teacher', 'dancer'].includes(String(body.role)) ? String(body.role) : 'dancer',
      email: str(body.email, 200),
    };
    const bad =
      !d.name || !d.city || !d.country || !isMail(d.email) || !isUrl(d.website) || !isUrl(d.ticketUrl) ||
      (!d.datesTba && (!isDate(d.startDate) || (d.endDate && (!isDate(d.endDate) || d.endDate < d.startDate))));
    if (bad) return json(422, { error: 'Invalid submission' });
    data = { ...d, startDate: d.datesTba ? null : d.startDate, endDate: d.datesTba ? null : d.endDate || d.startDate };
    title = `New festival: ${d.name} (${d.city}, ${d.country})`;
  }

  // JSON is valid YAML, so each value is emitted as a JSON scalar or array.
  const yaml = Object.entries(data).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join('\n');
  const issue = await fetch(`https://api.github.com/repos/${env.GITHUB_REPO}/issues`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'cubansalsacalendar-submit',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: title.slice(0, 250),
      labels: [kind],
      body: `Sent from the site form. Review before publishing.\n\n\`\`\`yaml\n${yaml}\n\`\`\`\n`,
    }),
  });
  if (!issue.ok) return json(502, { error: 'Could not record the message' });
  return json(200, { ok: true });
}
