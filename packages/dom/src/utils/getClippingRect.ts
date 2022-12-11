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
  isLastTraversableNode,
  isContainingBlock,
  isHTMLElement,
} from './is';
import {getBoundingClientRect} from './getBoundingClientRect';
import {max, min} from './math';
import {getParentNode} from './getParentNode';
import {getNodeName} from './getNodeName';
import {getScale} from './getScale';
import {cache} from './cache';

// Returns the inner client rect, subtracting scrollbars if present
function getInnerBoundingClientRect(
  element: Element,
  strategy: Strategy
): ClientRectObject {
  const clientRect = getBoundingClientRect(element, true, strategy === 'fixed');
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = isHTMLElement(element) ? getScale(element) : {x: 1, y: 1};
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x = left * scale.x;
  const y = top * scale.y;

  return {
    top: y,
    left: x,
    right: x + width,
    bottom: y + height,
    x,
    y,
    width,
    height,
  };
}

function getClientRectFromClippingAncestor(
  element: Element,
  clippingAncestor: Element | RootBoundary,
  strategy: Strategy
): ClientRectObject {
  if (clippingAncestor === 'viewport') {
    return rectToClientRect(getViewportRect(element, strategy));
  }

  if (isElement(clippingAncestor)) {
    return getInnerBoundingClientRect(clippingAncestor, strategy);
  }

  return rectToClientRect(getDocumentRect(getDocumentElement(element)));
}

// A "clipping ancestor" is an `overflow` element with the characteristic of
// clipping (or hiding) child elements. This returns all clipping ancestors
// of the given element up the tree.
function getClippingElementAncestors(element: Element): Array<Element> {
  const cachedResult = cache.get(element);
  if (cachedResult?.a) {
    return cachedResult.a;
  }

  let result = getOverflowAncestors(element).filter(
    (el) => isElement(el) && getNodeName(el) !== 'body'
  ) as Array<Element>;
  let currentContainingBlockComputedStyle: CSSStyleDeclaration | null = null;
  const elementIsFixed = getComputedStyle(element).position === 'fixed';
  let currentNode: Node | null = elementIsFixed
    ? getParentNode(element)
    : element;

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
    const computedStyle = getComputedStyle(currentNode);
    const containingBlock = isContainingBlock(currentNode);

    const shouldDropCurrentNode = elementIsFixed
      ? !containingBlock && !currentContainingBlockComputedStyle
      : !containingBlock &&
        computedStyle.position === 'static' &&
        !!currentContainingBlockComputedStyle &&
        ['absolute', 'fixed'].includes(
          currentContainingBlockComputedStyle.position
        );

    if (shouldDropCurrentNode) {
      // Drop non-containing blocks
      result = result.filter((ancestor) => ancestor !== currentNode);
    } else {
      // Record last containing block for next iteration
      currentContainingBlockComputedStyle = computedStyle;
    }

    currentNode = getParentNode(currentNode);
  }

  cache.set(element, {a: result});

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
  const elementClippingAncestors =
    boundary === 'clippingAncestors'
      ? getClippingElementAncestors(element)
      : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
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
