import {isJSDOM} from '../utils';

export function matchesFocusVisible(element: Element | null) {
  // We don't want to block focus from working with `visibleOnly`
  // (JSDOM doesn't match `:focus-visible` when the element has `:focus`)
  if (!element || isJSDOM()) return true;
  try {
    return element.matches(':focus-visible');
  } catch (_e) {
    return true;
  }
}
