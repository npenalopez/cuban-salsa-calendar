import type { APIRoute, GetStaticPaths } from 'astro';
import { MON3, dayRange } from '../../lib/dates';
import { ALL, stats } from '../../lib/data.server';
import { place } from '../../lib/festivals';
import { renderOg, type OgCard } from '../../lib/og.server';
import type { Enriched } from '../../lib/types';

function card(f: Enriched): OgCard {
  const y = f.s.getFullYear();
  const mon = f.s.getMonth() === f.e.getMonth() ? MON3[f.s.getMonth()] : `${MON3[f.s.getMonth()]}–${MON3[f.e.getMonth()]}`;
  const big = f.datePrecision === 'day' ? dayRange(f) : f.datePrecision === 'month' ? MON3[f.s.getMonth()] : String(y);
  const bigSub = f.datePrecision === 'day' ? `${mon} ${y}` : f.datePrecision === 'month' ? `${f.dateNote || 'Dates TBA'} · ${y}` : 'Dates TBA';
  return { kicker: 'Cuban Salsa Calendar', big, bigSub, title: f.name, sub: place(f) };
}

export const getStaticPaths = (() => [
  ...ALL.map((f) => ({ params: { id: f.id }, props: { card: card(f) } })),
  { params: { id: 'default' }, props: { card: { kicker: 'Cuban salsa festivals worldwide', big: String(stats().upcoming), bigSub: 'upcoming festivals', title: 'Cuban Salsa Calendar', sub: `Dates, cities and line-ups in ${stats().countries} countries` } } },
]) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) =>
  new Response(Buffer.from(await renderOg(props.card as OgCard)), { headers: { 'Content-Type': 'image/png' } });
