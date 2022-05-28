import type {
  SideObject,
  Padding,
  Boundary,
  RootBoundary,
  ElementContext,
  MiddlewareArguments,
} from './types';
import {getSideObjectFromPadding} from './utils/getPaddingObject';
import {rectToClientRect} from './utils/rectToClientRect';

export interface Options {
  /**
   * The clipping element(s) in which overflow will be checked.
   * @default 'clippingAncestors'
   */
  boundary: Boundary;
  /**
   * The root clipping element in which overflow will be checked.
   * @default 'viewport'
   */
  rootBoundary: RootBoundary;
  /**
   * The element in which overflow is being checked relative to a boundary.
   * @default 'floating'
   */
  elementContext: ElementContext;
  /**
   * Whether to check for overflow using the alternate element's boundary
   * (`clippingAncestors` boundary only).
   * @default false
   */
  altBoundary: boolean;
  /**
   * Virtual padding for the resolved overflow offsets.
   * @default 0
   */
  padding: Padding;
}

/**
 * Resolves with an object of overflow side offsets that determine how much the
 * element is overflowing a given clipping boundary.
 * - positive = overflowing the boundary by that number of pixels
 * - negative = how many pixels left before it will overflow
 * - 0 = lies flush with the boundary
 * @see https://floating-ui.com/docs/detectOverflow
 */
export async function detectOverflow(
  middlewareArguments: MiddlewareArguments,
  options: Partial<Options> = {}
): Promise<SideObject> {
  const {x, y, platform, rects, elements, strategy} = middlewareArguments;

  const {
    boundary = 'clippingAncestors',
    rootBoundary = 'viewport',
    elementContext = 'floating',
    altBoundary = false,
    padding = 0,
  } = options;

  const paddingObject = getSideObjectFromPadding(padding);
  const altContext = elementContext === 'floating' ? 'reference' : 'floating';
  const element = elements[altBoundary ? altContext : elementContext];

  const clippingClientRect = rectToClientRect(
    await platform.getClippingRect({
      element:
        (await platform.isElement?.(element)) ?? true
          ? element
          : element.contextElement ||
            (await platform.getDocumentElement?.(elements.floating)),
      boundary,
      rootBoundary,
      strategy,
    })
  );

  const elementClientRect = rectToClientRect(
    platform.convertOffsetParentRelativeRectToViewportRelativeRect
      ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
          rect:
            elementContext === 'floating'
              ? {...rects.floating, x, y}
              : rects.reference,
          offsetParent: await platform.getOffsetParent?.(elements.floating),
          strategy,
        })
      : rects[elementContext]
  );

  return {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom:
      elementClientRect.bottom -
      clippingClientRect.bottom +
      paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right:
      elementClientRect.right - clippingClientRect.right + paddingObject.right,
  };
}
