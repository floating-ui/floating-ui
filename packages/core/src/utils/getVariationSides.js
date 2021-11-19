// @flow
import type { ElementRects } from '../types';
import { top, bottom, left, right, start, type Placement } from '../enums';
import getOppositePlacement from './getOppositePlacement';
import getVariation from './getVariation';
import isVerticalPlacement from './isVerticalPlacement';

export default function getVariationSides(
  placement: Placement,
  rects: ElementRects
) {
  const isVertical = isVerticalPlacement(placement);
  const isStartVariation = getVariation(placement) === start;
  const len = isVertical ? 'width' : 'height';
  let mainVariationSide = isVerticalPlacement(placement)
    ? isStartVariation
      ? right
      : left
    : isStartVariation
    ? bottom
    : top;

  if (rects.reference[len] > rects.popper[len]) {
    mainVariationSide = getOppositePlacement(mainVariationSide);
  }

  return {
    main: mainVariationSide,
    alt: getOppositePlacement(mainVariationSide),
  };
}
