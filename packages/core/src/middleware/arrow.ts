import {detectOverflow} from '../detectOverflow';
import type {Middleware, Padding} from '../types';
import {getLengthFromAxis} from '../utils/getLengthFromAxis';
import {getMainAxisFromPlacement} from '../utils/getMainAxisFromPlacement';
import {getSideObjectFromPadding} from '../utils/getPaddingObject';
import {within} from '../utils/within';

export interface Options {
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
 * Positions an inner element of the floating element such that it is centered
 * to the reference element.
 * @see https://floating-ui.com/docs/arrow
 */
export const arrow = (options: Options): Middleware => ({
  name: 'arrow',
  options,
  async fn(middlewareArguments) {
    // Since `element` is required, we don't Partial<> the type
    const {element, padding = 0} = options ?? {};
    const {x, y, placement, rects, platform} = middlewareArguments;

    if (element == null) {
      if (__DEV__) {
        console.warn(
          'Floating UI: No `element` was passed to the `arrow` middleware.'
        );
      }
      return {};
    }

    const paddingObject = getSideObjectFromPadding(padding);
    const coords = {x, y};
    const axis = getMainAxisFromPlacement(placement);
    const length = getLengthFromAxis(axis);
    const arrowDimensions = await platform.getDimensions(element);
    const minProp = axis === 'y' ? 'top' : 'left';
    const maxProp = axis === 'y' ? 'bottom' : 'right';

    const endDiff =
      rects.reference[length] +
      rects.reference[axis] -
      coords[axis] -
      rects.floating[length];
    const startDiff = coords[axis] - rects.reference[axis];

    const arrowOffsetParent = await platform.getOffsetParent?.(element);
    let clientSize = arrowOffsetParent
      ? axis === 'y'
        ? arrowOffsetParent.clientHeight || 0
        : arrowOffsetParent.clientWidth || 0
      : 0;

    if (clientSize === 0) {
      clientSize = rects.floating[length];
    }

    const centerToReference = endDiff / 2 - startDiff / 2;

    // Make sure the arrow doesn't overflow the floating element if the center
    // point is outside the floating element's bounds
    const min = paddingObject[minProp];
    const max = clientSize - arrowDimensions[length] - paddingObject[maxProp];
    const center =
      clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
    const offset = within(min, center, max);

    const shouldAddOffset =
      center !== offset && rects.reference[length] <= rects.floating[length];
    const alignmentOffset = shouldAddOffset
      ? center < min
        ? min - center
        : max - center
      : 0;

    // When the floating element is larger than the reference element in the
    // specified dimension (length variable), ensure that the arrow will point
    // to it by shifting the floating element to take into account the padding.
    // This prevents it from pointing toward nothing.
    // However, in this scenario, the arrow will then be prevented from being
    // able to move itself away from the center — so we need to take the
    // overflow as a result into consideration. This keeps the behavior
    // consistent.
    const nextCoord = coords[axis] - alignmentOffset;
    const overflow = await detectOverflow({
      ...middlewareArguments,
      [axis]: nextCoord,
    });

    let overflowOffset = 0;
    if (axis === 'x') {
      if (overflow.left >= 0) {
        overflowOffset = overflow.left;
      } else if (overflow.right >= 0) {
        overflowOffset = -overflow.right;
      }
    } else {
      if (overflow.top >= 0) {
        overflowOffset = overflow.top;
      } else if (overflow.bottom >= 0) {
        overflowOffset = -overflow.bottom;
      }
    }

    return {
      [axis]: nextCoord + overflowOffset,
      data: {
        [axis]: offset,
        centerOffset: center - offset,
      },
    };
  },
});
