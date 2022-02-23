import {
  rectToClientRect,
  ClientRectObject,
  Boundary,
  RootBoundary,
} from '@floating-ui/core';
import {getViewportRect} from './getViewportRect';
import {getDocumentRect} from './getDocumentRect';
import {getOverflowAncestors} from './getOverflowAncestors';
import {getOffsetParent} from './getOffsetParent';
import {getDocumentElement} from './getDocumentElement';
import {getComputedStyle} from './getComputedStyle';
import {isElement, isHTMLElement} from './is';
import {getBoundingClientRect} from './getBoundingClientRect';
import {getParentNode} from './getParentNode';
import {contains} from './contains';
import {getNodeName} from './getNodeName';
import {max, min} from './math';

function getInnerBoundingClientRect(element: Element): ClientRectObject {
  const clientRect = getBoundingClientRect(element);
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  return {
    top,
    left,
    x: left,
    y: top,
    right: left + element.clientWidth,
    bottom: top + element.clientHeight,
    width: element.clientWidth,
    height: element.clientHeight,
  };
}

function getClientRectFromClippingAncestor(
  element: Element,
  clippingParent: Element | RootBoundary
): ClientRectObject {
  if (clippingParent === 'viewport') {
    return rectToClientRect(getViewportRect(element));
  }

  if (isElement(clippingParent)) {
    return getInnerBoundingClientRect(clippingParent);
  }

  return rectToClientRect(getDocumentRect(getDocumentElement(element)));
}

// A "clipping parent" is an overflowable container with the characteristic of
// clipping (or hiding) overflowing elements with a position different from
// `initial`
function getClippingAncestors(element: Element): Array<Element> {
  const clippingAncestors = getOverflowAncestors(getParentNode(element));
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

  // @ts-ignore isElement check ensures we return Array<Element>
  return clippingAncestors.filter(
    (clippingAncestors) =>
      isElement(clippingAncestors) &&
      contains(clippingAncestors, clipperElement) &&
      getNodeName(clippingAncestors) !== 'body'
  );
}

// Gets the maximum area that the element is visible in due to any number of
// clipping parents
export function getClippingClientRect({
  element,
  boundary,
  rootBoundary,
}: {
  element: Element;
  boundary: Boundary;
  rootBoundary: RootBoundary;
}): ClientRectObject {
  const mainClippingAncestors =
    boundary === 'clippingAncestors'
      ? getClippingAncestors(element)
      : [].concat(boundary);
  const clippingAncestors = [...mainClippingAncestors, rootBoundary];
  const firstClippingAncestor = clippingAncestors[0];

  const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestor);

    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);

    return accRect;
  }, getClientRectFromClippingAncestor(element, firstClippingAncestor));

  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;

  return clippingRect;
}
