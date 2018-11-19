// @flow
import getBasePlacement from './getBasePlacement';
import getAltAxis from './getAltAxis';
import getAltLen from './getAltLen';
import type { Rect, PositioningStrategy, Offsets } from '../types';
import { top, right, bottom, left, type Placement } from '../enums';

export default ({
  reference,
  popper,
  strategy,
  placement,
  scroll,
}: {
  reference: Rect,
  popper: Rect,
  strategy: PositioningStrategy,
  placement: Placement,
  scroll: { scrollTop: number, scrollLeft: number },
}): Offsets => {
  const basePlacement = getBasePlacement(placement);

  const { scrollTop, scrollLeft } = scroll;

  switch (basePlacement) {
    case top:
      return {
        x: reference.x + reference.width / 2 - popper.width / 2 - scrollLeft,
        y: reference.y - popper.height - scrollTop,
      };
    case bottom:
      return {
        x: reference.x + reference.width / 2 - popper.width / 2 - scrollLeft,
        y: reference.y + reference.height - scrollTop,
      };
    case right:
      return {
        x: reference.x + reference.width - scrollLeft,
        y: reference.y + reference.height / 2 - popper.height / 2 - scrollTop,
      };
    case left:
    default:
      return {
        x: reference.x - popper.width - scrollLeft,
        y: reference.y + reference.height / 2 - popper.height / 2 - scrollTop,
      };
  }
};
