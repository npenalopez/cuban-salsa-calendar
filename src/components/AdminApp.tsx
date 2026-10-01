import { useEffect, useMemo, useState } from 'preact/hooks';
import { MON3 } from '../lib/dates';
import { norm } from '../lib/text';
import type { Festival, FestivalsFile } from '../lib/types';

const KEY = 'csc-admin-draft';
/** Field order in the exported file. */
const ORDER = ['id', 'series', 'name', 'status', 'startDate', 'endDate', 'datePrecision', 'dateNote', 'city', 'country', 'countryCode', 'region', 'venue', 'coordinates', 'priceText', 'priceFrom', 'currency', 'ticketUrl', 'website', 'instagram', 'artists', 'description', 'lastVerified', 'featured', 'notes'] as const;
const REGIONS = ['Europe', 'North America', 'South America', 'Africa', 'Asia', 'Oceania'];

const blank = (v: unknown) => v == null || String(v).trim() === '' || (Array.isArray(v) && !v.length);
const slug = (s: string) => norm(s).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const today = () => new Date().toISOString().slice(0, 10);

type Check = [key: string, label: string, test: (f: Festival) => boolean];
const CHECKS: Check[] = [
  ['dates', 'Exact dates', (f) => f.datePrecision !== 'day'],
  ['price', 'Price', (f) => blank(f.priceText)],
  ['links', 'Website or Instagram', (f) => blank(f.website) && blank(f.instagram)],
  ['ticket', 'Ticket link', (f) => blank(f.ticketUrl)],
  ['artists', 'Line-up', (f) => blank(f.artists)],
  ['description', 'Description', (f) => blank(f.description)],
  ['venue', 'Venue', (f) => blank(f.venue)],
  ['coordinates', 'Coordinates', (f) => !f.coordinates],
  ['verified', 'Last checked', (f) => blank(f.lastVerified)],
];
const PRIORITY = ['dates', 'links', 'artists', 'price'];
const missingOf = (f: Festival) => CHECKS.filter((c) => c[2](f)).map((c) => c[0]);
const incomplete = (miss: string[]) => miss.some((m) => PRIORITY.includes(m));

function fmtDate(f: Festival) {
  if (!f.startDate) return '—';
  const [y, m, d] = f.startDate.split('-').map(Number);
  const [y2, m2, d2] = (f.endDate || f.startDate).split('-').map(Number);
  if (f.datePrecision === 'year') return String(y);
  if (f.datePrecision === 'month') return `${f.dateNote ? f.dateNote + ' ' : ''}${MON3[m - 1]} ${y}`;
  return m2 !== m ? `${d} ${MON3[m - 1]} – ${d2} ${MON3[m2 - 1]} ${y2}` : `${d}${d2 !== d ? '–' + d2 : ''} ${MON3[m - 1]} ${y2}`;
}

/** Editor state: the record plus string lat/lng and the original id. */
type Edit = Omit<Festival, 'coordinates'> & { lat: string; lng: string; _orig: string | null };

const empty = (): Edit => ({
  id: '', series: '', name: '', status: 'scheduled', startDate: '', endDate: '', datePrecision: 'day', dateNote: null,
  city: '', country: '', countryCode: '', region: 'Europe', venue: null, priceText: null, priceFrom: null, currency: null,
  ticketUrl: null, website: null, instagram: null, artists: [], description: null, lastVerified: null, featured: false, notes: null,
  lat: '', lng: '', _orig: null,
});

function ordered(f: Record<string, unknown>) {
  const o: Record<string, unknown> = {};
  ORDER.forEach((k) => (o[k] = f[k] === undefined ? null : f[k]));
  Object.keys(f).forEach((k) => !(k in o) && (o[k] = f[k]));
  return o;
}

