import type { ComponentChildren } from 'preact';
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
