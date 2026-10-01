import { useState } from 'preact/hooks';
import { allFestivals } from '../client/data';
import { copy, download } from '../client/share';
import { closeSheet, openSheet, setCity, setTheme, toast, useStore, type Theme } from '../client/store';
import { dateLong, plural, startOfToday } from '../lib/dates';
import { INSTAGRAM } from '../lib/festivals';
import { FEED_SLUG, calUrls, icsCalendar } from '../lib/ics';
import { norm } from '../lib/text';
import { CITIES } from '../lib/travel';
import type { Enriched } from '../lib/types';
import { Flag, Segmented, Sheet } from './ui';

const TITLES = { menu: 'Menu', artists: 'Top artists', city: 'Travel times', feeds: 'Calendar feeds', cal: 'Add to calendar' };

export default function GlobalSheets() {
  const st = useStore();
  const name = st.sheet?.name ?? null;
  const all = name ? allFestivals(startOfToday()) : [];
  return (
    <>
      {(Object.keys(TITLES) as (keyof typeof TITLES)[]).map((k) => (
        <Sheet id={`sheet-${k}`} title={TITLES[k]} open={name === k} onClose={closeSheet}>
          {name === k && k === 'menu' && <Menu all={all} saved={st.saved.length} cityName={st.city?.name} theme={st.theme} />}
          {name === k && k === 'artists' && <Artists all={all} />}
          {name === k && k === 'city' && <CitySheet cityName={st.city?.name ?? null} />}
          {name === k && k === 'feeds' && <Feeds all={all} saved={st.saved} />}
          {name === k && k === 'cal' && <Cal f={all.find((x) => x.id === st.sheet?.id)} />}
        </Sheet>
      ))}
      <div aria-live="polite" class="toast-wrap">{st.toast && <div class="toast">{st.toast}</div>}</div>
    </>
  );
}

function MenuRow(props: { href?: string; external?: boolean; onClick?: () => void; title: string; text: string }) {
  const body = (
    <>
      <span class="menu-row__text"><strong>{props.title}</strong><span>{props.text}</span></span>
      <span aria-hidden="true" class="menu-row__chev">{props.external ? '↗' : '›'}</span>
    </>
  );
  return props.href ? (
    <a class="menu-row" href={props.href} {...(props.external ? { target: '_blank', rel: 'noopener' } : {})}>{body}</a>
  ) : (
    <button type="button" class="menu-row" onClick={props.onClick}>{body}</button>
  );
}

function Menu({ all, saved, cityName, theme }: { all: Enriched[]; saved: number; cityName?: string; theme: Theme }) {
  const up = all.filter((f) => !f.arch);
  const arch = all.length - up.length;
  const countries = new Set(up.map((f) => f.countryCode).filter(Boolean)).size;
  return (
    <nav aria-label="Menu" class="menu">
      <MenuRow href="/saved/" title="Saved festivals" text={saved ? `${plural(saved, 'festival')} saved on this phone` : 'Tap ♡ on any festival to keep it here'} />
      <MenuRow onClick={() => openSheet('artists')} title="Top artists" text="Who teaches at the most festivals" />
      <MenuRow onClick={() => openSheet('city')} title="Travel times" text={cityName ? `On · from ${cityName}` : 'Off · show flight or drive time from your city'} />
      <MenuRow onClick={() => openSheet('feeds')} title="Calendar feeds" text="New festivals appear in your calendar app" />
      <MenuRow href="/archive/" title="Archive" text={`${plural(arch, 'festival')} that already happened`} />
      <MenuRow href="/submit/" title="Submit a festival" text="Organizer or dancer? Add one for free" />
      <MenuRow href={INSTAGRAM} external title="Follow on Instagram" text="@cubansalsacalendar" />
      <div class="menu__theme">
        <Segmented name="theme" legend="Appearance" value={theme} options={[['system', 'Auto'], ['light', 'Light'], ['dark', 'Dark']]} onChange={setTheme} small />
      </div>
      <p class="menu__foot">{up.length} upcoming festivals in {countries} countries. Something wrong on a festival? Open it and tap "Suggest a correction".</p>
    </nav>
  );
}

