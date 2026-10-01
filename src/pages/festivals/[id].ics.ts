import type { APIRoute, GetStaticPaths } from 'astro';
import { ALL } from '../../lib/data.server';
import { icsCalendar } from '../../lib/ics';
import type { Enriched } from '../../lib/types';

/** One file per festival with exact days. Static URLs open better than blob downloads in in-app browsers. */
export const getStaticPaths = (() =>
  ALL.filter((f) => f.datePrecision === 'day').map((f) => ({ params: { id: f.id }, props: { f } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const f = props.f as Enriched;
  return new Response(icsCalendar([f], f.name), { headers: { 'Content-Type': 'text/calendar; charset=utf-8' } });
};
