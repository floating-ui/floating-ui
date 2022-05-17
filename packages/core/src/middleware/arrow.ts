import type {Middleware, Padding} from '../types';
import {getLengthFromAxis} from '../utils/getLengthFromAxis';
import {getMainAxisFromPlacement} from '../utils/getMainAxisFromPlacement';
import {getSideObjectFromPadding} from '../utils/getPaddingObject';
import {within} from '../utils/within';
import {getAlignment} from '../utils/getAlignment';

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
    const alignment = getAlignment(placement);
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

    // Make sure that arrow points at the reference
    const alignmentPadding = alignment === 'start' ? paddingObject[minProp] : paddingObject[maxProp];
    const shouldAddOffset = alignmentPadding > 0
      && center !== offset
      && rects.reference[length] <= rects.floating[length];
    const alignmentOffset = shouldAddOffset ?
      center < min
        ? min - center
        : max - center
      : 0;

    return {
      [axis]: coords[axis] - alignmentOffset,
      data: {
        [axis]: offset,
        centerOffset: center - offset,
      },
    };
  },
});
