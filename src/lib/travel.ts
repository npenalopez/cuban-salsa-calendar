import type { City } from './types';

/** Dance hubs offered in the Travel times sheet (festival cities are added to the suggestions too): [name, lat, lng]. */
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

export type TravelMode = 'near' | 'car' | 'train' | 'plane';

export interface TravelOption {
  mode: TravelMode;
  /** Time on the road, on the train or in the air */
  hours: number;
  /** Door-to-door estimate used for ranking (adds airport time to flights) */
  doorToDoor: number;
  /** "≈ 2 h 30 drive", "≈ 4 h by train", "≈ 1 h 30 flight", "Nearby" */
  text: string;
}

// Rough landmass boxes: driving or taking the train only makes sense on the same continent.
const inEurope = (lat: number, lng: number) => lat >= 35.5 && lat <= 71.5 && lng >= -10.5 && lng <= 40;
const inNorthAmerica = (lat: number, lng: number) => lat >= 14 && lat <= 72 && lng >= -170 && lng <= -52;

const NEAR_KM = 40;
const AIRPORT_HOURS = 2.5; // getting to the airport, security, boarding, getting out

/**
 * Realistic ways to get from `city` to a festival, fastest door-to-door first. Rough on purpose:
 * straight-line distance with a detour factor and typical speeds, not a route planner.
 */
export function travelOptions(city: City | null, coords: [number, number] | null): TravelOption[] {
  if (!city || !coords) return [];
  const [lat, lng] = coords;
  const km = haversine(city.lat, city.lng, lat, lng);
  if (km < NEAR_KM) return [{ mode: 'near', hours: 0, doorToDoor: 0, text: 'Nearby' }];
  const bothEurope = inEurope(city.lat, city.lng) && inEurope(lat, lng);
  const sameLand = bothEurope || (inNorthAmerica(city.lat, city.lng) && inNorthAmerica(lat, lng));
  const out: TravelOption[] = [];
  if (km <= 1300 && (sameLand || km <= 500)) {
    const h = (km * 1.3) / 80;
    out.push({ mode: 'car', hours: h, doorToDoor: h, text: `≈ ${fmtHours(h)} drive` });
  }
  if (bothEurope && km <= 1100) {
    const h = (km * 1.25) / 110 + 0.5;
    out.push({ mode: 'train', hours: h, doorToDoor: h, text: `≈ ${fmtHours(h)} by train` });
  }
  if (km >= 250) {
    const h = km / 750 + 0.75;
    out.push({ mode: 'plane', hours: h, doorToDoor: h + AIRPORT_HOURS, text: `≈ ${fmtHours(h)} flight` });
  }
  return out.sort((a, b) => a.doorToDoor - b.doorToDoor);
}

/** The most practical option, for cards and sorting. */
export const bestTravel = (city: City | null, coords: [number, number] | null): TravelOption | null =>
  travelOptions(city, coords)[0] ?? null;

/** "from Zurich", "from your location" */
export const fromCity = (city: City) => `from ${city.name}`;
