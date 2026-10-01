import file from '../../data/festivals.json';
import { isoD, startOfToday } from './dates';
import { enrich, isListed } from './festivals';
import type { Enriched, FestivalsFile } from './types';

const data = file as unknown as FestivalsFile;

/** Build date. Set BUILD_TODAY=YYYY-MM-DD to preview another day. */
export const TODAY = startOfToday(process.env.BUILD_TODAY);
export const TODAY_ISO = isoD(TODAY);

/** Every published festival (exact dates only), enriched relative to the build date.
 * Includes private fields: never pass whole records to the client. */
export const ALL: Enriched[] = enrich(data.festivals.filter(isListed), TODAY);
export const UPCOMING = ALL.filter((f) => !f.arch);
export const ARCHIVE = ALL.filter((f) => f.arch);
export const DATA_VERSION = data.version;

export function stats() {
  const countries = new Set(UPCOMING.map((f) => f.countryCode).filter(Boolean)).size;
  return { upcoming: UPCOMING.length, countries };
}
