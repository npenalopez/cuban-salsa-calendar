import { useState } from 'preact/hooks';
import { allFestivals } from '../client/data';
import { copy, openCalendar } from '../client/share';
import { closeSheet, openSheet, setCity, setTheme, toast, useStore, type Theme } from '../client/store';
import { dateLong, startOfToday } from '../lib/dates';
import { type Lang, lp, t as tr } from '../i18n';
import { LangContext, useLang } from '../i18n/preact';
import { INSTAGRAM } from '../lib/festivals';
import { FEED_SLUG, calUrls, savedIcsPath } from '../lib/ics';
import { artistPath, pagedArtistSlugs } from '../lib/artists';
import { norm, slugify } from '../lib/text';
import { CITIES, fromCity } from '../lib/travel';
import { regionName } from '../i18n/places';
import type { City, Enriched } from '../lib/types';
import { Flag, LocateIcon, Segmented, Sheet } from './ui';

const TITLES = { menu: 'sheet.menu', artists: 'sheet.artists', city: 'sheet.city', feeds: 'sheet.feeds', cal: 'sheet.cal' };
const useTr = () => {
  const lang = useLang();
  return { lang, t: (k: string, v?: Record<string, string | number>) => tr(lang, k, v), L: (p: string) => lp(lang, p) };
};

export default function GlobalSheets({ lang = 'en' }: { lang?: Lang }) {
  const st = useStore();
  const name = st.sheet?.name ?? null;
  const all = name ? allFestivals(startOfToday()) : [];
  return (
    <LangContext.Provider value={lang}>
      {(Object.keys(TITLES) as (keyof typeof TITLES)[]).map((k) => (
        <Sheet id={`sheet-${k}`} title={tr(lang, TITLES[k])} open={name === k} onClose={closeSheet} variant={k === 'menu' ? 'drawer' : 'sheet'}>
          {name === k && k === 'menu' && <Menu all={all} saved={st.saved.length} cityName={st.city?.name} theme={st.theme} />}
          {name === k && k === 'artists' && <Artists all={all} />}
          {name === k && k === 'city' && <CitySheet all={all} city={st.city} />}
          {name === k && k === 'feeds' && <Feeds all={all} saved={st.saved} />}
          {name === k && k === 'cal' && <Cal f={all.find((x) => x.id === st.sheet?.id)} />}
        </Sheet>
      ))}
      <div aria-live="polite" class="toast-wrap">{st.toast && <div class="toast">{st.toast}</div>}</div>
    </LangContext.Provider>
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
  const { t, L } = useTr();
  return (
    <nav aria-label={t('site.menu')} class="menu">
      <MenuRow href={L('/saved/')} title={t('menu.saved')} text={saved ? t('menu.savedOn', { n: saved }) : t('menu.savedEmpty')} />
      <MenuRow onClick={() => openSheet('artists')} title={t('menu.artists')} text={t('menu.artistsText')} />
      <MenuRow href={L('/artists/')} title={t('menu.allArtists')} text={t('menu.allArtistsText')} />
      <MenuRow onClick={() => openSheet('city')} title={t('menu.travel')} text={cityName ? t('menu.travelOn', { city: cityName === 'your location' ? t('travel.yourLocation') : cityName }) : t('menu.travelOff')} />
      <MenuRow onClick={() => openSheet('feeds')} title={t('menu.feeds')} text={t('menu.feedsText')} />
      <MenuRow href={L('/archive/')} title={t('menu.archive')} text={t('menu.archiveText', { n: arch })} />
      <MenuRow href={L('/submit/')} title={t('menu.submit')} text={t('menu.submitText')} />
      <MenuRow href={INSTAGRAM} external title={t('menu.instagram')} text="@cubansalsacalendar" />
      <div class="menu__theme">
        <Segmented name="theme" legend={t('menu.appearance')} value={theme} options={[['system', t('menu.auto')], ['light', t('menu.light')], ['dark', t('menu.dark')]]} onChange={setTheme} small />
      </div>
      <p class="menu__foot">{t('menu.foot', { n: up.length, c: countries })}</p>
    </nav>
  );
}

function Artists({ all }: { all: Enriched[] }) {
  const { t, L } = useTr();
  const [tf, setTf] = useState<'year' | 'all'>('year');
  const [showAll, setShowAll] = useState(false);
  const yr = startOfToday().getFullYear();
  const paged = pagedArtistSlugs(all.map((f) => [...f.artists, ...f.people]));
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
        {tf === 'year' ? t('artists.rankedYear', { y: yr }) : t('artists.rankedAll')}
      </span>
      <span class="seg seg--sm" role="group" aria-label={t('artists.timeframe')}>
        {([['year', t('artists.thisYear')], ['all', t('artists.allTime')]] as const).map(([k, l]) => (
          <button type="button" class={`seg__opt${tf === k ? ' is-on' : ''}`} aria-pressed={tf === k} onClick={() => (setTf(k), setShowAll(false))}>{l}</button>
        ))}
      </span>
      <ol class="artist-list">
        {rows.map((x) => (
          <li>
            <a class="artist-row" href={L(paged.has(slugify(x.name)) ? artistPath(x.name) : `/upcoming/?q=${encodeURIComponent(x.name)}`)} aria-label={t('artists.rowAria', { name: x.name, n: t('n.festivals', { n: x.n }) })}>
              <span class={`rank rank--${Math.min(x.rank, 4)}`}>{x.rank}</span>
              <span class="artist-row__text">
                <strong>{x.name}</strong>
                <span>{t('n.festivals', { n: x.n })} · {t('n.countries', { n: x.cc.length })}</span>
              </span>
              <span class="artist-row__flags">{x.cc.slice(0, 3).map((c) => <Flag code={c} small />)}</span>
            </a>
          </li>
        ))}
      </ol>
      {arr.length > 10 && (
        <button type="button" class="btn" onClick={() => setShowAll(!showAll)}>{showAll ? t('artists.showTop') : t('artists.showAll', { n: arr.length })}</button>
      )}
    </div>
  );
}

