import type {FocusableElement} from 'tabbable';

let rafId = 0;
export function enqueueFocus(
  el: FocusableElement | null,
  preventScroll = false,
  sync = false
) {
  cancelAnimationFrame(rafId);
  const exec = () => el?.focus({preventScroll});
  if (sync) {
    exec();
  } else {
    rafId = requestAnimationFrame(exec);
  }
}
