import { openSheet, useStore } from '../client/store';

export default function HeaderActions() {
  const { saved } = useStore();
  return (
    <nav aria-label="Site" class="header__nav">
      <a href="/saved/" class="header__saved" aria-label={`Saved festivals, ${saved.length}`}>
        <span aria-hidden="true" class="header__heart">♡</span>
        <span aria-hidden="true">{saved.length}</span>
      </a>
      <button type="button" class="header__menu" aria-haspopup="dialog" onClick={() => openSheet('menu')}>
        <span aria-hidden="true">☰</span>Menu
      </button>
    </nav>
  );
}
