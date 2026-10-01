import type { APIRoute, GetStaticPaths } from 'astro';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { ALL } from '../../lib/data.server';

const require = createRequire(import.meta.url);

/** Only the flags the data uses, copied from the flag-icons package (4:3). */
export const getStaticPaths = (() =>
  [...new Set(ALL.map((f) => f.countryCode?.toLowerCase()).filter(Boolean) as string[])].map((code) => ({ params: { code } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ params }) =>
  new Response(readFileSync(require.resolve(`flag-icons/flags/4x3/${params.code}.svg`)), { headers: { 'Content-Type': 'image/svg+xml' } });
