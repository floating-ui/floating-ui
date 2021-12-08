import {
  rectToClientRect,
  ClientRectObject,
  Boundary,
  RootBoundary,
} from '@floating-ui/core';
import {getViewportRect} from './getViewportRect';
import {getDocumentRect} from './getDocumentRect';
import {getScrollParents} from './getScrollParents';
import {getOffsetParent} from './getOffsetParent';
import {getDocumentElement} from './getDocumentElement';
import {getComputedStyle} from './getComputedStyle';
import {isElement, isHTMLElement} from './is';
import {getBoundingClientRect} from './getBoundingClientRect';
import {getParentNode} from './getParentNode';
import {contains} from './contains';
import {getNodeName} from './getNodeName';

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

function getClientRectFromClippingParent(
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
function getClippingParents(element: Element): Array<Element> {
  const clippingParents = getScrollParents(getParentNode(element));
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
  return clippingParents.filter(
    (clippingParent) =>
      isElement(clippingParent) &&
      contains(clippingParent, clipperElement) &&
      getNodeName(clippingParent) !== 'body' &&
      (canEscapeClipping
        ? getComputedStyle(clippingParent).position !== 'static'
        : true)
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
  const mainClippingParents =
    boundary === 'clippingParents'
      ? getClippingParents(element)
      : [].concat(boundary);
  const clippingParents = [...mainClippingParents, rootBoundary];
  const firstClippingParent = clippingParents[0];

  const clippingRect = clippingParents.reduce((accRect, clippingParent) => {
    const rect = getClientRectFromClippingParent(element, clippingParent);

    accRect.top = Math.max(rect.top, accRect.top);
    accRect.right = Math.min(rect.right, accRect.right);
    accRect.bottom = Math.min(rect.bottom, accRect.bottom);
    accRect.left = Math.max(rect.left, accRect.left);

    return accRect;
  }, getClientRectFromClippingParent(element, firstClippingParent));

  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;

  return clippingRect;
}
