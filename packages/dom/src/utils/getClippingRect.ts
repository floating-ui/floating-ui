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
import {getDocumentElement} from './getDocumentElement';
import {getComputedStyle} from './getComputedStyle';
import {
  isElement,
  isHTMLElement,
  isLastTraversableNode,
  isOverflowElement,
  isShadowRoot,
} from './is';
import {getBoundingClientRect} from './getBoundingClientRect';
import {max, min} from './math';
import {getParentNode} from './getParentNode';

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
function getClippingElementAncestors(element: Element): Array<Element> {
  const overflowAncestors = getOverflowAncestors(element);
  let currentNode: Node | null = element;
  let hasEscapableParent = false;

  let result = overflowAncestors.filter((overflowAncestor) =>
    isElement(overflowAncestor)
  ) as Array<Element>;

  if (isShadowRoot(currentNode)) {
    currentNode = currentNode.host;
  }

  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    const position = getComputedStyle(currentNode).position;
    const canEscapeClipping = ['absolute', 'fixed'].includes(position);
    const isPositioned = position !== 'static';
    const hasOverflowProperty = isOverflowElement(currentNode);

    if (canEscapeClipping) {
      hasEscapableParent = true;
    }

    if (isPositioned && hasOverflowProperty) {
      hasEscapableParent = false;
    }

    if (hasEscapableParent && hasOverflowProperty) {
      result = result.filter((ancestor) => ancestor !== currentNode);
    }

    const parent = getParentNode(currentNode);
    currentNode = isShadowRoot(parent) ? parent.host : parent;
  }

  if (hasEscapableParent) {
    return [];
  }

  return result;
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
      ? getClippingElementAncestors(element)
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