function Artists({ all }: { all: Enriched[] }) {
  const [tf, setTf] = useState<'year' | 'all'>('year');
  const [showAll, setShowAll] = useState(false);
  const yr = startOfToday().getFullYear();
  const src = all.filter((f) => tf === 'all' || f.s.getFullYear() === yr);
  const m = new Map<string, { name: string; n: number; cc: string[]; rank: number }>();
  for (const f of src)
    for (const a of f.artists) {
      const k = norm(a);
      const x = m.get(k) || { name: a, n: 0, cc: [], rank: 0 };
      x.n++;
      if (f.countryCode && !x.cc.includes(f.countryCode)) x.cc.push(f.countryCode);
      m.set(k, x);
    }
  const arr = [...m.values()].sort((a, b) => b.n - a.n || a.name.localeCompare(b.name));
  let rank = 0;
  let last = -1;
  arr.forEach((x, i) => {
    if (x.n !== last) {
      rank = i + 1;
      last = x.n;
    }
    x.rank = rank;
  });
  const rows = showAll ? arr : arr.slice(0, 10);
  return (
    <div class="sheet-pad stack-12">
      <span class="meta">
        {tf === 'year' ? `Ranked by festival appearances in ${yr}. Tap a name to see their festivals.` : 'Ranked by festival appearances in all listed years.'}
      </span>
      <span class="seg seg--sm" role="group" aria-label="Time frame">
        {([['year', 'This year'], ['all', 'All time']] as const).map(([k, l]) => (
          <button type="button" class={`seg__opt${tf === k ? ' is-on' : ''}`} aria-pressed={tf === k} onClick={() => (setTf(k), setShowAll(false))}>{l}</button>
        ))}
      </span>
      <ol class="artist-list">
        {rows.map((x) => (
          <li>
            <a class="artist-row" href={`/upcoming/?q=${encodeURIComponent(x.name)}`} aria-label={`${x.name}, ${plural(x.n, 'festival')}. Show their festivals`}>
              <span class={`rank rank--${Math.min(x.rank, 4)}`}>{x.rank}</span>
              <span class="artist-row__text">
                <strong>{x.name}</strong>
                <span>{plural(x.n, 'festival')} · {x.cc.length} {x.cc.length === 1 ? 'country' : 'countries'}</span>
              </span>
              <span class="artist-row__flags">{x.cc.slice(0, 3).map((c) => <Flag code={c} small />)}</span>
            </a>
          </li>
        ))}
      </ol>
      {arr.length > 10 && (
        <button type="button" class="btn" onClick={() => setShowAll(!showAll)}>{showAll ? 'Show top 10' : `Show all ${arr.length} artists`}</button>
      )}
    </div>
  );
}

function CitySheet({ cityName }: { cityName: string | null }) {
  const useLocation = () => {
    if (!navigator.geolocation) return toast("Location isn't available here");
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setCity({ name: 'your location', lat: p.coords.latitude, lng: p.coords.longitude });
        closeSheet();
        toast('Travel times on');
      },
      () => toast("Couldn't get your location. Pick a city instead."),
    );
  };
  return (
    <div class="sheet-pad stack-12">
      <p class="sheet-text">Shows a rough flight or drive time on each festival. Stored only on this device.</p>
      <button type="button" class="btn btn--tall" onClick={useLocation}>Use my current location</button>
      <label for="city-pick" class="field-label">Or pick a city</label>
      <select
        id="city-pick"
        class="input"
        value={cityName && cityName !== 'your location' ? cityName : ''}
        onChange={(e) => {
          const c = CITIES.find((x) => x[0] === e.currentTarget.value);
          if (!c) return;
          setCity({ name: c[0], lat: c[1], lng: c[2] });
          closeSheet();
          toast('Travel times from ' + c[0]);
        }}
      >
        <option value="">Choose…</option>
        {CITIES.map((c) => <option value={c[0]}>{c[0]}</option>)}
      </select>
      {cityName && <button type="button" class="link-btn" onClick={() => (setCity(null), closeSheet())}>Stop showing travel times</button>}
    </div>
  );
}

function Feeds({ all, saved }: { all: Enriched[]; saved: string[] }) {
  const up = all.filter((f) => !f.arch);
  const dated = (l: Enriched[]) => l.filter((f) => f.datePrecision === 'day').length;
  const regions = [...new Set(up.map((f) => f.region))].sort();
  const rows: [string, string, Enriched[]][] = [['All festivals', 'all', up], ...regions.map((r): [string, string, Enriched[]] => [r, FEED_SLUG(r), up.filter((f) => f.region === r)])];
  const mine = up.filter((f) => saved.includes(f.id));
  return (
    <div class="sheet-pad stack-10">
      <p class="sheet-text">Subscribe once and new festivals appear in your own calendar app automatically. Updated every time the list changes.</p>
      {rows.map(([label, slug, list]) => (
        <div class="feed-row">
          <span><strong>{label}</strong><span class="meta feed-row__n">{dated(list)}</span></span>
          <span class="feed-row__actions">
            <button type="button" class="btn btn--sm" onClick={() => copy(`webcal://cubansalsacalendar.com/feeds/${slug}.ics`, 'Feed link copied')}>Copy link</button>
            <a class="link-btn feed-row__ics" href={`/feeds/${slug}.ics`}>.ics</a>
          </span>
        </div>
      ))}
      <div class="feed-row">
        <span><strong>My saved festivals</strong><span class="meta feed-row__n">{dated(mine)}</span></span>
        <span class="feed-row__actions">
          <button
            type="button"
            class="link-btn feed-row__ics"
            onClick={() => (dated(mine) ? download('my-cuban-salsa-festivals.ics', icsCalendar(mine, 'My Cuban salsa festivals'), 'text/calendar;charset=utf-8') : toast('No saved festivals with exact dates'))}
          >.ics</button>
        </span>
      </div>
    </div>
  );
}

function Cal({ f }: { f?: Enriched }) {
  if (!f) return null;
  const u = calUrls(f);
  const done = () => setTimeout(closeSheet, 50);
  return (
    <div class="sheet-pad stack-10">
      <span class="sheet-text">{f.name} · {dateLong(f)}</span>
      <a class="cal-row" href={u.google} target="_blank" rel="noopener" onClick={done}>Google Calendar ↗</a>
      <a class="cal-row" href={u.ics} onClick={done}>Apple Calendar, Outlook app, others (.ics)</a>
      <a class="cal-row" href={u.outlook} target="_blank" rel="noopener" onClick={done}>Outlook.com ↗</a>
      <span class="small-note">All-day event with reminders a week and a day before. In the Instagram app browser, use Google Calendar, or open this page in Safari or Chrome first.</span>
    </div>
  );
}
