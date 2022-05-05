import type {Coords, Middleware, MiddlewareArguments} from '../types';
import {getAlignment} from '../utils/getAlignment';
import {getSide} from '../utils/getSide';
import {getMainAxisFromPlacement} from '../utils/getMainAxisFromPlacement';

type OffsetValue =
  | number
  | {
      /**
       * The axis that runs along the side of the floating element.
       * @default 0
       */
      mainAxis?: number;
      /**
       * The axis that runs along the alignment of the floating element.
       * @default 0
       */
      crossAxis?: number;
      /**
       * When set to a number, overrides the `crossAxis` value for aligned
       * (non-centered/base) placements and works logically. A positive number
       * will move the floating element in the direction of the opposite edge
       * to the one that is aligned, while a negative number the reverse.
       * @default null
       */
      alignmentAxis?: number | null;
    };
type OffsetFunction = (args: MiddlewareArguments) => OffsetValue;

export type Options = OffsetValue | OffsetFunction;

export async function convertValueToCoords(
  middlewareArguments: MiddlewareArguments,
  value: Options
): Promise<Coords> {
  const {placement, platform, elements} = middlewareArguments;
  const rtl = await platform.isRTL?.(elements.floating);

  const side = getSide(placement);
  const alignment = getAlignment(placement);
  const isVertical = getMainAxisFromPlacement(placement) === 'x';
  const mainAxisMulti = ['left', 'top'].includes(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;

  const rawValue =
    typeof value === 'function' ? value(middlewareArguments) : value;

  // eslint-disable-next-line prefer-const
  let {mainAxis, crossAxis, alignmentAxis} =
    typeof rawValue === 'number'
      ? {mainAxis: rawValue, crossAxis: 0, alignmentAxis: null}
      : {mainAxis: 0, crossAxis: 0, alignmentAxis: null, ...rawValue};

  if (alignment && typeof alignmentAxis === 'number') {
    crossAxis = alignment === 'end' ? alignmentAxis * -1 : alignmentAxis;
  }

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
    const {x, y} = middlewareArguments;
    const diffCoords = await convertValueToCoords(middlewareArguments, value);

    return {
      x: x + diffCoords.x,
      y: y + diffCoords.y,
      data: diffCoords,
    };
  },
});
