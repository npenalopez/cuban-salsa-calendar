import type { CardVM } from '../lib/festivals';
import { CalendarIcon, Flag } from './ui';

interface Props {
  card: CardVM;
  saved: boolean;
  onSave: (id: string) => void;
  onCal: (id: string) => void;
}

export function FestivalCard({ card: c, saved, onSave, onCal }: Props) {
  const cls = ['card', c.muted && 'card--muted', c.tba && 'card--tba', c.featured && 'card--featured', c.postponed && 'card--postponed', c.struck && 'card--struck']
    .filter(Boolean).join(' ');
  return (
    <article class={cls}>
      <div class="date-block" aria-hidden="true">
        <span class="date-block__mon">{c.block.mon}</span>
        <span class="date-block__days">{c.block.days}</span>
        {c.block.sub && <span class="date-block__sub">{c.block.sub}</span>}
      </div>
      <div class="card__main">
        {c.badge && <span class={`badge badge--${c.badge.kind}`}>{c.badge.text}</span>}
        <h3 class="card__title">
          <a class="stretch" href={c.href} aria-label={c.aria}>{c.name}</a>
        </h3>
        <span class="place">
          <Flag code={c.countryCode} />
          {c.place}
        </span>
        {c.artists.length > 0 && (
          <div class="chips-mini" aria-label="Line-up">
            {c.artists.map((a) => <span class="chip-mini">{a}</span>)}
            {c.moreArtists > 0 && <span class="chip-mini chip-mini--more">+{c.moreArtists} more</span>}
          </div>
        )}
        {c.meta && <span class="meta">{c.meta}</span>}
        {c.travel && <span class="meta">{c.travel}</span>}
        {c.ticket && (
          <a class="card__ticket" href={c.ticket} target="_blank" rel="sponsored noopener">
            Get passes ↗<span class="sr-only"> for {c.name}, opens the organizer's site</span>
          </a>
        )}
      </div>
      <div class="card__actions">
        {c.showSave && (
          <button type="button" class={`icon-btn heart${saved ? ' is-saved' : ''}`} aria-pressed={saved} aria-label={`Save ${c.name}`} onClick={() => onSave(c.id)}>
            {saved ? '♥' : '♡'}
          </button>
        )}
        {c.showCal && (
          <button type="button" class="icon-btn" aria-haspopup="dialog" aria-label={`Add ${c.name} to calendar`} onClick={() => onCal(c.id)}>
            <CalendarIcon />
          </button>
        )}
      </div>
    </article>
  );
}
