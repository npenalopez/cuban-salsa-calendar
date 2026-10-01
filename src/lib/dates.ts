import type { Festival } from './types';

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const MON3 = MONTHS.map((m) => m.slice(0, 3).toUpperCase());
export const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const pad = (n: number) => String(n).padStart(2, '0');

/** Parse "YYYY-MM-DD" as a local date (no timezone shift). */
export const pISO = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};
export const isoD = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const ymd = (d: Date) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
export const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
/** "YYYY-MM" for a 0-based month. */
export const mkey = (y: number, m: number) => `${y}-${pad(m + 1)}`;
export const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`;

export function startOfToday(override?: string): Date {
  if (override && /^\d{4}-\d{2}-\d{2}$/.test(override)) return pISO(override);
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export interface MonthRef {
  y: number;
  /** 0-based */
  m: number;
  key: string;
}

/** The 12 months starting with today's month. */
export function months12(today: Date): MonthRef[] {
  const out: MonthRef[] = [];
  for (let i = 0; i < 12; i++) {
    const y = today.getFullYear() + Math.floor((today.getMonth() + i) / 12);
    const m = (today.getMonth() + i) % 12;
    out.push({ y, m, key: mkey(y, m) });
  }
  return out;
}

export const monthLabel = (key: string) => {
  const [y, m] = key.split('-').map(Number);
  return `${MONTHS[m - 1]} ${y}`;
};
export const monthPath = (key: string) => `/${key.replace('-', '/')}/`;

type Dated = Pick<Festival, 'datePrecision' | 'dateNote'> & { s: Date; e: Date };

/** "Sat 28 – Sun 29 November 2026", "Mid November 2026", "2026 · dates not announced". */
export function dateLong(f: Dated): string {
  const { s, e } = f;
  if (f.datePrecision === 'year') return `${s.getFullYear()} · dates not announced`;
  if (f.datePrecision === 'month') return `${f.dateNote ? f.dateNote + ' ' : ''}${MONTHS[s.getMonth()]} ${s.getFullYear()}`;
  if (s.getTime() === e.getTime()) return `${WD[s.getDay()]} ${s.getDate()} ${MONTHS[s.getMonth()]} ${s.getFullYear()}`;
  const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
  const startTail = sameMonth ? '' : ` ${MONTHS[s.getMonth()]}${s.getFullYear() !== e.getFullYear() ? ' ' + s.getFullYear() : ''}`;
  return `${WD[s.getDay()]} ${s.getDate()}${startTail} – ${WD[e.getDay()]} ${e.getDate()} ${MONTHS[e.getMonth()]} ${e.getFullYear()}`;
}

/** Short date for page titles: "28–29 Nov 2026", "Nov 2026", "2026". */
export function dateShort(f: Dated): string {
  const { s, e } = f;
  const mon = (d: Date) => MONTHS[d.getMonth()].slice(0, 3);
  if (f.datePrecision === 'year') return String(s.getFullYear());
  if (f.datePrecision === 'month') return `${mon(s)} ${s.getFullYear()}`;
  if (s.getTime() === e.getTime()) return `${s.getDate()} ${mon(s)} ${s.getFullYear()}`;
  if (s.getMonth() === e.getMonth()) return `${s.getDate()}–${e.getDate()} ${mon(s)} ${e.getFullYear()}`;
  return `${s.getDate()} ${mon(s)} – ${e.getDate()} ${mon(e)} ${e.getFullYear()}`;
}

export interface DateBlock {
  mon: string;
  days: string;
  sub: string;
}

/** The three lines of the card's date block. */
export function dateBlock(f: Dated, past: boolean): DateBlock {
  const { s, e } = f;
  if (f.datePrecision === 'year') return { mon: String(s.getFullYear()), days: 'TBA', sub: '' };
  if (f.datePrecision === 'month') {
    return {
      mon: MON3[s.getMonth()],
      days: f.dateNote ? f.dateNote.toUpperCase().slice(0, 5) : 'TBA',
      sub: past ? String(s.getFullYear()) : 'Days TBA',
    };
  }
  const one = s.getTime() === e.getTime();
  const sm = s.getMonth();
  const em = e.getMonth();
  return {
    mon: sm === em ? MON3[sm] : `${MON3[sm]}–${MON3[em]}`,
    days: one ? String(s.getDate()) : `${s.getDate()}–${e.getDate()}`,
    sub: past ? String(s.getFullYear()) : one ? WD[s.getDay()] : `${WD[s.getDay()]}–${WD[e.getDay()]}`,
  };
}

/** Day range for compact rows: "28–29", "7", "TBA". */
export function dayRange(f: Dated): string {
  if (f.datePrecision !== 'day') return 'TBA';
  const { s, e } = f;
  return s.getTime() === e.getTime() ? String(s.getDate()) : `${s.getDate()}–${e.getDate()}`;
}

const DAY = 864e5;
export const daysBetween = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / DAY);
