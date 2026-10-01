import { useEffect, useRef, useState } from 'preact/hooks';
import { plural } from '../lib/dates';

type Mode = 'new' | 'fix';
interface Props {
  mode: Mode;
  fid?: string;
  fname?: string;
  turnstileKey?: string;
}

type Field = 'change' | 'name' | 'city' | 'country' | 'start' | 'end' | 'website' | 'tickets' | 'email';
const ORDER: Field[] = ['change', 'name', 'city', 'country', 'start', 'end', 'website', 'tickets', 'email'];
const IDS: Record<Field, string> = { change: 'f-change', name: 'f-name', city: 'f-city', country: 'f-country', start: 'f-start', end: 'f-end', website: 'f-web', tickets: 'f-tix', email: 'f-email' };

const EMPTY = { change: '', name: '', city: '', country: '', start: '', end: '', datesTba: false, website: '', instagram: '', tickets: '', lineup: '', email: '', role: 'organizer' };
type Form = typeof EMPTY;

const isUrl = (v: string) => !v || /^https?:\/\/\S+\.\S+/.test(v);
const isMail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export function validate(mode: Mode, f: Form): Partial<Record<Field, string>> {
  const e: Partial<Record<Field, string>> = {};
  if (mode === 'fix') {
    if (!f.change.trim()) e.change = 'Tell us what to change.';
    if (f.email && !isMail(f.email)) e.email = 'Enter an email like name@example.com, or leave it empty.';
    return e;
  }
  if (!f.name.trim()) e.name = 'Enter the festival name.';
  if (!f.city.trim()) e.city = 'Enter the city.';
  if (!f.country.trim()) e.country = 'Enter the country.';
  if (!f.datesTba && !f.start) e.start = 'Enter the first day, or tick "Dates not announced yet".';
  if (!f.datesTba && f.start && f.end && f.end < f.start) e.end = "The last day can't be before the first day.";
  if (!isUrl(f.website)) e.website = 'Enter a full link starting with https://';
  if (!isUrl(f.tickets)) e.tickets = 'Enter a full link starting with https://';
  if (!f.email.trim()) e.email = 'Enter your email so we can check details with you.';
  else if (!isMail(f.email)) e.email = 'Enter an email like name@example.com.';
  return e;
}

declare global {
  interface Window {
    turnstile?: { render: (el: HTMLElement, o: Record<string, unknown>) => string; reset: (id?: string) => void };
  }
}

export default function SubmitForm({ mode, fid, fname, turnstileKey }: Props) {
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

  const errs = tried ? validate(mode, f) : {};
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
    if (Object.keys(validate(mode, f)).length) {
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
        <strong>Thank you. We got it.</strong>
        <span>We review every message before anything is published. If you left an email, we'll write back if we have questions.</span>
        <a href="/" class="inline-link">Back to festivals</a>
      </div>
    );
  }

  return (
    <form class="form" noValidate onSubmit={onSubmit}>
      {list.length > 0 && (
        <div id="form-errors" tabIndex={-1} role="alert" class="error-summary">
          <strong>Please fix {plural(list.length, 'thing')}:</strong>
          {list.map((k) => (
            <a href={`#${IDS[k]}`} onClick={(e) => (e.preventDefault(), document.getElementById(IDS[k])?.focus())}>{errs[k]}</a>
          ))}
        </div>
      )}
      {state === 'failed' && (
        <div role="alert" class="error-summary">
          <strong>Couldn't send that.</strong>
          <span>Check your connection and try again, or send it to us on Instagram @cubansalsacalendar.</span>
        </div>
      )}

      {isFix ? (
        <>
          <div class="fixbox">Festival:<strong>{fname}</strong></div>
          <div class="field">
            <label for="f-change">What should we change? <span class="req">*</span></label>
            <span id="f-change-hint" class="field__hint">For example new dates, the Instagram handle, the line-up, or a ticket link.</span>
            <textarea id="f-change" class="input" rows={5} value={f.change} onInput={set('change')} {...inv('change')} />
            <Err k="change" />
          </div>
        </>
      ) : (
        <>
          <div class="field">
            <label for="f-name">Festival name <span class="req">*</span></label>
            <input id="f-name" class="input" value={f.name} onInput={set('name')} {...inv('name')} />
            <Err k="name" />
          </div>
          <div class="two-col">
            <div class="field">
              <label for="f-city">City <span class="req">*</span></label>
              <input id="f-city" class="input" value={f.city} onInput={set('city')} {...inv('city')} />
              <Err k="city" />
            </div>
            <div class="field">
              <label for="f-country">Country <span class="req">*</span></label>
              <input id="f-country" class="input" value={f.country} onInput={set('country')} {...inv('country')} />
              <Err k="country" />
            </div>
          </div>
          <fieldset class="plain-fieldset">
            <legend>Dates</legend>
            <label class="check-row"><input type="checkbox" checked={f.datesTba} onChange={set('datesTba')} />Dates not announced yet</label>
            {!f.datesTba && (
              <div class="two-col two-col--fixed">
                <div class="field">
                  <label for="f-start" style="font-weight:400;font-size:15px">First day <span class="req">*</span></label>
                  <input id="f-start" type="date" class="input" value={f.start} onInput={set('start')} {...inv('start')} />
                  <Err k="start" />
                </div>
                <div class="field">
                  <label for="f-end" style="font-weight:400;font-size:15px">Last day</label>
                  <input id="f-end" type="date" class="input" value={f.end} onInput={set('end')} {...inv('end')} />
                  <Err k="end" />
                </div>
              </div>
            )}
          </fieldset>
          <div class="field">
            <label for="f-ig">Instagram</label>
            <input id="f-ig" class="input" inputMode="url" placeholder="@festival or link" value={f.instagram} onInput={set('instagram')} />
          </div>
          <div class="field">
            <label for="f-web">Website</label>
            <input id="f-web" type="url" class="input" placeholder="https://" value={f.website} onInput={set('website')} {...inv('website')} />
            <Err k="website" />
          </div>
          <div class="field">
            <label for="f-tix">Where to buy passes</label>
            <input id="f-tix" type="url" class="input" placeholder="https://" value={f.tickets} onInput={set('tickets')} {...inv('tickets')} />
            <Err k="tickets" />
          </div>
          <div class="field">
            <label for="f-lineup">Line-up</label>
            <textarea id="f-lineup" class="input" rows={3} placeholder="One artist per line" value={f.lineup} onInput={set('lineup')} />
          </div>
          <fieldset class="plain-fieldset">
            <legend>You are</legend>
            {[['organizer', 'The organizer'], ['teacher', 'A teacher or artist'], ['dancer', 'A dancer']].map(([v, l]) => (
              <label class="check-row"><input type="radio" name="role" checked={f.role === v} onChange={() => setF({ ...f, role: v })} />{l}</label>
            ))}
          </fieldset>
        </>
      )}

      <div class="field">
        <label for="f-email">Your email {!isFix && <span class="req">*</span>}</label>
        <span id="f-email-hint" class="field__hint">Only used to ask you about this {isFix ? 'change' : 'festival'}. Never shown or shared.</span>
        <input id="f-email" type="email" autocomplete="email" class="input" value={f.email} onInput={set('email')} {...inv('email')} />
        <Err k="email" />
      </div>
      {turnstileKey && <div ref={tsEl} />}
      <button type="submit" class="submit-btn" disabled={state === 'sending'}>
        {state === 'sending' ? 'Sending…' : isFix ? 'Send correction' : 'Send festival'}
      </button>
    </form>
  );
}
