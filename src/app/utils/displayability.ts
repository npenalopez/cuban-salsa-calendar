/**
 * Why a festival might not show up on the public calendar.
 *
 * The public-facing isDisplayableFestival in App.tsx is derived from
 * this — keeping the rules in one place means the admin tab can show
 * the same answer as the page (and explain WHY a festival is hidden).
 */

import { type Festival } from '../data/festivals';
import { getPrimaryMonth } from './dateUtils';

export type Visibility =
  | { displayed: true }
  | { displayed: false; reason: string };

export function getFestivalVisibility(festival: Festival): Visibility {
  if (!festival || typeof festival !== 'object') {
    return { displayed: false, reason: 'Invalid festival object' };
  }
  if (!festival.name?.trim())      return { displayed: false, reason: 'Missing name' };
  if (!festival.dates?.trim())     return { displayed: false, reason: 'Missing dates' };
  if (!festival.city?.trim())      return { displayed: false, reason: 'Missing city' };
  if (!festival.country?.trim())   return { displayed: false, reason: 'Missing country' };
  if (!festival.continent?.trim()) return { displayed: false, reason: 'Missing continent' };
  const primaryMonth = getPrimaryMonth(festival.dates);
  if (!primaryMonth) {
    return {
      displayed: false,
      reason: `Couldn't parse a month from "${festival.dates}" — add an explicit month name`,
    };
  }
  return { displayed: true };
}
