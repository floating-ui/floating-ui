// @flow
import getBasePlacement from './getBasePlacement';
import getVariation from './getVariation';
import getMainAxisFromPlacement from './getMainAxisFromPlacement';
import type { Rect, Coords, ClientRectObject } from '../types';
import { top, right, bottom, left, start, end, type Placement } from '../enums';

export default function computeCoords({
  reference,
  popper,
  placement,
}: {
  reference: Rect | ClientRectObject,
  popper: Rect | ClientRectObject,
  placement?: Placement,
}): Coords {
  const basePlacement = placement ? getBasePlacement(placement) : null;
  const variation = placement ? getVariation(placement) : null;
  const commonX = reference.x + reference.width / 2 - popper.width / 2;
  const commonY = reference.y + reference.height / 2 - popper.height / 2;

  let coords;
  switch (basePlacement) {
    case top:
      coords = {
        x: commonX,
        y: reference.y - popper.height,
      };
      break;
    case bottom:
      coords = {
        x: commonX,
        y: reference.y + reference.height,
      };
      break;
    case right:
      coords = {
        x: reference.x + reference.width,
        y: commonY,
      };
      break;
    case left:
      coords = {
        x: reference.x - popper.width,
        y: commonY,
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y,
      };
  }

  const mainAxis = basePlacement
    ? getMainAxisFromPlacement(basePlacement)
    : null;

  if (mainAxis != null) {
    const len = mainAxis === 'y' ? 'height' : 'width';

    switch (variation) {
      case start:
        coords[mainAxis] =
          coords[mainAxis] - (reference[len] / 2 - popper[len] / 2);
        break;
      case end:
        coords[mainAxis] =
          coords[mainAxis] + (reference[len] / 2 - popper[len] / 2);
        break;
      default:
    }
  }

  return coords;
}
