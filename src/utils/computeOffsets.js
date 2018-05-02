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
        x: reference.x + reference.width / 2 - popper.width / 2,
        y: reference.y - popper.height,
      };
    case bottom:
      return {
        x: reference.x + reference.width / 2 - popper.width / 2,
        y: reference.y + reference.height,
      };
    case right:
      return {
        x: reference.x + reference.width,
        y: reference.y + reference.height / 2 - popper.height / 2,
      };
    case left:
      return {
        x: reference.x - popper.width,
        y: reference.y + reference.height / 2 - popper.height / 2,
      };
    default:
      // $FlowFixMe: This will actually never match; github.com/facebook/flow/issues/2395
      return undefined;
  }
};
