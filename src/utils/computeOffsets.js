// @flow
import type { Rect, PositioningStrategy, Placement } from '../types';

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
}) => {
  return {
    y: reference.y + reference.height,
    x: reference.x + reference.width,
  };
};
