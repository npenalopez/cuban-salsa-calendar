import type { APIRoute, GetStaticPaths } from 'astro';
import { UPCOMING } from '../../lib/data.server';
import { FEED_SLUG, icsCalendar } from '../../lib/ics';

/** Subscription feeds: all upcoming, plus one per region. */
export const getStaticPaths = (() => {
  const regions = [...new Set(UPCOMING.map((f) => f.region))].sort();
  return [
    { params: { slug: 'all' }, props: { name: 'Cuban Salsa Calendar', list: UPCOMING } },
    ...regions.map((r) => ({ params: { slug: FEED_SLUG(r) }, props: { name: `Cuban Salsa Calendar · ${r}`, list: UPCOMING.filter((f) => f.region === r) } })),
  ];
}) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) =>
  new Response(icsCalendar(props.list, props.name), { headers: { 'Content-Type': 'text/calendar; charset=utf-8' } });
