import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { allFestivals } from '../client/data';
import { openCalendar, share } from '../client/share';
import { addRecent, clearRecent, openSheet, saveAll, toast, toggleSaved, useMounted, useStore } from '../client/store';
import { dateLong, monthLabel, monthPath, pISO, startOfToday } from '../lib/dates';
import { type Lang, lp, monthName, monthShort, t as tr } from '../i18n';
import { LangContext } from '../i18n/preact';
import { cardVM, festivalPath, place } from '../lib/festivals';
import { savedIcsPath } from '../lib/ics';
import {
  DEFAULT_FILTERS, computeView, filterCount, filterSummary, filtersQuery, parseFilters, styleOptions, whereOptions,
  type Filters, type LatLng, type PageRoute, type Sort, type When,
} from '../lib/listing';
import { didYouMean, suggestions, type Suggestion } from '../lib/search';
import { highlight, norm } from '../lib/text';
import { cityLabel } from '../lib/travel';
import { FestivalCard } from './FestivalCard';
import { MapView, type MapPoint } from './MapView';
import { FilterIcon, SearchIcon, Sheet } from './ui';

interface Props {
  route: PageRoute;
  lang?: Lang;
  /** Build date (YYYY-MM-DD): used for the server render and the first client render. */
  buildToday: string;
}

