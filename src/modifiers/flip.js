// @flow
import type { Placement } from '../enums';
import type { State, Modifier, Rect, Padding } from '../types';
import getOppositePlacement from '../utils/getOppositePlacement';
import getBasePlacement from '../utils/getBasePlacement';
import mergePaddingObject from '../utils/mergePaddingObject';
import expandToHashMap from '../utils/expandToHashMap';
import { right, bottom, left } from '../enums';

export function flip(
  state: State,
  options: { behavior: Array<Placement>, padding: Padding } = {}
) {
  const placement = state.placement;
  const defaultBehavior = [
    state.options.placement,
    getOppositePlacement(placement),
  ];
  const { behavior = defaultBehavior, padding = 5 } = options;
  const overflow = state.modifiersData.detectOverflow;

  const flippedPlacement = behavior.find(newPlacement => {
    const basePlacement = getBasePlacement(newPlacement);
    const paddingValue =
      typeof padding !== 'number'
        ? mergePaddingObject(padding)
        : expandToHashMap(padding, [top, right, bottom, left]);
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
