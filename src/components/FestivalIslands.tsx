import { useEffect, useRef, useState } from 'preact/hooks';
import { share } from '../client/share';
import { openSheet, toggleSaved, useMounted, useStore } from '../client/store';
import { fromCity, travelOptions } from '../lib/travel';
import { MapView } from './MapView';
import { CalendarIcon, PinIcon, TravelIcon } from './ui';

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

/** How to get there from the visitor's city: every realistic option with an icon, fastest first. */
export function TravelLine({ coords }: { coords: [number, number] }) {
  const { city } = useStore();
  const mounted = useMounted();
  if (!mounted) return null;
  if (!city) {
    return (
      <button type="button" class="travel-set" aria-haspopup="dialog" onClick={() => openSheet('city')}>
        <PinIcon />How far is it from you?
      </button>
    );
  }
  const opts = travelOptions(city, coords);
  return (
    <div class="travel-panel">
      <ul class="travel-list" aria-label={`Getting there ${fromCity(city)}`}>
        {opts.map((o) => (
          <li class="travel"><TravelIcon mode={o.mode} />{o.mode === 'near' ? (city.name === 'your location' ? 'Near you' : `Near ${city.name}`) : o.text}</li>
        ))}
      </ul>
      <span class="meta">
        {fromCity(city)} · rough estimate ·{' '}
        <button type="button" class="link-btn link-btn--inline" aria-haspopup="dialog" onClick={() => openSheet('city')}>Change</button>
      </span>
    </div>
  );
}

/** The map loads by itself as it comes into view (300 px early), so pages stay light until it's needed. */
export function FestivalMap({ id, name, lat, lng, label, place }: { id: string; name: string; lat: number; lng: number; label: string; place: string }) {
  const [show, setShow] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!box.current || !('IntersectionObserver' in window)) return setShow(true);
    const io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && (setShow(true), io.disconnect()), { rootMargin: '300px' });
    io.observe(box.current);
    return () => io.disconnect();
  }, []);
  if (show) return <MapView single points={[{ id, name, lat, lng }]} label={label} />;
  return (
    <div ref={box} class="map map--single map-open" role="img" aria-label={label}>
      <span class="map-pin" aria-hidden="true" style="width:24px;height:24px" />
      <span class="meta">Loading map of {place}…</span>
    </div>
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
