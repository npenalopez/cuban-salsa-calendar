// Airport names for festival pages (server only; the data file is ~250 KB).
import data from '../../scripts/data/airports.json';
import { km } from './listing';

type Row = [string, string, string, string, number, number, string];
const byCode = new Map((data.airports as Row[]).map((r) => [r[0], r]));

/** "Liverpool John Lennon Airport (LPL)" and the distance from the venue, or null for an unknown code. */
export function airportInfo(code: string | undefined, coords: [number, number] | null) {
  const r = code ? byCode.get(code) : undefined;
  if (!r) return null;
  return { code: r[0], name: r[1], city: r[2], km: coords ? Math.round(km({ lat: coords[0], lng: coords[1] }, { lat: r[4], lng: r[5] })) : null };
}
