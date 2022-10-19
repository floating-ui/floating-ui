import {
  rectToClientRect,
  ClientRectObject,
  Boundary,
  RootBoundary,
  Rect,
  Strategy,
} from '@floating-ui/core';
import {getViewportRect} from './getViewportRect';
import {getDocumentRect} from './getDocumentRect';
import {getOverflowAncestors} from './getOverflowAncestors';
import {getOffsetParent} from './getOffsetParent';
import {getDocumentElement} from './getDocumentElement';
import {getComputedStyle} from './getComputedStyle';
import {
  isElement,
  isHTMLElement,
  isLastTraversableNode,
  isOverflowElement,
} from './is';
import {getBoundingClientRect} from './getBoundingClientRect';
import {contains} from './contains';
import {getNodeName} from './getNodeName';
import {max, min} from './math';
import {getParentNode} from './getParentNode';

function getNearestParentCapableOfEscapingClipping(
  element: Element,
  clippingAncestors: Array<Element | Window | VisualViewport>
): Node {
  let currentNode: Node | null = element;

  while (
    currentNode &&
    // @ts-expect-error
    !clippingAncestors.includes(currentNode) &&
    !isLastTraversableNode(currentNode)
  ) {
    if (
      isElement(currentNode) &&
      ['absolute', 'fixed'].includes(getComputedStyle(currentNode).position)
    ) {
      break;
    }

    currentNode = getParentNode(currentNode);
  }

  return currentNode;
}

function getInnerBoundingClientRect(
  element: Element,
  strategy: Strategy
): ClientRectObject {
  const clientRect = getBoundingClientRect(
    element,
    false,
    strategy === 'fixed'
  );
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
  clippingParent: Element | RootBoundary,
  strategy: Strategy
): ClientRectObject {
  if (clippingParent === 'viewport') {
    return rectToClientRect(getViewportRect(element, strategy));
  }

  if (isElement(clippingParent)) {
    return getInnerBoundingClientRect(clippingParent, strategy);
  }

  return rectToClientRect(getDocumentRect(getDocumentElement(element)));
}

// A "clipping ancestor" is an overflowable container with the characteristic of
// clipping (or hiding) overflowing elements with a position different from
// `initial`
function getClippingAncestors(element: Element): Array<Element> {
  const clippingAncestors = getOverflowAncestors(element);
  const nearestEscapableParent = getNearestParentCapableOfEscapingClipping(
    element,
    clippingAncestors
  );

  let clipperElement: Element | null = null;
  if (nearestEscapableParent && isHTMLElement(nearestEscapableParent)) {
    const offsetParent = getOffsetParent(nearestEscapableParent);
    if (isOverflowElement(nearestEscapableParent)) {
      clipperElement = nearestEscapableParent;
    } else if (isHTMLElement(offsetParent)) {
      clipperElement = offsetParent;
    }
  }

  if (!isElement(clipperElement)) {
    return [];
  }

  // @ts-ignore isElement check ensures we return Array<Element>
  return clippingAncestors.filter(
    (clippingAncestors) =>
      clipperElement &&
      isElement(clippingAncestors) &&
      contains(clippingAncestors, clipperElement) &&
      getNodeName(clippingAncestors) !== 'body'
  );
}

// Gets the maximum area that the element is visible in due to any number of
// clipping ancestors
export function getClippingRect({
  element,
  boundary,
  rootBoundary,
  strategy,
}: {
  element: Element;
  boundary: Boundary;
  rootBoundary: RootBoundary;
  strategy: Strategy;
}): Rect {
  const mainClippingAncestors =
    boundary === 'clippingAncestors'
      ? getClippingAncestors(element)
      : [].concat(boundary);
  const clippingAncestors = [...mainClippingAncestors, rootBoundary];
  const firstClippingAncestor = clippingAncestors[0];

  const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
    const rect = getClientRectFromClippingAncestor(
      element,
      clippingAncestor,
      strategy
    );

    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);

    return accRect;
  }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));

  return {
    width: clippingRect.right - clippingRect.left,
    height: clippingRect.bottom - clippingRect.top,
    x: clippingRect.left,
    y: clippingRect.top,
  };
}
