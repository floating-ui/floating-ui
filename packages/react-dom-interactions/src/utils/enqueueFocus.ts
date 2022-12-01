import type {FocusableElement} from 'tabbable';

export function enqueueFocus(
  el: FocusableElement | null,
  preventScroll?: boolean
) {
  requestAnimationFrame(() => el?.focus({preventScroll}));
}
