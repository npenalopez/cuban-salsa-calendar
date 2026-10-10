import { describe, expect, it } from 'vitest';
import { countdown, countdownLong, dateBlock, dateLong, dateShort, months12, pISO } from './dates';
import { cardVM, enrich, fmtPrice, isListed, localPriceText, priceLabel } from './festivals';
import { basePath, langOf, lp, t } from '../i18n';
import { inCountry } from '../i18n/places';
import { calUrls, icsCalendar } from './ics';
import { computeView, DEFAULT_FILTERS, filtersQuery, km, parseFilters, styleOptions } from './listing';
import { didYouMean, suggestions } from './search';
import { artistKind, artistPath, canonicalArtist, canonicalLineup, pagedArtistSlugs, peopleOf } from './artists';
import { artistPages } from './artistPages';
import { bestTravel, fmtHours, travelOptions } from './travel';
import { countryPath, eventLd, festivalTitle, inName, landingIntro, landings, regionPath, relatedFor, slugify } from './seo';
import type { Festival } from './types';

const base: Festival = {
  id: 'x-2026', series: 'x', name: 'X Fest', status: 'scheduled', startDate: '2026-10-09', endDate: '2026-10-12', datePrecision: 'day',
  dateNote: null, city: 'Kraków', country: 'Poland', countryCode: 'PL', region: 'Europe', venue: null, coordinates: [50.06, 19.94],
  priceText: null, priceFrom: null, currency: null, ticketUrl: null, website: null, artists: [], featured: false,
};
const mk = (p: Partial<Festival>): Festival => ({ ...base, ...p });
const d = (s: string, e: string, datePrecision: Festival['datePrecision'] = 'day', dateNote: string | null = null) => ({ s: pISO(s), e: pISO(e), datePrecision, dateNote });
const TODAY = pISO('2026-10-01');

describe('dateLong', () => {
  it('same month', () => expect(dateLong(d('2026-11-28', '2026-11-29'))).toBe('Sat 28 – Sun 29 November 2026'));
  it('cross month', () => expect(dateLong(d('2026-10-30', '2026-11-01'))).toBe('Fri 30 October – Sun 1 November 2026'));
  it('cross year', () => expect(dateLong(d('2026-12-31', '2027-01-02'))).toBe('Thu 31 December 2026 – Sat 2 January 2027'));
  it('single day', () => expect(dateLong(d('2026-10-07', '2026-10-07'))).toBe('Wed 7 October 2026'));
  it('month precision', () => expect(dateLong(d('2026-11-01', '2026-11-30', 'month', 'Mid'))).toBe('Mid November 2026'));
  it('year precision', () => expect(dateLong(d('2026-01-01', '2026-12-31', 'year'))).toBe('2026 · dates not announced'));
});

describe('dateShort', () => {
  it('same month', () => expect(dateShort(d('2026-11-28', '2026-11-29'))).toBe('28–29 Nov 2026'));
  it('cross month', () => expect(dateShort(d('2026-10-30', '2026-11-01'))).toBe('30 Oct – 1 Nov 2026'));
});

describe('dateBlock', () => {
  it('same month', () => expect(dateBlock(d('2026-10-09', '2026-10-12'), false)).toEqual({ mon: 'OCT', days: '9–12', sub: 'Fri–Mon' }));
  it('cross month', () => expect(dateBlock(d('2026-10-30', '2026-11-01'), false)).toEqual({ mon: 'OCT–NOV', days: '30–1', sub: 'Fri–Sun' }));
  it('cross year', () => expect(dateBlock(d('2026-12-31', '2027-01-02'), false)).toEqual({ mon: 'DEC–JAN', days: '31–2', sub: 'Thu–Sat' }));
  it('single day', () => expect(dateBlock(d('2026-10-07', '2026-10-07'), false)).toEqual({ mon: 'OCT', days: '7', sub: 'Wed' }));
  it('past shows the year', () => expect(dateBlock(d('2025-10-09', '2025-10-12'), true).sub).toBe('2025'));
  it('month precision with note', () => expect(dateBlock(d('2026-11-01', '2026-11-30', 'month', 'Early'), false)).toEqual({ mon: 'NOV', days: 'EARLY', sub: 'Days TBA' }));
  it('month precision without note', () => expect(dateBlock(d('2026-11-01', '2026-11-30', 'month'), false).days).toBe('TBA'));
  it('year precision', () => expect(dateBlock(d('2026-01-01', '2026-12-31', 'year'), false)).toEqual({ mon: '2026', days: 'TBA', sub: '' }));
});

