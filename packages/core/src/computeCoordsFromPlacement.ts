import type {Placement, ElementRects, Coords} from './types';
import {getBasePlacement} from './utils/getBasePlacement';
import {getAlignment} from './utils/getAlignment';
import {getMainAxisFromPlacement} from './utils/getMainAxisFromPlacement';
import {getLengthFromAxis} from './utils/getLengthFromAxis';

export function computeCoordsFromPlacement({
  reference,
  floating,
  placement,
  rtl = false,
}: ElementRects & {placement: Placement; rtl?: boolean}): Coords {
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const mainAxis = getMainAxisFromPlacement(placement);
  const length = getLengthFromAxis(mainAxis);
  const commonAlign = reference[length] / 2 - floating[length] / 2;
  const basePlacement = getBasePlacement(placement);
  const isVertical = ['top', 'bottom'].includes(basePlacement);

  let coords;
  switch (basePlacement) {
    case 'top':
      coords = {x: commonX, y: reference.y - floating.height};
      break;
    case 'bottom':
      coords = {x: commonX, y: reference.y + reference.height};
      break;
    case 'right':
      coords = {x: reference.x + reference.width, y: commonY};
      break;
    case 'left':
      coords = {x: reference.x - floating.width, y: commonY};
      break;
    default:
      coords = {x: reference.x, y: reference.y};
  }

  switch (getAlignment(placement)) {
    case 'start':
      coords[mainAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case 'end':
      coords[mainAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    default:
  }

  return coords;
}
