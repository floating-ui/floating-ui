import {clamp, evaluate, getOppositeAxis, getSideAxis} from '../utils';
import type {DetectOverflowOptions} from '../detectOverflow';
import {detectOverflow} from '../detectOverflow';
import type {
  Derivable,
  Middleware,
  MiddlewareState,
  MiddlewareReturn,
  Coords,
} from '../types';

export interface ShiftOptions extends DetectOverflowOptions {
  /**
   * Determines whether to shift the floating element along the side axis.
   * @default false
   */
  side?: boolean;
  /**
   * Determines whether to shift the floating element along the align axis.
   * @default true
   */
  align?: boolean;
  /**
   * Accepts a function that limits the shifting done in order to prevent
   * detachment.
   */
  limiter?: {
    fn: (state: MiddlewareState) => Coords;
    options?: any;
  };
}

export function* shiftGen(
  state: MiddlewareState,
  options: ShiftOptions | Derivable<ShiftOptions> = {},
): Generator<any, MiddlewareReturn, any> {
  const {x, y, side} = state;

  const {
    side: checkSideAxis = false,
    align: checkAlignAxis = true,
    limiter = {fn: ({x, y}: MiddlewareState) => ({x, y})},
    ...detectOverflowOptions
  } = evaluate(options, state);

  const coords = {x, y};
  const overflow = yield* detectOverflow(state, detectOverflowOptions);
  const sideAxis = getSideAxis(side);
  const alignAxis = getOppositeAxis(sideAxis);

  let sideAxisCoord = coords[sideAxis];
  let alignAxisCoord = coords[alignAxis];

  if (checkSideAxis) {
    const minSide = sideAxis === 'y' ? 'top' : 'left';
    const maxSide = sideAxis === 'y' ? 'bottom' : 'right';
    const min = sideAxisCoord + overflow[minSide];
    const max = sideAxisCoord - overflow[maxSide];

    sideAxisCoord = clamp(min, sideAxisCoord, max);
  }

  if (checkAlignAxis) {
    const minSide = alignAxis === 'y' ? 'top' : 'left';
    const maxSide = alignAxis === 'y' ? 'bottom' : 'right';
    const min = alignAxisCoord + overflow[minSide];
    const max = alignAxisCoord - overflow[maxSide];

    alignAxisCoord = clamp(min, alignAxisCoord, max);
  }

  const limitedCoords = limiter.fn({
    ...state,
    [sideAxis]: sideAxisCoord,
    [alignAxis]: alignAxisCoord,
  });

  return {
    ...limitedCoords,
    data: {
      x: limitedCoords.x - x,
      y: limitedCoords.y - y,
      enabled: {
        [sideAxis]: checkSideAxis,
        [alignAxis]: checkAlignAxis,
      },
    },
  };
}

/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
export const shift = (
  options: ShiftOptions | Derivable<ShiftOptions> = {},
): Middleware => ({
  name: 'shift',
  options,
  fn(state) {
    return shiftGen(state, options);
  },
});

type LimitShiftOffset =
  | number
  | {
      /**
       * Offset the limiting of the axis that runs along the side of the
       * floating element.
       */
      side?: number;
      /**
       * Offset the limiting of the axis that runs along the align of the
       * floating element.
       */
      align?: number;
    };

export interface LimitShiftOptions {
  /**
   * Offset when limiting starts. `0` will limit when the opposite edges of the
   * reference and floating elements are aligned.
   * - positive = start limiting earlier
   * - negative = start limiting later
   */
  offset?: LimitShiftOffset | Derivable<LimitShiftOffset>;
  /**
   * Whether to limit shifting on the axis that runs along the side of the floating element.
   */
  side?: boolean;
  /**
   * Whether to limit shifting on the axis that runs along the align of the
   * floating element.
   */
  align?: boolean;
}

/**
 * Built-in `limiter` that will stop `shift()` at a certain point.
 */
export const limitShift = (
  options: LimitShiftOptions | Derivable<LimitShiftOptions> = {},
): {
  options: any;
  fn: (state: MiddlewareState) => Coords;
} => ({
  options,
  fn(state) {
    const {x, y, side, rects, middlewareData} = state;

    const {
      offset = 0,
      align: checkAlignAxis = true,
      side: checkSideAxis = true,
    } = evaluate(options, state);

    const coords = {x, y};
    const sideAxis = getSideAxis(side);
    const alignAxis = getOppositeAxis(sideAxis);

    let alignAxisCoord = coords[alignAxis];
    let sideAxisCoord = coords[sideAxis];

    const rawOffset = evaluate(offset, state);
    const computedOffset =
      typeof rawOffset === 'number'
        ? {side: rawOffset, align: 0}
        : {side: 0, align: 0, ...rawOffset};

    if (checkSideAxis) {
      const len = sideAxis === 'y' ? 'width' : 'height';
      const isOriginSide = ['top', 'left'].includes(side);
      const limitMin =
        rects.reference[sideAxis] -
        rects.floating[len] +
        (isOriginSide ? middlewareData.offset?.[sideAxis] || 0 : 0) +
        (isOriginSide ? 0 : computedOffset.align);
      const limitMax =
        rects.reference[sideAxis] +
        rects.reference[len] +
        (isOriginSide ? 0 : middlewareData.offset?.[sideAxis] || 0) -
        (isOriginSide ? computedOffset.align : 0);

      if (sideAxisCoord < limitMin) {
        sideAxisCoord = limitMin;
      } else if (sideAxisCoord > limitMax) {
        sideAxisCoord = limitMax;
      }
    }

    if (checkAlignAxis) {
      const len = alignAxis === 'y' ? 'height' : 'width';
      const limitMin =
        rects.reference[alignAxis] - rects.floating[len] + computedOffset.side;
      const limitMax =
        rects.reference[alignAxis] + rects.reference[len] - computedOffset.side;

      if (alignAxisCoord < limitMin) {
        alignAxisCoord = limitMin;
      } else if (alignAxisCoord > limitMax) {
        alignAxisCoord = limitMax;
      }
    }

    return {
      [sideAxis]: sideAxisCoord,
      [alignAxis]: alignAxisCoord,
    } as Coords;
  },
});
