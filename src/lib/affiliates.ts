import config from '../../config/affiliates.json';

export const AFFILIATES = config;

/** The config flag, unless the build sets DRIVE_SCRIPT=off (CI does: the script only works on the real domain). */
export const DRIVE_ENABLED = config.driveScriptEnabled && process.env.DRIVE_SCRIPT !== 'off';

/**
 * Travelpayouts site verification + Drive, exactly as Travelpayouts supplies it.
 * Base.astro puts it in <head> on every page while `driveScriptEnabled` is true.
 * Off since 2026-10-10 (the site is verified). To turn it back on, also allow its origins in the
 * CSP in public/_headers: emrldtp.com in script-src and connect-src, plus tp.media, *.tp.media
 * and *.travelpayouts.com in connect-src.
 */
export const DRIVE_SCRIPT = `<script nowprocket data-noptimize="1" data-cfasync="false" data-wpfc-render="false" seraph-accel-crit="1" data-no-defer="1" data-cmp-ab="2">
  (function () {
    var script = document.createElement("script");
    script.async = 1;
    script.setAttribute("data-cmp-ab","2");
    script.src = '${config.travelpayouts.driveScriptSrc}';
    document.head.appendChild(script);
  })();
</script>`;

const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const shift = (iso: string, days: number) => {
  const [y, m, d] = iso.split('-').map(Number);
  return ymd(new Date(y, m - 1, d + days));
};

/** Check in the day before the festival, check out the day after. */
export const stayDates = (f: { startDate: string; endDate: string }) => ({ checkin: shift(f.startDate, -1), checkout: shift(f.endDate, 1) });

/** Travelpayouts click link to a Kiwi.com search to the festival's airport. */
export function flightsUrl(f: { id: string; startDate: string; endDate: string; airport?: string }): string | null {
  if (!f.airport) return null;
  const { checkin, checkout } = stayDates(f);
  const t = config.travelpayouts;
  const kiwi = `${t.flights.deepLinkBase}?to=${encodeURIComponent(f.airport)}&departure=${checkin}&return=${checkout}&lang=en`;
  return `${t.flights.clickBase}?shmarker=${t.marker}.${encodeURIComponent(f.id)}&promo_id=${t.flights.promoId}&source_type=customlink&type=click&custom_url=${encodeURIComponent(kiwi)}`;
}

/** Stay22 search for places to stay around the venue. */
export function stayUrl(f: { id: string; startDate: string; endDate: string; coordinates: [number, number] | null }): string | null {
  if (!f.coordinates) return null;
  const { checkin, checkout } = stayDates(f);
  const s = config.stay22;
  return `${s.base}?aid=${encodeURIComponent(s.aid)}&campaign=${encodeURIComponent(f.id)}&checkin=${checkin}&checkout=${checkout}&lat=${f.coordinates[0]}&lng=${f.coordinates[1]}`;
}