function CitySheet({ all, city }: { all: Enriched[]; city: City | null }) {
  const { lang, t } = useTr();
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
    toast(t('city.toastFrom', { city: p[0] }));
  };
  const useLocation = () => {
    if (!navigator.geolocation) return toast(t('city.noGeo'));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCity({ name: 'your location', lat: pos.coords.latitude, lng: pos.coords.longitude });
        closeSheet();
        toast(t('city.toastHere'));
      },
      () => toast(t('city.geoFailed')),
    );
  };
  return (
    <div class="sheet-pad stack-12">
      {city ? (
        <div class="travel-now">
          <span>{t('city.showing')} <strong>{fromCity(city, lang)}</strong>.</span>
          <button type="button" class="link-btn" onClick={() => (setCity(null), closeSheet(), toast(t('city.off')))}>{t('city.turnOff')}</button>
        </div>
      ) : (
        <p class="sheet-text">{t('city.intro')}</p>
      )}
      <button type="button" class="btn btn--tall" onClick={useLocation}><LocateIcon size={18} />{t('city.useLocation')}</button>
      <form class="stack-8" onSubmit={(e) => (e.preventDefault(), choose(q))}>
        <label for="city-pick" class="field-label">{t('city.orType')}</label>
        <div class="city-row">
          <input
            id="city-pick"
            class="input"
            list="city-options"
            autocomplete="off"
            enterKeyHint="go"
            placeholder={t('city.placeholder')}
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
          <button type="submit" class="btn">{t('city.set')}</button>
        </div>
        <datalist id="city-options">{names.map((n) => <option value={n} />)}</datalist>
        {miss && <span id="city-miss" class="field__err">{t('city.miss')}</span>}
      </form>
      <p class="small-note">{t('city.note')}</p>
    </div>
  );
}

function Feeds({ all, saved }: { all: Enriched[]; saved: string[] }) {
  const { lang, t, L } = useTr();
  const up = all.filter((f) => !f.arch);
  const dated = (l: Enriched[]) => l.filter((f) => f.datePrecision === 'day').length;
  const regions = [...new Set(up.map((f) => f.region))].sort();
  const rows: [string, string, Enriched[]][] = [[t('feeds.all'), 'all', up], ...regions.map((r): [string, string, Enriched[]] => [regionName(lang, r), FEED_SLUG(r), up.filter((f) => f.region === r)])];
  const mine = up.filter((f) => saved.includes(f.id));
  return (
    <div class="sheet-pad stack-10">
      <p class="sheet-text">{t('feeds.intro')}</p>
      {rows.map(([label, slug, list]) => (
        <div class="feed-row">
          <span><strong>{label}</strong><span class="meta feed-row__n">{dated(list)}</span></span>
          <span class="feed-row__actions">
            <button type="button" class="btn btn--sm" onClick={() => copy(`webcal://cubansalsacalendar.com/feeds/${slug}.ics`, t('feeds.copied'))}>{t('feeds.copy')}</button>
            <a class="link-btn feed-row__ics" href={`/feeds/${slug}.ics`} onClick={(e) => { e.preventDefault(); openCalendar(`/feeds/${slug}.ics`); }}>.ics</a>
          </span>
        </div>
      ))}
      <div class="feed-row">
        <span><strong>{t('feeds.mine')}</strong><span class="meta feed-row__n">{dated(mine)}</span></span>
        <span class="feed-row__actions">
          <button
            type="button"
            class="link-btn feed-row__ics"
            onClick={() => (dated(mine) ? openCalendar(savedIcsPath(mine), `${L('/saved/')}?ids=${saved.join(',')}`) : toast(t('feeds.noneDated')))}
          >.ics</button>
        </span>
      </div>
    </div>
  );
}

function Cal({ f }: { f?: Enriched }) {
  const { lang, t } = useTr();
  if (!f) return null;
  const u = calUrls(f);
  const done = () => setTimeout(closeSheet, 50);
  return (
    <div class="sheet-pad stack-10">
      <span class="sheet-text">{f.name} · {dateLong(f, lang)}</span>
      <a class="cal-row" href={u.google} target="_blank" rel="noopener" onClick={done}>Google Calendar ↗</a>
      <a class="cal-row" href={u.ics} onClick={(e) => { e.preventDefault(); openCalendar(u.ics); done(); }}>{t('cal.ics')}</a>
      <a class="cal-row" href={u.outlook} target="_blank" rel="noopener" onClick={done}>Outlook.com ↗</a>
      <span class="small-note">{t('cal.note')}</span>
    </div>
  );
}
