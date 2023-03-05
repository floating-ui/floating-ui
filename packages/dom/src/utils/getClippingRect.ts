import type {
  Boundary,
  ClientRectObject,
  Rect,
  RootBoundary,
  Strategy,
} from '@floating-ui/core';
import {rectToClientRect} from '@floating-ui/core';

import {Platform, ReferenceElement} from '../types';
import {getBoundingClientRect} from './getBoundingClientRect';
import {getComputedStyle} from './getComputedStyle';
import {getDocumentElement} from './getDocumentElement';
import {getDocumentRect} from './getDocumentRect';
import {getOverflowAncestors} from './getOverflowAncestors';
import {getParentNode} from './getParentNode';
import {getScale} from './getScale';
import {getViewportRect} from './getViewportRect';
import {getWindow} from './getWindow';
import {
  isClientRectVisualViewportBased,
  isContainingBlock,
  isElement,
  isHTMLElement,
  isLastTraversableNode,
} from './is';
import {max, min} from './math';
import {getNodeName} from './node';

type PlatformWithCache = Platform & {
  _c: Map<ReferenceElement, Element[]>;
};

// Returns the inner client rect, subtracting scrollbars if present.
function getInnerBoundingClientRect(
  element: Element,
  strategy: Strategy
): Rect {
  const clientRect = getBoundingClientRect(element, true, strategy === 'fixed');
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = isHTMLElement(element) ? getScale(element) : {x: 1, y: 1};
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x = left * scale.x;
  const y = top * scale.y;

  return {
    width,
    height,
    x,
    y,
  };
}

function getClientRectFromClippingAncestor(
  element: Element,
  clippingAncestor: Element | RootBoundary,
  strategy: Strategy
): ClientRectObject {
  let rect: Rect;

  if (clippingAncestor === 'viewport') {
    rect = getViewportRect(element, strategy);
  } else if (clippingAncestor === 'document') {
    rect = getDocumentRect(getDocumentElement(element));
  } else if (isElement(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const mutableRect = {...clippingAncestor};
    if (isClientRectVisualViewportBased()) {
      const win = getWindow(element);
      mutableRect.x -= win.visualViewport?.offsetLeft || 0;
      mutableRect.y -= win.visualViewport?.offsetTop || 0;
    }
    rect = mutableRect;
  }

  return rectToClientRect(rect);
}

// A "clipping ancestor" is an `overflow` element with the characteristic of
// clipping (or hiding) child elements. This returns all clipping ancestors
// of the given element up the tree.
function getClippingElementAncestors(
  element: Element,
  cache: PlatformWithCache['_c']
): Array<Element> {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
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

    const shouldIgnoreCurrentNode = computedStyle.position === 'fixed';
    if (shouldIgnoreCurrentNode) {
      currentContainingBlockComputedStyle = null;
    } else {
      const shouldDropCurrentNode = elementIsFixed
        ? !containingBlock && !currentContainingBlockComputedStyle
        : !containingBlock &&
          computedStyle.position === 'static' &&
          !!currentContainingBlockComputedStyle &&
          ['absolute', 'fixed'].includes(
            currentContainingBlockComputedStyle.position
          );

      if (shouldDropCurrentNode) {
        // Drop non-containing blocks.
        result = result.filter((ancestor) => ancestor !== currentNode);
      } else {
        // Record last containing block for next iteration.
        currentContainingBlockComputedStyle = computedStyle;
      }
    }

    currentNode = getParentNode(currentNode);
  }

  cache.set(element, result);

  return result;
}

// Gets the maximum area that the element is visible in due to any number of
// clipping ancestors.
export function getClippingRect(
  this: PlatformWithCache,
  {
    element,
    boundary,
    rootBoundary,
    strategy,
  }: {
    element: Element;
    boundary: Boundary;
    rootBoundary: RootBoundary;
    strategy: Strategy;
  }
): Rect {
  const elementClippingAncestors =
    boundary === 'clippingAncestors'
      ? getClippingElementAncestors(element, this._c)
      : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstClippingAncestor = clippingAncestors[0];

  const clippingRect = clippingAncestors.reduce(
    (accRect: ClientRectObject, clippingAncestor) => {
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
    },
    getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy)
  );

  return {
    width: clippingRect.right - clippingRect.left,
    height: clippingRect.bottom - clippingRect.top,
    x: clippingRect.left,
    y: clippingRect.top,
  };
}
