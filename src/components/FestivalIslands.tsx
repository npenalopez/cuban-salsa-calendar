import { useEffect, useRef, useState } from 'preact/hooks';
import { share } from '../client/share';
import { openSheet, toggleSaved, useMounted, useStore } from '../client/store';
import { fromCity, nearCity, travelOptions } from '../lib/travel';
import { type Lang, t } from '../i18n';
import { LangContext } from '../i18n/preact';
import { MapView } from './MapView';
import { CalendarIcon, PinIcon, TravelIcon } from './ui';

export function TopActions({ id, name, url, canSave, lang = 'en' }: { id: string; name: string; url: string; canSave: boolean; lang?: Lang }) {
  const { saved } = useStore();
  const on = saved.includes(id);
  return (
    <span class="top-actions">
      {canSave && (
        <button type="button" class={`icon-btn heart${on ? ' is-saved' : ''}`} aria-pressed={on} aria-label={t(lang, 'card.save', { name })} onClick={() => toggleSaved(id)}>
          {on ? '♥' : '♡'}
        </button>
      )}
      <button type="button" class="text-btn" aria-label={t(lang, 'fest.shareAria')} onClick={() => share(name, url)}>{t(lang, 'fest.share')}</button>
    </span>
  );
}

export function AddToCalendar({ id, lang = 'en' }: { id: string; lang?: Lang }) {
  return (
    <button type="button" class="btn" aria-haspopup="dialog" onClick={() => openSheet('cal', id)}>
      <CalendarIcon size={18} />{t(lang, 'fest.addCal')}
    </button>
  );
}

/** How to get there from the visitor's city: every realistic option with an icon, fastest first. */
export function TravelLine({ coords, lang = 'en' }: { coords: [number, number]; lang?: Lang }) {
  const { city } = useStore();
  const mounted = useMounted();
  if (!mounted) return null;
  if (!city) {
    return (
      <button type="button" class="travel-set" aria-haspopup="dialog" onClick={() => openSheet('city')}>
        <PinIcon />{t(lang, 'travel.howFar')}
      </button>
    );
  }
  const opts = travelOptions(city, coords, lang);
  return (
    <div class="travel-panel">
      <ul class="travel-list" aria-label={t(lang, 'travel.gettingThere', { from: fromCity(city, lang) })}>
        {opts.map((o) => (
          <li class="travel"><TravelIcon mode={o.mode} />{o.mode === 'near' ? nearCity(city, lang) : o.text}</li>
        ))}
      </ul>
      <span class="meta">
        {fromCity(city, lang)} · {t(lang, 'travel.estimate')} ·{' '}
        <button type="button" class="link-btn link-btn--inline" aria-haspopup="dialog" onClick={() => openSheet('city')}>{t(lang, 'travel.change')}</button>
      </span>
    </div>
  );
}

/** The map loads by itself as it comes into view (300 px early), so pages stay light until it's needed. */
export function FestivalMap({ id, name, lat, lng, label, place, lang = 'en' }: { id: string; name: string; lat: number; lng: number; label: string; place: string; lang?: Lang }) {
  const [show, setShow] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!box.current || !('IntersectionObserver' in window)) return setShow(true);
    const io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && (setShow(true), io.disconnect()), { rootMargin: '300px' });
    io.observe(box.current);
    return () => io.disconnect();
  }, []);
  if (show) return <LangContext.Provider value={lang}><MapView single points={[{ id, name, lat, lng }]} label={label} /></LangContext.Provider>;
  return (
    <div ref={box} class="map map--single map-open" role="img" aria-label={label}>
      <span class="map-pin" aria-hidden="true" style="width:24px;height:24px" />
      <span class="meta">{t(lang, 'fest.loadingMap', { place })}</span>
    </div>
  );
}

/** Line-up: first 12 artists, then "+N more" / "Show fewer". */
/** Line-up chips; names with an artist page link there, the rest stay plain text. */
export function Lineup({ artists, hrefs, lang = 'en' }: { artists: string[]; hrefs: (string | null)[]; lang?: Lang }) {
  const [all, setAll] = useState(false);
  const shown = all ? artists : artists.slice(0, 12);
  return (
    <div class="lineup">
      {shown.map((a, i) =>
        hrefs[i] ? <a class="chip" href={hrefs[i]!} aria-label={t(lang, 'fest.artistAll', { name: a })}>{a}</a> : <span class="chip chip--plain">{a}</span>,
      )}
      {artists.length > 12 && (
        <button type="button" class="link-btn" onClick={() => setAll(!all)}>{all ? t(lang, 'fest.showFewer') : t(lang, 'card.more', { n: artists.length - 12 })}</button>
      )}
    </div>
  );
}
