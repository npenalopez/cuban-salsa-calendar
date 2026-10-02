import { useState } from 'preact/hooks';
import { allFestivals } from '../client/data';
import { copy, download } from '../client/share';
import { closeSheet, openSheet, setCity, setTheme, toast, useStore, type Theme } from '../client/store';
import { dateLong, plural, startOfToday } from '../lib/dates';
import { INSTAGRAM } from '../lib/festivals';
import { FEED_SLUG, calUrls, icsCalendar } from '../lib/ics';
import { norm } from '../lib/text';
import { CITIES, fromCity } from '../lib/travel';
import type { City, Enriched } from '../lib/types';
import { Flag, LocateIcon, Segmented, Sheet } from './ui';

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
          {name === k && k === 'city' && <CitySheet all={all} city={st.city} />}
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
      <MenuRow onClick={() => openSheet('city')} title="Travel times" text={cityName ? `On · from ${cityName}` : 'Off · car, train or plane time from your city'} />
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
    for (const a of f.people) {
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

function CitySheet({ all, city }: { all: Enriched[]; city: City | null }) {
  const [q, setQ] = useState('');
  const [miss, setMiss] = useState(false);
  // The dance hubs plus every festival city, one entry per name.
  const places = new Map<string, [string, number, number]>();
  for (const c of CITIES) places.set(norm(c[0]), c);
  for (const f of all) if (f.city && f.coordinates && !places.has(norm(f.city))) places.set(norm(f.city), [f.city, f.coordinates[0], f.coordinates[1]]);
  const names = [...places.values()].map((p) => p[0]).sort((x, y) => x.localeCompare(y));
  const choose = (value: string) => {
    const p = places.get(norm(value));
    if (!p) return setMiss(true);
    setCity({ name: p[0], lat: p[1], lng: p[2] });
    closeSheet();
    toast('Travel times from ' + p[0]);
  };
  const useLocation = () => {
    if (!navigator.geolocation) return toast("Location isn't available here");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCity({ name: 'your location', lat: pos.coords.latitude, lng: pos.coords.longitude });
        closeSheet();
        toast('Travel times from your location');
      },
      () => toast("Couldn't get your location. Type your city instead."),
    );
  };
  return (
    <div class="sheet-pad stack-12">
      {city ? (
        <div class="travel-now">
          <span>Showing travel times <strong>{fromCity(city)}</strong>.</span>
          <button type="button" class="link-btn" onClick={() => (setCity(null), closeSheet(), toast('Travel times off'))}>Turn off</button>
        </div>
      ) : (
        <p class="sheet-text">See how long it takes to get to each festival by car, train or plane, and sort festivals by distance. Your city stays on this device.</p>
      )}
      <button type="button" class="btn btn--tall" onClick={useLocation}><LocateIcon size={18} />Use my current location</button>
      <form class="stack-8" onSubmit={(e) => (e.preventDefault(), choose(q))}>
        <label for="city-pick" class="field-label">Or type your city</label>
        <div class="city-row">
          <input
            id="city-pick"
            class="input"
            list="city-options"
            autocomplete="off"
            enterKeyHint="go"
            placeholder="e.g. Zurich, Madrid, Toronto"
            value={q}
            aria-invalid={miss || undefined}
            aria-describedby={miss ? 'city-miss' : undefined}
            onInput={(e) => {
              const v = e.currentTarget.value;
              setQ(v);
              setMiss(false);
              // Picking a suggestion fills the whole name: apply it straight away.
              if (places.has(norm(v)) && names.includes(v)) choose(v);
            }}
          />
          <button type="submit" class="btn">Set</button>
        </div>
        <datalist id="city-options">{names.map((n) => <option value={n} />)}</datalist>
        {miss && <span id="city-miss" class="field__err">Not in the list yet. Pick the nearest big city from the suggestions.</span>}
      </form>
      <p class="small-note">Estimates from straight-line distance with typical speeds; flights add about 2.5 h for airports when choosing the fastest option.</p>
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
