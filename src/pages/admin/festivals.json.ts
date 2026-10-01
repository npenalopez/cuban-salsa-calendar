import type { APIRoute } from 'astro';
import file from '../../../data/festivals.json';

/**
 * The full file, private notes included, for the admin editor.
 * It lives under /admin/ so Cloudflare Access protects it with the editor.
 */
export const GET: APIRoute = () =>
  new Response(JSON.stringify(file), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
