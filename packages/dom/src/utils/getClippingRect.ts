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
import {isElement, isLastTraversableNode} from './is';
import {getBoundingClientRect} from './getBoundingClientRect';
import {max, min} from './math';
import {getParentNode} from './getParentNode';

// Returns the inner client rect, subtracting scrollbars if present
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

// A "clipping ancestor" is an overflowable container with the characteristic of
// clipping (or hiding) overflowing elements with a position different from
// `initial`
function getClippingElementAncestors(element: Element): Array<Element> {
  let result = getOverflowAncestors(element).filter((el) =>
    isElement(el)
  ) as Array<Element>;
  let currentNode: Node | null = element;
  let currentContainingBlockComputedStyle: CSSStyleDeclaration | null = null;

  // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block
  while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
    const computedStyle = getComputedStyle(currentNode);
    const {position, transform, perspective, willChange, filter} =
      computedStyle;

    // for compatibility considerations, some old browsers don't have `contain` and `backdropFilter` CSS properties
    // ts 4.1 CSSStyleDeclaration doesn't have this properties
    const contain = (computedStyle as any).contain ?? 'none';
    const backdropFilter = (computedStyle as any).backdropFilter ?? 'none';

    if (
      currentContainingBlockComputedStyle &&
      ['absolute', 'fixed'].includes(
        currentContainingBlockComputedStyle.position
      ) &&
      position === 'static' &&
      transform === 'none' &&
      perspective === 'none' &&
      !['transform', 'perspective'].includes(willChange) &&
      filter === 'none' &&
      contain !== 'paint' &&
      backdropFilter === 'none'
    ) {
      // drop non-containing blocks
      result = result.filter((ancestor) => ancestor !== currentNode);
    } else {
      // record last containing block for next iter
      currentContainingBlockComputedStyle = computedStyle;
    }

    currentNode = getParentNode(currentNode);
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
