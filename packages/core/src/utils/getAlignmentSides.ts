import type {ElementRects, Placement, Side} from '../types';
import {getAlignment} from './getAlignment';
import {getLengthFromAxis} from './getLengthFromAxis';
import {getMainAxisFromPlacement} from './getMainAxisFromPlacement';
import {getOppositePlacement} from './getOppositePlacement';

export function getAlignmentSides(
  placement: Placement,
  rects: ElementRects,
  rtl = false
): {main: Side; cross: Side} {
  const alignment = getAlignment(placement);
  const mainAxis = getMainAxisFromPlacement(placement);
  const length = getLengthFromAxis(mainAxis);

  let mainAlignmentSide: Side =
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
