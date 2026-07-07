import type {
  Boundary,
  ClientRectObject,
  Rect,
  RootBoundary,
  Strategy,
} from '@floating-ui/core';
import {rectToClientRect} from '@floating-ui/core';
import {max, min} from '@floating-ui/utils';
import {
  getComputedStyle,
  getDocumentElement,
  getNodeName,
  getOverflowAncestors,
  getParentNode,
  isContainingBlock,
  isLastTraversableNode,
  isTopLayer,
} from '@floating-ui/utils/dom';

import type {Platform, ReferenceElement} from '../types';
import {getBoundingClientRect} from '../utils/getBoundingClientRect';
import {getDocumentRect} from '../utils/getDocumentRect';
import {getViewportRect} from '../utils/getViewportRect';
import {getVisualOffsets} from '../utils/getVisualOffsets';
import {getScale} from './getScale';
import {isElement} from './isElement';

type PlatformWithCache = Platform & {
  _c: Map<ReferenceElement, Element[]>;
};

// Returns the inner client rect, subtracting scrollbars if present.
function getInnerBoundingClientRect(
  element: Element,
  strategy: Strategy,
): Rect {
  const clientRect = getBoundingClientRect(element, true, strategy === 'fixed');
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = getScale(element);
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
  strategy: Strategy,
): ClientRectObject {
  let rect: Rect;
  const isLayoutViewport = clippingAncestor === 'layoutViewport';

  if (isLayoutViewport || clippingAncestor === 'viewport') {
    rect = getViewportRect(element, strategy, isLayoutViewport);
  } else if (clippingAncestor === 'document') {
    rect = getDocumentRect(getDocumentElement(element));
  } else if (isElement(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const visualOffsets = getVisualOffsets(element);
    rect = {
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y,
      width: clippingAncestor.width,
      height: clippingAncestor.height,
    };
  }

  return rectToClientRect(rect);
}

// A "clipping ancestor" is an `overflow` element with the characteristic of
// clipping (or hiding) child elements. This returns all clipping ancestors
// of the given element up the tree.
function getClippingElementAncestors(
  element: Element,
  cache: PlatformWithCache['_c'],
): Array<Element> {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
  }

  let result = getOverflowAncestors(element, [], false).filter(
    (el) => isElement(el) && getNodeName(el) !== 'body',
  ) as Array<Element>;
  let lastKeptComputedStyle: CSSStyleDeclaration | null = null;
  const elementIsFixed = getComputedStyle(element).position === 'fixed';
  let currentNode: Node | null = elementIsFixed
    ? getParentNode(element)
    : element;

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
    const computedStyle = getComputedStyle(currentNode);
    const currentNodeIsContaining = isContainingBlock(currentNode);
    // Position of the containing block chain below the current node. A fixed
    // element whose containing block hasn't been found yet is a fixed chain.
    const lastPosition = lastKeptComputedStyle
      ? lastKeptComputedStyle.position
      : elementIsFixed
        ? 'fixed'
        : '';

    // A non-containing ancestor does not clip the element when the chain
    // below it escapes it: a fixed chain escapes all ancestors up to the
    // next containing block, an absolute chain escapes static ancestors.
    const shouldDropCurrentNode =
      !currentNodeIsContaining &&
      (lastPosition === 'fixed' ||
        (lastPosition === 'absolute' && computedStyle.position === 'static'));

    if (shouldDropCurrentNode) {
      // Drop non-containing blocks.
      result = result.filter((ancestor) => ancestor !== currentNode);
    } else {
      // The kept node carries the chain position for the next iteration.
      lastKeptComputedStyle = computedStyle;
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
  },
): Rect {
  const elementClippingAncestors =
    boundary === 'clippingAncestors'
      ? isTopLayer(element)
        ? []
        : getClippingElementAncestors(element, this._c)
      : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];

  const firstRect = getClientRectFromClippingAncestor(
    element,
    clippingAncestors[0],
    strategy,
  );
  let top = firstRect.top;
  let right = firstRect.right;
  let bottom = firstRect.bottom;
  let left = firstRect.left;

  for (let i = 1; i < clippingAncestors.length; i++) {
    const rect = getClientRectFromClippingAncestor(
      element,
      clippingAncestors[i],
      strategy,
    );
    top = max(rect.top, top);
    right = min(rect.right, right);
    bottom = min(rect.bottom, bottom);
    left = max(rect.left, left);
  }

  return {
    width: right - left,
    height: bottom - top,
    x: left,
    y: top,
  };
}
