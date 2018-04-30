// @flow
import getBasePlacement from './getBasePlacement';
import getMainAxisFromPlacement from './getMainAxisFromPlacement';
import getAltAxis from './getAltAxis';
import getAltLen from './getAltLen';
import type { Rect, PositioningStrategy, Offsets } from '../types';
import { top, right, bottom, left, type Placement } from '../enums';

export default ({
  reference,
  popper,
  strategy,
  placement,
}: {
  reference: Rect,
  popper: Rect,
  strategy: PositioningStrategy,
  placement: Placement,
}): Offsets => {
  const basePlacement = getBasePlacement(placement);

  switch (basePlacement) {
    case top:
      return {
        x: reference.x + reference.width / 2,
        y: reference.y - reference.height,
      };
    case bottom:
      return {
        x: reference.x + popper.width / 2,
        y: reference.y + reference.height,
      };
    case right:
      return {
        x: reference.x + reference.width,
        y: reference.y + popper.height / 2,
      };
    case left:
      return {
        x: reference.x - reference.width,
        y: reference.y + popper.height / 2,
      };
    default:
      // $FlowFixMe: This will actually never match github.com/facebook/flow/issues/2395
      return undefined;
  }
};
