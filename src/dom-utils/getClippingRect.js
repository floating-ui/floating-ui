// @flow
import type { VirtualElement, ClientRectObject } from '../types';
import type { RootBoundary } from '../enums';
import { viewport } from '../enums';
import getViewportRect from './getViewportRect';
import getDocumentRect from './getDocumentRect';
import listScrollParents from './listScrollParents';
import getOffsetParent from './getOffsetParent';
import getDocumentElement from './getDocumentElement';
import getComputedStyle from './getComputedStyle';
import unwrapVirtualElement from './unwrapVirtualElement';
import { isElement, isHTMLElement } from './instanceOf';
import getBoundingClientRect from './getBoundingClientRect';
import rectToClientRect from '../utils/rectToClientRect';
import getBorders from './getBorders';

// A "clipping parent" is a scrolling container with the characteristic of
// clipping (or hiding) overflowing elements with a position different from
// `initial`
function getClippingParents(elementOrVirtualElement: Element | VirtualElement) {
  const element = unwrapVirtualElement(elementOrVirtualElement);
  const scrollParents = listScrollParents(element);
  const canEscapeClipping = ['absolute', 'fixed'].includes(
    getComputedStyle(element).position
  );
  const clipperElement =
    canEscapeClipping && isHTMLElement(element)
      ? getOffsetParent(element)
      : element;

  if (!isElement(clipperElement)) {
    return [];
  }

  return scrollParents.filter(scrollParent => {
    return isElement(scrollParent) && scrollParent.contains(clipperElement);
  });
}

// Gets the maximum area that the element is visible in due to any number of
// clipping parents
export default function getClippingRect(
  elementOrVirtualElement: Element | VirtualElement,
  rootBoundary: RootBoundary
): ClientRectObject {
  const element = unwrapVirtualElement(elementOrVirtualElement);
  const documentElement = getDocumentElement(element);
  const clippingParents = getClippingParents(element);
  const firstClippingParent = clippingParents[0];

  // Fallback to document
  if (
    rootBoundary === 'document' &&
    (firstClippingParent === documentElement || !firstClippingParent)
  ) {
    return rectToClientRect(getDocumentRect(documentElement));
  }

  // Fallback to viewport
  if (rootBoundary === viewport && !firstClippingParent) {
    return rectToClientRect(getViewportRect(element));
  }

  const clippingRect = clippingParents.reduce((accRect, clippingParent) => {
    const rect = getBoundingClientRect(clippingParent);
    const borders = getBorders(clippingParent);

    accRect.top = Math.max(rect.top + borders.top, accRect.top);
    accRect.right = Math.min(rect.right - borders.right, accRect.right);
    accRect.bottom = Math.min(rect.bottom - borders.bottom, accRect.bottom);
    accRect.left = Math.max(rect.left + borders.left, accRect.left);

    return accRect;
  }, getBoundingClientRect(firstClippingParent));

  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;

  return clippingRect;
}