describe('countdown', () => {
  const t = pISO('2026-10-01');
  it('days ahead', () => expect(countdown(pISO('2026-10-13'), pISO('2026-10-15'), t)).toBe('In 12 days'));
  it('tomorrow', () => expect(countdown(pISO('2026-10-02'), pISO('2026-10-04'), t)).toBe('Tomorrow'));
  it('today', () => expect(countdown(t, pISO('2026-10-03'), t)).toBe('Today'));
  it('happening now', () => expect(countdown(pISO('2026-09-30'), pISO('2026-10-02'), t)).toBe('Happening now'));
  it('last day is still happening', () => expect(countdown(pISO('2026-09-28'), t, t)).toBe('Happening now'));
  it('over', () => expect(countdown(pISO('2026-09-20'), pISO('2026-09-22'), t)).toBeNull());
  it('long form', () => {
    expect(countdownLong(pISO('2026-11-28'), pISO('2026-11-29'), t)).toBe('starts in 58 days');
    expect(countdownLong(pISO('2026-09-20'), pISO('2026-09-28'), t)).toBe('ended 3 days ago');
    expect(countdownLong(pISO('2026-09-29'), pISO('2026-10-02'), t)).toBe('happening now');
  });
});

describe('artists', () => {
  it('variant spellings resolve to one name', () => {
    expect(canonicalArtist('Yusimi Moya')).toBe('Yusimi Moya Rodríguez');
    expect(canonicalArtist('YUSIMI MOYA')).toBe('Yusimi Moya Rodríguez');
    expect(canonicalArtist('jonar gonzalez')).toBe('Jonar González');
  });
  it('unknown names pass through', () => expect(canonicalArtist(' Someone New ')).toBe('Someone New'));
  it('line-ups are deduplicated after resolving', () =>
    expect(canonicalLineup(['Yusimi Moya', 'Yusimi Moya Rodríguez', 'Osbanis y Anneta'])).toEqual(['Osbanis & Anneta', 'Yusimi Moya Rodríguez']));
  it('couples credit each member once', () =>
    expect(peopleOf(['Osbanis & Anneta', 'Osbanis Tejeda', 'Jorge & Indira'])).toEqual(['Osbanis Tejeda', 'Anneta Kepka', 'Jorge & Indira']));
});

describe('months12', () => {
  it('wraps the year', () => {
    const m = months12(pISO('2026-10-15'));
    expect(m).toHaveLength(12);
    expect(m[0].key).toBe('2026-10');
    expect(m[3].key).toBe('2027-01');
    expect(m[11].key).toBe('2027-09');
  });
});

describe('fmtPrice', () => {
  it('known currency', () => expect(fmtPrice({ priceFrom: 59, currency: 'EUR', priceText: 'x' })).toBe('from €59'));
  it('other currency', () => expect(fmtPrice({ priceFrom: 470, currency: 'PLN', priceText: 'x' })).toBe('from PLN 470'));
  it('thousands', () => expect(fmtPrice({ priceFrom: 1200, currency: 'USD', priceText: 'x' })).toBe('from US$1,200'));
  it('free text only', () => expect(fmtPrice({ priceFrom: null, currency: null, priceText: 'TBA soon' })).toBe('TBA soon'));
});

describe('travel', () => {
  const zurich = { name: 'Zurich', lat: 47.38, lng: 8.54 };
  const modes = (c: [number, number]) => travelOptions(zurich, c).map((o) => o.mode);
  it('nearby', () => expect(modes([47.4, 8.5])).toEqual(['near']));
  it('short trip: car first, no plane', () => {
    expect(modes([47.56, 7.59])[0]).toBe('car'); // Basel
    expect(modes([47.56, 7.59])).not.toContain('plane');
  });
  it('Zurich to Munich (240 km): train first, then car, no flight', () => expect(modes([48.14, 11.58])).toEqual(['train', 'car']));
  it('Zurich to Barcelona: all three, flight fastest', () => {
    const m = modes([41.39, 2.17]);
    expect(m).toEqual(expect.arrayContaining(['car', 'train', 'plane']));
    expect(m[0]).toBe('plane');
  });
  it('across the ocean: plane only', () => expect(modes([40.71, -74.01])).toEqual(['plane']));
  it('Canary Islands: no train', () => expect(modes([28.29, -16.63])).not.toContain('train'));
  it('text', () => expect(bestTravel(zurich, [41.39, 2.17])?.text).toMatch(/^≈ \d h( 30)? flight$/));
  it('rounds to half hours', () => expect(fmtHours(2.4)).toBe('2 h 30'));
  it('minimum half hour', () => expect(fmtHours(0.1)).toBe('0 h 30'));
});

