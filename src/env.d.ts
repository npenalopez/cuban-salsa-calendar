/// <reference types="astro/client" />

declare module 'virtual:festivals' {
  import type { Festival } from './lib/types';
  const festivals: Festival[];
  export default festivals;
}

interface ImportMetaEnv {
  readonly PUBLIC_TURNSTILE_SITE_KEY?: string;
}

declare namespace Astro {
  interface ClientDirectives {
    /** Hydrate after the window load event (src/client/afterload.ts). */
    'client:afterload'?: boolean;
  }
}
