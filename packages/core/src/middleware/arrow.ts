import type {Padding} from '@floating-ui/utils';
import {
  clamp,
  evaluate,
  getAlignment,
  getAlignmentAxis,
  getAxisLength,
  getPaddingObject,
  min as mathMin,
} from '@floating-ui/utils';

import type {Derivable, Middleware} from '../types';

export interface ArrowOptions {
  /**
   * The arrow element to be positioned.
   * @default undefined
   */
  element: any;
  /**
   * The padding between the arrow element and the floating element edges.
   * Useful when the floating element has rounded corners.
   * @default 0
   */
  padding?: Padding;
}

/**
 * Provides data to position an inner element of the floating element so that it
 * appears centered to the reference element.
 * @see https://floating-ui.com/docs/arrow
 */
export const arrow = (
  options: ArrowOptions | Derivable<ArrowOptions>,
): Middleware => ({
  name: 'arrow',
  options,
  async fn(state) {
    const {x, y, placement, rects, platform, elements, middlewareData} = state;
    // Since `element` is required, we don't Partial<> the type.
    const {element, padding = 0} = evaluate(options, state) || {};

    if (element == null) {
      return {};
    }

    const paddingObject = getPaddingObject(padding);
    const coords = {x, y};
    const axis = getAlignmentAxis(placement);
    const length = getAxisLength(axis);
    const arrowDimensions = await platform.getDimensions(element);
    const isYAxis = axis === 'y';
    const minProp = isYAxis ? 'top' : 'left';
    const maxProp = isYAxis ? 'bottom' : 'right';
    const clientProp = isYAxis ? 'clientHeight' : 'clientWidth';

    const endDiff =
      rects.reference[length] +
      rects.reference[axis] -
      coords[axis] -
      rects.floating[length];
    const startDiff = coords[axis] - rects.reference[axis];

    const arrowOffsetParent = await platform.getOffsetParent?.(element);
    let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;

    // DOM platform can return `window` as the `offsetParent`.
    if (!clientSize || !(await platform.isElement?.(arrowOffsetParent))) {
      clientSize = elements.floating[clientProp] || rects.floating[length];
    }

    const centerToReference = endDiff / 2 - startDiff / 2;

    // If the padding is large enough that it causes the arrow to no longer be
    // centered, modify the padding so that it is centered.
    const largestPossiblePadding =
      clientSize / 2 - arrowDimensions[length] / 2 - 1;
    const minPadding = mathMin(paddingObject[minProp], largestPossiblePadding);
    const maxPadding = mathMin(paddingObject[maxProp], largestPossiblePadding);

    // Make sure the arrow doesn't overflow the floating element if the center
    // point is outside the floating element's bounds.
    const min = minPadding;
    const max = clientSize - arrowDimensions[length] - maxPadding;
    const center =
      clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
    const offset = clamp(min, center, max);

    // If the reference is small enough that the arrow's padding causes it to
    // to point to nothing for an aligned placement, adjust the offset of the
    // floating element itself. To ensure `shift()` continues to take action,
    // a single reset is performed when this is true.
    const shouldAddOffset =
      !middlewareData.arrow &&
      getAlignment(placement) != null &&
      center !== offset &&
      rects.reference[length] / 2 -
        (center < min ? minPadding : maxPadding) -
        arrowDimensions[length] / 2 <
        0;
    const alignmentOffset = shouldAddOffset
      ? center < min
        ? center - min
        : center - max
      : 0;

    return {
      [axis]: coords[axis] + alignmentOffset,
      data: {
        [axis]: offset,
        centerOffset: center - offset - alignmentOffset,
        ...(shouldAddOffset && {alignmentOffset}),
      },
      reset: shouldAddOffset,
    };
  },
});
