// @flow
import type { Placement } from '../enums';
import type { State, Modifier, Rect } from '../types';
import getOppositePlacement from '../utils/getOppositePlacement';
import getBasePlacement from '../utils/getBasePlacement';

export function flip(state: State, options: ?{ behavior: Array<Placement> }) {
  const placement = state.placement;
  const behavior =
    options && options.behavior
      ? options.behavior
      : [state.options.placement, getOppositePlacement(placement)];
  const overflow = state.modifiersData.detectOverflow;

  const flippedPlacement = behavior.find(
    newPlacement => overflow[getBasePlacement(newPlacement)] <= 0
  );

  if (flippedPlacement && flippedPlacement !== placement) {
    state = {
      ...state,
      placement: flippedPlacement,
      reset: true,
    };
  }
  return state;
}

export default ({
  name: 'flip',
  enabled: true,
  phase: 'main',
  fn: flip,
}: Modifier);
