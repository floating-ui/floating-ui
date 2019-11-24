// @flow
import { top, left, right, bottom, type Placement } from '../enums';
import type { State, Modifier, Rect } from '../types';
import getBasePlacement from '../utils/getBasePlacement';
import getMainAxisFromPlacement from '../utils/getMainAxisFromPlacement';
import getAltAxis from '../utils/getAltAxis';

export function preventOverflow(
  state: State,
  options: { mainAxis: boolean, altAxis: boolean } = {}
) {
  const {
    mainAxis: checkMainAxis = true,
    altAxis: checkAltAxis = false,
  } = options;
  const overflow = state.modifiersData.detectOverflow;
  const basePlacement = getBasePlacement(state.placement);
  const mainAxis = getMainAxisFromPlacement(basePlacement);
  const altAxis = getAltAxis(mainAxis);
  const popperOffsets = state.offsets.popper;

  if (checkMainAxis) {
    const mainSide = mainAxis === 'y' ? top : left;
    const altSide = mainAxis === 'y' ? bottom : right;
    state.offsets.popper[mainAxis] = Math.max(
      Math.min(
        popperOffsets[mainAxis],
        popperOffsets[mainAxis] - overflow[altSide]
      ),
      popperOffsets[mainAxis] + overflow[mainSide]
    );
  }
  if (checkAltAxis) {
    const mainSide = mainAxis === 'x' ? top : left;
    const altSide = mainAxis === 'x' ? bottom : right;
    console.log(altAxis, mainSide, overflow[altSide]);
    state.offsets.popper[altAxis] = Math.max(
      Math.min(
        popperOffsets[altAxis],
        popperOffsets[altAxis] - overflow[altSide]
      ),
      popperOffsets[altAxis] + overflow[mainSide]
    );
  }

  return state;
}

export default ({
  name: 'preventOverflow',
  enabled: true,
  phase: 'main',
  fn: preventOverflow,
  requires: ['detectOverflow'],
}: Modifier);
