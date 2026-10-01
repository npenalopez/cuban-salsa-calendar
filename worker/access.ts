/**
 * Cloudflare Access check for /admin.
 *
 * Access sits in front of /admin on the real domain and adds a signed JWT
 * (`Cf-Access-Jwt-Assertion`). The Worker verifies it too, so the editor and
 * the private notes stay closed on every other hostname (workers.dev, preview
 * URLs) and if Access is ever misconfigured. Without ACCESS_TEAM_DOMAIN and
 * ACCESS_AUD set, /admin is always closed.
 */
import type { Env } from './index';

interface Jwk extends JsonWebKey {
  kid: string;
}
let certs: { at: number; keys: Jwk[] } | null = null;

async function keys(team: string): Promise<Jwk[]> {
  if (certs && Date.now() - certs.at < 3600_000) return certs.keys;
  const r = await fetch(`https://${team}.cloudflareaccess.com/cdn-cgi/access/certs`);
  if (!r.ok) throw new Error('certs');
  certs = { at: Date.now(), keys: ((await r.json()) as { keys: Jwk[] }).keys };
  return certs.keys;
}

const b64url = (s: string) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
const decode = <T>(s: string) => JSON.parse(new TextDecoder().decode(b64url(s))) as T;

export async function hasAccess(request: Request, env: Env): Promise<boolean> {
  if (env.ADMIN_OPEN === '1' && new URL(request.url).hostname === 'localhost') return true;
  const team = env.ACCESS_TEAM_DOMAIN;
  const aud = env.ACCESS_AUD;
  const token = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!team || !aud || !token) return false;
  try {
    const [h, p, sig] = token.split('.');
    const header = decode<{ kid: string; alg: string }>(h);
    const claims = decode<{ aud: string | string[]; exp: number; iss: string }>(p);
    if (header.alg !== 'RS256') return false;
    const jwk = (await keys(team)).find((k) => k.kid === header.kid);
    if (!jwk) return false;
    const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64url(sig), new TextEncoder().encode(`${h}.${p}`));
    const auds = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
    return ok && auds.includes(aud) && claims.exp * 1000 > Date.now() && claims.iss === `https://${team}.cloudflareaccess.com`;
  } catch {
    return false;
  }
}
