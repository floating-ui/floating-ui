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
  windowScroll,
}: {
  reference: Rect,
  popper: Rect,
  strategy: PositioningStrategy,
  placement: Placement,
  windowScroll: { scrollTop: number, scrollLeft: number },
}): Offsets => {
  const basePlacement = getBasePlacement(placement);

  const { scrollTop, scrollLeft } = windowScroll;

  switch (basePlacement) {
    case top:
      return {
        x: scrollLeft + reference.x + reference.width / 2 - popper.width / 2,
        y: scrollTop + reference.y - popper.height,
      };
    case bottom:
      return {
        x: scrollLeft + reference.x + reference.width / 2 - popper.width / 2,
        y: scrollTop + reference.y + reference.height,
      };
    case right:
      return {
        x: scrollLeft + reference.x + reference.width,
        y: scrollTop + reference.y + reference.height / 2 - popper.height / 2,
      };
    case left:
      return {
        x: scrollLeft + reference.x - popper.width,
        y: scrollTop + reference.y + reference.height / 2 - popper.height / 2,
      };
    default:
      // $FlowFixMe: This will actually never match; github.com/facebook/flow/issues/2395
      return undefined;
  }
};
