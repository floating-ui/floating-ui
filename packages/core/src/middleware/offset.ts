import type {Placement, Rect, Coords, Middleware, ElementRects} from '../types';
import {getAlignment} from '../utils/getAlignment';
import {getSide} from '../utils/getSide';
import {getMainAxisFromPlacement} from '../utils/getMainAxisFromPlacement';

type OffsetValue =
  | number
  | {
      /**
       * The axis that runs along the side of the floating element.
       */
      mainAxis?: number;
      /**
       * The axis that runs along the alignment of the floating element.
       */
      crossAxis?: number;
    };
type OffsetFunction = (args: {
  floating: Rect;
  reference: Rect;
  placement: Placement;
}) => OffsetValue;

export type Options = OffsetValue | OffsetFunction;

export function convertValueToCoords(
  placement: Placement,
  rects: ElementRects,
  value: Options,
  rtl = false
): Coords {
  const side = getSide(placement);
  const alignment = getAlignment(placement);
  const isVertical = getMainAxisFromPlacement(placement) === 'x';
  const mainAxisMulti = ['left', 'top'].includes(side) ? -1 : 1;

  let crossAxisMulti = 1;
  if (alignment === 'end') {
    crossAxisMulti = -1;
  }
  if (rtl && isVertical) {
    crossAxisMulti *= -1;
  }

  const rawValue =
    typeof value === 'function' ? value({...rects, placement}) : value;
  const {mainAxis, crossAxis} =
    typeof rawValue === 'number'
      ? {mainAxis: rawValue, crossAxis: 0}
      : {mainAxis: 0, crossAxis: 0, ...rawValue};

  return isVertical
    ? {x: crossAxis * crossAxisMulti, y: mainAxis * mainAxisMulti}
    : {x: mainAxis * mainAxisMulti, y: crossAxis * crossAxisMulti};
}

/**
 * Displaces the floating element from its reference element.
 * @see https://floating-ui.com/docs/offset
 */
export const offset = (value: Options = 0): Middleware => ({
  name: 'offset',
  options: value,
  async fn(middlewareArguments) {
    const {x, y, placement, rects, platform, elements} = middlewareArguments;

    const diffCoords = convertValueToCoords(
      placement,
      rects,
      value,
      await platform.isRTL?.(elements.floating)
    );

    return {
      x: x + diffCoords.x,
      y: y + diffCoords.y,
      data: diffCoords,
    };
  },
});
