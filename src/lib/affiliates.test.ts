import { describe, expect, it } from 'vitest';
import config from '../../config/affiliates.json';
import { flightsUrl, stayDates, stayUrl } from './affiliates';
import { discountLabel } from './festivals';

const merseyside = { id: 'merseyside-latin-festival-liverpool-2026', startDate: '2026-12-04', endDate: '2026-12-06', airport: 'LPL', coordinates: [53.4084, -2.9916] as [number, number] };
const newYear = { id: 'cuba-me-mucho-angers-2027', startDate: '2027-01-01', endDate: '2027-01-03', airport: 'NTE', coordinates: [47.47, -0.55] as [number, number] };
const monthEnd = { id: 'dcuba-international-congress-2026', startDate: '2026-10-30', endDate: '2026-10-31', airport: 'BCN', coordinates: [41.6332, 2.7211] as [number, number] };

describe('affiliate links', () => {
  it('checks in the night before and out the day after, across month and year ends', () => {
    expect(stayDates(merseyside)).toEqual({ checkin: '2026-12-03', checkout: '2026-12-07' });
    expect(stayDates(newYear)).toEqual({ checkin: '2026-12-31', checkout: '2027-01-04' });
    expect(stayDates(monthEnd)).toEqual({ checkin: '2026-10-29', checkout: '2026-11-01' });
  });

  it('builds the Travelpayouts → Kiwi.com flights link with every parameter, the Kiwi link encoded once', () => {
    const u = new URL(flightsUrl(merseyside)!);
    expect(u.origin + u.pathname).toBe('https://c111.travelpayouts.com/click');
    expect(u.searchParams.get('shmarker')).toBe(`${config.travelpayouts.marker}.merseyside-latin-festival-liverpool-2026`);
    expect(u.searchParams.get('promo_id')).toBe('3791');
    expect(u.searchParams.get('source_type')).toBe('customlink');
    expect(u.searchParams.get('type')).toBe('click');
    const kiwi = new URL(u.searchParams.get('custom_url')!);
    expect(kiwi.origin + kiwi.pathname).toBe('https://www.kiwi.com/deep');
    expect(Object.fromEntries(kiwi.searchParams)).toEqual({ to: 'LPL', departure: '2026-12-03', return: '2026-12-07', lang: 'en' });
    // custom_url must be percent-encoded in the raw link, so its & and = don't leak into the outer query
    expect(flightsUrl(merseyside)).toContain('custom_url=https%3A%2F%2Fwww.kiwi.com%2Fdeep%3Fto%3DLPL%26departure%3D2026-12-03');
    expect(new URL(new URL(flightsUrl(newYear)!).searchParams.get('custom_url')!).searchParams.get('departure')).toBe('2026-12-31');
  });

  it('builds the Stay22 link with the venue coordinates and the campaign = festival id', () => {
    const u = new URL(stayUrl(monthEnd)!);
    expect(u.origin + u.pathname).toBe('https://www.stay22.com/allez/roam');
    expect(Object.fromEntries(u.searchParams)).toEqual({
      aid: 'cubansalsacalendar', campaign: 'dcuba-international-congress-2026', checkin: '2026-10-29', checkout: '2026-11-01', lat: '41.6332', lng: '2.7211',
    });
  });

  it('no airport, no flights link; no coordinates, no stay link', () => {
    expect(flightsUrl({ ...merseyside, airport: undefined })).toBeNull();
    expect(stayUrl({ ...merseyside, coordinates: null })).toBeNull();
  });

  it('discount labels', () => {
    expect(discountLabel({ amount: 10 })).toBe('10% off');
    expect(discountLabel({ amount: 15, currency: 'EUR' })).toBe('€15 off');
    expect(discountLabel({ amount: 20, currency: 'CHF' })).toBe('CHF 20 off');
  });
});
