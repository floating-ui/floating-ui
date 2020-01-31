// @flow
import type { ClientRectObject } from '../types';
import type { Boundary, RootBoundary } from '../enums';
import { viewport } from '../enums';
import getViewportRect from './getViewportRect';
import getDocumentRect from './getDocumentRect';
import listScrollParents from './listScrollParents';
import getOffsetParent from './getOffsetParent';
import getDocumentElement from './getDocumentElement';
import getComputedStyle from './getComputedStyle';
import { isElement, isHTMLElement } from './instanceOf';
import getBoundingClientRect from './getBoundingClientRect';
import getDecorations from './getDecorations';
import contains from './contains';
import rectToClientRect from '../utils/rectToClientRect';

function getClientRectFromMixedType(
  element: Element,
  clippingParent: Element | RootBoundary
): ClientRectObject {
  return clippingParent === viewport
    ? rectToClientRect(getViewportRect(element))
    : isHTMLElement(clippingParent)
    ? getBoundingClientRect(clippingParent)
    : rectToClientRect(getDocumentRect(getDocumentElement(element)));
}

// A "clipping parent" is an overflowable container with the characteristic of
// clipping (or hiding) overflowing elements with a position different from
// `initial`
function getClippingParents(element: Element): Array<Element> {
  const clippingParents = listScrollParents(element);
  const canEscapeClipping =
    ['absolute', 'fixed'].indexOf(getComputedStyle(element).position) >= 0;
  const clipperElement =
    canEscapeClipping && isHTMLElement(element)
      ? getOffsetParent(element)
      : element;

  if (!isElement(clipperElement)) {
    return [];
  }

  // $FlowFixMe: https://github.com/facebook/flow/issues/1414
  return clippingParents.filter(
    clippingParent =>
      isElement(clippingParent) && contains(clippingParent, clipperElement)
  );
}

// Gets the maximum area that the element is visible in due to any number of
// clipping parents
export default function getClippingRect(
  element: Element,
  boundary: Boundary,
  rootBoundary: RootBoundary
): ClientRectObject {
  const mainClippingParents =
    boundary === 'clippingParents'
      ? getClippingParents(element)
      : [].concat(boundary);
  const clippingParents = [...mainClippingParents, rootBoundary];
  const firstClippingParent = clippingParents[0];

  const clippingRect = clippingParents.reduce((accRect, clippingParent) => {
    const rect = getClientRectFromMixedType(element, clippingParent);
    const decorations = getDecorations(
      isHTMLElement(clippingParent)
        ? clippingParent
        : getDocumentElement(element)
    );

    accRect.top = Math.max(rect.top + decorations.top, accRect.top);
    accRect.right = Math.min(rect.right - decorations.right, accRect.right);
    accRect.bottom = Math.min(rect.bottom - decorations.bottom, accRect.bottom);
    accRect.left = Math.max(rect.left + decorations.left, accRect.left);

    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent));

  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;

  return clippingRect;
}
