import { useEffect, useRef } from 'preact/hooks';
import type * as MapLibre from 'maplibre-gl';
import type { FeatureCollection, Point } from 'geojson';
import { isDark } from '../client/store';
import mapCss from 'maplibre-gl/dist/maplibre-gl.css?url';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';

export interface MapPoint {
  id: string;
  lat: number;
  lng: number;
  name: string;
  href?: string;
  when?: string;
  place?: string;
}

type ML = typeof MapLibre;
let libP: Promise<ML> | null = null;

const addCss = (href: string) =>
  new Promise<void>((resolve) => {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = href;
    l.onload = l.onerror = () => resolve();
    document.head.appendChild(l);
  });

/** Load MapLibre and its CSS only when a map is first shown. */
function loadLib(): Promise<ML> {
  libP ??= (async () => {
    const [lib] = await Promise.all([import('maplibre-gl'), addCss(mapCss)]);
    lib.setWorkerUrl(workerUrl);
    return lib;
  })();
  return libP;
}

// ---------------------------------------------------------------- style
// OpenFreeMap's Positron (vector tiles from OpenStreetMap, free, no key), recoloured in the site palette.
const BASE = 'https://tiles.openfreemap.org/styles/positron';
let baseP: Promise<MapLibre.StyleSpecification> | null = null;
const loadBase = () => (baseP ??= fetch(BASE).then((r) => r.json()));

const PALETTE = {
  light: { land: '#F6EDE3', park: '#ECE5D2', wood: '#E6E0CC', water: '#C9D5E3', building: '#EDE2D5', road: '#FFFFFF', minor: '#FBF6F0', casing: '#E2D6C8', rail: '#E2D6C8', border: '#B9A99A', label: '#45475F', place: '#1C1F3D', waterLabel: '#5C6F96', halo: '#F6EDE3' },
  dark: { land: '#1C1F3D', park: '#20243F', wood: '#222642', water: '#11132A', building: '#24284A', road: '#383A52', minor: '#2A2D4A', casing: '#2A2D4A', rail: '#2A2D4A', border: '#5A5C78', label: '#C9C6D6', place: '#F6EDE3', waterLabel: '#8C9BC4', halo: '#15172B' },
};

function themed(base: MapLibre.StyleSpecification, dark: boolean): MapLibre.StyleSpecification {
  const c = dark ? PALETTE.dark : PALETTE.light;
  const layers = base.layers
    // No road shields or airport labels: a calmer map.
    .filter((l) => !/shield|airport|aeroway/.test(l.id))
    .map((l) => {
      const paint = { ...(('paint' in l && l.paint) || {}) } as Record<string, unknown>;
      const layout = { ...(('layout' in l && l.layout) || {}) } as Record<string, unknown>;
      const id = l.id;
      if (l.type === 'background') paint['background-color'] = c.land;
      else if (l.type === 'fill') {
        paint['fill-color'] = /water/.test(id) ? c.water : /park/.test(id) ? c.park : /wood|grass|glacier|ice/.test(id) ? c.wood : /building/.test(id) ? c.building : c.land;
        if (/building/.test(id)) paint['fill-outline-color'] = c.casing;
      } else if (l.type === 'line') {
        paint['line-color'] = /water/.test(id) ? c.water : /boundary/.test(id) ? c.border : /rail/.test(id) ? c.rail : /casing/.test(id) ? c.casing : /minor|path|pier/.test(id) ? c.minor : c.road;
      } else if (l.type === 'symbol') {
        // English names (falling back to the local one) instead of "Morocco المغرب".
        if (JSON.stringify(layout['text-field'] ?? '').includes('name')) layout['text-field'] = ['coalesce', ['get', 'name_en'], ['get', 'name:latin'], ['get', 'name']];
        paint['text-color'] = /water/.test(id) ? c.waterLabel : /label_(city|country|state|town)/.test(id) ? c.place : c.label;
        paint['text-halo-color'] = c.halo;
        paint['text-halo-width'] = 1.2;
      }
      return { ...l, paint, layout } as MapLibre.LayerSpecification;
    });
  return { ...base, layers, projection: { type: 'globe' } } as MapLibre.StyleSpecification;
}

// ---------------------------------------------------------------- component
const esc = (s: string) => s.replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]!);
const CORAL = '#FF6B4A';
const NAVY = '#1C1F3D';
const CREAM = '#F6EDE3';

function toGeoJSON(points: MapPoint[]): FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: points.map((p) => ({ type: 'Feature', geometry: { type: 'Point', coordinates: [p.lng, p.lat] }, properties: { ...p } })),
  };
}

