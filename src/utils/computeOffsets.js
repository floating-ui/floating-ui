// @flow
import getBasePlacement from './getBasePlacement';
import getVariationPlacement from './getVariationPlacement';
import getMainAxisFromPlacement from './getMainAxisFromPlacement';
import getAltAxis from './getAltAxis';
import getAltLen from './getAltLen';
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
  strategy,
  placement,
  scroll,
}: {
  reference: Rect | ClientRectObject,
  element: Rect | ClientRectObject,
  strategy: PositioningStrategy,
  placement?: Placement,
  scroll: { scrollTop: number, scrollLeft: number },
}): Offsets => {
  const basePlacement = placement ? getBasePlacement(placement) : null;
  const variationPlacement = placement
    ? getVariationPlacement(placement)
    : null;

  const { scrollTop, scrollLeft } = scroll;

  let offsets;
  switch (basePlacement) {
    case top:
      offsets = {
        x: reference.x + reference.width / 2 - element.width / 2 - scrollLeft,
        y: reference.y - element.height - scrollTop,
      };
      break;
    case bottom:
      offsets = {
        x: reference.x + reference.width / 2 - element.width / 2 - scrollLeft,
        y: reference.y + reference.height - scrollTop,
      };
      break;
    case right:
      offsets = {
        x: reference.x + reference.width - scrollLeft,
        y: reference.y + reference.height / 2 - element.height / 2 - scrollTop,
      };
      break;
    case left:
      offsets = {
        x: reference.x - element.width - scrollLeft,
        y: reference.y + reference.height / 2 - element.height / 2 - scrollTop,
      };
      break;
    default:
      offsets = {
        x: reference.x - scrollLeft,
        y: reference.y - scrollTop,
      };
  }

  const mainAxis = basePlacement
    ? getMainAxisFromPlacement(basePlacement)
    : null;
  const altAxis = mainAxis ? getAltAxis(mainAxis) : null;
  const len = altAxis === 'x' ? 'height' : 'width';

  if (mainAxis != null) {
    switch (variationPlacement) {
      case start:
        offsets[mainAxis] -= reference[len] / 2 - element[len] / 2;
        break;
      case end:
        offsets[mainAxis] += reference[len] / 2 - element[len] / 2;
        break;
      default:
    }
  }

  return offsets;
};
