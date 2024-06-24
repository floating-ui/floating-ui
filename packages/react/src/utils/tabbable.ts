import {activeElement, contains, getDocument} from '@floating-ui/react/utils';
import {type FocusableElement, tabbable} from 'tabbable';
import {createAttribute} from './createAttribute';

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

export function getClosestTabbableElement(
  tabbableElements: Array<FocusableElement>,
  element: HTMLElement,
  floating: HTMLElement,
) {
  const elementIndex = tabbableElements.indexOf(element);

  function traverseTabbableElements(next: boolean) {
    const attr = createAttribute('focus-guard');
    let index = elementIndex + (next ? 1 : 0);
    let currentElement = tabbableElements[index];

    while (
      currentElement &&
      (!currentElement.isConnected ||
        currentElement.hasAttribute(attr) ||
        contains(floating, currentElement))
    ) {
      if (next) {
        index++;
      } else {
        index--;
      }
      currentElement = tabbableElements[index];
    }

    return currentElement;
  }

  // First, try to find the next tabbable element
  const next = traverseTabbableElements(true);
  if (next) {
    return next;
  }

  // If we can't find a next tabbable element, try to find the previous one
  return traverseTabbableElements(false);
}
