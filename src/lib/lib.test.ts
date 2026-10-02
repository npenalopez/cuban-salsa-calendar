import { describe, expect, it } from 'vitest';
import { countdown, countdownLong, dateBlock, dateLong, dateShort, months12, pISO } from './dates';
import { cardVM, enrich, fmtPrice, isListed } from './festivals';
import { calUrls, icsCalendar } from './ics';
import { computeView, DEFAULT_FILTERS, filtersQuery, parseFilters } from './listing';
import { didYouMean, suggestions } from './search';
import { canonicalArtist, canonicalLineup, peopleOf } from './artists';
import { bestTravel, fmtHours, travelOptions } from './travel';
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