export function MapView({ points, single, label }: { points: MapPoint[]; single?: boolean; label: string }) {
  const el = useRef<HTMLDivElement>(null);
  const ref = useRef<{ lib: ML; map: MapLibre.Map; points: MapPoint[] } | null>(null);
  const latest = useRef(points);
  latest.current = points;

  function addData(map: MapLibre.Map) {
    if (map.getSource('festivals')) return;
    map.addSource('festivals', { type: 'geojson', data: toGeoJSON(latest.current), cluster: !single, clusterRadius: 42, clusterMaxZoom: 7 });
    map.addLayer({
      id: 'clusters', type: 'circle', source: 'festivals', filter: ['has', 'point_count'],
      paint: {
        'circle-color': NAVY,
        'circle-stroke-color': CREAM,
        'circle-stroke-width': 2,
        'circle-radius': ['step', ['get', 'point_count'], 15, 10, 19, 40, 24],
      },
    });
    map.addLayer({
      id: 'cluster-count', type: 'symbol', source: 'festivals', filter: ['has', 'point_count'],
      layout: { 'text-field': ['get', 'point_count_abbreviated'], 'text-font': ['Noto Sans Bold'], 'text-size': 13, 'text-allow-overlap': true },
      paint: { 'text-color': CREAM },
    });
    map.addLayer({
      id: 'pins', type: 'circle', source: 'festivals', filter: ['!', ['has', 'point_count']],
      paint: { 'circle-color': CORAL, 'circle-radius': single ? 10 : 8, 'circle-stroke-color': NAVY, 'circle-stroke-width': 3 },
    });
  }

  function fit(map: MapLibre.Map, lib: ML, pts: MapPoint[], animate: boolean) {
    if (!pts.length) return map.jumpTo({ center: [10, 30], zoom: 1 });
    if (pts.length === 1) return map.jumpTo({ center: [pts[0].lng, pts[0].lat], zoom: single ? 11.5 : 5 });
    const b = new lib.LngLatBounds();
    pts.forEach((p) => b.extend([p.lng, p.lat]));
    map.fitBounds(b, { padding: 40, maxZoom: 6, animate });
  }

  // Create the map once.
  useEffect(() => {
    let dead = false;
    const cleanups: (() => void)[] = [];
    Promise.all([loadLib(), loadBase()]).then(([lib, base]) => {
      if (dead || !el.current) return;
      const map = new lib.Map({
        container: el.current,
        style: themed(base, isDark()),
        attributionControl: { compact: true },
        cooperativeGestures: !single, // one finger scrolls the page; two fingers move the map
        dragRotate: false,
        pitchWithRotate: false,
        renderWorldCopies: false,
        center: [10, 30],
        zoom: 1,
      });
      map.addControl(new lib.NavigationControl({ showCompass: false }), 'top-left');
      ref.current = { lib, map, points: latest.current };
      // setStyle() drops our layers; add them back every time a style loads.
      map.on('style.load', () => addData(map));
      map.once('load', () => {
        fit(map, lib, latest.current, false);
        // Start with the attribution collapsed to its (i) button.
        el.current?.querySelector('.maplibregl-ctrl-attrib')?.classList.remove('maplibregl-compact-show');
      });

      if (!single) {
        map.on('click', 'clusters', async (e) => {
          const f = e.features?.[0];
          if (!f) return;
          const src = map.getSource('festivals') as MapLibre.GeoJSONSource;
          const zoom = await src.getClusterExpansionZoom(f.properties.cluster_id);
          map.easeTo({ center: (f.geometry as Point).coordinates as [number, number], zoom });
        });
        map.on('click', 'pins', (e) => {
          const p = e.features?.[0]?.properties as MapPoint | undefined;
          if (!p?.href) return;
          new lib.Popup({ offset: 12, maxWidth: '260px' })
            .setLngLat([p.lng, p.lat])
            .setHTML(`<a class="map-pop__name" href="${p.href}">${esc(p.name)}</a><div class="map-pop__meta">${esc(p.when || '')}<br>${esc(p.place || '')}</div><a class="map-pop__link" href="${p.href}">View festival →</a>`)
            .addTo(map);
        });
        for (const layer of ['clusters', 'pins']) {
          map.on('mouseenter', layer, () => (map.getCanvas().style.cursor = 'pointer'));
          map.on('mouseleave', layer, () => (map.getCanvas().style.cursor = ''));
        }
      }

      // Follow the site theme.
      const restyle = () => map.setStyle(themed(base, isDark()));
      window.addEventListener('csc-theme', restyle);
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener('change', restyle);
      cleanups.push(() => window.removeEventListener('csc-theme', restyle), () => mq.removeEventListener('change', restyle));
    });
    return () => {
      dead = true;
      cleanups.forEach((fn) => fn());
      ref.current?.map.remove();
      ref.current = null;
    };
  }, []);

  // New points (filters changed): update the data and refit.
  const sig = points.map((p) => p.id).join(',');
  useEffect(() => {
    const cur = ref.current;
    if (!cur || cur.points === points) return;
    cur.points = points;
    const src = cur.map.getSource('festivals') as MapLibre.GeoJSONSource | undefined;
    src?.setData(toGeoJSON(points));
    fit(cur.map, cur.lib, points, true);
  }, [sig]);

  return <div ref={el} class={`map${single ? ' map--single' : ''}`} role="region" aria-label={label} />;
}
