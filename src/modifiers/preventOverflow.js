// @flow
import { top, left, right, bottom, type Placement } from '../enums';
import type { State, Modifier, Rect, Padding } from '../types';
import getBasePlacement from '../utils/getBasePlacement';
import getMainAxisFromPlacement from '../utils/getMainAxisFromPlacement';
import getAltAxis from '../utils/getAltAxis';
import mergePaddingObject from '../utils/mergePaddingObject';
import expandToHashMap from '../utils/expandToHashMap';

export function preventOverflow(
  state: State,
  options: { mainAxis: boolean, altAxis: boolean, padding: Padding } = {}
) {
  const {
    mainAxis: checkMainAxis = true,
    altAxis: checkAltAxis = false,
    padding = { left: 50, top: 20, right: 0, bottom: 0 },
  } = options;
  const overflow = state.modifiersData.detectOverflow;
  const basePlacement = getBasePlacement(state.placement);
  const mainAxis = getMainAxisFromPlacement(basePlacement);
  const altAxis = getAltAxis(mainAxis);
  const popperOffsets = state.offsets.popper;
  const paddingObject =
    typeof padding !== 'number'
      ? mergePaddingObject(padding)
      : expandToHashMap(padding, [top, right, bottom, left]);

  console.log(paddingObject);

  if (checkMainAxis) {
    const mainSide = mainAxis === 'y' ? top : left;
    const altSide = mainAxis === 'y' ? bottom : right;

    state.offsets.popper[mainAxis] = Math.max(
      Math.min(
        popperOffsets[mainAxis],
        popperOffsets[mainAxis] - overflow[altSide] - paddingObject[altSide]
      ),
      popperOffsets[mainAxis] + overflow[mainSide] + paddingObject[mainSide]
    );
  }
  if (checkAltAxis) {
    const mainSide = mainAxis === 'x' ? top : left;
    const altSide = mainAxis === 'x' ? bottom : right;

    console.log(altAxis, mainSide, overflow[altSide]);

    state.offsets.popper[altAxis] = Math.max(
      Math.min(
        popperOffsets[altAxis],
        popperOffsets[altAxis] - overflow[altSide] - paddingObject[altSide]
      ),
      popperOffsets[altAxis] + overflow[mainSide] + paddingObject[mainSide]
    );
  }

  return state;
}

export default ({
  name: 'preventOverflow',
  enabled: true,
  phase: 'main',
  fn: preventOverflow,
}: Modifier);
