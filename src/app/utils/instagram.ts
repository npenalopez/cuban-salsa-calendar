/**
 * Accept any Instagram input format and return a clean handle (no @,
 * no domain, no slashes, no query). Returns null when the input is
 * empty, "-", or a non-Instagram URL.
 *
 *   "@yab_festival"                                  → "yab_festival"
 *   "yab_festival"                                   → "yab_festival"
 *   "instagram.com/yab_festival"                     → "yab_festival"
 *   "www.instagram.com/yab_festival/"                → "yab_festival"
 *   "https://www.instagram.com/yab_festival/?hl=en"  → "yab_festival"
 *   "https://www.facebook.com/yab"                   → null
 *   ""                                               → null
 *   "-"                                              → null
 */
export function normalizeInstagramHandle(raw: string | undefined | null): string | null {
  if (!raw) return null;
  let value = raw.trim();
  if (!value || value === '-') return null;

  // Strip protocol.
  value = value.replace(/^https?:\/\//i, '');

  // If a host is present, only accept Instagram — keep us from
  // accidentally linking to facebook / tiktok / typo'd domains.
  const hostMatch = value.match(/^([^/]+)(\/(.*))?$/i);
  if (hostMatch && /\./.test(hostMatch[1])) {
    const host = hostMatch[1].toLowerCase().replace(/^www\./, '');
    if (host !== 'instagram.com') return null;
    value = hostMatch[3] ?? '';
  }

  // Strip leading @, query string, anchor, surrounding slashes.
  value = value.replace(/^@/, '');
  value = value.split(/[?#]/)[0];
  value = value.replace(/^\/+|\/+$/g, '');
  // Drop any sub-path (e.g. handle/reels/123) — first segment only.
  value = value.split('/')[0];

  // Instagram handles allow letters, numbers, periods, underscores.
  if (!value || !/^[A-Za-z0-9._]+$/.test(value)) return null;
  return value;
}

export function buildInstagramUrl(raw: string | undefined | null): string | null {
  const handle = normalizeInstagramHandle(raw);
  return handle ? `https://www.instagram.com/${handle}` : null;
}
