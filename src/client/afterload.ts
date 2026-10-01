/** Astro's directive signature: `load()` resolves to the hydrate function. */
type ClientDirective = (load: () => Promise<() => Promise<void>>) => void;

/**
 * `client:afterload`: hydrate after the window `load` event, at the next idle
 * moment. Pages are fully pre-rendered, so their islands only add behaviour;
 * keeping that JavaScript off the critical path means it can never delay
 * first paint on slow phones.
 */
const afterload: ClientDirective = (load) => {
  const run = async () => (await load())();
  const idle = () =>
    'requestIdleCallback' in window ? requestIdleCallback(() => void run(), { timeout: 1500 }) : setTimeout(() => void run(), 200);
  if (document.readyState === 'complete') idle();
  else window.addEventListener('load', idle, { once: true });
};
export default afterload;
