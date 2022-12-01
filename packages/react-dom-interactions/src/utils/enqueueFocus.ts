import type {FocusableElement} from 'tabbable';

export function enqueueFocus(
  el: FocusableElement | null,
  preventScroll?: boolean
) {
  return requestAnimationFrame(() => el?.focus({preventScroll}));
}
