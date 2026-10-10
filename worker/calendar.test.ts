import { describe, expect, it } from 'vitest';
import { events, joinCalendar, parseIds } from './calendar';

const file = (id: string) =>
  ['BEGIN:VCALENDAR', 'VERSION:2.0', 'BEGIN:VEVENT', `UID:${id}@cubansalsacalendar.com`, 'DESCRIPTION:long line', '  folded', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n') + '\r\n';

describe('saved.ics', () => {
  it('keeps only well-formed, unique ids', () => {
    expect(parseIds('a-2026, b-2027,a-2026,../x,,UPPER')).toEqual(['a-2026', 'b-2027']);
    expect(parseIds(null)).toEqual([]);
  });

  it('joins the events of several files into one calendar', () => {
    const out = joinCalendar([file('a'), '', file('b')]);
    expect(events(out)).toHaveLength(2);
    expect(out.match(/BEGIN:VCALENDAR/g)).toHaveLength(1);
    expect(out).toContain('UID:b@cubansalsacalendar.com');
    expect(out).toContain('\r\n  folded\r\n');
    expect(out.endsWith('END:VCALENDAR\r\n')).toBe(true);
  });
});
