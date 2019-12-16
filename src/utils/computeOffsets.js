// @flow
import getBasePlacement from './getBasePlacement';
import getVariationPlacement from './getVariationPlacement';
import getMainAxisFromPlacement from './getMainAxisFromPlacement';
import type {
  Rect,
  PositioningStrategy,
  Offsets,
  ClientRectObject,
} from '../types';
import { top, right, bottom, left, start, end, type Placement } from '../enums';

export default ({
  reference,
  element,
  placement,
}: {
  reference: Rect | ClientRectObject,
  element: Rect | ClientRectObject,
  strategy: PositioningStrategy,
  placement?: Placement,
}): Offsets => {
  const basePlacement = placement ? getBasePlacement(placement) : null;
  const variationPlacement = placement
    ? getVariationPlacement(placement)
    : null;

  let offsets;
  switch (basePlacement) {
    case top:
      offsets = {
        x: reference.x + reference.width / 2 - element.width / 2,
        y: reference.y - element.height,
      };
      break;
    case bottom:
      offsets = {
        x: reference.x + reference.width / 2 - element.width / 2,
        y: reference.y + reference.height,
      };
      break;
    case right:
      offsets = {
        x: reference.x + reference.width,
        y: reference.y + reference.height / 2 - element.height / 2,
      };
      break;
    case left:
      offsets = {
        x: reference.x - element.width,
        y: reference.y + reference.height / 2 - element.height / 2,
      };
      break;
    default:
      offsets = {
        x: reference.x,
        y: reference.y,
      };
  }

  const mainAxis = basePlacement
    ? getMainAxisFromPlacement(basePlacement)
    : null;

  if (mainAxis != null) {
    const len = mainAxis === 'y' ? 'height' : 'width';

    switch (variationPlacement) {
      case start:
        offsets[mainAxis] =
          Math.floor(offsets[mainAxis]) -
          Math.floor(reference[len] / 2 - element[len] / 2);
        break;
      case end:
        offsets[mainAxis] =
          Math.floor(offsets[mainAxis]) +
          Math.ceil(reference[len] / 2 - element[len] / 2);
        break;
      default:
    }
  }

  return offsets;
};
