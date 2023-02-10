import {
  detectOverflow,
  Options as DetectOverflowOptions,
} from '../detectOverflow';
import type {Coords, Middleware, MiddlewareState} from '../types';
import {getCrossAxis} from '../utils/getCrossAxis';
import {getMainAxisFromPlacement} from '../utils/getMainAxisFromPlacement';
import {getSide} from '../utils/getSide';
import {within} from '../utils/within';

export interface Options {
  /**
   * The axis that runs along the alignment of the floating element. Determines
   * whether overflow along this axis is checked to perform shifting.
   * @default true
   */
  mainAxis: boolean;

  /**
   * The axis that runs along the side of the floating element. Determines
   * whether overflow along this axis is checked to perform shifting.
   * @default false
   */
  crossAxis: boolean;

  /**
   * Accepts a function that limits the shifting done in order to prevent
   * detachment.
   */
  limiter: {
    fn: (state: MiddlewareState) => Coords;
    options?: any;
  };
}

/**
 * Optimizes the visibility of the floating element by shifting it in order to
 * keep it in view when it will overflow the clipping boundary.
 * @see https://floating-ui.com/docs/shift
 */
export const shift = (
  options: Partial<Options & DetectOverflowOptions> = {}
): Middleware => ({
  name: 'shift',
  options,
  async fn(state) {
    const {x, y, placement} = state;
    const {
      mainAxis: checkMainAxis = true,
      crossAxis: checkCrossAxis = false,
      limiter = {fn: ({x, y}) => ({x, y})},
      ...detectOverflowOptions
    } = options;

    const coords = {x, y};
    const overflow = await detectOverflow(state, detectOverflowOptions);
    const mainAxis = getMainAxisFromPlacement(getSide(placement));
    const crossAxis = getCrossAxis(mainAxis);

    let mainAxisCoord = coords[mainAxis];
    let crossAxisCoord = coords[crossAxis];

    if (checkMainAxis) {
      const minSide = mainAxis === 'y' ? 'top' : 'left';
      const maxSide = mainAxis === 'y' ? 'bottom' : 'right';
      const min = mainAxisCoord + overflow[minSide];
      const max = mainAxisCoord - overflow[maxSide];

      mainAxisCoord = within(min, mainAxisCoord, max);
    }

    if (checkCrossAxis) {
      const minSide = crossAxis === 'y' ? 'top' : 'left';
      const maxSide = crossAxis === 'y' ? 'bottom' : 'right';
      const min = crossAxisCoord + overflow[minSide];
      const max = crossAxisCoord - overflow[maxSide];

      crossAxisCoord = within(min, crossAxisCoord, max);
    }

    const limitedCoords = limiter.fn({
      ...state,
      [mainAxis]: mainAxisCoord,
      [crossAxis]: crossAxisCoord,
    });

    return {
      ...limitedCoords,
      data: {
        x: limitedCoords.x - x,
        y: limitedCoords.y - y,
      },
    };
  },
});

type LimitShiftOffset =
  | ((args: MiddlewareState) =>
      | number
      | {
          /**
           * Offset the limiting of the axis that runs along the alignment of the
           * floating element.
           */
          mainAxis?: number;
          /**
           * Offset the limiting of the axis that runs along the side of the
           * floating element.
           */
          crossAxis?: number;
        })
  | number
  | {
      /**
       * Offset the limiting of the axis that runs along the alignment of the
       * floating element.
       */
      mainAxis?: number;
      /**
       * Offset the limiting of the axis that runs along the side of the
       * floating element.
       */
      crossAxis?: number;
    };

export type LimitShiftOptions = {
  /**
   * Offset when limiting starts. `0` will limit when the opposite edges of the
   * reference and floating elements are aligned.
   * - positive = start limiting earlier
   * - negative = start limiting later
   */
  offset: LimitShiftOffset;
  /**
   * Whether to limit the axis that runs along the alignment of the floating
   * element.
   */
  mainAxis: boolean;
  /**
   * Whether to limit the axis that runs along the side of the floating element.
   */
  crossAxis: boolean;
};

/**
 * Built-in `limiter` that will stop `shift()` at a certain point.
 */
export const limitShift = (
  options: Partial<LimitShiftOptions> = {}
): {
  options: Partial<LimitShiftOffset>;
  fn: (state: MiddlewareState) => Coords;
} => ({
  options,
  fn(state) {
    const {x, y, placement, rects, middlewareData} = state;
    const {
      offset = 0,
      mainAxis: checkMainAxis = true,
      crossAxis: checkCrossAxis = true,
    } = options;

    const coords = {x, y};
    const mainAxis = getMainAxisFromPlacement(placement);
    const crossAxis = getCrossAxis(mainAxis);

    let mainAxisCoord = coords[mainAxis];
    let crossAxisCoord = coords[crossAxis];

    const rawOffset = typeof offset === 'function' ? offset(state) : offset;
    const computedOffset =
      typeof rawOffset === 'number'
        ? {mainAxis: rawOffset, crossAxis: 0}
        : {mainAxis: 0, crossAxis: 0, ...rawOffset};

    if (checkMainAxis) {
      const len = mainAxis === 'y' ? 'height' : 'width';
      const limitMin =
        rects.reference[mainAxis] -
        rects.floating[len] +
        computedOffset.mainAxis;
      const limitMax =
        rects.reference[mainAxis] +
        rects.reference[len] -
        computedOffset.mainAxis;

      if (mainAxisCoord < limitMin) {
        mainAxisCoord = limitMin;
      } else if (mainAxisCoord > limitMax) {
        mainAxisCoord = limitMax;
      }
    }

    if (checkCrossAxis) {
      const len = mainAxis === 'y' ? 'width' : 'height';
      const isOriginSide = ['top', 'left'].includes(getSide(placement));
      const limitMin =
        rects.reference[crossAxis] -
        rects.floating[len] +
        (isOriginSide ? middlewareData.offset?.[crossAxis] || 0 : 0) +
        (isOriginSide ? 0 : computedOffset.crossAxis);
      const limitMax =
        rects.reference[crossAxis] +
        rects.reference[len] +
        (isOriginSide ? 0 : middlewareData.offset?.[crossAxis] || 0) -
        (isOriginSide ? computedOffset.crossAxis : 0);

      if (crossAxisCoord < limitMin) {
        crossAxisCoord = limitMin;
      } else if (crossAxisCoord > limitMax) {
        crossAxisCoord = limitMax;
      }
    }

    return {
      [mainAxis]: mainAxisCoord,
      [crossAxis]: crossAxisCoord,
    } as Coords;
  },
});
