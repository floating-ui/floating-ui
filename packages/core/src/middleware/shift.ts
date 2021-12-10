import type {
  Middleware,
  Rect,
  Placement,
  MiddlewareArguments,
  Coords,
} from '../types';
import {getBasePlacement} from '../utils/getBasePlacement';
import {getMainAxisFromPlacement} from '../utils/getMainAxisFromPlacement';
import {getCrossAxis} from '../utils/getCrossAxis';
import {within} from '../utils/within';
import {
  detectOverflow,
  Options as DetectOverflowOptions,
} from '../detectOverflow';

export type Options = {
  mainAxis: boolean;
  crossAxis: boolean;
  limiter: (middlewareArguments: MiddlewareArguments) => Coords;
};

export const shift = (
  options: Partial<Options & DetectOverflowOptions> = {}
): Middleware => ({
  name: 'shift',
  async fn(middlewareArguments: MiddlewareArguments) {
    const {x, y, placement} = middlewareArguments;
    const {
      mainAxis: checkMainAxis = true,
      crossAxis: checkCrossAxis = false,
      limiter = ({x, y}) => ({x, y}),
      ...detectOverflowOptions
    } = options;

    const coords = {x, y};
    const overflow = await detectOverflow(
      middlewareArguments,
      detectOverflowOptions
    );
    const mainAxis = getMainAxisFromPlacement(getBasePlacement(placement));
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

    return limiter({
      ...middlewareArguments,
      [mainAxis]: mainAxisCoord,
      [crossAxis]: crossAxisCoord,
    });
  },
});

type LimitShiftOffset =
  | ((args: {
      placement: Placement;
      floating: Rect;
      reference: Rect;
    }) => number | {mainAxis?: number; crossAxis?: number})
  | number
  | {mainAxis?: number; crossAxis?: number};

export type LimitShiftOptions = {
  offset: LimitShiftOffset;
  mainAxis: boolean;
  crossAxis: boolean;
};

export const limitShift =
  (
    options: Partial<LimitShiftOptions> = {}
  ): ((middlewareArguments: MiddlewareArguments) => Coords) =>
  (middlewareArguments: MiddlewareArguments) => {
    const {x, y, placement, rects, middlewareData} = middlewareArguments;
    const {
      offset = 0,
      mainAxis: checkMainAxis = true,
      crossAxis: checkCrossAxis = true,
    } = options;

    const coords = {x, y};
    const mainAxis = getMainAxisFromPlacement(getBasePlacement(placement));
    const crossAxis = getCrossAxis(mainAxis);

    let mainAxisCoord = coords[mainAxis];
    let crossAxisCoord = coords[crossAxis];

    const rawOffset =
      typeof offset === 'function' ? offset({...rects, placement}) : offset;
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
      const limitMin =
        rects.reference[crossAxis] -
        rects.floating[len] -
        (middlewareData.offset?.[mainAxis] ?? 0) +
        computedOffset.crossAxis;
      const limitMax =
        rects.reference[crossAxis] +
        rects.reference[len] +
        (middlewareData.offset?.[mainAxis] ?? 0) +
        computedOffset.crossAxis;

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
  };
