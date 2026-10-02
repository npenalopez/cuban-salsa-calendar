import { useEffect, useState } from 'preact/hooks';
import type { City } from '../lib/types';

export type Theme = 'system' | 'light' | 'dark';
export type SheetName = 'menu' | 'artists' | 'city' | 'feeds' | 'cal';

export interface StoreState {
  saved: string[];
  recent: string[];
  city: City | null;
  theme: Theme;
  sheet: { name: SheetName; id?: string } | null;
  toast: string | null;
}

/** What the server renders with. Islands start from this so hydration matches. */
export const SSR_STATE: StoreState = { saved: [], recent: [], city: null, theme: 'light', sheet: null, toast: null };

function ls<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}
function lsSet(key: string, v: unknown) {
  try {
    if (v == null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(v));
  } catch {
    /* storage blocked: keep in memory only */
  }
}

let state: StoreState = SSR_STATE;
let loaded = false;
const subs = new Set<() => void>();

function load() {
  if (loaded || typeof window === 'undefined') return;
  loaded = true;
  const theme = ls<Theme>('csc-theme');
  state = {
    ...state,
    saved: ls<string[]>('csc-saved') || [],
    recent: ls<string[]>('csc-recent') || [],
    city: ls<City>('csc-city'),
    theme: theme === 'dark' || theme === 'system' ? theme : 'light',
  };
  // Another tab changed the saved list.
  window.addEventListener('storage', (e) => {
    if (e.key === 'csc-saved') set({ saved: ls<string[]>('csc-saved') || [] });
  });
}

function set(patch: Partial<StoreState>) {
  state = { ...state, ...patch };
  subs.forEach((fn) => fn());
}

export function getState(): StoreState {
  load();
  return state;
}

/** Subscribe to the store. Returns SSR_STATE on the first render, then the real state. */
export function useStore(): StoreState {
  const [s, setS] = useState<StoreState>(SSR_STATE);
  useEffect(() => {
    load();
    const fn = () => setS(state);
    subs.add(fn);
    fn();
    return () => void subs.delete(fn);
  }, []);
  return s;
}

let toastTimer: ReturnType<typeof setTimeout> | undefined;
export function toast(msg: string) {
  clearTimeout(toastTimer);
  set({ toast: msg });
  toastTimer = setTimeout(() => set({ toast: null }), 2600);
}

export function toggleSaved(id: string) {
  const { saved } = getState();
  const has = saved.includes(id);
  const next = has ? saved.filter((x) => x !== id) : [...saved, id];
  lsSet('csc-saved', next);
  set({ saved: next });
  toast(has ? 'Removed from saved' : 'Saved');
}

export function saveAll(ids: string[]) {
  const next = Array.from(new Set([...getState().saved, ...ids]));
  lsSet('csc-saved', next);
  set({ saved: next });
  toast('Added to your saved list');
}

export function addRecent(v: string) {
  if (!v || v.length < 2) return;
  const next = [v, ...getState().recent.filter((x) => x !== v)].slice(0, 5);
  lsSet('csc-recent', next);
  set({ recent: next });
}
export function clearRecent() {
  lsSet('csc-recent', null);
  set({ recent: [] });
}

export function setCity(city: City | null) {
  lsSet('csc-city', city);
  set({ city });
}

export function setTheme(theme: Theme) {
  // Light is the default, so it needs no stored value or attribute.
  lsSet('csc-theme', theme === 'light' ? null : theme);
  if (theme === 'light') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = theme;
  set({ theme });
  window.dispatchEvent(new Event('csc-theme'));
}

export const openSheet = (name: SheetName, id?: string) => set({ sheet: { name, id } });
export const closeSheet = () => set({ sheet: null });

/** True once mounted in the browser. */
export function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}

export function isDark(): boolean {
  const t = document.documentElement.dataset.theme;
  if (t === 'system') return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  return t === 'dark';
}
