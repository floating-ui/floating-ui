// @flow
import type { Placement } from '../enums';
import type { State, Modifier, Rect, Padding } from '../types';
import getOppositePlacement from '../utils/getOppositePlacement';
import getBasePlacement from '../utils/getBasePlacement';

export function flip(
  state: State,
  options: { behavior: Array<Placement>, padding: Padding } = {}
) {
  const placement = state.placement;
  const behavior = options.behavior || [
    state.options.placement,
    getOppositePlacement(placement),
  ];
  const { padding = 5 } = options;
  const isNumberPadding = typeof padding === 'number';
  const overflow = state.modifiersData.detectOverflow;

  const flippedPlacement = behavior.find(newPlacement => {
    const basePlacement = getBasePlacement(newPlacement);
    const paddingValue = isNumberPadding ? padding : padding[basePlacement];
    return overflow[basePlacement] + paddingValue <= 0;
  });

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
