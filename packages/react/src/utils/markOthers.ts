import {contains, getDocument} from '@floating-ui/utils/react';

import {createAttribute} from './createAttribute';

export const supportsInert = () =>
  typeof HTMLElement !== 'undefined' && 'inert' in HTMLElement.prototype;

export function markOthers(
  avoidElementOrElements: Element | Element[],
  ariaHidden = false,
  inert = false
) {
  const marker = createAttribute('inert');
  const map = new Map<Element, [string | null, boolean, boolean]>();
  const avoidElements: Element[] = [].concat.call(avoidElementOrElements);

  traverseAndAddAttribute(getDocument(avoidElements[0]).body);

  function traverseAndAddAttribute(element: Element) {
    const ariaLiveElements = Array.from(
      element.querySelectorAll('[aria-live]')
    );

    if (
      avoidElements
        .concat(ariaLiveElements)
        .every(
          (avoidElement) =>
            !contains(avoidElement, element) && !contains(element, avoidElement)
        )
    ) {
      if (element.matches('[aria-live]')) {
        return;
      }

      map.set(element, [
        element.getAttribute('aria-hidden'),
        element.hasAttribute('inert'),
        element.hasAttribute(marker),
      ]);

      element.setAttribute(marker, '');
      ariaHidden && element.setAttribute('aria-hidden', 'true');
      inert && supportsInert() && element.setAttribute('inert', '');
    } else {
      Array.from(element.children).forEach(traverseAndAddAttribute);
    }
  }

  return () => {
    map.forEach(([originalAriaHidden, hadInert, hadMarker], element) => {
      if (ariaHidden) {
        if (originalAriaHidden === null) {
          element.removeAttribute('aria-hidden');
        } else if (originalAriaHidden) {
          element.setAttribute('aria-hidden', originalAriaHidden);
        }
      }

      !hadInert && inert && supportsInert() && element.removeAttribute('inert');
      !hadMarker && element.removeAttribute(marker);
    });

    map.clear();
  };
}