describe('cardVM', () => {
  it('meta: no line-up, no price', () => {
    const [f] = enrich([mk({})], TODAY);
    expect(cardVM(f, [f], null).meta).toBe('Line-up and prices not announced');
  });
  it('meta: price and artists', () => {
    const [f] = enrich([mk({ artists: ['A', 'B', 'C', 'D'], priceText: '€59', priceFrom: 59, currency: 'EUR' })], TODAY);
    const c = cardVM(f, [f], null);
    expect(c.meta).toBe('from €59');
    expect(c.artists).toEqual(['A', 'B', 'C']);
    expect(c.moreArtists).toBe(1);
  });
  it('meta: a starting price without price text counts as announced', () => {
    const [f] = enrich([mk({ artists: ['A'], priceFrom: 109, currency: 'EUR' })], TODAY);
    expect(cardVM(f, [f], null).meta).toBe('from €109');
    expect(priceLabel(f)).toBe('From €109');
  });
  it('never falls back to the website for Get passes', () => {
    const [f] = enrich([mk({ website: 'https://x.example' })], TODAY);
    expect(cardVM(f, [f], null).ticket).toBeNull();
  });
  it('past with a next edition', () => {
    const list = enrich([mk({ id: 'x-2025', startDate: '2025-10-09', endDate: '2025-10-12' }), mk({})], TODAY);
    const c = cardVM(list[0], list, null);
    expect(c.meta).toBe('Took place · next edition listed');
    expect(c.showSave).toBe(false);
    expect(c.showCal).toBe(false);
  });
  it('postponed hides artists and calendar', () => {
    const [f] = enrich([mk({ status: 'postponed', artists: ['A'] })], TODAY);
    const c = cardVM(f, [f], null);
    expect(c.artists).toEqual([]);
    expect(c.showCal).toBe(false);
    expect(c.badge?.text).toBe('Postponed');
  });
  it('countdown leads the meta line', () => {
    const [f] = enrich([mk({ artists: ['A'], priceText: '€59', priceFrom: 59, currency: 'EUR' })], TODAY);
    expect(cardVM(f, [f], null, TODAY).meta).toBe('In 8 days · from €59');
  });
  it('no countdown for postponed festivals', () => {
    const [f] = enrich([mk({ status: 'postponed' })], TODAY);
    expect(cardVM(f, [f], null, TODAY).meta).toBe('New dates not announced');
  });
  it('featured stays off while the flag is off', () => {
    const [f] = enrich([mk({ featured: true })], TODAY);
    expect(cardVM(f, [f], null).badge).toBeNull();
  });
});

