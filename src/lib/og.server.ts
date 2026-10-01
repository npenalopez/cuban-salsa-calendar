import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';

const require = createRequire(import.meta.url);
const font = (pkg: string, file: string) => readFileSync(require.resolve(`${pkg}/files/${file}`));

// Satori reads WOFF/TTF (not WOFF2 or variable axes), so use the static cuts.
const FONTS = [
  { name: 'Archivo', data: font('@fontsource/archivo', 'archivo-latin-800-normal.woff'), weight: 800 as const, style: 'normal' as const },
  { name: 'Archivo', data: font('@fontsource/archivo', 'archivo-latin-700-normal.woff'), weight: 700 as const, style: 'normal' as const },
  { name: 'Atkinson', data: font('@fontsource/atkinson-hyperlegible-next', 'atkinson-hyperlegible-next-latin-400-normal.woff'), weight: 400 as const, style: 'normal' as const },
];

const NAVY = '#1C1F3D';
const CORAL = '#FF6B4A';
const CREAM = '#F6EDE3';
const SUB = '#C9C6D6';

type Node = { type: string; props: Record<string, unknown> & { style?: Record<string, unknown>; children?: unknown } };
const h = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({ type, props: { style, children } });

// Same mark as the header logo and favicon: 5 stripes plus the coral triangle.
const FLAG_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20"><rect width="30" height="20" fill="${CREAM}"/><g fill="#383A52"><rect width="30" height="4"/><rect y="8" width="30" height="4"/><rect y="16" width="30" height="4"/></g><path d="M0 0 16.5 10 0 20z" fill="${CORAL}"/></svg>`;
const flagMark = (): Node => ({
  type: 'img',
  props: { src: `data:image/svg+xml;base64,${Buffer.from(FLAG_SVG).toString('base64')}`, width: 45, height: 30, style: { borderRadius: 4 } },
});

export interface OgCard {
  kicker: string;
  big: string;
  bigSub?: string;
  title: string;
  sub?: string;
}

export async function renderOg(c: OgCard): Promise<Uint8Array> {
  const titleSize = c.title.length > 44 ? 64 : c.title.length > 26 ? 76 : 92;
  const tree = h('div', { width: 1200, height: 630, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '64px 72px', background: NAVY, color: CREAM, fontFamily: 'Atkinson' }, [
    h('div', { display: 'flex', alignItems: 'center', gap: 18 }, [
      flagMark(),
      h('div', { fontFamily: 'Archivo', fontWeight: 700, fontSize: 28, letterSpacing: 4, color: CORAL, textTransform: 'uppercase' }, c.kicker),
    ]),
    h('div', { display: 'flex', alignItems: 'flex-end', gap: 28 }, [
      h('div', { fontFamily: 'Archivo', fontWeight: 800, fontSize: 168, lineHeight: 0.8, letterSpacing: -4, color: CREAM }, c.big),
      c.bigSub ? h('div', { fontFamily: 'Archivo', fontWeight: 800, fontSize: 44, color: CORAL, textTransform: 'uppercase', paddingBottom: 4 }, c.bigSub) : null,
    ].filter(Boolean)),
    h('div', { display: 'flex', flexDirection: 'column', gap: 14 }, [
      h('div', { fontFamily: 'Archivo', fontWeight: 800, fontSize: titleSize, lineHeight: 0.95, textTransform: 'uppercase', lineClamp: 2, display: 'block' }, c.title),
      c.sub ? h('div', { fontSize: 34, color: SUB }, c.sub) : null,
    ].filter(Boolean)),
  ]);
  const svg = await satori(tree as never, { width: 1200, height: 630, fonts: FONTS });
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}
