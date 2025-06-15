import {
  getAxisLength,
  getSideAxis,
  getOppositeAxis,
  type Coords,
  type ElementRects,
  type Side,
  type Align,
} from './utils';

export function getCoordinates(
  {reference, floating}: ElementRects,
  side: Side,
  align: Align,
  rtl?: boolean,
): Coords {
  const sideAxis = getSideAxis(side);
  const alignAxis = getOppositeAxis(sideAxis);
  const alignLength = getAxisLength(alignAxis);
  const isVertical = sideAxis === 'y';

  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;

  let coords: Coords;
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

  if (align === 'start') {
    coords[alignAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
  } else if (align === 'end') {
    coords[alignAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
  }

  return coords;
}
