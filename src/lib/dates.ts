import { type Lang, monthInText, monthName, monthShort, t, weekdayShort } from '../i18n';
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

export const monthLabel = (key: string, lang: Lang = 'en') => {
  const [y, m] = key.split('-').map(Number);
  return `${monthName(lang, m - 1)} ${y}`;
};
export const monthPath = (key: string) => `/${key.replace('-', '/')}/`;

type Dated = Pick<Festival, 'datePrecision' | 'dateNote'> & { s: Date; e: Date };

/** "Sat 28 – Sun 29 November 2026", "Mid November 2026", "2026 · dates not announced". */
export function dateLong(f: Dated, lang: Lang = 'en'): string {
  const { s, e } = f;
  const M = (d: Date) => (lang === 'en' ? monthName(lang, d.getMonth()) : monthInText(lang, d.getMonth()));
  const W = (d: Date) => weekdayShort(lang, d.getDay());
  const of = lang === 'es' ? ' de ' : ' ';
  if (f.datePrecision === 'year') return `${s.getFullYear()} · ${t(lang, 'date.notAnnounced')}`;
  if (f.datePrecision === 'month') return `${f.dateNote ? f.dateNote + ' ' : ''}${lang === 'en' ? M(s) : monthName(lang, s.getMonth())} ${s.getFullYear()}`;
  if (s.getTime() === e.getTime()) return `${W(s)} ${s.getDate()}${of}${M(s)}${of}${s.getFullYear()}`;
  const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
  const startTail = sameMonth ? '' : `${of}${M(s)}${s.getFullYear() !== e.getFullYear() ? of + s.getFullYear() : ''}`;
  return `${W(s)} ${s.getDate()}${startTail} – ${W(e)} ${e.getDate()}${of}${M(e)}${of}${e.getFullYear()}`;
}

/** Short date for page titles: "28–29 Nov 2026", "Nov 2026", "2026". */
export function dateShort(f: Dated, lang: Lang = 'en'): string {
  const { s, e } = f;
  const mon = (d: Date) => monthShort(lang, d.getMonth());
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
export function dateBlock(f: Dated, past: boolean, lang: Lang = 'en'): DateBlock {
  const { s, e } = f;
  const M3 = (m: number) => (lang === 'en' ? MON3[m] : monthShort(lang, m).toLocaleUpperCase());
  const W = (d: Date) => weekdayShort(lang, d.getDay());
  if (f.datePrecision === 'year') return { mon: String(s.getFullYear()), days: t(lang, 'date.tba'), sub: '' };
  if (f.datePrecision === 'month') {
    return {
      mon: M3(s.getMonth()),
      days: f.dateNote ? f.dateNote.toUpperCase().slice(0, 5) : t(lang, 'date.tba'),
      sub: past ? String(s.getFullYear()) : t(lang, 'date.daysTba'),
    };
  }
  const one = s.getTime() === e.getTime();
  const sm = s.getMonth();
  const em = e.getMonth();
  return {
    mon: sm === em ? M3(sm) : `${M3(sm)}–${M3(em)}`,
    days: one ? String(s.getDate()) : `${s.getDate()}–${e.getDate()}`,
    sub: past ? String(s.getFullYear()) : one ? W(s) : `${W(s)}–${W(e)}`,
  };
}

/** Day range for compact rows: "28–29", "7", "TBA". */
export function dayRange(f: Dated, lang: Lang = 'en'): string {
  if (f.datePrecision !== 'day') return t(lang, 'date.tba');
  const { s, e } = f;
  return s.getTime() === e.getTime() ? String(s.getDate()) : `${s.getDate()}–${e.getDate()}`;
}

const DAY = 864e5;
export const daysBetween = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / DAY);

/** Card countdown: "In 12 days", "Tomorrow", "Today", "Happening now"; null once it has ended. */
export function countdown(s: Date, e: Date, today: Date, lang: Lang = 'en'): string | null {
  const until = daysBetween(today, s);
  if (until > 1) return t(lang, 'cd.inDays', { n: until });
  if (until === 1) return t(lang, 'cd.tomorrow');
  if (until === 0) return t(lang, 'cd.today');
  return daysBetween(today, e) >= 0 ? t(lang, 'cd.now') : null;
}

/** Festival page line: "starts in 58 days", "starts tomorrow", "happening now", "ended 3 days ago". */
export function countdownLong(s: Date, e: Date, today: Date, lang: Lang = 'en'): string {
  const until = daysBetween(today, s);
  if (until > 1) return t(lang, 'cdl.inDays', { n: until });
  if (until === 1) return t(lang, 'cdl.tomorrow');
  if (until === 0) return t(lang, 'cdl.today');
  const ended = daysBetween(e, today);
  return ended <= 0 ? t(lang, 'cdl.now') : t(lang, 'cdl.ended', { n: ended });
}