export default function ListApp({ route, buildToday, lang = 'en' }: Props) {
  const t = (k: string, v?: Record<string, string | number>) => tr(lang, k, v);
  const L = (path: string) => lp(lang, path);
  const mounted = useMounted();
  const store = useStore();
  const todayKey = mounted ? startOfToday().getTime() : pISO(buildToday).getTime();
  const today = useMemo(() => new Date(todayKey), [todayKey]);
  const all = allFestivals(today);

  const [f, setF] = useState<Filters>(DEFAULT_FILTERS);
  const [shared, setShared] = useState<string[] | null>(null);
  const [sheet, setSheet] = useState<'months' | 'filters' | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [focusIdx, setFocusIdx] = useState(-1);
  const [dockHidden, setDockHidden] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // Read state from the URL once mounted (the server render uses defaults).
  useEffect(() => {
    setF(parseFilters(location.search));
    const ids = new URLSearchParams(location.search).get('ids');
    if (route.name === 'saved' && ids) setShared(ids.split(',').filter(Boolean));
  }, []);

  // Keep the URL shareable.
  useEffect(() => {
    if (!mounted) return;
    let qs = filtersQuery(f);
    if (shared) qs += (qs ? '&' : '?') + 'ids=' + shared.join(',');
    const url = location.pathname + qs;
    if (url !== location.pathname + location.search) history.replaceState(null, '', url);
    try {
      sessionStorage.setItem('csc-last-list', url);
    } catch {
      /* the festival page falls back to "/" */
    }
  }, [f, shared, mounted]);

  // Hide the dock on scroll down, show on scroll up and near the end.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - last;
      if (Math.abs(dy) < 8) return;
      const atEnd = window.innerHeight + y >= document.body.scrollHeight - 80;
      setDockHidden(dy > 0 && y > 240 && !atEnd);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const patch = (p: Partial<Filters>) => setF((cur) => ({ ...cur, ...p }));
  const clearFilters = () => patch({ where: '', savedOnly: false, style: '', cuban: false, when: 'any', sort: 'date', from: '', to: '' });

  // "Near me": the browser's location, asked for only when chosen and kept in memory, never stored.
  const [me, setMe] = useState<LatLng | null>(null);
  const [locating, setLocating] = useState(false);
  const pickSort = (s: Sort) => {
    if (s !== 'me' || me) return patch({ sort: s });
    if (!navigator.geolocation) return toast(t('list.noGeo'));
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        setMe({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        patch({ sort: 'me' });
      },
      () => {
        setLocating(false);
        toast(t('list.geoFailed'));
      },
      { maximumAge: 600_000, timeout: 15_000 },
    );
  };

  const v = computeView(all, today, route, f, store.saved, shared, store.city, me, lang);
  const fc = filterCount(f);
  const hasQuery = f.q.trim().length > 0;
  const isMonth = v.mode === 'month';
  const qsNoQuery = filtersQuery(f, { keepQuery: false });

  // ---- search
  const groups = searchOpen ? suggestions(v.up, f.q, store.recent, lang) : [];
  const flat: Suggestion[] = groups.flatMap((g) => g.items);
  const pick = (s: Suggestion) => {
    setSearchOpen(false);
    setFocusIdx(-1);
    if (s.type === 'festival') {
      location.href = L(festivalPath(s.id));
    } else if (s.type === 'country') {
      patch({ where: 'country:' + s.code, q: '' });
      addRecent(s.label);
    } else {
      patch({ q: s.value });
      addRecent(s.value);
    }
  };
  const onSearchKey = (e: KeyboardEvent) => {
    const n = flat.length;
    if (e.key === 'ArrowDown' && n) {
      e.preventDefault();
      setSearchOpen(true);
      setFocusIdx((focusIdx + 1) % n);
    } else if (e.key === 'ArrowUp' && n) {
      e.preventDefault();
      setFocusIdx((focusIdx - 1 + n) % n);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (focusIdx >= 0 && flat[focusIdx]) pick(flat[focusIdx]);
      else {
        addRecent(f.q.trim());
        setSearchOpen(false);
      }
    } else if (e.key === 'Escape') {
      setSearchOpen(false);
      setFocusIdx(-1);
    }
  };
  const dym = v.total === 0 && hasQuery ? didYouMean(v.up, f.q) : null;

  // ---- dock
  const i = v.monthIdx;
  const cur = i >= 0 ? v.m12[i] : null;
  const prev = i > 0 ? v.m12[i - 1] : null;
  const next = i >= 0 ? v.m12[i + 1] : null;
  const monthN = (key: string) => v.upF.filter((x) => x.mk === key).length;
  const otherLabel = { search: t('n.results', { n: v.total }), archive: t('view.archive'), saved: v.title, range: v.title, all: t('view.allUpcoming'), month: '' }[v.mode];

  // ---- map
  const items = v.sections.flatMap((s) => s.items);
  const points: MapPoint[] = items.filter((x) => x.coordinates).map((x) => ({
    id: x.id, lat: x.coordinates![0], lng: x.coordinates![1], name: x.name, href: L(festivalPath(x.id)), when: dateLong(x, lang), place: place(x, lang),
  }));
  const mapView = f.view === 'map';

  const where = whereOptions(v.up, lang);
  const styles = styleOptions(v.up, lang);
  const anyCuban = v.up.some((x) => x.cubanFocused === true);
  const savedCount = store.saved.length;
  const showShared = route.name === 'saved' && shared && shared.some((id) => !store.saved.includes(id));
  const awaitingClient = route.name === 'saved' && !mounted;

  return (
    <LangContext.Provider value={lang}>
      <div class="search">
        <label for="search" class="sr-only">{t('list.searchLabel')}</label>
        <div class="search__box">
          <SearchIcon />
          <input
            ref={searchRef}
            id="search"
            type="text"
            enterKeyHint="search"
            role="combobox"
            aria-expanded={flat.length > 0}
            aria-controls="search-list"
            aria-autocomplete="list"
            aria-activedescendant={focusIdx >= 0 ? `opt-${focusIdx}` : undefined}
            autocomplete="off"
            spellcheck={false}
            placeholder={t('list.searchPlaceholder')}
            value={f.q}
            onInput={(e) => {
              patch({ q: e.currentTarget.value });
              setSearchOpen(true);
              setFocusIdx(-1);
            }}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setTimeout(() => (setSearchOpen(false), setFocusIdx(-1)), 120)}
            onKeyDown={onSearchKey}
          />
          {hasQuery && (
            <button type="button" class="search__clear" aria-label={t('list.clearSearch')} onClick={() => (patch({ q: '' }), setFocusIdx(-1), searchRef.current?.focus())}>✕</button>
          )}
        </div>
        {flat.length > 0 && (
          <div id="search-list" role="listbox" aria-label={t('list.suggestions')} class="suggest">
            {groups.map((g) => (
              <div role="group" aria-label={g.title}>
                <div class="suggest__head">
                  <span class="label">{g.title}</span>
                  {g.canClear && <button type="button" class="link-btn suggest__clear" onMouseDown={(e) => (e.preventDefault(), clearRecent())}>{t('list.clear')}</button>}
                </div>
                {g.items.map((s) => {
                  const idx = flat.indexOf(s);
                  return (
                    <div id={`opt-${idx}`} role="option" aria-selected={idx === focusIdx} class={`suggest__opt${idx === focusIdx ? ' is-active' : ''}`} onMouseDown={(e) => (e.preventDefault(), pick(s))}>
                      <span class="suggest__text">
                        <span class="suggest__label"><Hl label={s.label} q={f.q} /></span>
                        {s.detail && <span class="suggest__detail">{s.detail}</span>}
                      </span>
                      <span class="suggest__count">{s.count ?? ''}</span>
                    </div>
                  );
                })}
              </div>
            ))}
            {hasQuery && <div class="suggest__hint">{t('list.enterHint', { q: f.q })}</div>}
          </div>
        )}
      </div>

      {!hasQuery && (isMonth || v.mode === 'all') && (
        <nav aria-label={t('list.explore')} class="explore">
          <a class="pill" href={L('/saved/')}>{t('list.savedPill')}{savedCount ? ` (${savedCount})` : ''}</a>
          <button type="button" class="pill" aria-haspopup="dialog" onClick={() => openSheet('artists')}>{t('list.topArtists')}</button>
          <button type="button" class="pill" aria-haspopup="dialog" onClick={() => openSheet('city')}>{t('list.travelTimes')}</button>
          <a class="pill" href={L('/archive/')}>{t('list.archive')}</a>
          <a class="pill" href={L('/submit/')}>{t('list.submit')}</a>
        </nav>
      )}
      {!isMonth && <a class="back-pill" href={L('/')}>{t('list.backUpcoming')}</a>}

      <div class="page-head">
        <span class="kicker">{awaitingClient ? t('view.saved') : v.kicker}</span>
        <h1 class="page-title" id="page-title">{v.title}</h1>
        {v.note && <p class="page-note">{v.note}</p>}
        {fc > 0 && (
          <div class="filtered">
            <span>{filterSummary(f, v.up, lang)}</span>
            <button type="button" class="link-btn" onClick={clearFilters}>{t('list.clearFilters')}</button>
          </div>
        )}
      </div>

      {showShared && (
        <div class="banner">
          <span>{t('list.sharedWithYou', { n: shared!.length })}</span>
          <span class="banner__actions">
            <button type="button" class="btn" onClick={() => saveAll(shared!)}>{t('list.saveAll')}</button>
            <button type="button" class="btn" onClick={() => openCalendar(savedIcsPath(all.filter((x) => shared!.includes(x.id) && !x.arch)), location.pathname + location.search)}>{t('list.addAllCal')}</button>
          </span>
        </div>
      )}
      {route.name === 'saved' && !shared && savedCount > 0 && (
        <div class="btn-row">
          <button type="button" class="btn" onClick={() => share(t('list.shareTitle'), `${location.origin}${L('/saved/')}?ids=${store.saved.join(',')}`)}>{t('list.shareList')}</button>
          <button
            type="button"
            class="btn"
            onClick={() => openCalendar(savedIcsPath(all.filter((x) => store.saved.includes(x.id) && !x.arch)), `${L('/saved/')}?ids=${store.saved.join(',')}`)}
          >{t('list.addAllIcs')}</button>
        </div>
      )}

      <div class={route.name === 'saved' ? 'saved-area' : undefined}>
      {(v.total > 0 || mapView) && !awaitingClient && (
        <div role="group" aria-label={t('list.viewAs')} class="toggle">
          {(['list', 'map'] as const).map((k) => (
            <button type="button" aria-pressed={f.view === k} onClick={() => patch({ view: k })}>{t(k === 'list' ? 'list.list' : 'list.map')}</button>
          ))}
        </div>
      )}

      <p aria-live="polite" class="sr-only">{mounted ? t('list.shown', { n: v.total }) : ''}</p>

      {awaitingClient ? (
        <div class="grid" aria-busy="true" aria-label={t('list.loading')}>
          {[1, 0.8, 0.6, 0.4].map((o) => <div class="skeleton" style={{ opacity: o }} />)}
        </div>
      ) : mapView ? (
        <div class="map-wrap">
          <MapView points={points} label={t('list.mapLabel')} />
          <span class="meta">{t('list.onMap', { n: points.length })}</span>
        </div>
      ) : (
        <div class="sections">
          {v.sections.map((s) => (
            <section aria-label={s.title || v.title}>
              {s.head ? (
                <div class="section-head">
                  <h2>{s.title}</h2>
                  <span class="meta">{s.items.length}</span>
                </div>
              ) : (
                <h2 class="sr-only">{v.mode === 'month' && v.monthKey ? t('list.festivalsIn', { month: monthLabel(v.monthKey, lang) }) : t('list.festivals')}</h2>
              )}
              <div class="grid">
                {s.items.map((x) => (
                  <FestivalCard card={cardVM(x, all, store.city, today, lang)} saved={store.saved.includes(x.id)} onSave={toggleSaved} onCal={(id) => openSheet('cal', id)} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {!awaitingClient && v.total === 0 && !mapView && (
        <div class="empty">
          <strong class="empty__title">{v.emptyTitle}</strong>
          {v.emptyText && <span class="empty__text">{v.emptyText}</span>}
          {dym && (
            <span class="empty__text">{t('list.didYouMean')} <button type="button" class="link-btn" onClick={() => patch({ q: dym })}>{dym}</button>?</span>
          )}
          <div class="btn-row">
            {fc > 0 && <button type="button" class="btn" onClick={clearFilters}>{t('list.clearFilters')}</button>}
            <a class="empty__submit" href={L('/submit/')}>{t('list.knowOne')}</a>
          </div>
        </div>
      )}

      </div>

      {isMonth && next && (
        <a class="next-month" href={L(monthPath(next.key)) + qsNoQuery}>{t('list.next', { month: monthLabel(next.key, lang), n: monthN(next.key) })} ›</a>
      )}

      <div class={`dock-wrap${dockHidden && !sheet && !store.sheet ? ' is-hidden' : ''}`}>
        <nav aria-label={t('list.chooseMonth')} class="dock">
          {isMonth && cur ? (
            <a
              class="dock__arrow"
              href={prev ? L(monthPath(prev.key)) + qsNoQuery : undefined}
              aria-label={prev ? t('list.prevMonth', { month: monthLabel(prev.key, lang) }) : t('list.noEarlier')}
              aria-disabled={!prev}
              role="link"
            >‹</a>
          ) : (
            <a class="dock__today" href={L('/')} aria-label={t('list.todayAria')}>{t('list.today')}</a>
          )}
          <button
            type="button"
            class="dock__center"
            aria-haspopup="dialog"
            aria-label={t('list.chooseMonthNow', { what: isMonth && cur ? `${monthLabel(cur.key, lang)}, ${t('n.festivals', { n: monthN(cur.key) })}` : otherLabel })}
            onClick={() => setSheet('months')}
          >
            <span class="dock__label">{isMonth ? (cur ? monthLabel(cur.key, lang) : v.title) : otherLabel} ▴</span>
            <span class="dock__sub">
              {isMonth && cur ? `${t('n.festivals', { n: monthN(cur.key) })} · ${t('list.ofTwelve', { i: i + 1 })}` : v.mode === 'search' ? t('list.forQuery', { q: f.q.trim() }) : `${t('n.festivals', { n: v.total })} · ${t('list.tapToChange')}`}
            </span>
          </button>
          {isMonth && cur && (
            <a
              class="dock__arrow"
              href={next ? L(monthPath(next.key)) + qsNoQuery : undefined}
              aria-label={next ? t('list.nextMonth', { month: monthLabel(next.key, lang) }) : t('list.noLater')}
              aria-disabled={!next}
              role="link"
            >›</a>
          )}
          <span class="dock__divider" aria-hidden="true" />
          <button type="button" class="dock__filters" aria-haspopup="dialog" aria-label={fc ? t('list.filtersActive', { n: fc }) : t('list.filters')} onClick={() => setSheet('filters')}>
            <FilterIcon />
            {fc > 0 && <span class="dock__badge" aria-hidden="true">{fc}</span>}
          </button>
        </nav>
      </div>

      <Sheet id="sheet-months" title={t('list.chooseMonth')} open={sheet === 'months'} onClose={() => setSheet(null)}>
        <div class="months">
          <a class="row-link row-link--strong" href={L('/upcoming/') + qsNoQuery}>{t('list.allAsList')}<span class="meta">{v.upF.length}</span></a>
          {Object.entries(groupByYear(v.m12)).map(([y, ms]) => (
            <>
              <span class="months__year">{y}</span>
              <div class="months__grid">
                {ms.map((m) => {
                  const n = monthN(m.key);
                  const isCur = isMonth && cur?.key === m.key;
                  return (
                    <a
                      href={L(monthPath(m.key)) + qsNoQuery}
                      aria-current={isCur ? 'page' : undefined}
                      aria-label={`${monthName(lang, m.m)} ${m.y}, ${t('n.festivals', { n })}`}
                      class={`month-cell${isCur ? ' is-current' : n ? '' : ' is-empty'}`}
                    >
                      <strong>{monthShort(lang, m.m)}</strong>
                      <span>{n}</span>
                    </a>
                  );
                })}
              </div>
            </>
          ))}
          <a class="row-link row-link--top" href={L('/archive/') + qsNoQuery}>{t('list.archivePast')}<span class="meta">{v.arch.length}</span></a>
        </div>
      </Sheet>

      <Sheet
        id="sheet-filters"
        title={t('list.filters')}
        open={sheet === 'filters'}
        onClose={() => setSheet(null)}
        footer={
          <>
            <button type="button" class="link-btn" onClick={clearFilters}>{t('list.clearAll')}</button>
            <button type="button" class="btn btn--primary btn--grow" onClick={() => setSheet(null)}>{t('list.show', { n: v.total })}</button>
          </>
        }
      >
        <div class="filters">
          <fieldset class="fieldset">
            <legend class="label">{t('list.when')}</legend>
            <div class="when-grid">
              {([['any', t('list.anyTime')], ['30', t('list.next30')], ['90', t('list.next90')], ['custom', t('list.pickDates')]] as [When, string][]).map(([k, l]) => (
                <label class={`radio-card${f.when === k ? ' is-on' : ''}`}>
                  <input type="radio" name="when" checked={f.when === k} onChange={() => patch({ when: k })} />
                  {l}
                </label>
              ))}
            </div>
            {f.when === 'custom' && (
              <div class="when-grid">
                <label class="date-field">{t('list.from')}<input type="date" class="input input--sm" value={f.from} onChange={(e) => patch({ from: e.currentTarget.value })} /></label>
                <label class="date-field">{t('list.to')}<input type="date" class="input input--sm" value={f.to} onChange={(e) => patch({ to: e.currentTarget.value })} /></label>
              </div>
            )}
          </fieldset>
          <div class="fieldset">
            <label for="where" class="label">{t('list.where')}</label>
            <select id="where" class="input" value={f.where} onChange={(e) => patch({ where: e.currentTarget.value })}>
              <option value="">{t('list.anywhere', { n: v.up.length })}</option>
              <optgroup label={t('list.regions')}>{where.regions.map((o) => <option value={o.value}>{o.label}</option>)}</optgroup>
              <optgroup label={t('list.countries')}>{where.countries.map((o) => <option value={o.value}>{o.label}</option>)}</optgroup>
            </select>
          </div>
          {styles.length > 0 && (
            <div class="fieldset">
              <label for="style" class="label">{t('list.style')}</label>
              <select id="style" class="input" value={f.style} onChange={(e) => patch({ style: e.currentTarget.value })}>
                <option value="">{t('list.anyStyle')}</option>
                {styles.map((o) => <option value={o.value}>{o.label} ({o.n})</option>)}
              </select>
            </div>
          )}
          {anyCuban && (
            <label class="switch-row">
              {t('list.cubanOnly')}
              <input type="checkbox" role="switch" checked={f.cuban} onChange={(e) => patch({ cuban: e.currentTarget.checked })} />
            </label>
          )}
          <label class="switch-row">
            {t('list.savedOnly')}
            <input type="checkbox" role="switch" checked={f.savedOnly} onChange={(e) => patch({ savedOnly: e.currentTarget.checked })} />
          </label>
          <div class="fieldset">
            <label for="sort" class="label">{t('list.sort')}</label>
            <select id="sort" class="input" value={(f.sort === 'near' && !store.city) || (f.sort === 'me' && !me) ? 'date' : f.sort} onChange={(e) => pickSort(e.currentTarget.value as Sort)} aria-describedby={locating ? 'sort-note' : undefined}>
              <option value="date">{t('sort.date')}</option>
              <option value="length">{t('sort.length')}</option>
              <option value="me">{t('sort.me')}</option>
              {store.city && <option value="near">{t('sort.near', { city: cityLabel(store.city, lang) })}</option>}
              <option value="name">{t('sort.name')}</option>
            </select>
            {locating && <span id="sort-note" class="small-note" role="status">{t('list.locating')}</span>}
          </div>
        </div>
      </Sheet>
    </LangContext.Provider>
  );
}

function groupByYear<T extends { y: number }>(ms: T[]): Record<string, T[]> {
  const g: Record<string, T[]> = {};
  for (const m of ms) (g[m.y] ||= []).push(m);
  return g;
}

/** Bold the matched part of a suggestion. */
function Hl({ label, q }: { label: string; q: string }) {
  const h = highlight(label, norm(q));
  return <>{h.pre}<strong>{h.match}</strong>{h.post}</>;
}
