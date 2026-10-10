import type { Style } from './types';

/** Style tags in display order, with the names used on pages and filters. */
export const STYLES: { key: Style; label: string; plural: string }[] = [
  { key: 'casino', label: 'Casino', plural: 'Casino festivals' },
  { key: 'timba', label: 'Timba', plural: 'Timba festivals' },
  { key: 'son', label: 'Son', plural: 'Son festivals' },
  { key: 'rumba', label: 'Rumba', plural: 'Rumba festivals' },
  { key: 'afro-cuban', label: 'Afro-Cuban', plural: 'Afro-Cuban festivals' },
  { key: 'rueda', label: 'Rueda de casino', plural: 'Rueda festivals' },
  { key: 'reggaeton', label: 'Reggaeton and reparto', plural: 'Festivals with reggaeton and reparto' },
  { key: 'mixed', label: 'Mixed styles', plural: 'Mixed festivals with Cuban salsa' },
];

export const styleLabel = (k: string) => STYLES.find((s) => s.key === k)?.label ?? k;
export const isStyle = (k: string): k is Style => STYLES.some((s) => s.key === k);
export const stylePath = (k: Style) => `/style/${k}/`;
