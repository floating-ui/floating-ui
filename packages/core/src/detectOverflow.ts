import {evaluate, getPaddingObject, rectToClientRect} from './utils';
import type {
  Boundary,
  Derivable,
  ElementContext,
  MiddlewareState,
  RootBoundary,
  Padding,
  SideObject,
} from './types';

export interface DetectOverflowOptions {
  /**
   * The clipping element(s) or area in which overflow will be checked.
   * @default 'clipping-ancestors'
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
   * (`clipping-ancestors` boundary only).
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
 * Generator version of detectOverflow that yields platform calls instead of awaiting them.
 * Resolves with an object of overflow side offsets that determine how much the
 * element is overflowing a given clipping boundary on each side.
 * - positive = overflowing the boundary by that number of pixels
 * - negative = how many pixels left before it will overflow
 * - 0 = lies flush with the boundary
 * @see https://floating-ui.com/docs/detectOverflow
 */
export function* detectOverflow(
  state: MiddlewareState,
  options: DetectOverflowOptions | Derivable<DetectOverflowOptions> = {},
): Generator<any, SideObject, any> {
  const {x, y, platform, rects, elements, strategy} = state;

  const {
    boundary = 'clipping-ancestors',
    rootBoundary = 'viewport',
    elementContext = 'floating',
    altBoundary = false,
    padding = 0,
  } = evaluate(options, state);

  const paddingObject = getPaddingObject(padding);
  const altContext = elementContext === 'floating' ? 'reference' : 'floating';
  const element = elements[altBoundary ? altContext : elementContext];

  const isElementResult = yield platform.isElement?.(element) ?? true;
  const documentElement = yield platform.getDocumentElement?.(
    elements.floating,
  );

  const clippingClientRect = rectToClientRect(
    yield platform.getClippingRect({
      element: isElementResult
        ? element
        : element.contextElement || documentElement,
      boundary,
      rootBoundary,
      strategy,
    }),
  );

  const rect =
    elementContext === 'floating'
      ? {x, y, width: rects.floating.width, height: rects.floating.height}
      : rects.reference;

  const offsetParent = yield platform.getOffsetParent?.(elements.floating);
  const isOffsetParentElement = yield platform.isElement?.(offsetParent);
  const offsetScale = isOffsetParentElement
    ? (yield platform.getScale?.(offsetParent)) || {x: 1, y: 1}
    : {x: 1, y: 1};

  const elementClientRect = rectToClientRect(
    platform.convertToViewportRelativeRect
      ? yield platform.convertToViewportRelativeRect({
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
