// Languages: English at the root, Spanish under /es/, French under /fr/.
// UI strings live in strings.ts; festival data (names, descriptions) stays as entered.
import { STRINGS, type Key } from './strings';

export type Lang = 'en' | 'es' | 'fr';
export const LANGS: Lang[] = ['en', 'es', 'fr'];
export const LANG_NAMES: Record<Lang, string> = { en: 'English', es: 'Español', fr: 'Français' };
export const LOCALES: Record<Lang, string> = { en: 'en-GB', es: 'es-ES', fr: 'fr-FR' };
export const isLang = (s: string | undefined): s is Lang => !!s && (LANGS as string[]).includes(s);

/** A site path in a language: "/festivals/x/" → "/es/festivals/x/". */
export const lp = (lang: Lang, path: string) => (lang === 'en' ? path : `/${lang}${path === '/' ? '/' : path}`);
/** The language-free path: "/es/festivals/x/" → "/festivals/x/". */
export const basePath = (path: string) => path.replace(/^\/(es|fr)(?=\/|$)/, '') || '/';
/** The language of a path. */
export const langOf = (path: string): Lang => (path.match(/^\/(es|fr)(?=\/|$)/)?.[1] as Lang) ?? 'en';

/**
 * A UI string with {placeholders} filled in. Plurals: pass `n`, and the key's `.one` / `.other`
 * variants are used ("festivals" → "festivals.one" / "festivals.other").
 */
export function t(lang: Lang, key: Key | string, vars: Record<string, string | number> = {}): string {
  const dict = STRINGS[lang] as Record<string, string>;
  const en = STRINGS.en as Record<string, string>;
  let k = key as string;
  if (typeof vars.n === 'number' && (`${k}.one` in en)) k = `${k}.${new Intl.PluralRules(LOCALES[lang]).select(vars.n) === 'one' ? 'one' : 'other'}`;
  const s = dict[k] ?? en[k] ?? k;
  return s.replace(/\{(\w+)\}/g, (_, v) => (v in vars ? String(vars[v]) : `{${v}}`));
}

const cap = (s: string) => s.charAt(0).toLocaleUpperCase() + s.slice(1);
const fmt = (lang: Lang, o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(LOCALES[lang], o);
const cache = new Map<string, string[]>();
function names(lang: Lang, kind: 'month' | 'mon' | 'wd'): string[] {
  const k = `${lang}:${kind}`;
  if (!cache.has(k)) {
    const list =
      kind === 'wd'
        ? Array.from({ length: 7 }, (_, i) => fmt(lang, { weekday: 'short' }).format(new Date(2024, 0, 7 + i)).replace('.', ''))
        : Array.from({ length: 12 }, (_, i) => fmt(lang, { month: kind === 'month' ? 'long' : 'short' }).format(new Date(2024, i, 15)).replace('.', ''));
    cache.set(k, list.map(cap));
  }
  return cache.get(k)!;
}
const EN_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const EN_WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
/** "October" / "Octubre" / "Octobre" (capitalised, for headings). */
export const monthName = (lang: Lang, m: number) => (lang === 'en' ? EN_MONTHS[m] : names(lang, 'month')[m]);
/** "Oct" / "Oct" / "Oct". */
export const monthShort = (lang: Lang, m: number) => (lang === 'en' ? EN_MONTHS[m].slice(0, 3) : names(lang, 'mon')[m]);
/** "Sun" / "Dom" / "Dim". */
export const weekdayShort = (lang: Lang, d: number) => (lang === 'en' ? EN_WD[d] : names(lang, 'wd')[d]);
/** Month in running text: "October" in English, "octubre" / "octobre" otherwise. */
export const monthInText = (lang: Lang, m: number) => (lang === 'en' ? monthName(lang, m) : monthName(lang, m).toLocaleLowerCase(LOCALES[lang]));

export type { Key };
