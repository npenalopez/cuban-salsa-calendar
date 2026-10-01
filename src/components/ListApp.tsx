import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { allFestivals } from '../client/data';
import { download, share } from '../client/share';
import { addRecent, clearRecent, openSheet, saveAll, toggleSaved, useMounted, useStore } from '../client/store';
import { MONTHS, dateLong, monthLabel, monthPath, pISO, plural, startOfToday } from '../lib/dates';
import { cardVM, festivalPath, place } from '../lib/festivals';
import { icsCalendar } from '../lib/ics';
import {
  DEFAULT_FILTERS, computeView, filterCount, filterSummary, filtersQuery, parseFilters, whereOptions,
  type Filters, type PageRoute, type When,
} from '../lib/listing';
import { didYouMean, suggestions, type Suggestion } from '../lib/search';
import { highlight, norm } from '../lib/text';
import { FestivalCard } from './FestivalCard';
import { MapView, type MapPoint } from './MapView';
import { FilterIcon, SearchIcon, Segmented, Sheet } from './ui';

interface Props {
  route: PageRoute;
  /** Build date (YYYY-MM-DD): used for the server render and the first client render. */
  buildToday: string;
}

export default function ListApp({ route, buildToday }: Props) {
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
  const clearFilters = () => patch({ where: '', savedOnly: false, when: 'any', sort: 'date', from: '', to: '' });

  const v = computeView(all, today, route, f, store.saved, shared);
  const fc = filterCount(f);
  const hasQuery = f.q.trim().length > 0;
  const isMonth = v.mode === 'month';
  const qsNoQuery = filtersQuery(f, { keepQuery: false });

  // ---- search
  const groups = searchOpen ? suggestions(v.up, f.q, store.recent) : [];
  const flat: Suggestion[] = groups.flatMap((g) => g.items);
  const pick = (s: Suggestion) => {
    setSearchOpen(false);
    setFocusIdx(-1);
    if (s.type === 'festival') {
      location.href = festivalPath(s.id);
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
  const otherLabel = { search: plural(v.total, 'result'), archive: 'Archive', saved: v.title, range: v.title, all: 'All upcoming', tba: 'Dates TBA', month: '' }[v.mode];

  // ---- map
  const items = v.sections.flatMap((s) => s.items);
  const points: MapPoint[] = items.filter((x) => x.coordinates).map((x) => ({
    id: x.id, lat: x.coordinates![0], lng: x.coordinates![1], name: x.name, href: festivalPath(x.id), when: dateLong(x), place: place(x),
  }));
  const mapView = f.view === 'map';

  const where = whereOptions(v.up);
  const savedCount = store.saved.length;
  const showShared = route.name === 'saved' && shared && shared.some((id) => !store.saved.includes(id));
  const awaitingClient = route.name === 'saved' && !mounted;

  return (
    <>
      <div class="search">
        <label for="search" class="sr-only">Search festivals</label>
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
            placeholder="Festival, city, country or artist"
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
            <button type="button" class="search__clear" aria-label="Clear search" onClick={() => (patch({ q: '' }), setFocusIdx(-1), searchRef.current?.focus())}>✕</button>
          )}
        </div>
        {flat.length > 0 && (
          <div id="search-list" role="listbox" aria-label="Suggestions" class="suggest">
            {groups.map((g) => (
              <div role="group" aria-label={g.title}>
                <div class="suggest__head">
                  <span class="label">{g.title}</span>
                  {g.canClear && <button type="button" class="link-btn suggest__clear" onMouseDown={(e) => (e.preventDefault(), clearRecent())}>Clear</button>}
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
            {hasQuery && <div class="suggest__hint">Press Enter to see all results for "{f.q}"</div>}
          </div>
        )}
      </div>

      {!hasQuery && (isMonth || v.mode === 'all' || v.mode === 'tba') && (
        <nav aria-label="Explore" class="explore">
          <a class="pill" href="/saved/">♡ Saved{savedCount ? ` (${savedCount})` : ''}</a>
          <button type="button" class="pill" aria-haspopup="dialog" onClick={() => openSheet('artists')}>★ Top artists</button>
          <button type="button" class="pill" aria-haspopup="dialog" onClick={() => openSheet('city')}>Travel times</button>
          <a class="pill" href="/archive/">Archive</a>
          <a class="pill" href="/submit/">Submit a festival</a>
        </nav>
      )}
      {!isMonth && <a class="back-pill" href="/">← Back to upcoming festivals</a>}

      <div class="page-head">
        <span class="kicker">{awaitingClient ? 'Saved' : v.kicker}</span>
        <h1 class="page-title" id="page-title">{v.title}</h1>
        {v.note && <p class="page-note">{v.note}</p>}
        {fc > 0 && (
          <div class="filtered">
            <span>{filterSummary(f, v.up)}</span>
            <button type="button" class="link-btn" onClick={clearFilters}>Clear filters</button>
          </div>
        )}
      </div>

      {showShared && (
        <div class="banner">
          <span>Someone shared {plural(shared!.length, 'festival')} with you.</span>
          <button type="button" class="btn" onClick={() => saveAll(shared!)}>Save all to my list</button>
        </div>
      )}
      {route.name === 'saved' && !shared && savedCount > 0 && (
        <div class="btn-row">
          <button type="button" class="btn" onClick={() => share('My Cuban salsa festivals', `${location.origin}/saved/?ids=${store.saved.join(',')}`)}>Share my list</button>
          <button
            type="button"
            class="btn"
            onClick={() => download('my-cuban-salsa-festivals.ics', icsCalendar(all.filter((x) => store.saved.includes(x.id) && !x.arch), 'My Cuban salsa festivals'), 'text/calendar;charset=utf-8')}
          >Add all to calendar (.ics)</button>
        </div>
      )}

      <div class={route.name === 'saved' ? 'saved-area' : undefined}>
      {(v.total > 0 || mapView) && !awaitingClient && (
        <div role="group" aria-label="View as" class="toggle">
          {(['list', 'map'] as const).map((k) => (
            <button type="button" aria-pressed={f.view === k} onClick={() => patch({ view: k })}>{k === 'list' ? 'List' : 'Map'}</button>
          ))}
        </div>
      )}

      <p aria-live="polite" class="sr-only">{mounted ? plural(v.total, 'festival') + ' shown' : ''}</p>

      {awaitingClient ? (
        <div class="grid" aria-busy="true" aria-label="Loading festivals">
          {[1, 0.8, 0.6, 0.4].map((o) => <div class="skeleton" style={{ opacity: o }} />)}
        </div>
      ) : mapView ? (
        <div class="map-wrap">
          <MapView points={points} label="Map of festivals" />
          <span class="meta">{plural(points.length, 'festival')} on the map. Tap a pin for details.</span>
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
                <h2 class="sr-only">{v.mode === 'month' && v.monthKey ? `Festivals in ${monthLabel(v.monthKey)}` : 'Festivals'}</h2>
              )}
              <div class="grid">
                {s.items.map((x) => (
                  <FestivalCard card={cardVM(x, all, store.city)} saved={store.saved.includes(x.id)} onSave={toggleSaved} onCal={(id) => openSheet('cal', id)} />
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
            <span class="empty__text">Did you mean <button type="button" class="link-btn" onClick={() => patch({ q: dym })}>{dym}</button>?</span>
          )}
          <div class="btn-row">
            {fc > 0 && <button type="button" class="btn" onClick={clearFilters}>Clear filters</button>}
            <a class="empty__submit" href="/submit/">Know a festival? Submit it</a>
          </div>
        </div>
      )}

      </div>

      {isMonth && next && (
        <a class="next-month" href={monthPath(next.key) + qsNoQuery}>Next: {monthLabel(next.key)} · {monthN(next.key)} ›</a>
      )}

      <div class={`dock-wrap${dockHidden && !sheet && !store.sheet ? ' is-hidden' : ''}`}>
        <nav aria-label="Browse by month" class="dock">
          {isMonth && cur ? (
            <a
              class="dock__arrow"
              href={prev ? monthPath(prev.key) + qsNoQuery : undefined}
              aria-label={prev ? `Previous month, ${monthLabel(prev.key)}` : 'No earlier month'}
              aria-disabled={!prev}
              role="link"
            >‹</a>
          ) : (
            <a class="dock__today" href="/" aria-label="Back to upcoming festivals, this month">‹ Today</a>
          )}
          <button
            type="button"
            class="dock__center"
            aria-haspopup="dialog"
            aria-label={isMonth && cur ? `Choose month. Now showing ${monthLabel(cur.key)}, ${plural(monthN(cur.key), 'festival')}` : `Choose month. Now showing ${otherLabel}`}
            onClick={() => setSheet('months')}
          >
            <span class="dock__label">{isMonth ? (cur ? monthLabel(cur.key) : v.title) : otherLabel} ▴</span>
            <span class="dock__sub">
              {isMonth && cur ? `${plural(monthN(cur.key), 'festival')} · ${i + 1} of 12` : v.mode === 'search' ? `for "${f.q.trim()}"` : `${plural(v.total, 'festival')} · tap to change`}
            </span>
          </button>
          {isMonth && cur && (
            <a
              class="dock__arrow"
              href={next ? monthPath(next.key) + qsNoQuery : undefined}
              aria-label={next ? `Next month, ${monthLabel(next.key)}` : 'No later month'}
              aria-disabled={!next}
              role="link"
            >›</a>
          )}
          <span class="dock__divider" aria-hidden="true" />
          <button type="button" class="dock__filters" aria-haspopup="dialog" aria-label={`Filters${fc ? `, ${fc} active` : ''}`} onClick={() => setSheet('filters')}>
            <FilterIcon />
            {fc > 0 && <span class="dock__badge" aria-hidden="true">{fc}</span>}
          </button>
        </nav>
      </div>

      <Sheet id="sheet-months" title="Choose a month" open={sheet === 'months'} onClose={() => setSheet(null)}>
        <div class="months">
          <a class="row-link row-link--strong" href={'/upcoming/' + qsNoQuery}>All upcoming, as one list<span class="meta">{v.upF.length}</span></a>
          {Object.entries(groupByYear(v.m12)).map(([y, ms]) => (
            <>
              <span class="months__year">{y}</span>
              <div class="months__grid">
                {ms.map((m) => {
                  const n = monthN(m.key);
                  const isCur = isMonth && cur?.key === m.key;
                  return (
                    <a
                      href={monthPath(m.key) + qsNoQuery}
                      aria-current={isCur ? 'page' : undefined}
                      aria-label={`${MONTHS[m.m]} ${m.y}, ${plural(n, 'festival')}`}
                      class={`month-cell${isCur ? ' is-current' : n ? '' : ' is-empty'}`}
                    >
                      <strong>{MONTHS[m.m].slice(0, 3)}</strong>
                      <span>{n}</span>
                    </a>
                  );
                })}
              </div>
            </>
          ))}
          <a class="row-link row-link--top" href={'/dates-tba/' + qsNoQuery}>Dates to be announced<span class="meta">{v.upF.filter((x) => x.tba).length}</span></a>
          <a class="row-link row-link--top" href={'/archive/' + qsNoQuery}>Archive · past festivals<span class="meta">{v.arch.length}</span></a>
        </div>
      </Sheet>

      <Sheet
        id="sheet-filters"
        title="Filters"
        open={sheet === 'filters'}
        onClose={() => setSheet(null)}
        footer={
          <>
            <button type="button" class="link-btn" onClick={clearFilters}>Clear all</button>
            <button type="button" class="btn btn--primary btn--grow" onClick={() => setSheet(null)}>Show {plural(v.total, 'festival')}</button>
          </>
        }
      >
        <div class="filters">
          <fieldset class="fieldset">
            <legend class="label">When</legend>
            <div class="when-grid">
              {([['any', 'Any time'], ['30', 'Next 30 days'], ['90', 'Next 3 months'], ['custom', 'Pick dates']] as [When, string][]).map(([k, l]) => (
                <label class={`radio-card${f.when === k ? ' is-on' : ''}`}>
                  <input type="radio" name="when" checked={f.when === k} onChange={() => patch({ when: k })} />
                  {l}
                </label>
              ))}
            </div>
            {f.when === 'custom' && (
              <div class="when-grid">
                <label class="date-field">From<input type="date" class="input input--sm" value={f.from} onChange={(e) => patch({ from: e.currentTarget.value })} /></label>
                <label class="date-field">To<input type="date" class="input input--sm" value={f.to} onChange={(e) => patch({ to: e.currentTarget.value })} /></label>
              </div>
            )}
          </fieldset>
          <div class="fieldset">
            <label for="where" class="label">Where</label>
            <select id="where" class="input" value={f.where} onChange={(e) => patch({ where: e.currentTarget.value })}>
              <option value="">Anywhere ({v.up.length})</option>
              <optgroup label="Regions">{where.regions.map((o) => <option value={o.value}>{o.label}</option>)}</optgroup>
              <optgroup label="Countries">{where.countries.map((o) => <option value={o.value}>{o.label}</option>)}</optgroup>
            </select>
          </div>
          <label class="switch-row">
            Only saved festivals
            <input type="checkbox" role="switch" checked={f.savedOnly} onChange={(e) => patch({ savedOnly: e.currentTarget.checked })} />
          </label>
          <Segmented name="sort" legend="Sort" value={f.sort} options={[['date', 'Date'], ['name', 'Name A–Z']]} onChange={(s) => patch({ sort: s })} />
        </div>
      </Sheet>
    </>
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
