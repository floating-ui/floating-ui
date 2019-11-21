// @flow
import getBasePlacement from './getBasePlacement';
import getAltAxis from './getAltAxis';
import getAltLen from './getAltLen';
import type {
  Rect,
  PositioningStrategy,
  Offsets,
  ClientRectObject,
} from '../types';
import { top, right, bottom, left, type Placement } from '../enums';

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

  const { scrollTop, scrollLeft } = scroll;

  switch (basePlacement) {
    case top:
      return {
        x: reference.x + reference.width / 2 - element.width / 2 - scrollLeft,
        y: reference.y - element.height - scrollTop,
      };
    case bottom:
      return {
        x: reference.x + reference.width / 2 - element.width / 2 - scrollLeft,
        y: reference.y + reference.height - scrollTop,
      };
    case right:
      return {
        x: reference.x + reference.width - scrollLeft,
        y: reference.y + reference.height / 2 - element.height / 2 - scrollTop,
      };
    case left:
      return {
        x: reference.x - element.width - scrollLeft,
        y: reference.y + reference.height / 2 - element.height / 2 - scrollTop,
      };
    default:
      return {
        x: reference.x - scrollLeft,
        y: reference.y - scrollTop,
      };
  }
};
