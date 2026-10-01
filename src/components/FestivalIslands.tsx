import { useState } from 'preact/hooks';
import { share } from '../client/share';
import { openSheet, toggleSaved, useStore } from '../client/store';
import { travel } from '../lib/travel';
import { MapView } from './MapView';
import { CalendarIcon } from './ui';

export function TopActions({ id, name, url, canSave }: { id: string; name: string; url: string; canSave: boolean }) {
  const { saved } = useStore();
  const on = saved.includes(id);
  return (
    <span class="top-actions">
      {canSave && (
        <button type="button" class={`icon-btn heart${on ? ' is-saved' : ''}`} aria-pressed={on} aria-label={`Save ${name}`} onClick={() => toggleSaved(id)}>
          {on ? '♥' : '♡'}
        </button>
      )}
      <button type="button" class="text-btn" aria-label="Share this festival" onClick={() => share(name, url)}>Share</button>
    </span>
  );
}

export function AddToCalendar({ id }: { id: string }) {
  return (
    <button type="button" class="btn" aria-haspopup="dialog" onClick={() => openSheet('cal', id)}>
      <CalendarIcon size={18} />Add to calendar
    </button>
  );
}

export function TravelLine({ coords }: { coords: [number, number] }) {
  const { city } = useStore();
  const t = travel(city, coords);
  return t ? <span class="meta">{t}</span> : null;
}

/** The map loads only when asked for: most visitors arrive on mobile data from Instagram. */
export function FestivalMap({ id, name, lat, lng, label, place }: { id: string; name: string; lat: number; lng: number; label: string; place: string }) {
  const [open, setOpen] = useState(false);
  if (open) return <MapView single points={[{ id, name, lat, lng }]} label={label} />;
  return (
    <button type="button" class="map map--single map-open" onClick={() => setOpen(true)}>
      <span class="map-pin" aria-hidden="true" style="width:24px;height:24px" />
      <span class="map-open__text">Show map</span>
      <span class="meta">{place}</span>
    </button>
  );
}

/** Line-up: first 12 artists, then "+N more" / "Show fewer". */
export function Lineup({ artists }: { artists: string[] }) {
  const [all, setAll] = useState(false);
  const shown = all ? artists : artists.slice(0, 12);
  return (
    <div class="lineup">
      {shown.map((a) => (
        <a class="chip" href={`/upcoming/?q=${encodeURIComponent(a)}`} aria-label={`Find festivals with ${a}`}>{a}</a>
      ))}
      {artists.length > 12 && (
        <button type="button" class="link-btn" onClick={() => setAll(!all)}>{all ? 'Show fewer' : `+${artists.length - 12} more`}</button>
      )}
    </div>
  );
}