describe('listing', () => {
  const list = enrich(
    [
      mk({ id: 'a', name: 'Alpha', startDate: '2026-10-09', endDate: '2026-10-11', city: 'Havana', country: 'Cuba', countryCode: 'CU', region: 'North America', artists: ['Yusimí Moya'] }),
      mk({ id: 'b', name: 'Beta', startDate: '2026-11-01', endDate: '2026-11-02' }),
      mk({ id: 'c', name: 'Gamma', startDate: '2026-01-01', endDate: '2026-12-31', datePrecision: 'year' }),
      mk({ id: 'd', name: 'Delta', startDate: '2025-05-01', endDate: '2025-05-02' }),
    ],
    TODAY,
  );
  it('month page shows only that month', () => {
    const v = computeView(list, TODAY, { name: 'month', key: null }, DEFAULT_FILTERS, [], null);
    expect(v.title).toBe('October');
    expect(v.total).toBe(1);
  });
  it('accent-insensitive search across artists', () => {
    const v = computeView(list, TODAY, { name: 'month', key: null }, { ...DEFAULT_FILTERS, q: 'yusimi' }, [], null);
    expect(v.mode).toBe('search');
    expect(v.sections[0].items.map((x) => x.id)).toEqual(['a']);
  });
  it('archive holds past festivals', () => {
    const v = computeView(list, TODAY, { name: 'archive' }, DEFAULT_FILTERS, [], null);
    expect(v.sections.flatMap((s) => s.items).map((x) => x.id)).toEqual(['d']);
  });
  it('only exact-date festivals are published', () => {
    expect(list.filter(isListed).map((x) => x.id)).toEqual(['a', 'b', 'd']);
  });
  it('where filter by country', () => {
    const v = computeView(list, TODAY, { name: 'all' }, { ...DEFAULT_FILTERS, where: 'country:CU' }, [], null);
    expect(v.total).toBe(1);
  });
  it('nearest first with a travel city', () => {
    const zurich = { name: 'Zurich', lat: 47.38, lng: 8.54 };
    const near = list.map((x) => ({ ...x, coordinates: (x.id === 'b' ? [47.4, 8.6] : [41.39, 2.17]) as [number, number] }));
    const v = computeView(near, TODAY, { name: 'all' }, { ...DEFAULT_FILTERS, sort: 'near' }, [], null, zurich);
    expect(v.sections[0].title).toBe('Nearest first');
    expect(v.sections[0].items[0].id).toBe('b');
  });
  it('nearest first without a city falls back to dates', () => {
    const v = computeView(list.filter(isListed), TODAY, { name: 'all' }, { ...DEFAULT_FILTERS, sort: 'near' }, [], null, null);
    expect(v.sections[0].title).toBe('October 2026');
  });
  it('query string round trip', () => {
    const f = { ...DEFAULT_FILTERS, q: 'havana', where: 'region:Europe', when: '90' as const, sort: 'name' as const };
    expect(parseFilters(filtersQuery(f))).toEqual(f);
  });
  it('suggestions escape regex characters', () => {
    expect(() => suggestions(list.filter((x) => !x.arch), '(*', [])).not.toThrow();
  });
  it('did you mean', () => expect(didYouMean(list, 'havanna')).toBe('Havana'));
});

describe('ics', () => {
  const [f] = enrich([mk({ name: 'X, Fest; 2026', artists: ['A'] })], TODAY);
  const body = icsCalendar([f], 'Test', pISO('2026-10-01'));
  it('end date is exclusive', () => expect(body).toContain('DTEND;VALUE=DATE:20261013'));
  it('escapes text', () => expect(body).toContain('SUMMARY:X\\, Fest\\; 2026'));
  it('stable uid and two alarms', () => {
    expect(body).toContain('UID:x-2026@cubansalsacalendar.com');
    expect(body.match(/BEGIN:VALARM/g)).toHaveLength(2);
  });
  it('lines are folded to 75 octets', () => {
    expect(body.split('\r\n').every((l) => new TextEncoder().encode(l).length <= 75)).toBe(true);
  });
  it('skips non-day precision', () => {
    const [y] = enrich([mk({ datePrecision: 'year', startDate: '2026-01-01', endDate: '2026-12-31' })], TODAY);
    expect(icsCalendar([y], 'T')).not.toContain('BEGIN:VEVENT');
  });
  it('calendar URLs use exclusive end', () => {
    const u = calUrls(f);
    expect(u.google).toContain('dates=20261009/20261013');
    expect(u.outlook).toContain('startdt=2026-10-09&enddt=2026-10-13');
  });
});

