import { useEffect, useRef, useState } from 'preact/hooks';
import { type Lang, lp, t as tr } from '../i18n';

type Mode = 'new' | 'fix';
interface Props {
  mode: Mode;
  fid?: string;
  fname?: string;
  turnstileKey?: string;
  lang?: Lang;
}

type Field = 'change' | 'name' | 'city' | 'country' | 'start' | 'end' | 'website' | 'tickets' | 'email';
const ORDER: Field[] = ['change', 'name', 'city', 'country', 'start', 'end', 'website', 'tickets', 'email'];
const IDS: Record<Field, string> = { change: 'f-change', name: 'f-name', city: 'f-city', country: 'f-country', start: 'f-start', end: 'f-end', website: 'f-web', tickets: 'f-tix', email: 'f-email' };

const EMPTY = { change: '', name: '', city: '', country: '', start: '', end: '', datesTba: false, website: '', instagram: '', tickets: '', lineup: '', email: '', role: 'organizer' };
type Form = typeof EMPTY;

const isUrl = (v: string) => !v || /^https?:\/\/\S+\.\S+/.test(v);
const isMail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export function validate(mode: Mode, f: Form, lang: Lang = 'en'): Partial<Record<Field, string>> {
  const e: Partial<Record<Field, string>> = {};
  const t = (k: string) => tr(lang, k);
  if (mode === 'fix') {
    if (!f.change.trim()) e.change = t('form.errChange');
    if (f.email && !isMail(f.email)) e.email = t('form.errEmailOpt');
    return e;
  }
  if (!f.name.trim()) e.name = t('form.errName');
  if (!f.city.trim()) e.city = t('form.errCity');
  if (!f.country.trim()) e.country = t('form.errCountry');
  if (!f.datesTba && !f.start) e.start = t('form.errStart');
  if (!f.datesTba && f.start && f.end && f.end < f.start) e.end = t('form.errEnd');
  if (!isUrl(f.website)) e.website = t('form.errUrl');
  if (!isUrl(f.tickets)) e.tickets = t('form.errUrl');
  if (!f.email.trim()) e.email = t('form.errEmailReq');
  else if (!isMail(f.email)) e.email = t('form.errEmail');
  return e;
}

declare global {
  interface Window {
    turnstile?: { render: (el: HTMLElement, o: Record<string, unknown>) => string; reset: (id?: string) => void };
  }
}