export default function AdminApp() {
  const [list, setList] = useState<Festival[]>([]);
  const [version, setVersion] = useState('');
  const [draft, setDraft] = useState(false);
  const [q, setQ] = useState('');
  const [missing, setMissing] = useState('all');
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 }>({ key: 'default', dir: 1 });
  const [edit, setEdit] = useState<Edit | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [artistInput, setArtistInput] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const toast = (m: string) => {
    setToastMsg(m);
    setTimeout(() => setToastMsg((cur) => (cur === m ? null : cur)), 2600);
  };

  const loadPublished = () =>
    fetch('/admin/festivals.json', { cache: 'no-store' })
      .then((r) => r.json() as Promise<FestivalsFile>)
      .then((j) => (setList(j.festivals), setVersion(j.version), setDraft(false)))
      .catch(() => toast("Couldn't load festivals.json"));

  useEffect(() => {
    try {
      const d = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (d && Array.isArray(d.festivals)) {
        setList(d.festivals);
        setVersion(d.version || '');
        setDraft(true);
        return;
      }
    } catch {
      /* fall through */
    }
    loadPublished();
  }, []);

  const persist = (next: Festival[]) => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ version, festivals: next }));
    } catch {
      toast("Couldn't save the draft in this browser");
    }
    setList(next);
    setDraft(true);
  };

  const pool = useMemo(() => {
    const m = new Map<string, string>();
    list.forEach((f) => (f.artists || []).forEach((a) => !m.has(norm(a)) && m.set(norm(a), a)));
    return [...m.values()].sort((a, b) => a.localeCompare(b));
  }, [list]);
  const countries = useMemo(() => [...new Set(list.map((f) => f.country).filter(Boolean) as string[])].sort(), [list]);

  // ---- table
  const all = list.map((f) => ({ f, miss: missingOf(f) }));
  const nq = norm(q);
  let rows = all.filter((x) => !nq || norm([x.f.id, x.f.name, x.f.city, x.f.country, ...(x.f.artists || [])].join(' ')).includes(nq));
  if (missing === 'incomplete') rows = rows.filter((x) => incomplete(x.miss));
  else if (missing !== 'all') rows = rows.filter((x) => x.miss.includes(missing));
  const val = ({ f }: { f: Festival }): string | number => {
    switch (sort.key) {
      case 'dates': return f.startDate || '9999';
      case 'price': return f.priceFrom == null ? Infinity : f.priceFrom;
      case 'artists': return (f.artists || []).length;
      default: return String((f as unknown as Record<string, unknown>)[sort.key] ?? '').toLowerCase();
    }
  };
  if (sort.key === 'default') rows.sort((a, b) => Number(incomplete(b.miss)) - Number(incomplete(a.miss)) || a.f.name.localeCompare(b.f.name));
  else rows.sort((a, b) => {
    const A = val(a);
    const B = val(b);
    return (A < B ? -1 : A > B ? 1 : 0) * sort.dir;
  });

  const stats: [string, string, number][] = [
    ['all', 'festivals', all.length],
    ['incomplete', 'missing key info', all.filter((x) => incomplete(x.miss)).length],
    ['links', 'no website or Instagram', all.filter((x) => x.miss.includes('links')).length],
    ['ticket', 'no ticket link', all.filter((x) => x.miss.includes('ticket')).length],
    ['dates', 'dates not exact', all.filter((x) => x.miss.includes('dates')).length],
  ];

  // ---- actions
  function exportJson() {
    const now = new Date();
    const v = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}-${list.length}`;
    const sorted = list.slice().sort((a, b) => (a.startDate || '9').localeCompare(b.startDate || '9') || a.name.localeCompare(b.name));
    const body = JSON.stringify({ version: v, updated: today(), festivals: sorted.map((f) => ordered(f as unknown as Record<string, unknown>)) }, null, 2) + '\n';
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([body], { type: 'application/json' }));
    a.download = 'festivals.json';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => (URL.revokeObjectURL(a.href), a.remove()), 800);
    toast('Exported festivals.json · version ' + v);
  }

  function onImport(e: Event) {
    const input = e.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    file.text().then((t) => {
      const j = JSON.parse(t);
      const l = Array.isArray(j) ? j : j.festivals;
      if (!Array.isArray(l)) throw new Error('bad');
      persist(l);
      toast(`Imported ${l.length} festivals`);
    }).catch(() => toast("That file isn't a valid festivals.json"));
    input.value = '';
  }

  const openEdit = (f: Festival) => {
    setEdit({ ...f, artists: [...(f.artists || [])], _orig: f.id, lat: f.coordinates ? String(f.coordinates[0]) : '', lng: f.coordinates ? String(f.coordinates[1]) : '' });
    setErrors([]);
    setArtistInput('');
  };
  const setE = (k: keyof Edit, v: unknown) => setEdit((e) => (e ? { ...e, [k]: v } : e));

  function validate(e: Edit): string[] {
    const er: string[] = [];
    if (blank(e.name)) er.push('Name is required.');
    if (blank(e.city)) er.push('City is required.');
    if (blank(e.country)) er.push('Country is required.');
    if (blank(e.startDate) || blank(e.endDate)) er.push("Start and end dates are required (use the month or year range if the days aren't known).");
    else if (e.endDate < e.startDate) er.push('End date is before start date.');
    const id = e.id || slug(e.name + '-' + (e.startDate || '').slice(0, 4));
    if (list.some((f) => f.id === id && f.id !== e._orig)) er.push(`Another festival already uses the id "${id}".`);
    if (id && !/^[a-z0-9-]+$/.test(id)) er.push('The id can only use a–z, 0–9 and hyphens.');
    (['ticketUrl', 'website', 'instagram'] as const).forEach((k) => {
      if (!blank(e[k]) && !/^https?:\/\/\S+\.\S+/.test(String(e[k]))) er.push(`${k} must be a full link starting with https://`);
    });
    if ((e.lat && isNaN(+e.lat)) || (e.lng && isNaN(+e.lng))) er.push('Coordinates must be numbers.');
    if (!blank(e.countryCode) && !/^[A-Za-z]{2}$/.test(String(e.countryCode))) er.push('Country code must be 2 letters.');
    if (!blank(e.currency) && !/^[A-Za-z]{3}$/.test(String(e.currency))) er.push('Currency must be a 3-letter code like EUR.');
    return er;
  }

  function save(ev?: Event) {
    ev?.preventDefault();
    if (!edit) return;
    const er = validate(edit);
    if (er.length) {
      setErrors(er);
      setTimeout(() => document.getElementById('ed-errors')?.focus(), 30);
      return;
    }
    const e = edit;
    const id = e.id || slug(e.name + '-' + e.startDate.slice(0, 4));
    const clean = (v: unknown) => (blank(v) ? null : typeof v === 'string' ? v.trim() : v);
    const f = {
      ...Object.fromEntries(ORDER.map((k) => [k, (e as unknown as Record<string, unknown>)[k] ?? null])),
      id,
      series: (clean(e.series) as string) || id.replace(/-20\d\d$/, ''),
      name: e.name.trim(),
      dateNote: clean(e.dateNote),
      city: clean(e.city),
      country: clean(e.country),
      countryCode: clean(e.countryCode) ? String(e.countryCode).toUpperCase() : null,
      venue: clean(e.venue),
      priceText: clean(e.priceText),
      priceFrom: blank(e.priceFrom) ? null : +e.priceFrom!,
      currency: clean(e.currency) ? String(e.currency).toUpperCase() : null,
      ticketUrl: clean(e.ticketUrl),
      website: clean(e.website),
      instagram: clean(e.instagram),
      description: clean(e.description),
      notes: clean(e.notes),
      lastVerified: clean(e.lastVerified),
      coordinates: e.lat && e.lng ? [+e.lat, +e.lng] : null,
      featured: !!e.featured,
    } as Festival;
    const isNew = e._orig == null;
    persist(isNew ? [...list, f] : list.map((x) => (x.id === e._orig ? f : x)));
    setEdit(null);
    toast((isNew ? 'Added ' : 'Saved ') + f.name);
  }

  function del(f: Festival) {
    if (!window.confirm(`Delete "${f.name}"? You can undo this by discarding the draft before exporting.`)) return;
    persist(list.filter((x) => x.id !== f.id));
    toast('Deleted ' + f.name);
  }

  function addArtist() {
    if (!edit) return;
    const v = artistInput.trim();
    if (!v) return;
    if (edit.artists.some((a) => norm(a) === norm(v))) return toast(v + ' is already listed');
    const match = pool.find((a) => norm(a) === norm(v));
    setEdit({ ...edit, artists: [...edit.artists, match || v] });
    setArtistInput('');
  }

  const cols: [string, string][] = [['name', 'Festival'], ['dates', 'Dates'], ['city', 'City'], ['country', 'Country'], ['region', 'Region'], ['status', 'Status'], ['price', 'Price'], ['artists', 'Artists']];

  return (
    <div class="admin">
      <header class="admin__header">
        <div class="admin__header-inner">
          <div class="admin__title">
            <span class="kicker">/admin · behind Cloudflare Access</span>
            <h1>Festival data</h1>
          </div>
          <span class="meta">{draft ? `Unpublished draft · ${list.length} festivals` : `Published file · ${version} · ${list.length} festivals`}</span>
          <button type="button" class="btn" onClick={() => (setEdit(empty()), setErrors([]), setArtistInput(''))}>+ Add festival</button>
          <label class="btn admin__import">Import JSON<input type="file" accept="application/json,.json" onChange={onImport} /></label>
          <button type="button" class="btn btn--primary admin__export" onClick={exportJson}>Export festivals.json</button>
        </div>
      </header>

      <main class="admin__main">
        <p class="admin__intro">
          Edits are saved as a draft in this browser only. To publish, export <code>festivals.json</code>, replace <code>data/festivals.json</code> in the repo, and push. Cloudflare rebuilds the site in about a minute.
        </p>
        {draft && (
          <button type="button" class="link-btn" onClick={() => {
            if (!window.confirm('Discard all unpublished edits?')) return;
            try { localStorage.removeItem(KEY); } catch { /* ignore */ }
            loadPublished();
            toast('Draft discarded');
          }}>Discard draft and reload the published file</button>
        )}

        <div role="group" aria-label="Quick filters" class="admin__stats">
          {stats.map(([k, l, n]) => (
            <button type="button" aria-pressed={missing === k} class={`stat${missing === k ? ' is-on' : ''}`} onClick={() => setMissing(k)}>
              <strong>{n}</strong><span>{l}</span>
            </button>
          ))}
        </div>

        <div class="admin__bar">
          <label for="q" class="sr-only">Search</label>
          <input id="q" type="search" class="input admin__search" placeholder="Search name, city, country, artist or id" value={q} onInput={(e) => setQ(e.currentTarget.value)} />
          <label for="miss" class="meta">Show</label>
          <select id="miss" class="input admin__select" value={missing} onChange={(e) => setMissing(e.currentTarget.value)}>
            <option value="all">All festivals</option>
            <option value="incomplete">Missing key info (dates, links, line-up, price)</option>
            {CHECKS.map((c) => <option value={c[0]}>Missing: {c[1]}</option>)}
          </select>
          <span aria-live="polite" class="meta">{rows.length} shown</span>
        </div>

        <div class="admin__table-wrap">
          <table class="admin__table">
            <thead>
              <tr>
                {cols.map(([key, label]) => (
                  <th scope="col" aria-sort={sort.key === key ? (sort.dir > 0 ? 'ascending' : 'descending') : 'none'}>
                    <button type="button" onClick={() => setSort((s) => (s.key === key ? { key, dir: s.dir > 0 ? -1 : 1 } : { key, dir: 1 }))}>
                      {label}<span aria-hidden="true">{sort.key === key ? (sort.dir > 0 ? '▲' : '▼') : '↕'}</span>
                    </button>
                  </th>
                ))}
                <th scope="col">Missing</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ f, miss }) => (
                <tr>
                  <td class="admin__name"><button type="button" onClick={() => openEdit(f)}>{f.name}</button><div class="admin__id">{f.id}</div></td>
                  <td class="nowrap">{fmtDate(f)}<div class="admin__sub">{f.datePrecision === 'day' ? '' : f.datePrecision === 'month' ? 'month only' : 'year only'}</div></td>
                  <td>{f.city || '—'}</td>
                  <td>{f.country || '—'}</td>
                  <td>{f.region || '—'}</td>
                  <td><span class={`badge badge--${f.status} admin__status`}>{f.status}</span></td>
                  <td class="admin__price">{f.priceText || '—'}</td>
                  <td class="num">{(f.artists || []).length}</td>
                  <td class={`admin__miss${incomplete(miss) ? ' is-bad' : ''}`}>{miss.length ? CHECKS.filter((c) => miss.includes(c[0])).map((c) => c[1]).join(', ') : 'Complete'}</td>
                  <td class="nowrap admin__actions">
                    <button type="button" class="btn btn--sm" aria-label={`Edit ${f.name}`} onClick={() => openEdit(f)}>Edit</button>
                    <button type="button" class="admin__del" aria-label={`Delete ${f.name}`} onClick={() => del(f)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <p class="admin__none">No festivals match.</p>}
        </div>
      </main>

      {edit && (
        <Editor
          edit={edit}
          isNew={edit._orig == null}
          errors={errors}
          setE={setE}
          onSave={save}
          onClose={() => setEdit(null)}
          countries={countries}
          pool={pool}
          artistInput={artistInput}
          setArtistInput={setArtistInput}
          addArtist={addArtist}
          markChecked={() => (setE('lastVerified', today()), toast('Marked as checked today'))}
        />
      )}
      <div aria-live="polite" class="toast-wrap admin__toast">{toastMsg && <div class="toast">{toastMsg}</div>}</div>
    </div>
  );
}

