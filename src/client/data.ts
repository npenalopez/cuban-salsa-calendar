import festivals from 'virtual:festivals';
import { enrich } from '../lib/festivals';
import type { Enriched } from '../lib/types';

let cache: { key: number; list: Enriched[] } | null = null;

/** All festivals (client fields only), enriched relative to `today`. */
export function allFestivals(today: Date): Enriched[] {
  if (cache?.key !== today.getTime()) cache = { key: today.getTime(), list: enrich(festivals, today) };
  return cache.list;
}
