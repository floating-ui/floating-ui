// @flow
import { top, bottom, left, right, type Placement } from '../enums';
import type { Modifier, Rect, ModifierArguments } from '../types';
import getBasePlacement from '../utils/getBasePlacement';
import getMainAxisFromPlacement from '../utils/getMainAxisFromPlacement';
import getAltAxis from '../utils/getAltAxis';
import within from '../utils/within';
import detectOverflow, {
  type Options as DetectOverflowOptions,
} from '../utils/detectOverflow';

type Options = {
  mainAxis: boolean,
  altAxis: boolean,
  ...DetectOverflowOptions,
};

export const shift = (options: Options = {}): Modifier => ({
  name: 'shift',
  async fn(modifierArguments: ModifierArguments) {
    const { placement, coords } = modifierArguments;
    const {
      mainAxis: checkMainAxis = true,
      altAxis: checkAltAxis = false,
      ...detectOverflowOptions
    } = options;

    const overflow = await detectOverflow(
      modifierArguments,
      detectOverflowOptions
    );
    const mainAxis = getMainAxisFromPlacement(getBasePlacement(placement));
    const altAxis = getAltAxis(mainAxis);

    let mainAxisCoord = coords[mainAxis];
    let altAxisCoord = coords[altAxis];

    if (checkMainAxis) {
      const minSide = mainAxis === 'y' ? top : left;
      const maxSide = mainAxis === 'y' ? bottom : right;
      const min = mainAxisCoord + overflow[minSide];
      const max = mainAxisCoord - overflow[maxSide];

      mainAxisCoord = within(min, mainAxisCoord, max);
    }

    if (checkAltAxis) {
      const minSide = altAxis === 'y' ? top : left;
      const maxSide = altAxis === 'y' ? bottom : right;
      const min = altAxisCoord + overflow[minSide];
      const max = altAxisCoord - overflow[maxSide];

      altAxisCoord = within(min, altAxisCoord, max);
    }

    const mainAxisString: string = mainAxis;
    const altAxisString: string = altAxis;
    return {
      [mainAxisString]: mainAxisCoord,
      [altAxisString]: altAxisCoord,
    };
  },
});

type LimitShiftOffset =
  | (({
      placement: Placement,
      popper: Rect,
      reference: Rect,
      arrow?: Rect,
    }) => number)
  | number;

type LimitShiftOptions = {
  offset: LimitShiftOffset,
  mainAxis: boolean,
  altAxis: boolean,
};

export const limitShift = (options: LimitShiftOptions = {}): Modifier => ({
  name: 'limitShift',
  async fn(modifierArguments: ModifierArguments) {
    const { placement, coords, rects, modifiersData } = modifierArguments;
    const {
      offset = 0,
      mainAxis: checkMainAxis = true,
      altAxis: checkAltAxis = true,
    } = options;

    const mainAxis = getMainAxisFromPlacement(getBasePlacement(placement));
    const altAxis = getAltAxis(mainAxis);

    let mainAxisCoord = coords[mainAxis];
    let altAxisCoord = coords[altAxis];

    const rawOffset =
      typeof offset === 'function'
        ? offset({ ...rects, placement })
        : { mainAxis: offset, altAxis: 0 };
    const computedOffset =
      typeof rawOffset === 'number'
        ? { mainAxis: rawOffset, altAxis: 0 }
        : { mainAxis: 0, altAxis: 0, ...rawOffset };

    if (checkMainAxis) {
      const len = mainAxis === 'y' ? 'height' : 'width';
      const refLen = rects.reference[len];
      const popLen = rects.popper[len];
      const limitMin =
        rects.reference[mainAxis] - popLen + computedOffset.mainAxis;
      const limitMax =
        rects.reference[mainAxis] + refLen - computedOffset.mainAxis;

      if (mainAxisCoord < limitMin) {
        mainAxisCoord = limitMin;
      } else if (mainAxisCoord > limitMax) {
        mainAxisCoord = limitMax;
      }
    }

    if (checkAltAxis) {
      const len = mainAxis === 'y' ? 'width' : 'height';
      const refLen = rects.reference[len];
      const popLen = rects.popper[len];
      const limitMin =
        rects.reference[altAxis] -
        popLen -
        (modifiersData.offset?.[mainAxis] ?? 0) +
        computedOffset.altAxis;
      const limitMax =
        rects.reference[altAxis] +
        refLen +
        (modifiersData.offset?.[mainAxis] ?? 0) +
        computedOffset.altAxis;

      if (altAxisCoord < limitMin) {
        altAxisCoord = limitMin;
      } else if (altAxisCoord > limitMax) {
        altAxisCoord = limitMax;
      }
    }

    const mainAxisString: string = mainAxis;
    const altAxisString: string = altAxis;
    return {
      [mainAxisString]: mainAxisCoord,
      [altAxisString]: altAxisCoord,
    };
  },
});
