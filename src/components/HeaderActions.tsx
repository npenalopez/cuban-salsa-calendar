import { openSheet, useStore } from '../client/store';
import { type Lang, lp, t } from '../i18n';

export default function HeaderActions({ lang = 'en' }: { lang?: Lang }) {
  const { saved } = useStore();
  return (
    <nav aria-label={t(lang, 'site.nav')} class="header__nav">
      <a href={lp(lang, '/saved/')} class="header__saved" aria-label={t(lang, 'site.savedAria', { n: saved.length })}>
        <span aria-hidden="true" class="header__heart">♡</span>
        <span aria-hidden="true">{saved.length}</span>
      </a>
      <button type="button" class="header__menu" aria-haspopup="dialog" onClick={() => openSheet('menu')}>
        <span aria-hidden="true">☰</span>{t(lang, 'site.menu')}
      </button>
    </nav>
  );
}
