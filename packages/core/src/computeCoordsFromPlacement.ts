import {
  getAlignment,
  getAxisLength,
  getOppositeAxis,
  getSide,
  getSideAxis,
} from '@floating-ui/utils';

import type {Coords, ElementRects, Placement} from './types';

export function computeCoordsFromPlacement(
  {reference, floating}: ElementRects,
  placement: Placement,
  rtl?: boolean
): Coords {
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const sideAxis = getSideAxis(placement);
  const alignmentAxis = getOppositeAxis(sideAxis);
  const length = getAxisLength(sideAxis);
  const side = getSide(placement);
  const commonAlign = reference[length] / 2 - floating[length] / 2;
  const isVertical = sideAxis === 'y';

  let coords;
  switch (side) {
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
      coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case 'end':
      coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    default:
  }

  return coords;
}
