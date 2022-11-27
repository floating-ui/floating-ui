import type {FocusableElement} from 'tabbable';

export function enqueueFocus(
  el: FocusableElement | null,
  preventScroll?: boolean
) {
  queueMicrotask(() => el?.focus({preventScroll}));
}
