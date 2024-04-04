import {activeElement, contains, getDocument} from '@floating-ui/react/utils';
import {tabbable} from 'tabbable';

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
  }) as const;

export function getTabbableIn(
  container: HTMLElement,
  direction: 'next' | 'prev',
) {
  const allTabbable = tabbable(container, getTabbableOptions());

  if (direction === 'prev') {
    allTabbable.reverse();
  }

  const activeIndex = allTabbable.indexOf(
    activeElement(getDocument(container)) as HTMLElement,
  );
  const nextTabbableElements = allTabbable.slice(activeIndex + 1);
  return nextTabbableElements[0];
}

export function getNextTabbable() {
  return getTabbableIn(document.body, 'next');
}

export function getPreviousTabbable() {
  return getTabbableIn(document.body, 'prev');
}

export function isOutsideEvent(
  event: FocusEvent | React.FocusEvent,
  container?: Element,
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
