import type {Placement, ElementRects, Coords} from './types';
import {getBasePlacement} from './utils/getBasePlacement';
import {getAlignment} from './utils/getAlignment';
import {getMainAxisFromPlacement} from './utils/getMainAxisFromPlacement';
import {getLengthFromAxis} from './utils/getLengthFromAxis';

export function computeCoordsFromPlacement({
  reference,
  floating,
  placement,
}: ElementRects & {placement: Placement}): Coords {
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;

  let coords;
  switch (getBasePlacement(placement)) {
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

  const mainAxis = getMainAxisFromPlacement(placement);
  const length = getLengthFromAxis(mainAxis);

  switch (getAlignment(placement)) {
    case 'start':
      coords[mainAxis] =
        coords[mainAxis] - (reference[length] / 2 - floating[length] / 2);
      break;
    case 'end':
      coords[mainAxis] =
        coords[mainAxis] + (reference[length] / 2 - floating[length] / 2);
      break;
    default:
  }

  return coords;
}
