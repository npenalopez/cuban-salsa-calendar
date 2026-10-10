import { toast } from './store';

/** Web Share API, falling back to copying the link. */
export async function share(title: string, url: string) {
  if (navigator.share) {
    try {
      await navigator.share({ title, url });
      return;
    } catch (e) {
      if ((e as Error)?.name === 'AbortError') return;
    }
  }
  await copy(url, 'Link copied');
}

export async function copy(text: string, msg = 'Link copied') {
  try {
    await navigator.clipboard.writeText(text);
    toast(msg);
  } catch {
    toast(text);
  }
}

/** Instagram, Facebook, TikTok and similar app browsers: they drop calendar files. */
export const inAppBrowser = () => /Instagram|FBAN|FBAV|FB_IAB|TikTok|musical_ly|Bytedance|Line\/|Snapchat|LinkedInApp|Pinterest/i.test(navigator.userAgent);

/**
 * Open an .ics URL so the phone offers to add the events. In an app browser,
 * hand it to Safari (iOS 17+, x-safari-https:) or the default browser (Android
 * intent:); if the page is still showing a moment later, explain what to do.
 * `handoff` goes in the address bar first, so "Open in browser" from the app's
 * menu carries what the phone browser needs (its saved list is a different one).
 */
export function openCalendar(path: string, handoff?: string) {
  const url = new URL(path, location.href);
  if (!inAppBrowser()) {
    location.href = url.href;
    return;
  }
  const android = /Android/i.test(navigator.userAgent);
  location.href = android
    ? `intent://${url.host}${url.pathname}${url.search}#Intent;scheme=https;S.browser_fallback_url=${encodeURIComponent(url.href)};end`
    : `x-safari-${url.href}`;
  setTimeout(() => {
    if (document.visibilityState !== 'visible') return;
    if (handoff) history.replaceState(history.state, '', handoff);
    toast(android ? 'Tap ⋮ and choose "Open in Chrome", then try again' : 'Tap ··· and choose "Open in external browser", then try again', 8000);
  }, 1500);
}
