import type { ComponentChildren } from 'preact';
import type { TravelMode } from '../lib/travel';
import { useEffect, useRef } from 'preact/hooks';

export const SearchIcon = () => (
  <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="9" cy="9" r="6" /><path d="M13.5 13.5 17 17" /></svg>
);
export const CalendarIcon = ({ size = 20 }: { size?: number }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="4.5" width="14" height="12" rx="2" /><path d="M3 8.5h14M7 2.5v4M13 2.5v4" /></svg>
);
export const FilterIcon = () => (
  <svg aria-hidden="true" width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 5h14M6 10h8M8.5 15h3" /></svg>
);

// Travel icons: paths from Lucide (lucide.dev, ISC licence), 24 px grid, drawn with the text colour.
const Svg = ({ size = 16, children }: { size?: number; children: ComponentChildren }) => (
  <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">{children}</svg>
);
export const PlaneIcon = ({ size }: { size?: number }) => (
  <Svg size={size}><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" /></Svg>
);
export const TrainIcon = ({ size }: { size?: number }) => (
  <Svg size={size}><path d="M8 3.1V7a4 4 0 0 0 8 0V3.1" /><path d="m9 15-1-1" /><path d="m15 15 1-1" /><path d="M9 19c-2.8 0-5-2.2-5-5v-4a8 8 0 0 1 16 0v4c0 2.8-2.2 5-5 5Z" /><path d="m8 19-2 3" /><path d="m16 19 2 3" /></Svg>
);
export const CarIcon = ({ size }: { size?: number }) => (
  <Svg size={size}><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><path d="M9 17h6" /><circle cx="17" cy="17" r="2" /></Svg>
);
export const PinIcon = ({ size }: { size?: number }) => (
  <Svg size={size}><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></Svg>
);
export const LocateIcon = ({ size }: { size?: number }) => (
  <Svg size={size}><line x1="2" x2="5" y1="12" y2="12" /><line x1="19" x2="22" y1="12" y2="12" /><line x1="12" x2="12" y1="2" y2="5" /><line x1="12" x2="12" y1="19" y2="22" /><circle cx="12" cy="12" r="7" /><circle cx="12" cy="12" r="3" /></Svg>
);
export const TravelIcon = ({ mode, size }: { mode: TravelMode; size?: number }) =>
  mode === 'plane' ? <PlaneIcon size={size} /> : mode === 'train' ? <TrainIcon size={size} /> : mode === 'car' ? <CarIcon size={size} /> : <PinIcon size={size} />;

/** Decorative flag; the country name is always next to it in text. */
export const Flag = ({ code, small }: { code: string | null; small?: boolean }) =>
  code ? (
    <img class={`flag${small ? ' flag--sm' : ''}`} src={`/flags/${code.toLowerCase()}.svg`} alt="" width={small ? 18 : 20} height={small ? 12 : 14} loading="lazy" decoding="async" />
  ) : null;

/** Bottom sheet on a native modal <dialog>: focus trap, Esc, focus return. */
export function Sheet(props: { open: boolean; title: string; onClose: () => void; children: ComponentChildren; footer?: ComponentChildren; id: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (props.open && !d.open) d.showModal();
    else if (!props.open && d.open) d.close();
  }, [props.open]);
  return (
    <dialog
      ref={ref}
      class="sheet"
      aria-labelledby={props.id}
      onClose={() => props.open && props.onClose()}
      onClick={(e) => e.target === ref.current && props.onClose()}
    >
      {props.open && (
        <div class="sheet__panel">
          <div class="sheet__head">
            <h2 id={props.id} class="sheet__title">{props.title}</h2>
            <button type="button" class="icon-btn" aria-label="Close" onClick={props.onClose}>✕</button>
          </div>
          <div class="sheet__body">{props.children}</div>
          {props.footer && <div class="sheet__foot">{props.footer}</div>}
        </div>
      )}
    </dialog>
  );
}

/** Segmented control on radio inputs. */
export function Segmented<T extends string>(props: { name: string; legend: string; value: T; options: [T, string][]; onChange: (v: T) => void; small?: boolean }) {
  return (
    <fieldset class="seg-field">
      <legend class="seg-field__legend">{props.legend}</legend>
      <span class={`seg${props.small ? ' seg--sm' : ''}`}>
        {props.options.map(([v, l]) => (
          <label class={`seg__opt${props.value === v ? ' is-on' : ''}`}>
            <input type="radio" class="sr-only" name={props.name} checked={props.value === v} onChange={() => props.onChange(v)} />
            {l}
          </label>
        ))}
      </span>
    </fieldset>
  );
}