export default function SubmitForm({ mode, fid, fname, turnstileKey, lang = 'en' }: Props) {
  const t = (k: string, v?: Record<string, string | number>) => tr(lang, k, v);
  const [f, setF] = useState<Form>(EMPTY);
  const [tried, setTried] = useState(false);
  const [state, setState] = useState<'open' | 'sending' | 'sent' | 'failed'>('open');
  const [token, setToken] = useState('');
  const tsEl = useRef<HTMLDivElement>(null);
  const isFix = mode === 'fix';

  // Cloudflare Turnstile (only when a site key is configured).
  useEffect(() => {
    if (!turnstileKey || !tsEl.current) return;
    const render = () => window.turnstile?.render(tsEl.current!, { sitekey: turnstileKey, callback: setToken, 'expired-callback': () => setToken('') });
    if (window.turnstile) return void render();
    const s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    s.async = true;
    s.onload = render;
    document.head.appendChild(s);
  }, []);

  const errs = tried ? validate(mode, f, lang) : {};
  const list = ORDER.filter((k) => errs[k]);
  const set = (k: keyof Form) => (e: Event) => {
    const t = e.currentTarget as HTMLInputElement;
    setF((cur) => ({ ...cur, [k]: t.type === 'checkbox' ? t.checked : t.value }));
  };
  const inv = (k: Field) => ({ 'aria-invalid': errs[k] ? true : undefined, 'aria-describedby': [k === 'change' || k === 'email' ? `${IDS[k]}-hint` : '', errs[k] ? `${IDS[k]}-err` : ''].filter(Boolean).join(' ') || undefined });
  const Err = ({ k }: { k: Field }) => (errs[k] ? <span id={`${IDS[k]}-err`} class="field__err">{errs[k]}</span> : null);

  async function onSubmit(e: Event) {
    e.preventDefault();
    setTried(true);
    if (Object.keys(validate(mode, f, lang)).length) {
      setTimeout(() => document.getElementById('form-errors')?.focus(), 30);
      return;
    }
    setState('sending');
    const payload = isFix
      ? { kind: 'correction', festivalId: fid, festivalName: fname, change: f.change.trim(), email: f.email.trim() }
      : {
          kind: 'submission',
          name: f.name.trim(), city: f.city.trim(), country: f.country.trim(),
          datesTba: f.datesTba, startDate: f.datesTba ? null : f.start, endDate: f.datesTba ? null : f.end || f.start,
          instagram: f.instagram.trim(), website: f.website.trim(), ticketUrl: f.tickets.trim(),
          artists: f.lineup.split('\n').map((x) => x.trim()).filter(Boolean),
          role: f.role, email: f.email.trim(),
        };
    try {
      const r = await fetch('/api/submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...payload, token }) });
      if (!r.ok) throw new Error(String(r.status));
      setState('sent');
      window.scrollTo(0, 0);
    } catch {
      setState('failed');
      if (turnstileKey) window.turnstile?.reset();
    }
  }

  if (state === 'sent') {
    return (
      <div role="status" class="success">
        <strong>{t('form.thanks')}</strong>
        <span>{t('form.thanksText')}</span>
        <a href={lp(lang, '/')} class="inline-link">{t('fest.back').replace('← ', '')}</a>
      </div>
    );
  }

  return (
    <form class="form" noValidate onSubmit={onSubmit}>
      {list.length > 0 && (
        <div id="form-errors" tabIndex={-1} role="alert" class="error-summary">
          <strong>{t('form.fix', { n: list.length })}</strong>
          {list.map((k) => (
            <a href={`#${IDS[k]}`} onClick={(e) => (e.preventDefault(), document.getElementById(IDS[k])?.focus())}>{errs[k]}</a>
          ))}
        </div>
      )}
      {state === 'failed' && (
        <div role="alert" class="error-summary">
          <strong>{t('form.failed')}</strong>
          <span>{t('form.failedText')}</span>
        </div>
      )}

      {isFix ? (
        <>
          <div class="fixbox">{t('form.festival')}<strong>{fname}</strong></div>
          <div class="field">
            <label for="f-change">{t('form.change')} <span class="req">*</span></label>
            <span id="f-change-hint" class="field__hint">{t('form.changeHint')}</span>
            <textarea id="f-change" class="input" rows={5} value={f.change} onInput={set('change')} {...inv('change')} />
            <Err k="change" />
          </div>
        </>
      ) : (
        <>
          <div class="field">
            <label for="f-name">{t('form.name')} <span class="req">*</span></label>
            <input id="f-name" class="input" value={f.name} onInput={set('name')} {...inv('name')} />
            <Err k="name" />
          </div>
          <div class="two-col">
            <div class="field">
              <label for="f-city">{t('form.city')} <span class="req">*</span></label>
              <input id="f-city" class="input" value={f.city} onInput={set('city')} {...inv('city')} />
              <Err k="city" />
            </div>
            <div class="field">
              <label for="f-country">{t('form.country')} <span class="req">*</span></label>
              <input id="f-country" class="input" value={f.country} onInput={set('country')} {...inv('country')} />
              <Err k="country" />
            </div>
          </div>
          <fieldset class="plain-fieldset">
            <legend>{t('form.dates')}</legend>
            <label class="check-row"><input type="checkbox" checked={f.datesTba} onChange={set('datesTba')} />{t('form.datesTba')}</label>
            {!f.datesTba && (
              <div class="two-col two-col--fixed">
                <div class="field">
                  <label for="f-start" style="font-weight:400;font-size:15px">{t('form.first')} <span class="req">*</span></label>
                  <input id="f-start" type="date" class="input" value={f.start} onInput={set('start')} {...inv('start')} />
                  <Err k="start" />
                </div>
                <div class="field">
                  <label for="f-end" style="font-weight:400;font-size:15px">{t('form.last')}</label>
                  <input id="f-end" type="date" class="input" value={f.end} onInput={set('end')} {...inv('end')} />
                  <Err k="end" />
                </div>
              </div>
            )}
          </fieldset>
          <div class="field">
            <label for="f-ig">Instagram</label>
            <input id="f-ig" class="input" inputMode="url" placeholder={t('form.igPlaceholder')} value={f.instagram} onInput={set('instagram')} />
          </div>
          <div class="field">
            <label for="f-web">{t('form.website')}</label>
            <input id="f-web" type="url" class="input" placeholder="https://" value={f.website} onInput={set('website')} {...inv('website')} />
            <Err k="website" />
          </div>
          <div class="field">
            <label for="f-tix">{t('form.tickets')}</label>
            <input id="f-tix" type="url" class="input" placeholder="https://" value={f.tickets} onInput={set('tickets')} {...inv('tickets')} />
            <Err k="tickets" />
          </div>
          <div class="field">
            <label for="f-lineup">{t('form.lineup')}</label>
            <textarea id="f-lineup" class="input" rows={3} placeholder={t('form.lineupPlaceholder')} value={f.lineup} onInput={set('lineup')} />
          </div>
          <fieldset class="plain-fieldset">
            <legend>{t('form.youAre')}</legend>
            {[['organizer', t('form.organizer')], ['teacher', t('form.teacher')], ['dancer', t('form.dancer')]].map(([v, l]) => (
              <label class="check-row"><input type="radio" name="role" checked={f.role === v} onChange={() => setF({ ...f, role: v })} />{l}</label>
            ))}
          </fieldset>
        </>
      )}

      <div class="field">
        <label for="f-email">{t('form.email')} {!isFix && <span class="req">*</span>}</label>
        <span id="f-email-hint" class="field__hint">{t(isFix ? 'form.emailHintFix' : 'form.emailHintNew')}</span>
        <input id="f-email" type="email" autocomplete="email" class="input" value={f.email} onInput={set('email')} {...inv('email')} />
        <Err k="email" />
      </div>
      {turnstileKey && <div ref={tsEl} />}
      <button type="submit" class="submit-btn" disabled={state === 'sending'}>
        {t(state === 'sending' ? 'form.sending' : isFix ? 'form.sendFix' : 'form.sendNew')}
      </button>
    </form>
  );
}
