import { addDays, isoD, ymd } from './dates';
import { SITE, festivalPath } from './festivals';
import type { Enriched } from './types';

const esc = (t: string) => t.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

/** Fold content lines longer than 75 octets (RFC 5545 §3.1). */
function fold(line: string): string {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;
  const out: string[] = [];
  let cur = '';
  let len = 0;
  for (const ch of line) {
    const n = new TextEncoder().encode(ch).length;
    if (len + n > (out.length ? 74 : 75)) {
      out.push(cur);
      cur = '';
      len = 0;
    }
    cur += ch;
    len += n;
  }
  out.push(cur);
  return out.join('\r\n ');
}

const location = (f: Enriched) => [f.venue, f.city, f.country].filter(Boolean).join(', ');

export function icsEvent(f: Enriched, now = new Date()): string {
  const url = SITE + festivalPath(f.id);
  const desc = [
    f.artists.length ? 'Line-up: ' + f.artists.join(', ') : '',
    f.priceText ? 'Price: ' + f.priceText : '',
    f.website ? 'Website: ' + f.website : '',
    'Details: ' + url,
  ].filter(Boolean).join('\n');
  return [
    'BEGIN:VEVENT',
    `UID:${f.id}@cubansalsacalendar.com`,
    `DTSTAMP:${ymd(now)}T000000Z`,
    `DTSTART;VALUE=DATE:${ymd(f.s)}`,
    `DTEND;VALUE=DATE:${ymd(addDays(f.e, 1))}`,
    'SUMMARY:' + esc(f.name),
    'LOCATION:' + esc(location(f)),
    'DESCRIPTION:' + esc(desc),
    'URL:' + url,
    'STATUS:' + (f.status === 'cancelled' ? 'CANCELLED' : 'CONFIRMED'),
    'BEGIN:VALARM', 'TRIGGER:-P7D', 'ACTION:DISPLAY', 'DESCRIPTION:' + esc(f.name + ' starts in a week'), 'END:VALARM',
    'BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', 'DESCRIPTION:' + esc(f.name + ' starts tomorrow'), 'END:VALARM',
    'END:VEVENT',
  ].map(fold).join('\r\n');
}

/** A VCALENDAR with every day-precision festival in `list`. */
export function icsCalendar(list: Enriched[], name: string, now = new Date()): string {
  const events = list.filter((f) => f.datePrecision === 'day').map((f) => icsEvent(f, now));
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Cuban Salsa Calendar//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    fold('X-WR-CALNAME:' + esc(name)), 'X-PUBLISHED-TTL:PT12H', 'REFRESH-INTERVAL;VALUE=DURATION:PT12H',
    ...events,
    'END:VCALENDAR',
  ].join('\r\n') + '\r\n';
}

export function calUrls(f: Enriched) {
  const end = addDays(f.e, 1);
  const url = SITE + festivalPath(f.id);
  const a = f.artists;
  const det = [
    a.length ? 'Line-up: ' + a.slice(0, 8).join(', ') + (a.length > 8 ? '…' : '') : '',
    f.priceText ? 'Price: ' + f.priceText : '',
    'Details: ' + url,
  ].filter(Boolean).join('\n');
  const enc = encodeURIComponent;
  return {
    google: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${enc(f.name)}&dates=${ymd(f.s)}/${ymd(end)}&location=${enc(location(f))}&details=${enc(det)}`,
    outlook: `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&allday=true&subject=${enc(f.name)}&startdt=${isoD(f.s)}&enddt=${isoD(end)}&location=${enc(location(f))}&body=${enc(det)}`,
    ics: `/festivals/${encodeURIComponent(f.id)}.ics`,
  };
}

export const FEED_SLUG = (region: string) => region.toLowerCase().replace(/\s+/g, '-');
