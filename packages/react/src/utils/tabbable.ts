import {tabbable} from 'tabbable';

import {activeElement} from './activeElement';
import {contains} from './contains';
import {getDocument} from './getDocument';

export const getTabbableOptions = () =>
  ({
    getShadowRoot: true,
    displayCheck:
      // JSDOM does not support the `tabbable` library. To solve this we can
      // check if `ResizeObserver` is a real function (not polyfilled), which
      // determines if the current environment is JSDOM-like.
      typeof ResizeObserver === 'function' &&
      ResizeObserver.toString().includes('[native code]')
        ? 'full'
        : 'none',
  } as const);

export function getTabbableIn(
  container: HTMLElement,
  direction: 'next' | 'prev',
  from?: HTMLElement | null
) {
  const allTabbable = tabbable(container, getTabbableOptions());

  if (direction === 'prev') {
    allTabbable.reverse();
  }

  const fromElement =
    from ?? (activeElement(getDocument(container)) as HTMLElement);

  const activeIndex = allTabbable.indexOf(fromElement);
  const nextTabbableElements = allTabbable.slice(activeIndex + 1);
  return nextTabbableElements[0];
}

export function getNextTabbable(from?: HTMLElement | null) {
  return getTabbableIn(document.body, 'next', from);
}

export function getPreviousTabbable(from?: HTMLElement | null) {
  return getTabbableIn(document.body, 'prev', from);
}

export function isNextTabbableFrom(from?: HTMLElement | null) {
  const container = document.body;
  const allTabbable = tabbable(container, getTabbableOptions());
  const activeEl = activeElement(getDocument(container)) as HTMLElement;
  const activeIndex = allTabbable.indexOf(activeEl);

  return allTabbable[activeIndex - 1] === from;
}

export function isOutsideEvent(
  event: FocusEvent | React.FocusEvent,
  container?: Element
) {
  const containerElement = container || (event.currentTarget as Element);
  const relatedTarget = event.relatedTarget as HTMLElement | null;
  return !relatedTarget || !contains(containerElement, relatedTarget);
}

export function disableFocusInside(container: HTMLElement) {
  const tabbableElements = tabbable(container, getTabbableOptions());
  tabbableElements.forEach((element) => {
    element.dataset.tabindex = element.getAttribute('tabindex') || '';
    element.setAttribute('tabindex', '-1');
  });
}

export function enableFocusInside(container: HTMLElement) {
  const elements = container.querySelectorAll<HTMLElement>('[data-tabindex]');
  elements.forEach((element) => {
    const tabindex = element.dataset.tabindex;
    delete element.dataset.tabindex;
    if (tabindex) {
      element.setAttribute('tabindex', tabindex);
    } else {
      element.removeAttribute('tabindex');
    }
  });
}
