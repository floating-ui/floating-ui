import type {Padding, SideObject} from '@floating-ui/utils';
import {evaluate, getPaddingObject, rectToClientRect} from '@floating-ui/utils';

import type {
  Boundary,
  Derivable,
  ElementContext,
  MiddlewareState,
  RootBoundary,
} from './types';

export interface DetectOverflowOptions {
  /**
   * The clipping element(s) or area in which overflow will be checked.
   * @default 'clippingAncestors'
   */
  boundary?: Boundary;
  /**
   * The root clipping area in which overflow will be checked.
   * @default 'viewport'
   */
  rootBoundary?: RootBoundary;
  /**
   * The element in which overflow is being checked relative to a boundary.
   * @default 'floating'
   */
  elementContext?: ElementContext;
  /**
   * Whether to check for overflow using the alternate element's boundary
   * (`clippingAncestors` boundary only).
   * @default false
   */
  altBoundary?: boolean;
  /**
   * Virtual padding for the resolved overflow detection offsets.
   * @default 0
   */
  padding?: Padding;
}

/**
 * Resolves with an object of overflow side offsets that determine how much the
 * element is overflowing a given clipping boundary on each side.
 * - positive = overflowing the boundary by that number of pixels
 * - negative = how many pixels left before it will overflow
 * - 0 = lies flush with the boundary
 * @see https://floating-ui.com/docs/detectOverflow
 */
export async function detectOverflow(
  state: MiddlewareState,
  options: DetectOverflowOptions | Derivable<DetectOverflowOptions> = {},
): Promise<SideObject> {
  const {x, y, platform, rects, elements, strategy} = state;

  const {
    boundary = 'clippingAncestors',
    rootBoundary = 'viewport',
    elementContext = 'floating',
    altBoundary = false,
    padding = 0,
  } = evaluate(options, state);

  const paddingObject = getPaddingObject(padding);
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
    }),
  );

  const rect =
    elementContext === 'floating'
      ? {x, y, width: rects.floating.width, height: rects.floating.height}
      : rects.reference;

  const offsetParent = await platform.getOffsetParent?.(elements.floating);
  const offsetScale = (await platform.isElement?.(offsetParent))
    ? (await platform.getScale?.(offsetParent)) || {x: 1, y: 1}
    : {x: 1, y: 1};

  const elementClientRect = rectToClientRect(
    platform.convertOffsetParentRelativeRectToViewportRelativeRect
      ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect({
          elements,
          rect,
          offsetParent,
          strategy,
        })
      : rect,
  );

  return {
    top:
      (clippingClientRect.top - elementClientRect.top + paddingObject.top) /
      offsetScale.y,
    bottom:
      (elementClientRect.bottom -
        clippingClientRect.bottom +
        paddingObject.bottom) /
      offsetScale.y,
    left:
      (clippingClientRect.left - elementClientRect.left + paddingObject.left) /
      offsetScale.x,
    right:
      (elementClientRect.right -
        clippingClientRect.right +
        paddingObject.right) /
      offsetScale.x,
  };
}
