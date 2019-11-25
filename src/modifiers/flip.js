// @flow
import type { Placement } from '../enums';
import type { State, Modifier, Rect, Padding } from '../types';
import getOppositePlacement from '../utils/getOppositePlacement';
import getBasePlacement from '../utils/getBasePlacement';
import mergePaddingObject from '../utils/mergePaddingObject';
import expandToHashMap from '../utils/expandToHashMap';
import { basePlacements } from '../enums';

export function flip(
  state: State,
  options?: { behavior: Array<Placement>, padding: Padding } = {}
) {
  const placement = state.placement;
  const defaultBehavior = [
    state.options.placement,
    getOppositePlacement(state.options.placement),
  ];
  const { behavior = defaultBehavior, padding = 0 } = options;
  const overflow = state.modifiersData.detectOverflow;
  const flipIndex = state.modifiersData.flip.index;

  const paddingObject = mergePaddingObject(
    typeof padding !== 'number'
      ? padding
      : expandToHashMap(padding, basePlacements)
  );

  const flippedPlacement = behavior[flipIndex];

  if (!flippedPlacement && placement !== state.options.placement) {
    state.placement = state.options.placement;
    state.reset = true;
    return state;
  }

  if (!flippedPlacement && placement === state.options.placement) {
    return state;
  }

  const basePlacement = getBasePlacement(flippedPlacement);
  const fits = overflow[basePlacement] + paddingObject[basePlacement] <= 0;

  if (!fits) {
    state.modifiersData.flip.index += 1;
    state.reset = true;
    return state;
  } else if (fits && state.placement !== flippedPlacement) {
    state.placement = flippedPlacement;
    state.reset = true;
    return state;
  }

  return state;
}

export default ({
  name: 'flip',
  enabled: true,
  phase: 'main',
  fn: flip,
  requires: ['detectOverflow'],
  data: { index: 0 },
}: Modifier);
