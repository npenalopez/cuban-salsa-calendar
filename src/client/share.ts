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

/** Download a generated file (used only where a static URL can't exist, e.g. the saved list). */
export function download(name: string, body: string, type: string) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([body], { type }));
  a.download = name;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(a.href);
    a.remove();
  }, 800);
}
