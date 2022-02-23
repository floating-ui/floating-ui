import type {ElementRects, Placement, BasePlacement} from '../types';
import {getLengthFromAxis} from './getLengthFromAxis';
import {getMainAxisFromPlacement} from './getMainAxisFromPlacement';
import {getOppositePlacement} from './getOppositePlacement';
import {getAlignment} from './getAlignment';

export function getAlignmentSides(
  placement: Placement,
  rects: ElementRects,
  rtl = false
): {
  main: BasePlacement;
  cross: BasePlacement;
} {
  const alignment = getAlignment(placement);
  const mainAxis = getMainAxisFromPlacement(placement);
  const length = getLengthFromAxis(mainAxis);

  let mainAlignmentSide: BasePlacement =
    mainAxis === 'x'
      ? alignment === (rtl ? 'end' : 'start')
        ? 'right'
        : 'left'
      : alignment === 'start'
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
