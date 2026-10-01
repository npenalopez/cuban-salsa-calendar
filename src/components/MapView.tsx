import { useEffect, useRef } from 'preact/hooks';
import type * as Leaflet from 'leaflet';
import { isDark } from '../client/store';
import leafletCss from 'leaflet/dist/leaflet.css?url';
import clusterCss from 'leaflet.markercluster/dist/MarkerCluster.css?url';

export interface MapPoint {
  id: string;
  lat: number;
  lng: number;
  name: string;
  href?: string;
  when?: string;
  place?: string;
}

type LeafletNS = typeof Leaflet;
let leafletP: Promise<LeafletNS> | null = null;

const addCss = (href: string) =>
  new Promise<void>((resolve) => {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = href;
    l.onload = l.onerror = () => resolve();
    document.head.appendChild(l);
  });

/** Load Leaflet, its CSS and the cluster plugin only when a map is first shown. */
function loadLeaflet(): Promise<LeafletNS> {
  leafletP ??= (async () => {
    const [{ default: L }] = await Promise.all([import('leaflet'), addCss(leafletCss), addCss(clusterCss)]);
    (window as unknown as { L: LeafletNS }).L = L;
    await import('leaflet.markercluster');
    return L;
  })();
  return leafletP;
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
const tileUrl = (dark: boolean) =>
  `https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/${dark ? 'World_Dark_Gray_Base' : 'World_Light_Gray_Base'}/MapServer/tile/{z}/{y}/{x}`;

export function MapView({ points, single, label }: { points: MapPoint[]; single?: boolean; label: string }) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<{ L: LeafletNS; map: Leaflet.Map; layer: Leaflet.LayerGroup; tiles: Leaflet.TileLayer | null } | null>(null);

  // Create the map once.
  useEffect(() => {
    let dead = false;
    let onTheme: (() => void) | null = null;
    let mq: MediaQueryList | null = null;
    loadLeaflet().then((L) => {
      if (dead || !el.current) return;
      const m = L.map(el.current, { scrollWheelZoom: false, worldCopyJump: true });
      const layer = single
        ? L.layerGroup().addTo(m)
        : L.markerClusterGroup({
            showCoverageOnHover: false,
            maxClusterRadius: 44,
            iconCreateFunction: (c) => L.divIcon({ className: '', html: `<span class="map-cluster">${c.getChildCount()}</span>`, iconSize: [36, 36] }),
          }).addTo(m);
      map.current = { L, map: m, layer, tiles: null };
      const setTiles = () => {
        const cur = map.current!;
        cur.tiles?.remove();
        cur.tiles = L.tileLayer(tileUrl(isDark()), { attribution: 'Tiles © Esri, HERE, Garmin, © OpenStreetMap', maxZoom: 16, detectRetina: true }).addTo(m);
      };
      setTiles();
      onTheme = setTiles;
      window.addEventListener('csc-theme', setTiles);
      mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener('change', setTiles);
      draw(points);
    });
    return () => {
      dead = true;
      if (onTheme) window.removeEventListener('csc-theme', onTheme);
      if (onTheme && mq) mq.removeEventListener('change', onTheme);
      map.current?.map.remove();
      map.current = null;
    };
  }, []);

  function draw(pts: MapPoint[]) {
    const cur = map.current;
    if (!cur) return;
    const { L, map: m, layer } = cur;
    layer.clearLayers();
    const size = single ? 24 : 18;
    for (const p of pts) {
      const marker = L.marker([p.lat, p.lng], {
        title: p.name,
        alt: p.name,
        icon: L.divIcon({ className: '', iconSize: [size, size], iconAnchor: [size / 2, size / 2], html: `<span class="map-pin" style="width:${size}px;height:${size}px"></span>` }),
      });
      if (p.href) {
        marker.bindPopup(
          `<a class="map-pop__name" href="${p.href}">${esc(p.name)}</a><div class="map-pop__meta">${esc(p.when || '')}<br>${esc(p.place || '')}</div><a class="map-pop__link" href="${p.href}">View festival →</a>`,
        );
      }
      marker.addTo(layer);
    }
    if (pts.length === 1) m.setView([pts[0].lat, pts[0].lng], single ? 11 : 6);
    else if (pts.length) m.fitBounds(L.latLngBounds(pts.map((p) => [p.lat, p.lng] as [number, number])), { padding: [28, 28], maxZoom: 6 });
    else m.setView([35, 5], 2);
    setTimeout(() => m.invalidateSize(), 60);
  }

  const sig = points.map((p) => p.id).join(',');
  useEffect(() => draw(points), [sig]);

  return <div ref={el} class={`map${single ? ' map--single' : ''}`} role="region" aria-label={label} />;
}