describe('seo', () => {
  it('slugs, paths and "the" for country names', () => {
    expect(slugify('Côte d’Ivoire & Co')).toBe('cote-d-ivoire-and-co');
    expect(countryPath('United Kingdom')).toBe('/country/united-kingdom/');
    expect(regionPath('North America')).toBe('/region/north-america/');
    expect(inName('Czech Republic')).toBe('the Czech Republic');
    expect(inName('Germany')).toBe('Germany');
  });

  it('festival titles lead with name and year, without repeating the year', () => {
    const [a, b] = enrich([mk({}), mk({ id: 'y-2026', name: 'Ruedamania 2026' })], TODAY);
    expect(festivalTitle(a)).toBe('X Fest 2026: Cuban Salsa Festival in Kraków, Poland');
    expect(festivalTitle(b)).toBe('Ruedamania 2026: Cuban Salsa Festival in Kraków, Poland');
  });

  it('builds country, region and year pages with upcoming and past split', () => {
    const all = enrich([mk({}), mk({ id: 'old', startDate: '2026-03-01', endDate: '2026-03-02' }), mk({ id: 'de', country: 'Germany', countryCode: 'DE', city: 'Berlin', startDate: '2027-01-08', endDate: '2027-01-10' })], TODAY);
    const ls = landings(all);
    const pl = ls.find((l) => l.path === '/country/poland/')!;
    expect(pl.upcoming.map((f) => f.id)).toEqual(['x-2026']);
    expect(pl.past.map((f) => f.id)).toEqual(['old']);
    expect(ls.find((l) => l.path === '/region/europe/')!.upcoming).toHaveLength(2);
    expect(ls.filter((l) => l.kind === 'year').map((l) => l.path)).toEqual(['/2026/', '/2027/']);
    expect(landingIntro(pl)).toBe('One Cuban salsa festival is coming up in Poland, in Kraków.');
    expect(relatedFor(pl, ls)[0].links.map((x) => x.href)).toEqual(['/country/germany/']);
  });

  it('Event JSON-LD: every performer, offers only while upcoming, postponed status', () => {
    const [f, past, pp] = enrich([
      mk({ artists: ['Ana', 'Leo & Mia', 'Orquesta Z'], ticketUrl: 'https://t.example', priceFrom: 99, currency: 'EUR' }),
      mk({ id: 'p', startDate: '2026-03-01', endDate: '2026-03-02', ticketUrl: 'https://t.example', priceFrom: 99, currency: 'EUR' }),
      mk({ id: 'pp', status: 'postponed' }),
    ], TODAY);
    const ld = eventLd(f) as any;
    expect(ld.performer.map((p: any) => p['@type'])).toEqual(['Person', 'PerformingGroup', 'PerformingGroup']);
    expect(ld.offers).toMatchObject({ url: 'https://t.example', price: 99, priceCurrency: 'EUR', availability: 'https://schema.org/InStock' });
    expect(ld.startDate).toBe('2026-10-09');
    expect((eventLd(past) as any).offers).toBeUndefined();
    expect((eventLd(pp) as any).eventStatus).toBe('https://schema.org/EventPostponed');
  });
});

describe('styles, Cuban focus and new sorts', () => {
  const list = enrich([
    mk({ id: 'a', name: 'A', styles: ['timba', 'casino'], cubanFocused: true, startDate: '2026-10-09', endDate: '2026-10-10', coordinates: [50.06, 19.94] }),
    mk({ id: 'b', name: 'B', styles: ['casino', 'mixed'], cubanFocused: false, startDate: '2026-10-20', endDate: '2026-10-25', coordinates: [40.42, -3.7] }),
    mk({ id: 'c', name: 'C', startDate: '2026-11-01', endDate: '2026-11-03', coordinates: [52.52, 13.4] }),
  ], TODAY);
  const ids = (f: Partial<typeof DEFAULT_FILTERS>, me = null as null | { lat: number; lng: number }) =>
    computeView(list, TODAY, { name: 'all' }, { ...DEFAULT_FILTERS, ...f }, [], null, null, me).sections.flatMap((s) => s.items.map((x) => x.id));

  it('parses and writes style, cuban and the new sorts', () => {
    const f = parseFilters('?style=timba&cuban=1&sort=length');
    expect(f).toMatchObject({ style: 'timba', cuban: true, sort: 'length' });
    expect(filtersQuery(f)).toBe('?style=timba&cuban=1&sort=length');
    expect(parseFilters('?style=salsa&sort=nope')).toMatchObject({ style: '', sort: 'date' });
  });

  it('filters by style and Cuban focus', () => {
    expect(ids({ style: 'casino' })).toEqual(['a', 'b']);
    expect(ids({ cuban: true })).toEqual(['a']);
  });

  it('sorts by length and by distance from the visitor, falling back to date without a location', () => {
    expect(ids({ sort: 'length' })).toEqual(['b', 'c', 'a']);
    expect(ids({ sort: 'me' }, { lat: 52.4, lng: 13.1 })).toEqual(['c', 'a', 'b']);
    expect(ids({ sort: 'me' })).toEqual(['a', 'b', 'c']);
    expect(km({ lat: 52.52, lng: 13.4 }, { lat: 48.86, lng: 2.35 })).toBeGreaterThan(870);
    expect(km({ lat: 52.52, lng: 13.4 }, { lat: 48.86, lng: 2.35 })).toBeLessThan(885);
  });

  it('style pages exist only for styles in use; mixed festivals are titled "Salsa Festival"', () => {
    const paths = landings(list).filter((l) => l.kind === 'style').map((l) => l.path);
    expect(paths).toEqual(['/style/casino/', '/style/timba/', '/style/mixed/']);
    expect(festivalTitle(list[1])).toBe('B 2026: Salsa Festival in Kraków, Poland');
    expect(festivalTitle(list[2])).toBe('C 2026: Cuban Salsa Festival in Kraków, Poland');
    expect(styleOptions(list.filter((x) => !x.arch)).map((o) => [o.value, o.n])).toEqual([['casino', 2], ['timba', 1], ['mixed', 1]]);
  });
});

