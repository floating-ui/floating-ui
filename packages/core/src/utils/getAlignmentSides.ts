import type {ElementRects, Placement, BasePlacement} from '../types';
import {getLengthFromAxis} from './getLengthFromAxis';
import {getMainAxisFromPlacement} from './getMainAxisFromPlacement';
import {getOppositePlacement} from './getOppositePlacement';
import {getAlignment} from './getAlignment';

export function getAlignmentSides(
  placement: Placement,
  rects: ElementRects
): {
  main: BasePlacement;
  cross: BasePlacement;
} {
  const isStart = getAlignment(placement) === 'start';
  const mainAxis = getMainAxisFromPlacement(placement);
  const length = getLengthFromAxis(mainAxis);

  let mainAlignmentSide: BasePlacement =
    mainAxis === 'x'
      ? isStart
        ? 'right'
        : 'left'
      : isStart
      ? 'bottom'
      : 'top';

  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }

  return {
    main: mainAlignmentSide,
    cross: getOppositePlacement(mainAlignmentSide),
  };
}
