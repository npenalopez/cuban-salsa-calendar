import type { City } from './types';

/** Dance hubs offered in the Travel times sheet: [name, lat, lng]. */
export const CITIES: [string, number, number][] = [
  ['Amsterdam', 52.37, 4.9], ['Athens', 37.98, 23.73], ['Barcelona', 41.39, 2.17], ['Berlin', 52.52, 13.4],
  ['Dubai', 25.2, 55.27], ['Havana', 23.11, -82.37], ['Lisbon', 38.72, -9.14], ['London', 51.51, -0.13],
  ['Madrid', 40.42, -3.7], ['Melbourne', -37.81, 144.96], ['Mexico City', 19.43, -99.13], ['Miami', 25.76, -80.19],
  ['Milan', 45.46, 9.19], ['Montreal', 45.5, -73.57], ['Munich', 48.14, 11.58], ['New York', 40.71, -74.01],
  ['Oslo', 59.91, 10.75], ['Paris', 48.86, 2.35], ['Rome', 41.9, 12.5], ['Stockholm', 59.33, 18.07],
  ['Sydney', -33.87, 151.21], ['Tokyo', 35.68, 139.69], ['Toronto', 43.65, -79.38], ['Vienna', 48.21, 16.37],
  ['Warsaw', 52.23, 21.01], ['Zurich', 47.38, 8.54],
];

/** Great-circle distance in km. */
export function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const r = (x: number) => (x * Math.PI) / 180;
  const h = Math.sin(r(lat2 - lat1) / 2) ** 2 + Math.cos(r(lat1)) * Math.cos(r(lat2)) * Math.sin(r(lng2 - lng1) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
}

/** Hours rounded to the nearest half hour: "2 h 30", "3 h". */
export function fmtHours(h: number): string {
  const t = Math.max(0.5, Math.round(h * 2) / 2);
  return `${Math.floor(t)} h${t % 1 ? ' 30' : ''}`;
}

export function travel(city: City | null, coords: [number, number] | null): string | null {
  if (!city || !coords) return null;
  const km = haversine(city.lat, city.lng, coords[0], coords[1]);
  if (km < 40) return `Near ${city.name}`;
  if (km < 450) return `≈ ${fmtHours(km / 75)} drive from ${city.name}`;
  return `≈ ${fmtHours(km / 750 + 0.75)} flight from ${city.name}`;
}