interface EditorProps {
  edit: Edit;
  isNew: boolean;
  errors: string[];
  setE: (k: keyof Edit, v: unknown) => void;
  onSave: (e?: Event) => void;
  onClose: () => void;
  countries: string[];
  pool: string[];
  artistInput: string;
  setArtistInput: (v: string) => void;
  addArtist: () => void;
  markChecked: () => void;
}

type FieldOpts = { req?: boolean; wide?: boolean; type?: string; ph?: string; hint?: string; mono?: boolean; list?: string; kind?: 'select' | 'text' | 'check'; options?: (string | [string, string])[]; rows?: number; checkLabel?: string };

function Editor(p: EditorProps) {
  const e = p.edit;
  const tried = p.errors.length > 0;
  const F = (key: keyof Edit, label: string, o: FieldOpts = {}) => {
    const v = e[key];
    const bad = tried && o.req && blank(v);
    const common = { 'aria-invalid': bad || undefined };
    return (
      <label class="ed-field" style={o.wide ? 'grid-column:1 / -1' : undefined}>
        {label}{o.req ? ' *' : ''}
        {o.kind === 'select' ? (
          <select class="input input--sm" value={String(v ?? '')} onChange={(ev) => p.setE(key, ev.currentTarget.value)}>
            {(o.options || []).map((x) => (Array.isArray(x) ? <option value={x[0]}>{x[1]}</option> : <option value={x}>{x}</option>))}
          </select>
        ) : o.kind === 'text' ? (
          <textarea class="input" rows={o.rows || 3} placeholder={o.ph} value={String(v ?? '')} onInput={(ev) => p.setE(key, ev.currentTarget.value)} />
        ) : o.kind === 'check' ? (
          <span class="check-row"><input type="checkbox" checked={!!v} onChange={(ev) => p.setE(key, ev.currentTarget.checked)} />{o.checkLabel}</span>
        ) : (
          <input
            class={`input input--sm${o.mono ? ' mono' : ''}`}
            type={o.type || 'text'}
            list={o.list}
            placeholder={o.ph}
            value={String(v ?? '')}
            onInput={(ev) => p.setE(key, ev.currentTarget.value)}
            {...common}
          />
        )}
        {o.hint && <span class="ed-hint">{o.hint}</span>}
      </label>
    );
  };

  return (
    <dialog
      ref={(el) => {
        if (el && !el.open) el.showModal();
      }}
      class="ed-dialog"
      aria-labelledby="ed-title"
      onCancel={(ev) => (ev.preventDefault(), p.onClose())}
      onClick={(ev) => ev.target === ev.currentTarget && p.onClose()}
    >
      <form
        class="ed"
        noValidate
        onSubmit={p.onSave}
        onKeyDown={(ev) => {
          if ((ev.metaKey || ev.ctrlKey) && ev.key === 's') {
            ev.preventDefault();
            p.onSave();
          }
        }}
      >
        <div class="ed__head">
          <h2 id="ed-title" class="sheet__title">{p.isNew ? 'Add festival' : 'Edit festival'}</h2>
          <button type="button" class="icon-btn" aria-label="Close without saving" onClick={p.onClose}>✕</button>
        </div>
        <div class="ed__body">
          {tried && (
            <div id="ed-errors" tabIndex={-1} role="alert" class="error-summary"><strong>Can't save yet.</strong><span>{p.errors.join(' ')}</span></div>
          )}
          <fieldset class="ed-group">
            <legend class="label">Basics</legend>
            {F('name', 'Name', { req: true, wide: true })}
            {F('id', 'ID (used in the URL)', { mono: true, ph: 'auto from name + year', hint: 'Changing it breaks old links.' })}
            {F('series', 'Series', { mono: true, ph: 'auto', hint: 'Same value links editions across years.' })}
            {F('status', 'Status', { kind: 'select', options: [['scheduled', 'Scheduled'], ['postponed', 'Postponed'], ['cancelled', 'Cancelled'], ['sold-out', 'Sold out']] })}
            {F('featured', 'Listing', { kind: 'check', checkLabel: 'Featured (sponsored)' })}
          </fieldset>
          <fieldset class="ed-group">
            <legend class="label">Dates</legend>
            {F('datePrecision', 'Known to', { kind: 'select', options: [['day', 'Exact days'], ['month', 'Month only'], ['year', 'Year only']] })}
            {F('startDate', 'Start', { type: 'date', req: true })}
            {F('endDate', 'End', { type: 'date', req: true })}
            {F('dateNote', 'Note', { ph: 'Mid, Early, Fall edition…', hint: 'Shown in place of days when known to the month.' })}
          </fieldset>
          <fieldset class="ed-group">
            <legend class="label">Place</legend>
            {F('city', 'City', { req: true })}
            {F('country', 'Country', { req: true, list: 'dl-countries' })}
            {F('countryCode', 'Country code', { ph: 'ES', hint: '2 letters, for the flag.' })}
            {F('region', 'Region', { kind: 'select', options: REGIONS })}
            {F('venue', 'Venue', { wide: true })}
            {F('lat', 'Latitude', { ph: '41.46' })}
            {F('lng', 'Longitude', { ph: '12.62' })}
          </fieldset>
          <fieldset class="ed-group">
            <legend class="label">Price and links</legend>
            {F('priceText', 'Price as shown', { wide: true, ph: 'Full pass from €80 (empty = not announced)' })}
            {F('priceFrom', 'From (number)', { ph: '80' })}
            {F('currency', 'Currency', { ph: 'EUR' })}
            {F('ticketUrl', 'Ticket link (Get passes)', { wide: true, type: 'url', ph: 'https://' })}
            {F('website', 'Website', { type: 'url', ph: 'https://' })}
            {F('instagram', 'Instagram profile', { type: 'url', ph: 'https://www.instagram.com/…' })}
          </fieldset>
          <fieldset class="ed-group">
            <legend class="label">Text</legend>
            {F('description', 'Public description', { kind: 'text', wide: true, rows: 4 })}
            {F('notes', 'Private notes (never published)', { kind: 'text', wide: true, rows: 2 })}
            {F('lastVerified', 'Last checked', { type: 'date' })}
          </fieldset>
          <datalist id="dl-countries">{p.countries.map((c) => <option value={c} />)}</datalist>

          <fieldset class="ed-lineup">
            <legend class="label">Line-up · {e.artists.length} {e.artists.length === 1 ? 'artist' : 'artists'}</legend>
            <div class="ed-chips">
              {e.artists.map((a, i) => (
                <span class="ed-chip">{a}<button type="button" aria-label={`Remove ${a}`} onClick={() => p.setE('artists', e.artists.filter((_, j) => j !== i))}>✕</button></span>
              ))}
            </div>
            <div class="ed-add">
              <label for="add-artist" class="sr-only">Add artist</label>
              <input
                id="add-artist"
                class="input input--sm"
                list="dl-artists"
                placeholder="Add an artist (suggestions from the database)"
                value={p.artistInput}
                onInput={(ev) => p.setArtistInput(ev.currentTarget.value)}
                onKeyDown={(ev) => ev.key === 'Enter' && (ev.preventDefault(), p.addArtist())}
              />
              <button type="button" class="btn" onClick={p.addArtist}>Add</button>
            </div>
            <datalist id="dl-artists">{p.pool.map((a) => <option value={a} />)}</datalist>
          </fieldset>
        </div>
        <div class="ed__foot">
          <button type="button" class="link-btn" onClick={p.markChecked}>Mark as checked today</button>
          <span style="flex:1" />
          <button type="button" class="btn" onClick={p.onClose}>Cancel</button>
          <button type="submit" class="btn btn--primary">{p.isNew ? 'Add festival' : 'Save changes'}</button>
        </div>
      </form>
    </dialog>
  );
}
