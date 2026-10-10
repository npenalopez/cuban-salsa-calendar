// Country and region names per language, and how to say "in <country>".
import { type Lang, LOCALES, t } from '.';

const names = new Map<string, Intl.DisplayNames>();
/** Country name in the language: English keeps the data's own spelling ("Czech Republic"). */
export function countryName(lang: Lang, code: string | null | undefined, enName: string | null | undefined): string {
  if (lang === 'en' || !code) return enName ?? '';
  if (!names.has(lang)) names.set(lang, new Intl.DisplayNames([LOCALES[lang]], { type: 'region' }));
  try {
    return names.get(lang)!.of(code) ?? enName ?? '';
  } catch {
    return enName ?? '';
  }
}

export const regionName = (lang: Lang, region: string) => t(lang, `region.${region}`);

// French: masculine countries take "au", plurals "aux", Cuba "à"; everything else "en".
const FR_AU = new Set(['CA', 'MX', 'JP', 'PT', 'DK', 'LU', 'VN', 'GB', 'BR', 'PE', 'VE', 'MA', 'CL', 'PA', 'SN', 'KE', 'NG', 'LB', 'QA', 'KW']);
const FR_AUX = new Set(['US', 'AE', 'NL', 'PH']);
const FR_A = new Set(['CU', 'SG', 'MT', 'CY', 'MU', 'MC']);

/** "the Czech Republic" (en, after "in"), "Chequia" (es, after "en"), "en Tchéquie" (fr, with its preposition). */
export function inCountry(lang: Lang, code: string | null | undefined, enName: string | null | undefined): string {
  const name = countryName(lang, code, enName);
  if (lang === 'en') return /^(united|czech|dominican|netherlands|philippines)\b/i.test(name) ? `the ${name}` : name;
  if (lang === 'es') return name;
  const c = (code ?? '').toUpperCase();
  return `${FR_AUX.has(c) ? 'aux' : FR_AU.has(c) ? 'au' : FR_A.has(c) ? 'à' : 'en'} ${name}`;
}

/** Region in the same shape as inCountry: "Europe" / "Europa" / "en Europe". */
export const inRegion = (lang: Lang, region: string) => (lang === 'fr' ? `en ${regionName(lang, region)}` : regionName(lang, region));
