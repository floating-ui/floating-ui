import {tabbable, type FocusableElement} from 'tabbable';
import {activeElement, contains, getDocument} from './element';

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

function getTabbableIn(
  container: HTMLElement,
  direction: 'next' | 'prev',
): FocusableElement | undefined {
  const doc = getDocument(container);
  const currentActive = activeElement(doc) as FocusableElement;
  const tabbableElements = tabbable(container, getTabbableOptions());
  const n = tabbableElements.length;

  if (n === 0) {
    return;
  }

  const activeIndex = tabbableElements.indexOf(currentActive);

  if (activeIndex === -1) {
    return;
  }

  return tabbableElements[activeIndex + (direction === 'next' ? 1 : -1)];
}

export function getNextTabbable(
  referenceElement: Element | null,
): FocusableElement | null {
  return (
    getTabbableIn(getDocument(referenceElement).body, 'next') ||
    (referenceElement as FocusableElement)
  );
}

export function getPreviousTabbable(
  referenceElement: Element | null,
): FocusableElement | null {
  return (
    getTabbableIn(getDocument(referenceElement).body, 'prev') ||
    (referenceElement as FocusableElement)
  );
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
