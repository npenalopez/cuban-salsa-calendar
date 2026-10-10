// The page language for Preact islands: each island root gets `lang` and provides it here.
import { createContext } from 'preact';
import { useContext } from 'preact/hooks';
import { type Lang, isLang, t } from '.';

export const LangContext = createContext<Lang>('en');
export const useLang = () => useContext(LangContext);
/** t() bound to the current island's language. */
export const useT = () => {
  const lang = useLang();
  return (key: string, vars?: Record<string, string | number>) => t(lang, key, vars);
};
/** For code outside components (toasts): the <html lang> of the page. */
export const pageLang = (): Lang => {
  const l = typeof document !== 'undefined' ? document.documentElement.lang : 'en';
  return isLang(l) ? l : 'en';
};