describe('artist pages', () => {
  it('kinds, paths and the one-word rule', () => {
    expect(artistKind('DJ Charanga')).toBe('dj');
    expect(artistKind('Seo & Eneris')).toBe('couple');
    expect(artistKind('Elito Revé y su Charangón')).toBe('group');
    expect(artistKind('Adonis Santiago')).toBe('person');
    expect(artistPath('Ana & José')).toBe('/artists/ana-and-jose/');
    expect(artistPath('Wilmer & Maria')).toBe('/artists/wilmer-y-maria/'); // alias of the registry name
    const paged = pagedArtistSlugs([['Cristian', 'Ana Paz'], ['Cristian', 'Solo'], ['Ana Paz']]);
    expect(paged.has('cristian')).toBe(false); // one word, two festivals: maybe two people
    expect(paged.has('solo')).toBe(true); // one word, one festival
    expect(paged.has('ana-paz')).toBe(true);
  });

  it('collects upcoming and past festivals; accent variants share one page', () => {
    const list = enrich([
      mk({ id: 'a', artists: ['José Pérez', 'Osbanis & Anneta'] }),
      mk({ id: 'b', startDate: '2026-03-01', endDate: '2026-03-02', artists: ['Jose Perez'] }),
    ], TODAY);
    const pages = artistPages(list);
    const jose = pages.find((p) => p.slug === 'jose-perez')!;
    expect(jose.upcoming.map((h) => h.f.id)).toEqual(['a']);
    expect(jose.past.map((h) => h.f.id)).toEqual(['b']);
    const anneta = pages.find((p) => p.slug === 'anneta-kepka')!;
    expect(anneta.upcoming[0].via).toBe('Osbanis & Anneta');
    expect(anneta.memberOf).toEqual(['Osbanis & Anneta']);
  });
});

describe('i18n', () => {
  it('translates strings with plurals and falls back to English', () => {
    expect(t('es', 'n.festivals', { n: 1 })).toBe('1 festival');
    expect(t('es', 'n.festivals', { n: 3 })).toBe('3 festivales');
    expect(t('fr', 'cd.inDays', { n: 2 })).toBe('Dans 2 jours');
    expect(t('fr', 'no.such.key')).toBe('no.such.key');
  });
  it('paths, languages and country phrases', () => {
    expect(lp('es', '/festivals/x/')).toBe('/es/festivals/x/');
    expect(lp('en', '/festivals/x/')).toBe('/festivals/x/');
    expect(basePath('/fr/country/germany/')).toBe('/country/germany/');
    expect(langOf('/es/')).toBe('es');
    expect(inCountry('fr', 'US', 'United States')).toBe('aux États-Unis');
    expect(inCountry('fr', 'MX', 'Mexico')).toBe('au Mexique');
    expect(inCountry('fr', 'CU', 'Cuba')).toBe('à Cuba');
    expect(inCountry('es', 'DE', 'Germany')).toBe('Alemania');
    expect(inCountry('en', 'GB', 'United Kingdom')).toBe('the United Kingdom');
  });
  it('dates and prices per language; English unchanged', () => {
    const [f] = enrich([mk({ startDate: '2026-11-13', endDate: '2026-11-15', priceText: 'From €130' })], TODAY);
    expect(dateLong(f)).toBe('Fri 13 – Sun 15 November 2026');
    expect(dateLong(f, 'es')).toBe('Vie 13 – Dom 15 de noviembre de 2026');
    expect(dateLong(f, 'fr')).toBe('Ven 13 – Dim 15 novembre 2026');
    expect(priceLabel(f, 'es')).toBe('Desde €130');
    expect(localPriceText('€60 to €195', 'fr')).toBe('€60 – €195');
    expect(festivalTitle(f, 'fr')).toBe('X Fest 2026 : festival de salsa cubaine à Kraków, Pologne');
  });
});
